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

const INTRO_DETAIL =
  "Instagram stories are designed to disappear — they vanish from a profile 24 hours after they're posted, unless the account owner has pinned them to a Highlight. That's great for casual, in-the-moment sharing, but it's frustrating the moment you want to keep a copy of something: a friend's trip photos, an event announcement, a recipe someone posted, or a moment you just don't want to lose. Instagram doesn't offer a native \"save to device\" button for other people's stories, and screen-recording loses quality, picks up status bar clutter, and takes several extra steps. StorySnag solves this by fetching the original story file directly — the same photo or video Instagram serves inside the app — and handing it to you as a clean download, with no re-encoding, no screen-recording artifacts, and no watermark. This matters whether you're trying to save a one-off personal moment or keep a reliable archive of public posts over time, since the gap between \"what Instagram shows you\" and \"what you can actually keep\" is exactly the problem a story downloader is meant to close. Because the whole process runs through a public lookup rather than an Instagram account, there's nothing to configure beyond entering the handle — the tool does the rest, and the result is the same file quality every time, regardless of how many stories the profile has posted that day.";

const STEPS = [
  {
    icon: Link2,
    title: "Copy the username or story link",
    description:
      "Open Instagram, find the account whose story you want to save, and copy their @handle — or copy the direct story link if you already have one. You can type the handle in manually too; StorySnag doesn't require an exact URL format, just something that identifies the public profile.",
  },
  {
    icon: Sparkles,
    title: "Paste it into StorySnag",
    description:
      "Drop the handle or link into the box above and hit enter. StorySnag looks up every story currently live on that profile and lays them out as thumbnails so you can see everything that's currently posted before you choose what to save.",
  },
  {
    icon: Download,
    title: "Preview and download",
    description:
      "Tap any story thumbnail to preview it at full resolution, then download the photo or video directly to your device. Photos save as JPG and videos save as MP4 — both at the original quality Instagram stores, ready to view offline or share elsewhere.",
  },
];

const TIPS = [
  {
    title: "Save stories before the 24-hour window closes",
    description:
      "Once a story expires, it's gone from the profile entirely (unless it's in a Highlight), and StorySnag can no longer fetch it. If you spot something worth keeping, it's worth downloading right away rather than coming back later.",
  },
  {
    title: "Check Highlights for older stories",
    description:
      "Many creators and businesses pin their best stories to Highlights, which live permanently on the profile. If a story has already expired from the main feed, check whether it was saved to a Highlight — StorySnag can still fetch it from there.",
  },
  {
    title: "Download the original file, not a screen recording",
    description:
      "Screen-recording a story re-encodes the video and often captures your phone's status bar or notification banners. Downloading directly through StorySnag keeps the original resolution and audio quality intact.",
  },
  {
    title: "Great for backups and research",
    description:
      "Social media managers, journalists, and researchers often use story downloads to archive public campaign content or document public statements before they expire — just remember to respect the creator's rights if you plan to reuse anything.",
  },
  {
    title: "Double-check the handle before pasting",
    description:
      "Instagram usernames can look similar at a glance — swapped underscores, extra periods, or lookalike characters are common. A quick copy-paste straight from the profile avoids typos that would otherwise return the wrong account's stories.",
  },
  {
    title: "Revisit active stories throughout the day",
    description:
      "Because new stories can be posted at any time and each one has its own 24-hour clock, checking back on a profile more than once a day is the only way to catch everything before it expires — StorySnag will always show whatever is currently live.",
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
  {
    q: "Can I download an entire profile's stories at once?",
    a: "Yes — when you paste a username, StorySnag shows every story currently live on that profile, and you can preview and download each one individually.",
  },
  {
    q: "Why can't I find a story I saw yesterday?",
    a: "If it's been more than 24 hours since it was posted and it wasn't saved to a Highlight, Instagram has already removed it from the profile, and no tool — including StorySnag — can retrieve it after that.",
  },
  {
    q: "Can I save a story from a brand or business account?",
    a: "Yes — as long as the account is public, StorySnag works the same way for business, creator, and personal accounts alike.",
  },
  {
    q: "Will the downloaded video include the original audio?",
    a: "Yes. Video stories download with their original audio track fully intact, exactly as Instagram stored it.",
  },
  {
    q: "Can I use StorySnag on my phone instead of a computer?",
    a: "Yes — StorySnag is a responsive website, so it works the same way in any mobile browser as it does on desktop, with no app install required on either platform.",
  },
  {
    q: "Can I download a story that includes a link sticker or poll?",
    a: "Yes — StorySnag downloads the underlying photo or video exactly as posted, including any visible stickers, text, or poll overlays baked into the image or video itself.",
  },
];

export default function Page() {
  return (
    <GuidePage
      eyebrow="Instagram Stories"
      h1="How to Download Instagram Stories"
      intro="Save any public Instagram story as a photo or video in seconds. No app install, no login, and the account owner never finds out."
      introDetail={INTRO_DETAIL}
      steps={STEPS}
      tips={TIPS}
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
