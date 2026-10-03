import type { Metadata } from "next";
import { Download, Link2, Sparkles } from "lucide-react";
import GuidePage from "@/components/GuidePage";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "How to Download Instagram Stories — Free & Anonymous | StorySnag",
  description:
    "Save any public Instagram story as a photo or video in seconds. No app install, no login, and the account owner never finds out. Step-by-step guide.",
  path: "/how-to-download-instagram-stories",
});

const STEPS = [
  {
    icon: Link2,
    title: "Copy the username or story link",
    description:
      "Open Instagram, find the account whose story you want to save, and copy their @handle — or copy the direct story link if you already have one.",
  },
  {
    icon: Sparkles,
    title: "Paste it into StorySnag",
    description:
      "Drop the handle or link into the box above and hit enter. StorySnag looks up every story currently live on that profile.",
  },
  {
    icon: Download,
    title: "Preview and download",
    description:
      "Tap any story thumbnail to preview it at full resolution, then download the photo or video directly to your device.",
  },
];

const FAQS = [
  {
    q: "Can I download someone else's Instagram story without them knowing?",
    a: "Yes. StorySnag fetches stories anonymously through Instagram's public data — the account you're downloading from is never notified.",
  },
  {
    q: "How long do Instagram stories stay available to download?",
    a: "Instagram stories disappear 24 hours after they're posted, so grab the ones you want before they expire. Stories saved to a profile's Highlights stay available much longer.",
  },
  {
    q: "Do I need to follow the account to download their story?",
    a: "No. You don't need to follow the account or even have an Instagram account yourself — the profile just needs to be public.",
  },
  {
    q: "What file format are downloaded stories?",
    a: "Photo stories download as JPG and video stories download as MP4, both at the original resolution Instagram stores.",
  },
  {
    q: "Is it legal to download Instagram stories?",
    a: "Downloading public content for personal viewing is generally fine. Just avoid republishing or redistributing someone else's content without their permission.",
  },
];

export default function Page() {
  return (
    <GuidePage
      eyebrow="Instagram Stories"
      h1="How to Download Instagram Stories"
      intro="Save any public Instagram story as a photo or video in seconds. No app install, no login, and the account owner never finds out."
      steps={STEPS}
      faqs={FAQS}
      ctaHeading="Ready to save a story?"
      ctaSubheading="Paste a username or story link below — no sign-up required."
      relatedGuides={[
        { href: "/how-to-download-instagram-reels", label: "How to download Instagram Reels" },
        { href: "/instagram-profile-picture-downloader", label: "Instagram profile picture downloader" },
      ]}
    />
  );
}
