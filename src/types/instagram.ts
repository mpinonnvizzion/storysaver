export type MediaType = "image" | "video";

export interface Profile {
  username: string;
  fullName: string;
  bio: string;
  profilePicUrl: string;
  profilePicHdUrl: string;
  isPrivate: boolean;
  isVerified: boolean;
  followerCount: number;
  followingCount: number;
  postCount: number;
}

export interface Story {
  id: string;
  username: string;
  type: MediaType;
  thumbnailUrl: string;
  mediaUrl: string;
  takenAt: string;
  expiresAt: string;
  durationSeconds?: number;
}

export interface Reel {
  id: string;
  username: string;
  thumbnailUrl: string;
  videoUrl: string;
  caption: string;
  durationSeconds: number;
  viewCount?: number;
  likeCount?: number;
  takenAt: string;
}

export interface Media {
  id: string;
  type: MediaType;
  sourceKind: "story" | "reel" | "post";
  username: string;
  thumbnailUrl: string;
  mediaUrl: string;
  caption?: string;
  durationSeconds?: number;
  takenAt?: string;
}

export interface Highlight {
  highlightId: string;
  title: string;
  mediaCount: number;
  coverImageUrl: string;
  items: Story[]; // same shape as story items
}

export interface InstagramService {
  getProfile(username: string): Promise<Profile>;
  getStories(username: string): Promise<{ stories: Story[]; highlights: Highlight[] }>;
  getReels(username: string): Promise<Reel[]>;
  getMediaByUrl(url: string): Promise<Media>;
  getProfilePicHD(username: string): Promise<string>;
}

export class InstagramServiceError extends Error {
  constructor(
    message: string,
    public readonly code: "NOT_FOUND" | "PRIVATE" | "RATE_LIMITED" | "UPSTREAM_ERROR" | "INVALID_INPUT",
    public readonly status: number,
  ) {
    super(message);
    this.name = "InstagramServiceError";
  }
}
