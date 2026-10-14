import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "About StorySnag | StorySnag",
  description: "What StorySnag is, who it's for, and how it works.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-14">
      <h1 className="font-display text-3xl font-bold text-foreground">About StorySnag</h1>

      <Section title="What StorySnag is">
        <p>
          StorySnag is a free web tool for saving public Instagram content — stories, Reels, and profile
          pictures — without installing an app, creating an account, or logging in to Instagram. Paste a
          username or a link into the box on the homepage, and StorySnag fetches the original file directly
          from Instagram&apos;s public data so you can preview it and download it to your device in a couple of
          clicks.
        </p>
        <p>
          The project started from a simple frustration: Instagram stories disappear after 24 hours, the
          in-app profile picture is a tiny cropped circle, and saving a Reel usually means screen-recording it
          and losing quality in the process. StorySnag fixes all three by going straight to the source files
          Instagram already serves, instead of recreating or re-compressing anything.
        </p>
      </Section>

      <Section title="Who it's for">
        <p>
          StorySnag is built for anyone who wants to keep a copy of public Instagram content they care about —
          a friend&apos;s travel story before it expires, a Reel for a moodboard, or a clearer look at a
          profile picture. It&apos;s commonly used by social media managers archiving campaign content,
          researchers and journalists collecting public posts for reference, and everyday users who simply want
          a backup of stories and Reels that Instagram doesn&apos;t let you save natively. It only works on
          public accounts — StorySnag has no way to access private content, and it never asks for your
          Instagram password.
        </p>
      </Section>

      <Section title="How it works">
        <p>
          Under the hood, StorySnag takes the username or link you paste in, looks up the associated public
          Instagram data, and locates the original, full-resolution media file rather than a compressed
          preview. That file is handed back to you to preview and download directly — nothing is uploaded to
          Instagram, no notification is sent to the account you&apos;re viewing, and no login is required on
          either end. There&apos;s no limit on how many times you can use it, no watermark added to downloads,
          and no app to install; it runs entirely in your browser on any device with an internet connection.
        </p>
      </Section>

      <Section title="A note on respect and legality">
        <p>
          StorySnag is a tool for personal use, backups, and fair-use research — not for republishing or
          redistributing someone else&apos;s content without their permission. See our{" "}
          <a href="/terms" className="text-accent-400 hover:underline">
            Terms of Service
          </a>{" "}
          for the full details, and our{" "}
          <a href="/privacy" className="text-accent-400 hover:underline">
            Privacy Policy
          </a>{" "}
          for exactly what information we do (and don&apos;t) collect. StorySnag is not affiliated with,
          endorsed by, or sponsored by Instagram or Meta Platforms, Inc.
        </p>
      </Section>

      <Section title="Questions">
        <p>
          Reach out any time at{" "}
          <a href="mailto:hello@storysnag.com" className="text-accent-400 hover:underline">
            hello@storysnag.com
          </a>
          .
        </p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="font-display text-lg font-semibold text-foreground">{title}</h2>
      <div className="mt-2 space-y-3 text-sm leading-relaxed text-foreground/70">{children}</div>
    </section>
  );
}
