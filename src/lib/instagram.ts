import "server-only";
import type { InstagramService, Media, MediaType, Profile, Reel, Story } from "@/types/instagram";
import { InstagramServiceError } from "@/types/instagram";
import { CACHE_TTL, getOrSetCached } from "@/lib/cache";
import { parseSmartInput } from "@/lib/input-parser";

const BASE_URL = "https://api.hikerapi.com";

// --- Raw HikerAPI response shapes (instagrapi-compatible) -----------------
// HikerAPI mirrors the instagrapi JSON schema. Only the fields we use are
// declared; the live payloads carry many more.

interface RawImageCandidate {
  url: string;
  width?: number;
  height?: number;
}

interface RawVideoVersion {
  url: string;
  width?: number;
  height?: number;
  type?: number;
}

interface RawUser {
  pk: number | string;
  username: string;
  full_name?: string;
  biography?: string;
  profile_pic_url?: string;
  hd_profile_pic_url_info?: { url: string };
  is_private?: boolean;
  is_verified?: boolean;
  follower_count?: number;
  following_count?: number;
  media_count?: number;
}

interface RawMediaItem {
  pk: number | string;
  id?: string;
  code?: string;
  media_type?: number; // 1 = photo, 2 = video, 8 = carousel
  product_type?: string; // "clips" for reels
  caption_text?: string | null;
  taken_at?: number;
  expiring_at?: number;
  view_count?: number;
  like_count?: number;
  video_duration?: number;
  image_versions2?: { candidates?: RawImageCandidate[] };
  video_versions?: RawVideoVersion[];
  carousel_media?: RawMediaItem[];
}

interface RawReelResponse {
  reel?: {
    items?: RawMediaItem[];
  };
}

interface RawClipsResponse {
  items?: Array<{ media: RawMediaItem } | RawMediaItem>;
}

interface RawMediaInfoResponse {
  items?: RawMediaItem[];
}

// --- helpers ----------------------------------------------------------

function apiKey(): string {
  const key = process.env.HIKERAPI_KEY;
  if (!key) {
    throw new InstagramServiceError(
      "HIKERAPI_KEY is not configured on the server",
      "UPSTREAM_ERROR",
      500,
    );
  }
  return key;
}

async function hikerGet<T>(path: string, params: Record<string, string>): Promise<T> {
  const url = new URL(path, BASE_URL);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  let res: Response;
  try {
    res = await fetch(url, {
      headers: { accept: "application/json", "x-access-key": apiKey() },
      // Stories/reels change frequently; let our own cache layer own TTLs.
      cache: "no-store",
    });
  } catch {
    throw new InstagramServiceError("Could not reach Instagram data provider", "UPSTREAM_ERROR", 502);
  }

  if (res.status === 404) {
    throw new InstagramServiceError("Not found", "NOT_FOUND", 404);
  }
  if (res.status === 429) {
    throw new InstagramServiceError("Upstream rate limit hit, try again shortly", "RATE_LIMITED", 429);
  }
  if (!res.ok) {
    throw new InstagramServiceError(`Upstream error (${res.status})`, "UPSTREAM_ERROR", 502);
  }

  return (await res.json()) as T;
}

function bestImageUrl(candidates?: RawImageCandidate[]): string {
  return candidates?.[0]?.url ?? "";
}

function bestVideoUrl(versions?: RawVideoVersion[]): string {
  return versions?.[0]?.url ?? "";
}

function unixToIso(ts?: number): string {
  return ts ? new Date(ts * 1000).toISOString() : new Date().toISOString();
}

function mediaTypeOf(raw: RawMediaItem): MediaType {
  return raw.media_type === 2 ? "video" : "image";
}

function mapProfile(raw: RawUser): Profile {
  return {
    username: raw.username,
    fullName: raw.full_name ?? "",
    bio: raw.biography ?? "",
    profilePicUrl: raw.profile_pic_url ?? "",
    profilePicHdUrl: raw.hd_profile_pic_url_info?.url ?? raw.profile_pic_url ?? "",
    isPrivate: raw.is_private ?? false,
    isVerified: raw.is_verified ?? false,
    followerCount: raw.follower_count ?? 0,
    followingCount: raw.following_count ?? 0,
    postCount: raw.media_count ?? 0,
  };
}

function mapStory(raw: RawMediaItem, username: string): Story {
  const type = mediaTypeOf(raw);
  return {
    id: String(raw.pk ?? raw.id),
    username,
    type,
    thumbnailUrl: bestImageUrl(raw.image_versions2?.candidates),
    mediaUrl: type === "video" ? bestVideoUrl(raw.video_versions) : bestImageUrl(raw.image_versions2?.candidates),
    takenAt: unixToIso(raw.taken_at),
    expiresAt: unixToIso(raw.expiring_at),
    durationSeconds: raw.video_duration,
  };
}

function mapReel(raw: RawMediaItem, username: string): Reel {
  return {
    id: String(raw.pk ?? raw.id ?? raw.code),
    username,
    thumbnailUrl: bestImageUrl(raw.image_versions2?.candidates),
    videoUrl: bestVideoUrl(raw.video_versions),
    caption: raw.caption_text ?? "",
    durationSeconds: raw.video_duration ?? 0,
    viewCount: raw.view_count,
    likeCount: raw.like_count,
    takenAt: unixToIso(raw.taken_at),
  };
}

function mapMedia(raw: RawMediaItem, username: string, sourceKind: Media["sourceKind"]): Media {
  // Carousels: surface the first slide. Good enough for MVP; a future
  // pass could return all slides for a picker UI.
  const primary = raw.media_type === 8 && raw.carousel_media?.length ? raw.carousel_media[0] : raw;
  const type = mediaTypeOf(primary);

  return {
    id: String(raw.pk ?? raw.id ?? raw.code),
    type,
    sourceKind,
    username,
    thumbnailUrl: bestImageUrl(primary.image_versions2?.candidates),
    mediaUrl: type === "video" ? bestVideoUrl(primary.video_versions) : bestImageUrl(primary.image_versions2?.candidates),
    caption: raw.caption_text ?? undefined,
    durationSeconds: primary.video_duration,
    takenAt: raw.taken_at ? unixToIso(raw.taken_at) : undefined,
  };
}

// --- service ------------------------------------------------------------

class HikerApiInstagramService implements InstagramService {
  async getProfile(username: string): Promise<Profile> {
    return getOrSetCached(`profile:${username}`, CACHE_TTL.PROFILE, async () => {
      const data = await hikerGet<{ user: RawUser }>("/v2/user/by/username", { username });
      return mapProfile(data.user);
    });
  }

  async getStories(username: string): Promise<Story[]> {
    return getOrSetCached(`stories:${username}`, CACHE_TTL.STORIES, async () => {
      const data = await hikerGet<RawReelResponse>("/v2/user/stories/by/username", { username });
      const items = data.reel?.items ?? [];
      return items.map((item) => mapStory(item, username));
    });
  }

  async getReels(username: string): Promise<Reel[]> {
    return getOrSetCached(`reels:${username}`, CACHE_TTL.REELS, async () => {
      const userId = await this.resolveUserId(username);
      const data = await hikerGet<RawClipsResponse>("/v2/user/clips", { user_id: userId });
      const items = (data.items ?? []).map((entry) => ("media" in entry ? entry.media : entry));
      return items.map((item) => mapReel(item, username));
    });
  }

  async getMediaByUrl(url: string): Promise<Media> {
    return getOrSetCached(`media:${url}`, CACHE_TTL.MEDIA, async () => {
      const data = await hikerGet<RawMediaInfoResponse>("/v2/media/info/by/url", { url });
      const raw = data.items?.[0];
      if (!raw) {
        throw new InstagramServiceError("Media not found", "NOT_FOUND", 404);
      }
      const sourceKind: Media["sourceKind"] = raw.product_type === "clips" ? "reel" : "post";
      const username = (raw as RawMediaItem & { user?: { username?: string } }).user?.username ?? "";
      return mapMedia(raw, username, sourceKind);
    });
  }

  async getProfilePicHD(username: string): Promise<string> {
    const profile = await this.getProfile(username);
    return profile.profilePicHdUrl;
  }

  /** /v2/user/clips needs a numeric user id rather than a username. */
  private async resolveUserId(username: string): Promise<string> {
    return getOrSetCached(`userid:${username}`, CACHE_TTL.PROFILE, async () => {
      const res = await hikerGet<{ user: RawUser }>("/v2/user/by/username", { username });
      return String(res.user.pk);
    });
  }
}

export const instagramService: InstagramService = new HikerApiInstagramService();

/**
 * Resolves a raw story/reel/post URL (or the story's username+id pair) to a
 * single downloadable Media item. Shared by /api/media and /download so
 * both stay in sync on how each link kind is handled.
 */
export async function resolveDirectMedia(rawUrl: string): Promise<Media> {
  const parsed = parseSmartInput(rawUrl);

  if (parsed.kind === "story") {
    const stories = await instagramService.getStories(parsed.username);
    const story = parsed.storyId ? stories.find((s) => s.id === parsed.storyId) : stories[0];
    if (!story) {
      throw new InstagramServiceError("Story not found or expired", "NOT_FOUND", 404);
    }
    return {
      id: story.id,
      type: story.type,
      sourceKind: "story",
      username: story.username,
      thumbnailUrl: story.thumbnailUrl,
      mediaUrl: story.mediaUrl,
      durationSeconds: story.durationSeconds,
      takenAt: story.takenAt,
    };
  }

  if (parsed.kind === "reel" || parsed.kind === "post") {
    return instagramService.getMediaByUrl(rawUrl);
  }

  throw new InstagramServiceError(
    parsed.kind === "invalid" ? parsed.reason : "Expected a story, reel, or post link",
    "INVALID_INPUT",
    400,
  );
}
