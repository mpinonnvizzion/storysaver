import type { Metadata } from "next";
import { Download, Link2, Sparkles } from "lucide-react";
import SmartInputBar from "@/components/SmartInputBar";
import AdSlot from "@/components/AdSlot";
import { buildMetadata, SITE_URL } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "StorySnag — Download Instagram Stories, Reels & Profile Pictures",
  description:
    "Paste a username or Instagram link to instantly download stories, reels, and HD profile pictures. No login, no watermarks, totally anonymous.",
  path: "/",
});

const STEPS = [
  {
    icon: Link2,
    title: "Paste a link or handle",
    description: "Drop in a username, @handle, or any instagram.com story, reel, or post link.",
  },
  {
    icon: Sparkles,
    title: "We fetch it instantly",
    description: "StorySnag finds the original, highest-quality version in seconds.",
  },
  {
    icon: Download,
    title: "Download in one click",
    description: "No popups, no countdowns, no watermark. Just your file.",
  },
];

const FAQS = [
  { q: "Is StorySnag free?", a: "Yes — downloading stories, reels, and profile pictures is completely free." },
  {
    q: "Do I need to log in to Instagram?",
    a: "No. StorySnag works anonymously — the account you're downloading from never knows you visited.",
  },
  {
    q: "Can I download private accounts' stories?",
    a: "No. StorySnag can only fetch content from public Instagram accounts.",
  },
  {
    q: "What quality are the downloads?",
    a: "StorySnag always fetches the original, highest-resolution version Instagram has available.",
  },
  {
    q: "How long are stories available?",
    a: "Instagram stories disappear after 24 hours, so grab them before they expire.",
  },
];

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "StorySnag",
            url: SITE_URL,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description:
              "Download Instagram stories, reels, and HD profile pictures instantly. No login required.",
          }),
        }}
      />

      <section className="flex flex-1 flex-col items-center px-4 pb-16 pt-12 text-center sm:pt-20">
        <h1 className="text-balance font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Save Instagram stories, <span className="text-accent-400">reels</span> &amp; profile pics — instantly.
        </h1>
        <p className="mt-4 max-w-xl text-base text-foreground/60 sm:text-lg">
          No login. No watermarks. No waiting rooms. Paste a link and go.
        </p>

        <div className="mt-8 flex w-full justify-center">
          <SmartInputBar />
        </div>

        <div className="mt-10 w-full max-w-2xl">
          <AdSlot id="home-below-input" size="leaderboard" />
        </div>
      </section>

      <section className="border-t border-border bg-surface/30 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-display text-2xl font-bold sm:text-3xl">How it works</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.title} className="flex flex-col items-center text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-500/10 text-accent-400">
                  <step.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-display font-semibold text-foreground">{step.title}</h3>
                <p className="mt-1.5 text-sm text-foreground/60">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center font-display text-2xl font-bold sm:text-3xl">Frequently asked questions</h2>
          <div className="mt-8 divide-y divide-border">
            {FAQS.map((faq) => (
              <details key={faq.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-foreground">
                  {faq.q}
                  <span className="ml-4 shrink-0 text-foreground/40 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 text-sm text-foreground/60">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <div className="px-4 pb-12">
        <div className="mx-auto max-w-2xl">
          <AdSlot id="home-page-bottom" size="leaderboard" />
        </div>
      </div>
    </>
  );
}
