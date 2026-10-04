# StorySnag

Instagram story, reel, and profile picture downloader. No login required.

Full product spec: [`storysnag-project-brief.md`](./storysnag-project-brief.md).

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Framer Motion, Lucide React
- Instagram data via [Apify](https://console.apify.com) actors

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in APIFY_TOKEN
npm run dev
```

Open http://localhost:3000.

## Environment variables

| Variable               | Required | Notes                                            |
| ----------------------- | -------- | ------------------------------------------------- |
| `APIFY_TOKEN`           | yes      | Server-only. Never expose via `NEXT_PUBLIC_*`.     |
| `NEXT_PUBLIC_SITE_URL`  | yes      | Used for metadata/Open Graph URLs.                 |

## Structure

```
src/
├── app/
│   ├── page.tsx                  # Home — hero, smart input, how-it-works, FAQ
│   ├── profile/[username]/       # Profile results view (stories/reels tabs)
│   ├── download/                 # Direct story/reel/post link results (single MediaCard)
│   ├── terms/, privacy/          # Legal pages, linked from the footer
│   ├── robots.ts, sitemap.ts     # /robots.txt, /sitemap.xml (home + terms + privacy)
│   └── api/{profile,stories,reels,media,download}/route.ts
├── components/                   # SmartInputBar, ProfileHeader, StoriesGrid, ReelsGrid, MediaCard, AdSlot, ...
├── lib/                          # instagram.ts (HikerAPI service), input-parser, cache, rate-limit, metadata
└── types/instagram.ts            # Domain types + InstagramService interface
```

`/api/download` proxies Instagram CDN media (allowlisted to `*.cdninstagram.com` / `*.fbcdn.net` hosts
only) and sets `Content-Disposition` so the browser saves as `storysnag_[username]_[type]_[timestamp].[ext]`.

`AdSlot` renders empty placeholder space only — sized per placement (`leaderboard` 728×90 desktop /
mediumRectangle 300×250 / mobile banner 320×50, auto-swapped at the `sm` breakpoint) with a
`data-ad-slot` id ready for AdSense. Three placements: home below the input bar, home page bottom,
and inside `ProfileTabs` between the stories/reels tab switch (the two are tabbed, not stacked, so
this is the closest literal fit to the original "between stories and reels" placement).

## Notes / known gaps

- The SEO content/guide pages from the original brief (`/how-to-download-instagram-*`, `/blog`,
  `/instagram-profile-picture-downloader`) are still **not built** — out of scope for this pass.
- `public/og-image.png` is referenced in metadata but not generated — add a real 1200×630 image before launch.
- Mobile grid columns (`StoriesGrid`/`ReelsGrid`) are 2/3/4 across breakpoints rather than the literal
  1/2/3-4 spec — 1-column mobile renders ~636px-tall 9:16 tiles on a 390px phone (one story per screen),
  which reads as a bug, not a grid. 2-column keeps tiles thumb-sized (~308px tall) while still being
  denser than the original 3/4/5 scheme. Easy to flip back if you want the literal 1-column behavior.
- The cache (`lib/cache.ts`) and rate limiter (`lib/rate-limit.ts`) are in-memory and per-instance —
  fine for MVP traffic on Vercel, but reset on cold start and aren't shared across regions. Swap for
  Vercel KV / Upstash if that starts to matter.
- HikerAPI field mappings in `lib/instagram.ts` were built against its published OpenAPI schema.
  Confirmed reaching the live endpoint correctly (auth + routing all work), but every call so far
  returns `402 Payment Required` — the HikerAPI account needs credits/billing before real response
  shapes can be verified end-to-end.
- `vercel.json` sets `maxDuration: 60` on `/api/download` only, since it streams potentially large
  video files through a serverless function — the default timeout could cut off big downloads.
- No automated tests yet.
