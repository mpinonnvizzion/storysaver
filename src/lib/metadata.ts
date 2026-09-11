import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://storysnag.com";
export const SITE_NAME = "StorySnag";
const DEFAULT_OG_IMAGE = "/og-image.png";

interface BuildMetadataOptions {
  title: string;
  description: string;
  /** Route path, e.g. "/profile/natgeo". Defaults to the homepage. */
  path?: string;
  noIndex?: boolean;
}

/**
 * Every page calls this instead of hand-rolling openGraph/twitter blocks.
 * Next only inherits those nested objects from the root layout when a page
 * doesn't define its own — so a page that sets `title` but not `openGraph`
 * would silently show the homepage's OG title/description on share cards.
 */
export function buildMetadata({ title, description, path = "/", noIndex = false }: BuildMetadataOptions): Metadata {
  const url = new URL(path, SITE_URL).toString();

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      url,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
