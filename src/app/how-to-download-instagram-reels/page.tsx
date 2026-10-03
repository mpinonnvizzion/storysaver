import type { Metadata } from "next";
import { Download, Link2, Sparkles } from "lucide-react";
import GuidePage from "@/components/GuidePage";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "How to Download Instagram Reels in HD — No Watermark | StorySnag",
  description:
    "Grab any public Instagram Reel as a clean MP4 — full resolution, no watermark, no sign-up required. Step-by-step guide.",
  path: "/how-to-download-instagram-reels",
});

const STEPS = [
  {
    icon: Link2,
    title: "Copy the Reel link",
    description:
      "Open the Reel in the Instagram app or on the web, tap the share icon, and choose Copy Link.",
  },
  {
    icon: Sparkles,
    title: "Paste the link into StorySnag",
    description:
      "Paste the link into the box above. StorySnag fetches the original video file Instagram serves to the app.",
  },
  {
    icon: Download,
    title: "Download the MP4",
    description:
      "Click download to save the Reel in its original quality — ready to watch offline or share elsewhere.",
  },
];

const FAQS = [
  {
    q: "Will the downloaded Reel have a watermark?",
    a: "No. StorySnag downloads the original video file Instagram stores, with no added watermark.",
  },
  {
    q: "What quality are downloaded Reels?",
    a: "StorySnag always fetches the same source quality Instagram serves in-app — there's no extra compression on our end.",
  },
  {
    q: "Can I download Reels from private accounts?",
    a: "No. StorySnag can only fetch Reels from accounts that are set to public.",
  },
  {
    q: "Does downloading a Reel notify the creator?",
    a: "No. StorySnag works anonymously, so the creator never knows their Reel was downloaded.",
  },
  {
    q: "Can I download just the audio from a Reel?",
    a: "Not currently — StorySnag downloads the full video file with its original audio included.",
  },
];

export default function Page() {
  return (
    <GuidePage
      eyebrow="Instagram Reels"
      h1="How to Download Instagram Reels in HD"
      intro="Grab any public Instagram Reel as a clean MP4 — full resolution, no watermark, no sign-up required."
      steps={STEPS}
      faqs={FAQS}
      ctaHeading="Ready to save a Reel?"
      ctaSubheading="Paste a Reel link below and download it in seconds."
      relatedGuides={[
        { href: "/how-to-download-instagram-stories", label: "How to download Instagram stories" },
        { href: "/instagram-profile-picture-downloader", label: "Instagram profile picture downloader" },
      ]}
    />
  );
}
