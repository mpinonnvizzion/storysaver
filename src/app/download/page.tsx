import type { Metadata } from "next";
import DownloadClient from "./DownloadClient";
import { buildMetadata } from "@/lib/metadata";

interface DownloadPageProps {
  searchParams: Promise<{ url?: string }>;
}

const FALLBACK_DESCRIPTION = "Download a specific Instagram story, reel, or post — free, anonymous, no login required.";

// Query-param-driven results page — not a canonical URL search engines
// should index, but it still needs a real title/description for the
// browser tab and for anyone who shares the link directly. The dynamic
// title (fetched via resolveDirectMedia) was removed because that fetch now
// happens client-side — Apify runs take 15-20s, well past Vercel Hobby's
// 10s serverless function limit for generateMetadata itself.
export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Direct Link Download | StorySnag",
    description: FALLBACK_DESCRIPTION,
    path: "/download",
    noIndex: true,
  });
}

export default async function DownloadPage({ searchParams }: DownloadPageProps) {
  const { url } = await searchParams;

  if (!url) {
    return (
      <DownloadMessage
        title="No link provided"
        message="Paste a story, reel, or post link on the home page to download it here."
      />
    );
  }

  // Keyed by url so navigating between two ?url= values (same route segment)
  // remounts with fresh state instead of reusing the old instance.
  return <DownloadClient key={url} url={url} />;
}

function DownloadMessage({ title, message }: { title: string; message: string }) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center px-4 py-24 text-center">
      <h1 className="font-display text-xl font-bold text-foreground">{title}</h1>
      <p className="mt-2 text-sm text-foreground/60">{message}</p>
    </div>
  );
}
