# Wirral AI — Marketing Website

A full homepage built with React, TypeScript, Tailwind CSS and Vite, following the Wirral AI brand brief
(Electric Blue / AI Green / Dark Navy) with the "W" logo's circuit-to-network motif as the visual signature
throughout the site.

## Quick start

```bash
npm install
npm run dev       # local dev server, usually http://localhost:5173
npm run build     # production build into /dist
npm run preview   # preview the production build locally
```

## Deploying

The `/dist` folder produced by `npm run build` is a static site — it can be deployed to Vercel, Netlify,
Cloudflare Pages, or any static host. For Vercel: push this folder to a GitHub repo and import it in Vercel
with the defaults (framework preset: Vite). No environment variables are required.

## Lead capture

This site has **no contact forms and no email capture** — every call-to-action opens a pre-filled WhatsApp
conversation, matching the existing Wirral AI brand standard. The WhatsApp number lives in one place:

```
src/lib/whatsapp.ts
```

## Where to edit content

All copy lives in plain data files so it can be updated without touching component code:

- `src/data/services.ts` — the 10 services, grouped into Capture / Convert / Retain / Optimise
- `src/data/painPoints.ts` — the Problem section + the rotating hero pill, each with its own WhatsApp message
- `src/data/benefits.ts` — the six outcome cards
- `src/data/caseStudies.ts` — client case studies and the retention stat
- `src/data/faqs.ts` — the FAQ accordion

## Things to swap in before this goes live

- **Case study copy** (`caseStudies.ts`): the three client blurbs (Gene23, Lahori Lane, JC Paint) are written
  to be accurate in kind but don't include hard numbers, since I didn't want to invent statistics on your
  behalf. If you have real before/after figures for any of them, drop them in — a specific number will
  convert better than the current qualitative copy.
- **Operations Snapshot mockup** (`src/components/OperationsSnapshot.tsx`): the dashboard preview under the
  hero uses illustrative example numbers (47 leads, 38s response time, etc.) and is labelled "Example data"
  in small print. Replace with real aggregate figures once you're comfortable sharing them, or leave as a
  stylised mockup.
- **Pricing** in the FAQ is described qualitatively ("40–60% less than a traditional agency") rather than
  with a number, since the brief doesn't fix a price and trial length isn't specified anywhere for Wirral AI
  itself — adjust `faqs.ts` if you want to commit to specifics.

## Design notes

- Fonts: Space Grotesk (display), IBM Plex Sans (body), IBM Plex Mono (small labels/data) — loaded via
  Google Fonts in `index.html`.
- The hero's animated network background and the Final CTA's quieter reprise of it are the only two canvas
  animations on the page (`src/components/NetworkCanvas.tsx`), deliberately used sparingly as the page's one
  signature moment rather than scattered everywhere.
- Every other section uses a lightweight scroll-triggered fade-up (`src/hooks/useScrollReveal.ts` +
  `src/components/Reveal.tsx`), and all motion respects `prefers-reduced-motion`.
- The logo PNG was reprocessed from your uploaded artwork to remove its black background and isolate the
  glyph from the surrounding scattered dot texture, so it sits cleanly on the navy background at any size.
