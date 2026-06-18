# Wirral AI — Marketing Website

A multi-page site built with React, TypeScript, Tailwind CSS, React Router and Vite, following the
Wirral AI brand (Electric Blue / AI Green / Dark Navy) with the "W" logo's circuit-to-network motif as
the visual signature throughout.

## ⚠️ Required setup: the chat assistant needs an API key

Every call-to-action on the site opens an AI chat widget that qualifies the visitor (business name,
industry, what they're after, contact details) before handing off to WhatsApp with a proper summary —
**nothing goes to WhatsApp without going through this chat first.** That chat is powered by Claude via
a small serverless function at `api/chat.js`, which needs an Anthropic API key to work.

To set it up:

1. Get an API key at [console.anthropic.com](https://console.anthropic.com) (this is a separate,
   pay-as-you-go account from a regular Claude.ai subscription — usage for this chatbot is genuinely
   cheap, but it isn't free, and it's billed to whichever account owns the key).
2. In the Vercel project dashboard: **Settings → Environment Variables**, add a variable named
   `ANTHROPIC_API_KEY` with that key as the value. Never put this key directly in code or commit it to
   GitHub.
3. Redeploy (Vercel sometimes needs a fresh deploy to pick up a newly-added environment variable).

Until that's set, the chat widget will show a graceful error with a direct WhatsApp fallback link rather
than breaking outright — but the qualifying chat itself won't run.

## Quick start

```bash
npm install
npm run dev       # local dev server, usually http://localhost:5173 (chat API won't work locally
                   # without `vercel dev` and a `.env` file with ANTHROPIC_API_KEY set)
npm run build     # production build into /dist
npm run preview   # preview the production build locally (static only, no API routes)
```

## Deploying

This is a static frontend (`/dist`) plus one serverless function (`/api/chat.js`), which is exactly
what Vercel's zero-config setup expects — push to GitHub and import the repo with the Vite preset, no
extra configuration needed beyond the environment variable above.

## How the lead-capture flow works

There are no contact forms anywhere on this site. Instead:

1. Every CTA button calls `openChat(topic)` from `src/lib/chatContext.tsx`, which opens the chat widget
   (`src/components/ChatWidget.tsx`) with a topic-specific opening line (`src/lib/chatOpeners.ts`).
2. The widget sends the conversation to `/api/chat.js`, which proxies it to Claude with a system prompt
   (in that same file) instructing it to qualify the lead conversationally — never as a rigid form.
3. Once Claude has enough information, it ends its reply with a structured `[SUMMARY_READY]...[/SUMMARY_READY]`
   block. The frontend (`src/lib/chatSummary.ts`) detects this, hides it from the visible chat, and shows
   a "Send to Nathan on WhatsApp" button with that summary pre-filled as the message.
4. The visitor still has to tap send in their own WhatsApp app — that's a WhatsApp platform limitation
   (true `wa.me` links can't be sent programmatically), not something this code can change. What's
   different from a plain link is that the message is now a real, specific summary instead of a generic
   "hi, I'm interested."

The WhatsApp number itself lives in `src/lib/whatsapp.ts`.

## Site structure

- `/` — homepage
- `/ai-staff`, `/automated-marketing` — the two add-on pillar pages
- `/restaurants`, `/trades`, `/clinics-salons` — niche-specific landing pages (add more by extending
  `src/data/niches.ts` and adding a matching `<Route>` in `App.tsx`)
- unmatched paths fall through to a `noindex` 404 page

## Where to edit content

- `src/data/pillars.ts` — the two add-on pillars (AI Staff / Automated Marketing) and their services
- `src/data/niches.ts` — the three industry pages: pain points, examples, SEO copy
- `src/data/painPoints.ts` — the Problem section + the rotating hero pill
- `src/data/benefits.ts` — the six outcome cards
- `src/data/caseStudies.ts` — client case studies and the retention stat
- `src/data/faqs.ts` — the FAQ accordion (also feeds the FAQPage structured data on the homepage)
- `api/chat.js` — the qualifying assistant's system prompt, if you want to change what it asks about

## Pricing model

The website itself is a flat **£50 one-off build, then £20/month** to keep it hosted and supported.
AI Staff and Automated Marketing are optional **add-ons on a separate monthly retainer** — the site is
written throughout to keep that distinction clear rather than implying everything is bundled into the
£50. The retainer amount itself isn't fixed anywhere in the copy (the assistant is told to say it'll be
discussed directly), so add it to the system prompt in `api/chat.js` once you've settled on a number.

## SEO

- `public/sitemap.xml`, `public/robots.txt`, `public/llms.txt` — submit the sitemap to Google Search
  Console once the domain is live.
- Every page sets its own title/description/canonical/Open Graph tags via `src/components/Seo.tsx`,
  rather than sharing one static set across the whole site.
- This is still a client-rendered React app, not a statically pre-rendered one — Google handles that
  fine for indexing, but if you ever want the absolute best Core Web Vitals/SEO ceiling, the next step
  up would be static pre-rendering or SSR, which is a real architecture decision rather than a tweak.

## Things to swap in before this goes live

- **The API key above** — without it, the entire lead-capture flow is non-functional.
- **The retainer price** for AI Staff/Automated Marketing — currently left open in conversation rather
  than stated as a number.
- **Case study copy** (`caseStudies.ts`): the three client blurbs (Gene23, Lahori Lane, JC Paint) are
  accurate in kind but don't include hard numbers. If you get real before/after figures, add them.
- **Operations Snapshot mockup** (`src/components/OperationsSnapshot.tsx`): uses illustrative example
  numbers, clearly labelled "Example data" in small print. Replace with real aggregates if you want.

## Design notes

- Fonts: Space Grotesk (display), IBM Plex Sans (body), IBM Plex Mono (small labels/data) — self-hosted
  from `public/fonts/` (not Google Fonts), with the two fonts used in the first paint preloaded from
  `index.html` for faster mobile load times.
- The hero's animated network background and the Final CTA's quieter reprise of it are the only two
  canvas animations on the page (`src/components/NetworkCanvas.tsx`). It pauses entirely via
  `IntersectionObserver` whenever scrolled off-screen, and throttles its most expensive calculation —
  deliberately tuned this way after mobile performance testing showed the original always-on version
  costing real CPU/battery for no visible benefit once off-screen.
- Every other section uses a lightweight scroll-triggered fade-up (`src/hooks/useScrollReveal.ts` +
  `src/components/Reveal.tsx`), and all motion respects `prefers-reduced-motion`.
- The W logo is a WebP, resized to the largest size it's actually displayed at (it was originally an
  oversized PNG costing real load time for no visual benefit).
