import type { Metadata } from "next";
import MediaCard from "@/components/MediaCard";
import AdSlot from "@/components/AdSlot";
import { resolveDirectMedia } from "@/lib/instagram";
import { InstagramServiceError, type Media } from "@/types/instagram";
import { buildMetadata } from "@/lib/metadata";

interface DownloadPageProps {
  searchParams: Promise<{ url?: string }>;
}

const FALLBACK_DESCRIPTION = "Download a specific Instagram story, reel, or post — free, anonymous, no login required.";

export async function generateMetadata({ searchParams }: DownloadPageProps): Promise<Metadata> {
  const { url } = await searchParams;
  // Query-param-driven results page — not a canonical URL search engines
  // should index, but it still needs a real title/description for the
  // browser tab and for anyone who shares the link directly.
  if (!url) {
    return buildMetadata({ title: "Direct Link Download | StorySnag", description: FALLBACK_DESCRIPTION, path: "/download", noIndex: true });
  }

  try {
    const media = await resolveDirectMedia(url);
    const who = media.username ? `@${media.username}'s` : "an";
    return buildMetadata({
      title: `Download ${who} Instagram ${media.sourceKind} | StorySnag`,
      description: `Download this Instagram ${media.sourceKind} instantly — free, anonymous, no login required.`,
      path: "/download",
      noIndex: true,
    });
  } catch {
    return buildMetadata({ title: "Direct Link Download | StorySnag", description: FALLBACK_DESCRIPTION, path: "/download", noIndex: true });
  }
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

  let media: Media;
  try {
    media = await resolveDirectMedia(url);
  } catch (error) {
    if (error instanceof InstagramServiceError) {
      return <DownloadMessage title="Couldn't fetch that link" message={error.message} />;
    }
    throw error;
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center px-4 py-14">
      <MediaCard media={media} />
      <div className="mt-10 w-full">
        <AdSlot id="download-below-card" size="mediumRectangle" />
      </div>
    </div>
  );
}

function DownloadMessage({ title, message }: { title: string; message: string }) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center px-4 py-24 text-center">
      <h1 className="font-display text-xl font-bold text-foreground">{title}</h1>
      <p className="mt-2 text-sm text-foreground/60">{message}</p>
    </div>
  );
}
