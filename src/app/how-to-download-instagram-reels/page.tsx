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

const INTRO_DETAIL =
  "Reels have become one of the most shared formats on Instagram, but the platform gives you almost no good way to keep a copy of someone else's Reel. There's no built-in download button for other creators' videos, and screen-recording means living with compression artifacts, your phone's battery indicator baked into the footage, and audio that's slightly out of sync. StorySnag was built to close that gap: paste the Reel's link and it fetches the exact MP4 file Instagram serves to the app — same resolution, same audio track, no re-encoding and no watermark layered on top. Whether you're saving a recipe, a tutorial, a funny clip, or a piece of content you want to reference later for work, StorySnag gets you the real file in a couple of clicks. This is especially useful for anyone who relies on Reels professionally — social media managers pulling examples for a client deck, editors studying pacing and transitions, or small businesses keeping an archive of their own published content in case it's ever needed again. Because the download comes from the same source file Instagram's app uses internally, there's no quality ceiling imposed by a third-party re-compression step, which is the main reason screen recordings always look noticeably worse than the original. And because the whole lookup happens anonymously against public data, there's no account to connect, no permissions to grant, and no record left behind linking the download back to you or notifying the creator that their Reel was saved.";

const STEPS = [
  {
    icon: Link2,
    title: "Copy the Reel link",
    description:
      "Open the Reel in the Instagram app or on the web, tap the share icon, and choose Copy Link. This works for any public Reel — you don't need to be following the creator, and the link format is the same whether it came from a profile, the Reels tab, or a direct share.",
  },
  {
    icon: Sparkles,
    title: "Paste the link into StorySnag",
    description:
      "Paste the link into the box above. StorySnag parses the URL, looks up the Reel, and fetches the original video file Instagram serves to the app — the same quality you'd see watching it natively, not a re-compressed copy.",
  },
  {
    icon: Download,
    title: "Download the MP4",
    description:
      "Click download to save the Reel in its original quality — ready to watch offline, add to a collection, or use for reference. The file downloads directly to your device with no extra steps, countdowns, or pop-ups in the way.",
  },
];

const TIPS = [
  {
    title: "Grab the link from the Reel itself, not the profile grid",
    description:
      "Tapping share directly on the Reel gives you the cleanest, most reliable link. Links copied from a profile grid thumbnail can sometimes point to the wrong post if the grid has reordered since you opened it.",
  },
  {
    title: "Save Reels for offline viewing on flights or with poor signal",
    description:
      "Once downloaded, a Reel plays like any other local video file — no internet connection, no Instagram account, and no app required to watch it again later.",
  },
  {
    title: "Keep a reference library for inspiration",
    description:
      "Many creators download Reels from accounts they admire to study editing styles, transitions, or pacing. Just remember that downloading for personal reference is different from reposting — don't redistribute someone else's content as your own.",
  },
  {
    title: "Audio comes along automatically",
    description:
      "There's no separate step needed to preserve sound — StorySnag downloads the full video file with its original audio track already included, whether that's a voiceover, licensed music, or ambient sound.",
  },
  {
    title: "Re-copy the link if a download looks off",
    description:
      "If a Reel has been edited, replaced, or taken down since you first copied the link, fetching it again from the live post ensures you're downloading the current version rather than a stale one.",
  },
  {
    title: "Works the same for Reels embedded in a profile's feed",
    description:
      "Reels posted directly to a profile's grid use the same link format as ones found in the dedicated Reels tab, so there's nothing special to do differently depending on where you found the video.",
  },
  {
    title: "Organize downloads as you go",
    description:
      "If you're building a reference library of several Reels, renaming each file right after downloading — rather than sorting through a folder of generic filenames later — saves a lot of time when you come back to it.",
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
  {
    q: "Does it matter if the Reel link came from the app or the web?",
    a: "No — both instagram.com Reel links and links shared from the mobile app work the same way in StorySnag.",
  },
  {
    q: "Why did my download fail?",
    a: "The most common reasons are a mistyped or incomplete link, or the account switching to private after you copied the link. Double-check the link and confirm the account is still public, then try again.",
  },
  {
    q: "Can I download a Reel that's been shared to someone's story?",
    a: "Yes — if you can get to the original Reel's own link (tap through to the source post), StorySnag can fetch it the same way as any other public Reel.",
  },
  {
    q: "Is there a size or length limit on Reels I can download?",
    a: "No — StorySnag fetches the full Reel file regardless of its length, up to whatever maximum Instagram itself allows for Reels.",
  },
  {
    q: "Can I download a Reel on my phone without an app?",
    a: "Yes — just open StorySnag in your phone's browser, paste the Reel link, and download directly to your device's storage, the same way you would on a desktop.",
  },
  {
    q: "Can I download a Reel that was posted as a collaboration between two accounts?",
    a: "Yes — collaborative Reels work the same as any other public Reel. Use the link from either collaborator's profile and StorySnag will fetch the same underlying video.",
  },
];

export default function Page() {
  return (
    <GuidePage
      eyebrow="Instagram Reels"
      h1="How to Download Instagram Reels in HD"
      intro="Grab any public Instagram Reel as a clean MP4 — full resolution, no watermark, no sign-up required."
      introDetail={INTRO_DETAIL}
      steps={STEPS}
      tips={TIPS}
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
