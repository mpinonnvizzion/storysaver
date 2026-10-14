import type { Metadata } from "next";
import { Download, Globe, ImageIcon, Link2, Monitor, ShieldCheck, Sparkles } from "lucide-react";
import SmartInputBar from "@/components/SmartInputBar";
import AdSlot from "@/components/AdSlot";
import { buildMetadata } from "@/lib/metadata";
import { buildFaqSchema, buildOrganizationSchema, buildWebApplicationSchema } from "@/lib/schema";

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
    description:
      "Drop in a username, @handle, or any instagram.com story, reel, or post link into the box above. StorySnag works with any public account, so you don't need to know anything beyond the handle or URL.",
  },
  {
    icon: Sparkles,
    title: "We fetch it instantly",
    description:
      "StorySnag looks up the original, highest-quality version of that content in seconds — not a compressed preview. Everything happens anonymously, so the account you're viewing never finds out.",
  },
  {
    icon: Download,
    title: "Download in one click",
    description:
      "Preview the result, then download it straight to your device. No popups, no countdown timers, no watermark stamped across the file — just the file you asked for.",
  },
];

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Free & Anonymous",
    description:
      "StorySnag doesn't require an account, a login, or your Instagram password. Every lookup is anonymous — the profile you're viewing is never notified, and we don't track who requested what.",
  },
  {
    icon: Globe,
    title: "No App Install",
    description:
      "There's nothing to download or install. StorySnag runs entirely in your browser, so it works the same whether you're on a shared computer, a work laptop, or a phone you just picked up.",
  },
  {
    icon: ImageIcon,
    title: "HD Quality",
    description:
      "We fetch the original file Instagram stores, not a shrunken thumbnail. Stories, Reels, and profile pictures all download at the highest resolution Instagram makes available.",
  },
  {
    icon: Monitor,
    title: "Works on Any Device",
    description:
      "StorySnag is built as a responsive web app, so it works identically on iPhone, Android, Windows, Mac, or Linux — anywhere you've got a browser and an internet connection.",
  },
];

const STATS = [
  { value: "10,000+", label: "Stories downloaded" },
  { value: "5,000+", label: "Reels saved" },
  { value: "50,000+", label: "Profiles looked up" },
  { value: "100%", label: "Free, always" },
];

const FAQS = [
  { q: "Is StorySnag free?", a: "Yes — downloading stories, reels, and profile pictures is completely free, with no hidden premium tier or download cap." },
  {
    q: "Do I need to log in to Instagram?",
    a: "No. StorySnag works anonymously — the account you're downloading from never knows you visited, and we never ask for your Instagram password.",
  },
  {
    q: "Can I download private accounts' stories?",
    a: "No. StorySnag can only fetch content from public Instagram accounts. There's no way around Instagram's privacy settings, and we don't try to bypass them.",
  },
  {
    q: "What quality are the downloads?",
    a: "StorySnag always fetches the original, highest-resolution version Instagram has available — the same source file the app uses internally, not a compressed copy.",
  },
  {
    q: "How long are stories available?",
    a: "Instagram stories disappear after 24 hours, so grab them before they expire. Stories saved to a profile's Highlights stay available for as long as the Highlight exists.",
  },
  {
    q: "Do I need to install an app or browser extension?",
    a: "No. StorySnag is a website — just open it in any browser on any device. There's nothing to install and nothing to update.",
  },
  {
    q: "Does StorySnag store the content I download?",
    a: "No. Content is fetched on demand and cached briefly for performance, then discarded. We don't keep a permanent archive of anything you download — see our Privacy Policy for details.",
  },
  {
    q: "Is there a limit to how many times I can use StorySnag?",
    a: "No hard limit for normal use. We apply light rate limiting purely to prevent automated abuse, so everyday use — even dozens of downloads a day — works without issue.",
  },
];

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildWebApplicationSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrganizationSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema(FAQS)) }}
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
            {STEPS.map((step, index) => (
              <div key={step.title} className="flex flex-col items-center text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-500/10 text-accent-400">
                  <step.icon className="h-6 w-6" />
                </span>
                <span className="mt-3 font-display text-xs font-semibold uppercase tracking-wide text-foreground/40">
                  Step {index + 1}
                </span>
                <h3 className="mt-1 font-display font-semibold text-foreground">{step.title}</h3>
                <p className="mt-1.5 text-sm text-foreground/60">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-display text-2xl font-bold sm:text-3xl">Why StorySnag?</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm text-foreground/60 sm:text-base">
            Built to be the fastest, most private way to save public Instagram content — no catches.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-border bg-surface-raised/40 p-6 text-left"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-500/10 text-accent-400">
                  <feature.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground/60">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface/30 px-4 py-12">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 text-center sm:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-2xl font-bold text-accent-400 sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-xs text-foreground/60 sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center font-display text-2xl font-bold sm:text-3xl">Frequently asked questions</h2>
          <div className="mt-8 divide-y divide-border">
            {FAQS.map((faq) => (
              <details key={faq.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-foreground">
                  <h3 className="text-left">{faq.q}</h3>
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
