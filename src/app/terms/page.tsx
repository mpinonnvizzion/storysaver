import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service | StorySnag",
  description: "The terms that govern your use of StorySnag.",
  path: "/terms",
});

const LAST_UPDATED = "September 10, 2026";

export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-14">
      <h1 className="font-display text-3xl font-bold text-foreground">Terms of Service</h1>
      <p className="mt-2 text-sm text-foreground/50">Last updated: {LAST_UPDATED}</p>

      <Section title="1. Acceptance of terms">
        <p>
          By using StorySnag, you agree to these terms. If you don&apos;t agree with them, please don&apos;t use
          the site.
        </p>
      </Section>

      <Section title="2. What StorySnag does">
        <p>
          StorySnag lets you download publicly available Instagram stories, reels, and profile pictures by
          pasting a username or link. No account or login is required, and we never ask for your Instagram
          credentials.
        </p>
      </Section>

      <Section title="3. Your responsibilities">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Only download content you have the right to use, or that is otherwise covered by fair use.</li>
          <li>
            Respect the rights of the people who created the content — don&apos;t republish or redistribute it
            without permission.
          </li>
          <li>Don&apos;t use StorySnag to harass, stalk, or violate anyone&apos;s privacy.</li>
          <li>Don&apos;t attempt to abuse, scrape, or overload the service with automated requests.</li>
        </ul>
      </Section>

      <Section title="4. No warranty">
        <p>
          StorySnag is provided &quot;as is,&quot; without warranties of any kind. Instagram content availability,
          quality, and accuracy depend on a third-party data source we don&apos;t control, and we can&apos;t
          guarantee uninterrupted or error-free service.
        </p>
      </Section>

      <Section title="5. Limitation of liability">
        <p>
          To the fullest extent permitted by law, StorySnag and its operators aren&apos;t liable for any indirect,
          incidental, or consequential damages arising from your use of the site.
        </p>
      </Section>

      <Section title="6. Instagram disclaimer">
        <p>StorySnag is not affiliated with, endorsed by, or sponsored by Instagram or Meta Platforms, Inc.</p>
      </Section>

      <Section title="7. Changes to these terms">
        <p>
          We may update these terms occasionally. Continuing to use StorySnag after changes are posted means you
          accept the revised terms.
        </p>
      </Section>

      <Section title="8. Contact">
        <p>
          Questions about these terms?{" "}
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
