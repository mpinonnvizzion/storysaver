import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/metadata";

// Static for now — home plus the evergreen SEO/legal pages. Dynamic profile
// pages are intentionally left out (unbounded, generated on demand);
// /download is excluded via robots.ts since it's a query-param results view.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    {
      url: `${SITE_URL}/how-to-download-instagram-stories`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/how-to-download-instagram-reels`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/instagram-profile-picture-downloader`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
