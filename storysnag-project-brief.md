# StorySnag — Project Brief
## Instagram Story, Reel & Profile Picture Downloader
**Domain:** storysnag.com  
**Deploy target:** Vercel  
**Built with:** Claude Code

---

## 1. Product Vision

StorySnag is a fast, clean, anonymous Instagram downloader focused on stories, reels, and profile pictures. The goal is to become the tool users *think of first* when they want to save Instagram content — winning through UX quality, not feature bloat.

The market is crowded (storysaver.net, snapinsta.to, fastdl.app, sssinstagram.com) but most competitors are ad-heavy and visually dated. StorySnag wins by being faster, cleaner, and more memorable.

---

## 2. Target Audience

- **General public** — anyone saving stories casually
- **Content creators / influencers** — archiving their own or others' content
- **Social media managers / marketers** — monitoring competitors, saving campaign content

All users are anonymous. No login required.

---

## 3. MVP Features

### 3.1 Smart Input Bar (Primary UI Element)
A single input bar that auto-detects what the user entered:

| Input type | Detection logic | Action |
|---|---|---|
| `chaampinon` or `@chaampinon` | No slashes, no protocol | Handle search → fetch profile + active stories |
| `instagram.com/chaampinon` | Instagram profile URL pattern | Same as handle search |
| `instagram.com/stories/chaampinon/...` | Story direct link | Fetch that specific story |
| `instagram.com/reel/ABC123/` | Reel direct link | Fetch that specific reel |
| `instagram.com/p/ABC123/` | Post direct link | Fetch that specific post (image/video) |

The bar should:
- Strip `@` prefix, `https://`, `www.` automatically
- Show a subtle hint below: `Enter a username, @handle, or Instagram link`
- Animate a loading state while fetching
- Show inline error if profile is private or not found

### 3.2 Profile Results View
When a handle/profile URL is entered, show:
- **Profile header**: avatar (HD, downloadable), display name, username, bio snippet
- **Stories grid**: thumbnail grid of active stories (photo + video), each with a download button and preview on click/tap
- **Reels tab**: grid of recent reels with thumbnail + duration badge, download button per reel
- **Profile picture download**: prominent "Download HD" button on the avatar

### 3.3 Direct Link Results View
When a direct story/reel/post link is entered:
- Show a single media card with preview + download button
- For video: show thumbnail with play button, duration
- For photo: show full preview
- One-click download, no extra steps

### 3.4 Download Flow
- Preview before download (always)
- Single click to download (no popups, no redirects, no countdown timers)
- Original quality (highest available resolution)
- Proper filename: `storysnag_[username]_[type]_[timestamp].[ext]`

---

## 4. Tech Stack

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS 3+
- **Fonts:** Distinctive, non-generic choices (NOT Inter, Roboto, Arial). Use a characterful display font paired with a clean body font via Google Fonts.
- **Icons:** Lucide React
- **Animations:** Framer Motion for page transitions and micro-interactions

### Backend (API Routes)
- **Runtime:** Next.js API routes (serverless on Vercel)
- **Instagram data:** RapidAPI Instagram scraper endpoint (or equivalent) — abstracted behind a service layer so the provider can be swapped
- **Rate limiting:** Basic IP-based rate limiting to prevent abuse
- **Caching:** In-memory cache (or Vercel KV if needed) for profile data (TTL: 5 min for stories, 1 hour for profile info)

### Deployment
- **Platform:** Vercel (free tier to start)
- **Domain:** storysnag.com (DNS pointed from registrar to Vercel)
- **Environment variables:** `RAPIDAPI_KEY`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GA_ID`

---

## 5. Design Direction

### Aesthetic: "Refined utility" — clean, fast, confident
NOT another generic tool site. Think: the confidence of a premium SaaS landing page applied to a free utility tool.

- **Dark mode default** with optional light mode toggle
- **Color palette:** Warm accent (amber/orange) against dark neutrals — conveys speed and energy. NOT blue/purple gradients.
- **Typography:** Bold, distinctive headings. Clean readable body text. The brand name "StorySnag" should feel snappy.
- **Layout:** Centered hero with oversized input bar. Results below. Minimal navigation.
- **Micro-interactions:** Input bar glow on focus, smooth skeleton loaders, download button feedback animation, media cards with hover preview.
- **Mobile-first:** 70%+ of traffic will be mobile. Touch targets 44px+, thumb-friendly layout.

### Key pages
1. **Home** (`/`) — Hero + smart input bar + how-it-works section + FAQ (for SEO)
2. **Profile view** (`/profile/[username]`) — Stories grid + reels + profile pic download
3. **Direct download** (`/download`) — Single media card result

### Ad placement strategy (Phase 1)
- One banner below the input bar (before results)
- One banner between stories grid and reels section
- One banner at page bottom
- **NEVER:** interstitial ads, popups, fake download buttons, countdown timers. This is the competitive advantage — respect the user.

---

## 6. SEO Strategy

### Meta & technical
- Dynamic `<title>` and `<meta description>` per page
- `robots.txt` and `sitemap.xml` auto-generated
- Open Graph + Twitter Card meta for social sharing
- Schema.org `WebApplication` structured data on homepage
- Fast Core Web Vitals (target: all green)

### Content pages (for organic traffic)
- `/how-to-download-instagram-stories` — guide page
- `/how-to-download-instagram-reels` — guide page  
- `/instagram-profile-picture-downloader` — landing page
- `/blog` — future content hub

### Target keywords
- "instagram story downloader"
- "download instagram stories"  
- "instagram reel downloader"
- "instagram profile picture download"
- "save instagram stories anonymously"
- "[username] instagram stories" (dynamic, via profile pages)

---

## 7. Project Structure

```
storysnag/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with fonts, metadata, analytics
│   │   ├── page.tsx                # Home — hero + input bar + SEO content
│   │   ├── profile/
│   │   │   └── [username]/
│   │   │       └── page.tsx        # Profile results view
│   │   ├── download/
│   │   │   └── page.tsx            # Direct link results
│   │   ├── api/
│   │   │   ├── profile/
│   │   │   │   └── route.ts        # GET /api/profile?username=x
│   │   │   ├── stories/
│   │   │   │   └── route.ts        # GET /api/stories?username=x
│   │   │   ├── reels/
│   │   │   │   └── route.ts        # GET /api/reels?username=x
│   │   │   ├── media/
│   │   │   │   └── route.ts        # GET /api/media?url=x (direct link resolver)
│   │   │   └── download/
│   │   │       └── route.ts        # GET /api/download?url=x (proxy download)
│   │   └── globals.css
│   ├── components/
│   │   ├── SmartInputBar.tsx        # The main input with auto-detection
│   │   ├── ProfileHeader.tsx        # Avatar + name + bio
│   │   ├── StoriesGrid.tsx          # Thumbnail grid of stories
│   │   ├── ReelsGrid.tsx            # Thumbnail grid of reels
│   │   ├── MediaCard.tsx            # Single media preview + download
│   │   ├── DownloadButton.tsx       # Animated download CTA
│   │   ├── AdSlot.tsx               # Wrapper for ad placements
│   │   ├── Footer.tsx               # Links, disclaimer, branding
│   │   ├── ThemeToggle.tsx          # Dark/light mode switch
│   │   └── SkeletonLoader.tsx       # Loading placeholder
│   ├── lib/
│   │   ├── instagram.ts             # Instagram API service layer
│   │   ├── input-parser.ts          # Smart input detection logic
│   │   ├── cache.ts                 # In-memory caching util
│   │   └── rate-limit.ts            # IP-based rate limiter
│   └── types/
│       └── instagram.ts             # TypeScript types for API responses
├── public/
│   ├── og-image.png                 # Social sharing image
│   └── favicon.ico
├── tailwind.config.ts
├── next.config.js
├── vercel.json
├── package.json
├── tsconfig.json
└── .env.example                     # RAPIDAPI_KEY, NEXT_PUBLIC_SITE_URL, etc.
```

---

## 8. API Service Layer

The Instagram data fetching should be abstracted so the provider can be swapped:

```typescript
// lib/instagram.ts — interface
export interface InstagramService {
  getProfile(username: string): Promise<Profile>;
  getStories(username: string): Promise<Story[]>;
  getReels(username: string): Promise<Reel[]>;
  getMediaByUrl(url: string): Promise<Media>;
  getProfilePicHD(username: string): Promise<string>; // HD URL
}
```

Initial implementation uses RapidAPI. If it breaks or gets expensive, swap to another provider without touching components.

---

## 9. Monetization Phases

| Phase | Trigger | Revenue |
|---|---|---|
| **1 — Ads** | Launch | Google AdSense — 3 non-intrusive placements |
| **2 — Affiliate** | 10k monthly users | Contextual affiliate links (VPN, social tools) |
| **3 — Pro tier** | 50k monthly users | $4.99/mo — no ads, bulk download, history, favorites |

---

## 10. Launch Checklist

- [ ] Domain registered (storysnag.com)
- [ ] Vercel project created and linked
- [ ] RapidAPI key provisioned
- [ ] Core pages built (home, profile, download)
- [ ] Smart input bar working with all 3 input types
- [ ] Download proxy working (bypasses CORS)
- [ ] Mobile responsive on all pages
- [ ] Ad slots wired (can be empty until AdSense approved)
- [ ] SEO meta tags on all pages
- [ ] Analytics (Google Analytics or Plausible)
- [ ] Legal: Terms of Service + Privacy Policy pages
- [ ] Disclaimer: "StorySnag is not affiliated with Instagram"
- [ ] Test on: Chrome, Safari, Firefox, iOS Safari, Android Chrome
