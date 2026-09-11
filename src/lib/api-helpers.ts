import { NextResponse, type NextRequest } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { InstagramServiceError } from "@/types/instagram";

export function rateLimitOrNull(request: NextRequest): NextResponse | null {
  const ip = getClientIp(request);
  const { allowed, resetAt } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests — slow down and try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.max(1, Math.ceil((resetAt - Date.now()) / 1000))) },
      },
    );
  }
  return null;
}

const STATUS_BY_CODE: Record<InstagramServiceError["code"], number> = {
  NOT_FOUND: 404,
  PRIVATE: 403,
  RATE_LIMITED: 429,
  UPSTREAM_ERROR: 502,
  INVALID_INPUT: 400,
};

export function errorResponse(error: unknown): NextResponse {
  if (error instanceof InstagramServiceError) {
    return NextResponse.json({ error: error.message, code: error.code }, { status: STATUS_BY_CODE[error.code] });
  }
  console.error(error);
  return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
}

export function sanitizeForFilename(value: string, fallback: string): string {
  const cleaned = value.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 60);
  return cleaned || fallback;
}
