import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy | StorySnag",
  description: "What StorySnag does and doesn't collect when you use the site.",
  path: "/privacy",
});

const LAST_UPDATED = "September 10, 2026";

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-14">
      <h1 className="font-display text-3xl font-bold text-foreground">Privacy Policy</h1>
      <p className="mt-2 text-sm text-foreground/50">Last updated: {LAST_UPDATED}</p>

      <Section title="Overview">
        <p>
          StorySnag is built to be used anonymously. There&apos;s no account, no login, and no Instagram
          credentials are ever requested or stored.
        </p>
      </Section>

      <Section title="Information we collect">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Standard server logs (IP address, timestamp, requested URL) used briefly for rate limiting and abuse prevention.</li>
          <li>The username or link you submit, used only to fetch and display the requested content.</li>
          <li>No names, emails, or other personal information — unless you choose to email us directly.</li>
        </ul>
      </Section>

      <Section title="How we use Instagram data">
        <p>
          Profile, story, and reel data is fetched on demand from a third-party Instagram data provider and shown
          to you directly. It&apos;s cached briefly for performance — up to 5 minutes for stories and reels, up to
          1 hour for profile info — then discarded. We don&apos;t build permanent archives of Instagram content.
        </p>
      </Section>

      <Section title="Cookies & local storage">
        <p>
          We store your dark/light mode preference in your browser&apos;s local storage. That&apos;s the only
          thing we set today. If we add analytics or ad services in the future, this policy will be updated to
          reflect it before they go live.
        </p>
      </Section>

      <Section title="Third-party services">
        <p>
          We use a third-party API to fetch public Instagram data. That provider processes your request (the
          username or link you submit) to return content; we don&apos;t share any additional information with
          them.
        </p>
      </Section>

      <Section title="Children's privacy">
        <p>StorySnag isn&apos;t directed at children under 13, and we don&apos;t knowingly collect information from them.</p>
      </Section>

      <Section title="Instagram disclaimer">
        <p>StorySnag is not affiliated with, endorsed by, or sponsored by Instagram or Meta Platforms, Inc.</p>
      </Section>

      <Section title="Changes to this policy">
        <p>We may update this policy occasionally. Material changes will be reflected here with a new date.</p>
      </Section>

      <Section title="Contact">
        <p>
          Questions about this policy?{" "}
          <a href="mailto:hello@storysnag.com" className="text-accent-400 hover:underline">
            hello@storysnag.com
          </a>
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
