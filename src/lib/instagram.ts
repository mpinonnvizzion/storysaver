import "server-only";
import type { InstagramService, Media, MediaType, Profile, Reel, Story } from "@/types/instagram";
import { InstagramServiceError } from "@/types/instagram";
import { CACHE_TTL, getOrSetCached } from "@/lib/cache";
import { parseSmartInput } from "@/lib/input-parser";

const API_BASE = "https://api.apify.com/v2";

// Apify actor slugs (store path form — converted to `username~actor-name`
// for REST calls, since the API doesn't accept the slash).
const STORIES_ACTOR = "goat255/instagram-stories-highlights-scraper";
const PROFILE_ACTOR = "apify/instagram-profile-scraper";
const POST_ACTOR = "apify/instagram-post-scraper";

const TERMINAL_RUN_STATUSES = new Set(["SUCCEEDED", "FAILED", "ABORTED", "TIMED-OUT"]);

// --- Raw Apify dataset item shapes -----------------------------------
// Only the fields we use are declared; live payloads carry more.

interface RawApifyStoryItem {
  id?: string;
  mediaType?: "video" | "image" | string;
  takenAt?: number;
  expiringAt?: number;
  imageUrl?: string;
  videoUrl?: string;
}

interface RawApifyStoriesResult {
  username: string;
  status?: "ok" | "private" | "not_found" | "no_active_stories" | string;
  isPrivate?: boolean;
  storyCount?: number;
  stories?: RawApifyStoryItem[];
}

interface RawApifyProfile {
  username: string;
  fullName?: string;
  biography?: string;
  profilePicUrl?: string;
  profilePicUrlHD?: string;
  private?: boolean;
  verified?: boolean;
  followersCount?: number;
  followsCount?: number;
  postsCount?: number;
}

interface RawApifyPost {
  id?: string;
  shortCode?: string;
  type?: "Image" | "Video" | "Sidecar" | string;
  videoUrl?: string;
  displayUrl?: string;
  caption?: string | null;
  likesCount?: number;
  timestamp?: string;
  ownerUsername?: string;
  videoDuration?: number;
}

interface ApifyRun {
  id: string;
  status: string;
  defaultDatasetId: string;
}

// --- Apify REST helpers -------------------------------------------------

function apifyToken(): string {
  const token = process.env.APIFY_TOKEN;
  if (!token) {
    throw new InstagramServiceError("APIFY_TOKEN is not configured on the server", "UPSTREAM_ERROR", 500);
  }
  return token;
}

function authHeaders(): HeadersInit {
  return { "content-type": "application/json", authorization: `Bearer ${apifyToken()}` };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function apifyFetch<T>(url: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, { ...init, headers: authHeaders(), cache: "no-store" });
  } catch {
    throw new InstagramServiceError("Could not reach Instagram data provider", "UPSTREAM_ERROR", 502);
  }

  if (res.status === 429) {
    throw new InstagramServiceError("Upstream rate limit hit, try again shortly", "RATE_LIMITED", 429);
  }
  if (!res.ok) {
    throw new InstagramServiceError(`Upstream error (${res.status})`, "UPSTREAM_ERROR", 502);
  }

  return (await res.json()) as T;
}

/**
 * Starts an Apify actor run, polls until it leaves the RUNNING/READY state,
 * and returns the resulting dataset items. Apify actor runs are async by
 * nature (there's no synchronous "scrape and respond" endpoint for these
 * actors), so every call pays a start + poll + fetch round trip.
 */
async function runApifyActor<T>(
  actorSlug: string,
  input: Record<string, unknown>,
  { maxWaitMs = 30_000, pollIntervalMs = 2_000 }: { maxWaitMs?: number; pollIntervalMs?: number } = {},
): Promise<T[]> {
  const actorId = actorSlug.replace("/", "~");

  const start = await apifyFetch<{ data: ApifyRun }>(`${API_BASE}/actors/${actorId}/runs`, {
    method: "POST",
    body: JSON.stringify(input),
  });

  let run = start.data;
  const deadline = Date.now() + maxWaitMs;

  while (!TERMINAL_RUN_STATUSES.has(run.status)) {
    if (Date.now() >= deadline) {
      throw new InstagramServiceError("Instagram data provider timed out", "UPSTREAM_ERROR", 504);
    }
    await sleep(pollIntervalMs);
    const poll = await apifyFetch<{ data: ApifyRun }>(`${API_BASE}/actors/${actorId}/runs/${run.id}`);
    run = poll.data;
  }

  if (run.status !== "SUCCEEDED") {
    throw new InstagramServiceError(`Instagram data provider run ${run.status.toLowerCase()}`, "UPSTREAM_ERROR", 502);
  }

  return apifyFetch<T[]>(`${API_BASE}/datasets/${run.defaultDatasetId}/items`);
}

// --- mapping helpers ------------------------------------------------------

/** Handles both the stories actor's unix-seconds timestamps and the post actor's ISO strings. */
function toIso(value?: number | string): string {
  if (typeof value === "number") return new Date(value * 1000).toISOString();
  if (typeof value === "string") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
  }
  return new Date().toISOString();
}

function normalizeInstagramUrl(raw: string): string {
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(withProtocol);
    return `https://${url.hostname.replace(/^www\./i, "")}${url.pathname}`;
  } catch {
    return withProtocol;
  }
}

function mapApifyProfile(raw: RawApifyProfile): Profile {
  return {
    username: raw.username,
    fullName: raw.fullName ?? "",
    bio: raw.biography ?? "",
    profilePicUrl: raw.profilePicUrl ?? "",
    profilePicHdUrl: raw.profilePicUrlHD ?? raw.profilePicUrl ?? "",
    isPrivate: raw.private ?? false,
    isVerified: raw.verified ?? false,
    followerCount: raw.followersCount ?? 0,
    followingCount: raw.followsCount ?? 0,
    postCount: raw.postsCount ?? 0,
  };
}

/** Throws for terminal statuses; "no_active_stories" is not an error — it just means an empty result. */
function assertStoriesStatusOk(result: RawApifyStoriesResult): void {
  switch (result.status) {
    case "ok":
    case "no_active_stories":
    case undefined:
      return;
    case "private":
      throw new InstagramServiceError("This account is private", "PRIVATE", 403);
    case "not_found":
      throw new InstagramServiceError("Instagram user not found", "NOT_FOUND", 404);
    default:
      throw new InstagramServiceError(`Unexpected upstream status: ${result.status}`, "UPSTREAM_ERROR", 502);
  }
}

function mapApifyStory(raw: RawApifyStoryItem, username: string): Story {
  const type: MediaType = raw.mediaType === "video" ? "video" : "image";
  const mediaUrl = type === "video" ? raw.videoUrl ?? raw.imageUrl ?? "" : raw.imageUrl ?? "";
  return {
    id: String(raw.id ?? `${username}-${raw.takenAt ?? Date.now()}`),
    username,
    type,
    thumbnailUrl: raw.imageUrl ?? mediaUrl,
    mediaUrl,
    takenAt: toIso(raw.takenAt),
    expiresAt: toIso(raw.expiringAt),
  };
}

function mapApifyReel(raw: RawApifyPost, username: string): Reel {
  return {
    id: String(raw.id ?? raw.shortCode ?? `${username}-${raw.timestamp ?? Date.now()}`),
    username: raw.ownerUsername ?? username,
    thumbnailUrl: raw.displayUrl ?? "",
    videoUrl: raw.videoUrl ?? "",
    caption: raw.caption ?? "",
    durationSeconds: raw.videoDuration ?? 0,
    likeCount: raw.likesCount,
    takenAt: toIso(raw.timestamp),
  };
}

function mapApifyMedia(raw: RawApifyPost, username: string, sourceKind: Media["sourceKind"]): Media {
  const type: MediaType = raw.type === "Video" ? "video" : "image";
  return {
    id: String(raw.id ?? raw.shortCode ?? `${username}-media`),
    type,
    sourceKind,
    username: raw.ownerUsername ?? username,
    thumbnailUrl: raw.displayUrl ?? "",
    mediaUrl: type === "video" ? raw.videoUrl ?? raw.displayUrl ?? "" : raw.displayUrl ?? "",
    caption: raw.caption ?? undefined,
    durationSeconds: raw.videoDuration,
    takenAt: toIso(raw.timestamp),
  };
}

// --- service ------------------------------------------------------------

class ApifyInstagramService implements InstagramService {
  async getProfile(username: string): Promise<Profile> {
    return getOrSetCached(`profile:${username}`, CACHE_TTL.PROFILE, async () => {
      const items = await runApifyActor<RawApifyProfile>(PROFILE_ACTOR, { usernames: [username] });
      const raw = items[0];
      if (!raw) {
        throw new InstagramServiceError("Instagram user not found", "NOT_FOUND", 404);
      }
      return mapApifyProfile(raw);
    });
  }

  async getStories(username: string): Promise<Story[]> {
    return getOrSetCached(`stories:${username}`, CACHE_TTL.STORIES, async () => {
      const items = await runApifyActor<RawApifyStoriesResult>(
        STORIES_ACTOR,
        { usernames: [username], includeStories: true, includeHighlights: false, expandHighlightItems: false },
        { maxWaitMs: 30_000, pollIntervalMs: 2_000 },
      );
      const result = items[0];
      if (!result) {
        throw new InstagramServiceError("Instagram user not found", "NOT_FOUND", 404);
      }
      assertStoriesStatusOk(result);
      return (result.stories ?? []).map((story) => mapApifyStory(story, username));
    });
  }

  async getReels(username: string): Promise<Reel[]> {
    return getOrSetCached(`reels:${username}`, CACHE_TTL.REELS, async () => {
      const items = await runApifyActor<RawApifyPost>(POST_ACTOR, { username: [username], resultsLimit: 12 });
      return items.filter((item) => item.type === "Video").map((item) => mapApifyReel(item, username));
    });
  }

  async getMediaByUrl(url: string): Promise<Media> {
    return getOrSetCached(`media:${url}`, CACHE_TTL.MEDIA, async () => {
      const normalized = normalizeInstagramUrl(url);
      const items = await runApifyActor<RawApifyPost>(POST_ACTOR, { username: [normalized], resultsLimit: 1 });
      const raw = items[0];
      if (!raw) {
        throw new InstagramServiceError("Media not found", "NOT_FOUND", 404);
      }
      const sourceKind: Media["sourceKind"] = normalized.includes("/reel/") ? "reel" : "post";
      return mapApifyMedia(raw, raw.ownerUsername ?? "", sourceKind);
    });
  }

  async getProfilePicHD(username: string): Promise<string> {
    const profile = await this.getProfile(username);
    return profile.profilePicHdUrl;
  }
}

export const instagramService: InstagramService = new ApifyInstagramService();

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
