import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { ImageIcon } from "lucide-react";
import SmartInputBar from "@/components/SmartInputBar";
import AdSlot from "@/components/AdSlot";
import { buildFaqSchema, type FaqEntry } from "@/lib/schema";

export interface GuideStep {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface RelatedGuide {
  href: string;
  label: string;
}

export interface GuidePageProps {
  eyebrow: string;
  h1: string;
  intro: string;
  steps: GuideStep[];
  faqs: FaqEntry[];
  ctaHeading: string;
  ctaSubheading: string;
  relatedGuides: RelatedGuide[];
}

export default function GuidePage({
  eyebrow,
  h1,
  intro,
  steps,
  faqs,
  ctaHeading,
  ctaSubheading,
  relatedGuides,
}: GuidePageProps) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema(faqs)) }}
      />

      <section className="flex flex-col items-center px-4 pb-14 pt-12 text-center sm:pt-16">
        <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-wide text-accent-400">
          {eyebrow}
        </span>
        <h1 className="mt-4 text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          {h1}
        </h1>
        <p className="mt-4 max-w-xl text-base text-foreground/60 sm:text-lg">{intro}</p>

        <div className="mt-8 flex w-full justify-center">
          <SmartInputBar />
        </div>
      </section>

      <section className="border-t border-border bg-surface/30 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-display text-2xl font-bold sm:text-3xl">Step-by-step guide</h2>
          <ol className="mt-10 divide-y divide-border">
            {steps.map((step, index) => (
              <li key={step.title} className="grid gap-6 py-10 first:pt-0 last:pb-0 sm:grid-cols-2 sm:items-center">
                <div className="sm:order-1">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-500/10 text-sm font-display font-semibold text-accent-400">
                      {index + 1}
                    </span>
                    <step.icon className="h-5 w-5 text-accent-400" />
                  </div>
                  <h3 className="mt-3 font-display text-lg font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-foreground/60">{step.description}</p>
                </div>
                <div
                  className="flex aspect-video w-full items-center justify-center rounded-xl border border-dashed border-border/60 bg-surface-raised/40 text-foreground/30 sm:order-2"
                  aria-hidden="true"
                >
                  <ImageIcon className="h-8 w-8" strokeWidth={1.5} />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <AdSlot id="guide-mid-content" size="leaderboard" />
        </div>
      </div>

      <section className="px-4 pb-16">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">{ctaHeading}</h2>
          <p className="mt-2 text-sm text-foreground/60 sm:text-base">{ctaSubheading}</p>
          <div className="mt-6 flex justify-center">
            <SmartInputBar />
          </div>
        </div>
      </section>

      <section className="border-t border-border px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center font-display text-2xl font-bold sm:text-3xl">Frequently asked questions</h2>
          <div className="mt-8 divide-y divide-border">
            {faqs.map((faq) => (
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

      {relatedGuides.length > 0 && (
        <section className="border-t border-border bg-surface/30 px-4 py-12">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-foreground/50">
              More guides
            </h2>
            <nav className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2">
              {relatedGuides.map((guide) => (
                <Link key={guide.href} href={guide.href} className="text-sm text-accent-400 hover:underline">
                  {guide.label}
                </Link>
              ))}
            </nav>
          </div>
        </section>
      )}
    </>
  );
}
