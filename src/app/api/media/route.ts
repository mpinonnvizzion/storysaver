import { NextResponse, type NextRequest } from "next/server";
import { resolveDirectMedia } from "@/lib/instagram";
import { errorResponse, rateLimitOrNull } from "@/lib/api-helpers";

/** Resolves a direct story/reel/post link to a single downloadable media item. */
export async function GET(request: NextRequest) {
  const limited = rateLimitOrNull(request);
  if (limited) return limited;

  const rawUrl = request.nextUrl.searchParams.get("url")?.trim();
  if (!rawUrl) {
    return NextResponse.json({ error: "Missing required 'url' query param" }, { status: 400 });
  }

  try {
    const media = await resolveDirectMedia(rawUrl);
    return NextResponse.json(media);
  } catch (error) {
    return errorResponse(error);
  }
}
