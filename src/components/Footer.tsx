import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface/50">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-foreground/60">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <Link href="/" className="font-display font-semibold text-foreground">
            StorySnag
          </Link>
          <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            {/* -my-3 offsets the padding so the bigger tap target doesn't push the row apart visually. */}
            <Link href="/" className="-my-3 flex items-center py-3 hover:text-foreground">
              Home
            </Link>
            <Link href="/terms" className="-my-3 flex items-center py-3 hover:text-foreground">
              Terms
            </Link>
            <Link href="/privacy" className="-my-3 flex items-center py-3 hover:text-foreground">
              Privacy
            </Link>
            <a href="mailto:hello@storysnag.com" className="-my-3 flex items-center py-3 hover:text-foreground">
              Contact
            </a>
          </nav>
        </div>
        <p className="mt-4 text-center text-xs text-foreground/40 sm:text-left">
          StorySnag is not affiliated with, endorsed by, or sponsored by Instagram or Meta Platforms, Inc. Only
          download content you have the right to use.
        </p>
      </div>
    </footer>
  );
}
