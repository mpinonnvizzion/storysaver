import { NextResponse, type NextRequest } from "next/server";
import { rateLimitOrNull, sanitizeForFilename } from "@/lib/api-helpers";

// Instagram/Meta CDN hosts that actually serve story/reel/post media.
// Restricting to these keeps this proxy from being turned into an open
// fetch-anything relay (SSRF) via the ?url= param.
const ALLOWED_HOST_SUFFIXES = [".cdninstagram.com", ".fbcdn.net"];

function isAllowedMediaHost(hostname: string): boolean {
  return ALLOWED_HOST_SUFFIXES.some((suffix) => hostname.endsWith(suffix));
}

function extensionFor(contentType: string | null, isVideo: boolean): string {
  if (contentType?.includes("video")) return "mp4";
  if (contentType?.includes("png")) return "png";
  if (contentType?.includes("webp")) return "webp";
  if (contentType?.includes("jpeg") || contentType?.includes("jpg")) return "jpg";
  return isVideo ? "mp4" : "jpg";
}

export async function GET(request: NextRequest) {
  const limited = rateLimitOrNull(request);
  if (limited) return limited;

  const { searchParams } = request.nextUrl;
  const rawUrl = searchParams.get("url");
  if (!rawUrl) {
    return NextResponse.json({ error: "Missing required 'url' query param" }, { status: 400 });
  }

  let mediaUrl: URL;
  try {
    mediaUrl = new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: "Invalid media url" }, { status: 400 });
  }

  if (mediaUrl.protocol !== "https:" || !isAllowedMediaHost(mediaUrl.hostname)) {
    return NextResponse.json({ error: "Media host not allowed" }, { status: 400 });
  }

  const upstream = await fetch(mediaUrl, { cache: "no-store" });
  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: "Could not fetch media from Instagram" }, { status: 502 });
  }

  const type = searchParams.get("type") ?? "media";
  const isVideo = type === "video" || type === "reel";
  const contentType = upstream.headers.get("content-type");
  const ext = extensionFor(contentType, isVideo);

  const username = sanitizeForFilename(searchParams.get("username") ?? "", "user");
  const safeType = sanitizeForFilename(type, "media");
  const filename = `storysnag_${username}_${safeType}_${Date.now()}.${ext}`;

  const headers = new Headers({
    "Content-Type": contentType ?? "application/octet-stream",
    "Content-Disposition": `attachment; filename="${filename}"`,
    "Cache-Control": "no-store",
  });
  const contentLength = upstream.headers.get("content-length");
  if (contentLength) headers.set("Content-Length", contentLength);

  return new NextResponse(upstream.body, { headers });
}
