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

const INTRO_DETAIL =
  "Instagram deliberately shows profile pictures as a small, cropped circle — fine for browsing, but useless the moment you actually want to see the photo clearly or save a copy. There's no official \"view full size\" button anywhere in the app. What most people don't realize is that Instagram still stores a much larger version of that photo on its servers; the app just never displays it. StorySnag retrieves that full-size original directly, so you can see faces, text, or details that are completely lost in the tiny thumbnail, and save the file at the same resolution Instagram keeps internally. It's useful for double-checking who you're talking to, archiving a brand's current logo, or just getting a better look at a picture you can otherwise barely make out. This comes up more often than people expect — comparing a profile picture against another photo to confirm an identity, grabbing a clean brand asset without asking a design team to re-export it, or simply wanting to see a grandparent's or old friend's photo without the usual tiny, blurry crop. Since the lookup only needs a username, it works just as well for accounts you've never interacted with as it does for ones you follow closely. No special permissions or follow relationship changes what you can see, because Instagram has always treated the profile photo itself as public-facing — the privacy setting on an account governs its posts and stories, not the picture used to represent it across the platform.";

const STEPS = [
  {
    icon: Link2,
    title: "Enter the username",
    description:
      "Type or paste the @handle of the profile whose picture you want to view or save. You don't need a link — just the handle is enough, and it works for personal accounts, creators, and business profiles alike.",
  },
  {
    icon: Sparkles,
    title: "StorySnag fetches the HD version",
    description:
      "Instagram stores a much larger version of every profile photo than it displays in the app. StorySnag retrieves the full-size original from Instagram's servers, so you see the exact same file the account owner uploaded, not a cropped thumbnail.",
  },
  {
    icon: Download,
    title: "Download or view full-screen",
    description:
      "Open the image full-screen to inspect it closely, or download it directly as a JPG to keep a copy. Either way, you're looking at the real resolution — often several times larger than the thumbnail Instagram shows by default.",
  },
];

const TIPS = [
  {
    title: "Use the HD version to verify an account before trusting it",
    description:
      "Blurry, low-res profile pictures are sometimes a sign of a fake or impersonation account. Viewing the full-resolution original can make inconsistencies, stolen photos, or poor-quality edits much easier to spot.",
  },
  {
    title: "Works for business and creator accounts too",
    description:
      "Brand logos and creator headshots benefit the same way — if you need a clean copy of a company's current profile photo for a deck or reference document, the HD version is far more usable than a screenshot of the circle icon.",
  },
  {
    title: "No need to follow the account first",
    description:
      "Profile pictures are visible to anyone, logged in or not, so there's no need to follow an account or even have an Instagram account yourself to look one up.",
  },
  {
    title: "Default avatars won't return a usable image",
    description:
      "If an account has never set a custom profile photo, Instagram's generic default avatar is all there is to fetch — StorySnag can't produce a photo that was never uploaded.",
  },
  {
    title: "Recheck after a profile photo update",
    description:
      "Accounts change their profile picture fairly often. If you're tracking a brand's current look over time, re-running the lookup periodically will always return whatever photo is live on the account right now.",
  },
  {
    title: "Works just as well on mobile as desktop",
    description:
      "There's no difference in how StorySnag retrieves a profile picture depending on the device — the same full-resolution file is returned whether you're looking it up from a phone browser or a laptop.",
  },
  {
    title: "Pair it with the other StorySnag tools",
    description:
      "If you're already looking up a profile's picture, it's often worth checking whether they have any active stories or recent Reels worth saving too — all three lookups use the same username.",
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
  {
    q: "What if the username doesn't exist or is spelled wrong?",
    a: "StorySnag will let you know it couldn't find a match. Double-check the spelling — Instagram usernames are case-insensitive but must match exactly otherwise, including underscores and periods.",
  },
  {
    q: "Does this work for Facebook or other platforms?",
    a: "No — StorySnag is built specifically for Instagram profile pictures, stories, and Reels.",
  },
  {
    q: "Can I view a profile picture history, not just the current one?",
    a: "No — StorySnag shows whatever profile picture is currently live on the account. It doesn't keep or expose a history of past photos.",
  },
  {
    q: "Is viewing a profile picture different from downloading it?",
    a: "Not really — both show you the same full-resolution file. Viewing opens it full-screen in your browser; downloading saves a JPG copy to your device.",
  },
  {
    q: "Do I need an Instagram account to use this tool?",
    a: "No — StorySnag doesn't require you to log in or even have an Instagram account yourself. Just enter the username you're looking up.",
  },
  {
    q: "Will the profile picture download still work if the account is deactivated?",
    a: "No — if an account has been deactivated or deleted, Instagram no longer serves any of its data, including the profile picture, so StorySnag won't be able to retrieve it.",
  },
];

export default function Page() {
  return (
    <GuidePage
      eyebrow="Profile Pictures"
      h1="Instagram Profile Picture Downloader"
      intro="See any Instagram profile picture at full resolution and save it — way bigger than the tiny circle Instagram shows you."
      introDetail={INTRO_DETAIL}
      steps={STEPS}
      tips={TIPS}
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
