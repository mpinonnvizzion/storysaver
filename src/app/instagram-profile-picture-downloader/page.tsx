import type { Metadata } from "next";
import { Download, Link2, Sparkles } from "lucide-react";
import GuidePage from "@/components/GuidePage";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Instagram Profile Picture Downloader — View & Save in HD | StorySnag",
  description:
    "See any Instagram profile picture at full resolution and save it — way bigger than the tiny circle Instagram shows you. Step-by-step guide.",
  path: "/instagram-profile-picture-downloader",
});

const STEPS = [
  {
    icon: Link2,
    title: "Enter the username",
    description: "Type or paste the @handle of the profile whose picture you want to view or save.",
  },
  {
    icon: Sparkles,
    title: "StorySnag fetches the HD version",
    description:
      "Instagram stores a much larger version of every profile photo than it displays in the app. StorySnag retrieves the full-size original.",
  },
  {
    icon: Download,
    title: "Download or view full-screen",
    description: "Open the image full-screen to inspect it, or download it directly as a JPG.",
  },
];

const FAQS = [
  {
    q: "Why is the downloaded profile picture bigger than what I see on Instagram?",
    a: "Instagram's app only ever shows a small, cropped thumbnail of a profile picture. The underlying file Instagram stores is much higher resolution, and that's what StorySnag retrieves.",
  },
  {
    q: "Can I view a private account's profile picture?",
    a: "Instagram doesn't treat profile pictures as private content — the photo is visible on every account regardless of whether its posts are private, so StorySnag can fetch it for any valid username.",
  },
  {
    q: "Does the account owner get notified when I view their profile picture?",
    a: "No. StorySnag works anonymously, so there's no notification sent to the account owner.",
  },
  {
    q: "What format is the downloaded profile picture?",
    a: "Profile pictures download as a JPG at the original resolution Instagram has stored.",
  },
  {
    q: "Can I download multiple profile pictures at once?",
    a: "Not currently — StorySnag is built to look up one profile at a time, to keep the tool fast and simple.",
  },
];

export default function Page() {
  return (
    <GuidePage
      eyebrow="Profile Pictures"
      h1="Instagram Profile Picture Downloader"
      intro="See any Instagram profile picture at full resolution and save it — way bigger than the tiny circle Instagram shows you."
      steps={STEPS}
      faqs={FAQS}
      ctaHeading="Ready to view a profile picture?"
      ctaSubheading="Enter a username below to see it in full HD."
      relatedGuides={[
        { href: "/how-to-download-instagram-stories", label: "How to download Instagram stories" },
        { href: "/how-to-download-instagram-reels", label: "How to download Instagram Reels" },
      ]}
    />
  );
}
