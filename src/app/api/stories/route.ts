import { NextResponse, type NextRequest } from "next/server";
import { instagramService } from "@/lib/instagram";
import { errorResponse, rateLimitOrNull } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  const limited = rateLimitOrNull(request);
  if (limited) return limited;

  const username = request.nextUrl.searchParams.get("username")?.trim();
  if (!username) {
    return NextResponse.json({ error: "Missing required 'username' query param" }, { status: 400 });
  }

  try {
    const stories = await instagramService.getStories(username);
    return NextResponse.json({ stories });
  } catch (error) {
    return errorResponse(error);
  }
}
