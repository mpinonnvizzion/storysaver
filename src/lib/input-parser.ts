export type ParsedInput =
  | { kind: "handle"; username: string }
  | { kind: "story"; username: string; storyId?: string }
  | { kind: "reel"; shortcode: string }
  | { kind: "post"; shortcode: string }
  | { kind: "invalid"; reason: string };

const USERNAME_RE = /^[a-zA-Z0-9._]{1,30}$/;

// Path segments that are Instagram routes, not usernames — a bare
// single-segment path matching one of these is not a profile.
const RESERVED_PATHS = new Set([
  "explore",
  "accounts",
  "direct",
  "about",
  "legal",
  "developer",
  "stories",
  "reel",
  "reels",
  "p",
  "tv",
]);

/**
 * Detects what kind of Instagram target a raw user-entered string points to:
 * a bare handle, a profile URL, or a direct story/reel/post link.
 */
export function parseSmartInput(raw: string): ParsedInput {
  const trimmed = raw.trim();

  if (!trimmed) {
    return { kind: "invalid", reason: "Enter a username, @handle, or Instagram link" };
  }

  // No slash: either a bare handle or an @handle.
  if (!trimmed.includes("/")) {
    const username = trimmed.replace(/^@/, "");
    if (!USERNAME_RE.test(username)) {
      return { kind: "invalid", reason: "That doesn't look like a valid Instagram username" };
    }
    return { kind: "handle", username };
  }

  let url: URL;
  try {
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    url = new URL(withProtocol);
  } catch {
    return { kind: "invalid", reason: "That doesn't look like a valid Instagram link" };
  }

  const host = url.hostname.replace(/^www\./i, "").toLowerCase();
  if (host !== "instagram.com") {
    return { kind: "invalid", reason: "Only instagram.com links are supported" };
  }

  const segments = url.pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return { kind: "invalid", reason: "That link doesn't point to a profile, story, reel, or post" };
  }

  const [first, second, third] = segments;

  if (first === "stories" && second) {
    return { kind: "story", username: second, storyId: third };
  }

  if ((first === "reel" || first === "reels") && second) {
    return { kind: "reel", shortcode: second };
  }

  if (first === "p" && second) {
    return { kind: "post", shortcode: second };
  }

  if (segments.length === 1 && !RESERVED_PATHS.has(first) && USERNAME_RE.test(first)) {
    return { kind: "handle", username: first };
  }

  return { kind: "invalid", reason: "That doesn't look like a profile, story, reel, or post link" };
}

/** Strips the @/protocol/www noise for display in the input bar as the user types. */
export function stripDisplayPrefix(raw: string): string {
  return raw
    .trim()
    .replace(/^@/, "")
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "");
}
