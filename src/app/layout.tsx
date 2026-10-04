import type { Metadata } from "next";
import { Suspense } from "react";
import { Space_Grotesk, Manrope } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import ThemeToggle from "@/components/ThemeToggle";
import { ADSENSE_CLIENT_ID } from "@/lib/adsense";
import { buildMetadata, SITE_URL } from "@/lib/metadata";
import "./globals.css";

const THEME_INIT_SCRIPT = `try {
  if (localStorage.getItem("storysnag-theme") === "light") {
    document.documentElement.classList.remove("dark");
  }
} catch (e) {}`;

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...buildMetadata({
    title: "StorySnag — Download Instagram Stories, Reels & Profile Pictures",
    description:
      "Download Instagram stories, reels, and HD profile pictures instantly. No login, no watermarks, no ads before your download. Just paste a link or handle.",
    path: "/",
  }),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${spaceGrotesk.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <header className="flex items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex min-h-11 items-center font-display text-lg font-bold text-foreground">
            Story<span className="text-accent-400">Snag</span>
          </Link>
          <ThemeToggle />
        </header>
        <div className="flex-1 flex flex-col">{children}</div>
        <Footer />
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
      </body>
    </html>
  );
}
