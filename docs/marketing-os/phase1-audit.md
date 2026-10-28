# Wirral.ai Marketing OS — Phase 1 audit and plan

Date: 28 October 2026. Status: plan only. No application code in this change.

This document is what was verified in `nath69bank/wirral-ai-website` at `main`, plus what the public live sites returned on 28 October 2026. Anything not seen in code or in those responses is marked as an assumption or a proposal. No secret values are recorded. Environment variables are named only.

`.vercelignore` ignores `*.md`, so this file will not be published on the website.

---

## 1. Where the code actually lives

**The Social App is not in this repository.** Neither is the source of the site that is live at www.wirral.ai today.

| Surface | What it is | Source in this git repo? |
| --- | --- | --- |
| `nath69bank/wirral-ai-website` `main` | Static HTML, CSS and a few Vercel serverless functions. Satoshi and Cabinet Grotesk. Pine and copper tokens in `style.css`. | Yes. This is the checkout. |
| https://www.wirral.ai | Vite single-page app. Bundle `/assets/index-nDhS0IxO.js`. Tailwind CSS 4.3.3. Last-Modified on the homepage: 27 October 2026, 20:25 UTC. | **No.** The live HTML is not the static `index.html` in git. |
| https://socialapp.wirral.ai | Separate Vite app, Content Hub. Bundle `/assets/index-DRWu0Kry.js`. Last-Modified: 27 October 2026, 23:26 UTC. | **No.** |
| Branch `feature/social-content-hub` | Older static page at `/social-content-hub`. It writes copy and says it cannot publish. | In git, not merged, behind `main`. It is not the live app. |

Checked and not the Social App: public repositories `wirral_ai` (a tips product), `Youtubetakeover` (a YouTube playbook), and the client-site repos. No public repository under `nath69bank` contains Post for Me or Stripe server code. The GitHub token used here cannot list private repositories (`user/repos?visibility=private` returned 403). Assumption: the Vite sources are in a private repository or an unpublished local project, and Vercel is deploying those, not this `main`.

The live website and the live Social App are related but separate deployments:

- www.wirral.ai links to `https://socialapp.wirral.ai` and also has its own `/social-content-hub` page.
- That page calls `https://www.wirral.ai/api/content-hub` (the website host, not the Social App host).
- socialapp.wirral.ai calls its own `/api/content-hub`, `/api/social`, `/api/billing` and `/api/referrals`.
- socialapp.wirral.ai loads `assistant.css` and `assistant.js` from www.wirral.ai, except on `/admin`.
- The Social App admin has a “Leads” link to `https://www.wirral.ai/dashboard`.

**Stripe and Post for Me cannot be reused from this repository, because the integration code is not here.** What can be said about reuse comes from the public Social App client and from unauthenticated calls to its public API. See sections 5 and 6.

Until the deploying source is in version control that this work can read, a feature pull request against this `main` would not change the live Social App, and it might not change the live website either.

---

## 2. This repository: framework, hosting, data, auth, secrets

Verified in git `main`.

### Framework

- Static site. No React, Next, or database client.
- `package.json`: `"type": "module"`, Node `24.x`.
- Dependencies: `@anthropic-ai/sdk`, `@vercel/blob`, `zod`.
- Server code is three Vercel functions: `api/chat.js`, `api/opportunities.js`, `api/enquiries.js`, sharing `api/_brand.js`.

### Hosting

- `vercel.json`: `cleanUrls`, no trailing slash, long-cache for `/assets`, one-day cache for CSS and JS, security headers (`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options: SAMEORIGIN`, `Permissions-Policy` allowing microphone on self, HSTS with `includeSubDomains; preload`).
- Redirects for old paths (`/blog` → `/insights`, `/contact` → `/#talk`, location short paths, and similar).
- GitHub Action `.github/workflows/portfolio-screenshots.yml` runs Mondays, captures portfolio shots, and pushes to the repo (`contents: write`).
- Live responses from both www.wirral.ai and socialapp.wirral.ai send `server: Vercel`.

### Database

There is no database.

Enquiries are JSON objects in Vercel Blob under the prefix `enquiries/`, written with `access: 'public'`. The dashboard lists up to 500 blobs and then fetches each public URL.

### Authentication and roles

There are no user accounts and no roles.

`/dashboard` is a single shared secret. The browser stores it in `localStorage` under `wirralai_dashboard_token` and sends `x-dashboard-token`. The server compares it to `DASHBOARD_TOKEN` with `===`. Statuses are `new`, `contacted` and `archived`.

### Environment variable names

Present in code:

- `ANTHROPIC_API_KEY` (required for chat and opportunities)
- `ANTHROPIC_MODEL` (optional; default in code is `claude-opus-5`)
- `DASHBOARD_TOKEN`
- `BLOB_READ_WRITE_TOKEN` (not read directly; the Blob SDK error text is matched when it is missing)

No `.env` file is tracked. `.gitignore` does not ignore `.env`. No Stripe, Post for Me, Clerk, database, or email variables exist in this repo.

---

## 3. Routes, navigation and dashboards

### In git `main`

Public pages: `/`, `/build-with-us`, `/ai-consulting`, `/ai-implementation`, `/ai-automation`, `/ai-training-for-business`, location pages (Wirral, Liverpool, Manchester, Chester, Widnes, Warrington, North Wales), `/insights` plus six articles, `/work`, `/work/the-order-block`.

Header: AI consulting, Implementation, Automation, Capability, Content Hub (external link to socialapp.wirral.ai), Our work, Insights, Build with us.

One private page: `/dashboard` (`noindex`). It is an enquiries list, not a product dashboard.

The assistant (`assistant.js`) is the site chat. It books a call by opening WhatsApp (`wa.me`, number published in the client) and posts a lead to `/api/enquiries`. On socialapp.wirral.ai the same script is loaded with `window.wirralAI = { site: 'contenthub', apiBase: 'https://www.wirral.ai' }`.

### On the live website (bundle, not in git)

Router paths found in `/assets/index-nDhS0IxO.js`:

`/`, `/build-with-us`, `/areas`, `/book`, `/ai-opportunity-finder`, `/social-content-hub`, `/free/boring-jobs-checklist`, `/app`, `/ai-consulting`, `/ai-implementation`, `/ai-automation`, `/ai-training-for-business`, `/discord-community-setup`, `/insights` and article slugs, `/work`, `/work/the-order-block`, plus location pages including Birkenhead, Cheshire, Ellesmere Port, Merseyside and Runcorn (these last five are not in git `main`).

Footer and tool links in that bundle include Social Content Hub, AI opportunity finder, Boring Jobs Checklist, Insights, Our work, Where we work, Build with us, Book a call.

`/app` renders a different tree from the marketing pages (no shared header in that branch of the router). What `/app` contains was not exercised while signed in.

`/social-content-hub` on the live website is a content writer. It posts to `https://www.wirral.ai/api/content-hub`. The website bundle contains no `stripe` string and no “Post for Me” string. Publishing lives on socialapp.wirral.ai.

### On the live Social App

One screen for visitors, plus `/admin` when the path is exactly `/admin`.

Visitor tools named in the client: Post writer, What to post today, review replies, Publish everywhere, Post from a photo, Interview me, 7-day campaign, repurpose, 30-day calendar, Carousel, Ads, My library. Library data is stored in the browser (`localStorage` keys prefixed in the client, including profile, voices, trial and workspace).

Admin tabs: overview, numbers, calendar, analytics, accounts. Overview shows scheduled posts, published posts, a “Post for Me this month” meter, and reach. There is an owner-only action that adds a comment call-to-action to scheduled Instagram and Facebook posts.

Plans named in the client, with the prices written there:

| Tier | Price in the client | Auto-posts / month in the client |
| --- | --- | --- |
| Free | £0 | 0 |
| Starter | £9 | 0 |
| Pro | £19 | 200 |
| Growth | £49 | 200 |
| Done for you | Custom quote | 200 |

These are not the proposed Marketing OS prices (Starter £19, Pro £39, Business £79).

---

## 4. Post for Me

### Not in this repo

No Post for Me SDK, API host, webhook handler, or environment variable.

The unmerged `feature/social-content-hub` page tells visitors it does not connect to Facebook, Instagram, or any other platform.

### What the live Social App client does

`POST /api/social` with JSON. Every call includes a `workspace` id. The browser creates one if missing: `ws_` plus random characters, kept in `localStorage`. Requests also send `x-hub-owner` when an owner token is stored, and `Authorization: Bearer` when Clerk has a session.

Actions present in the client:

| Action | What the client expects back |
| --- | --- |
| `status` | `{ configured: boolean }`. If false, the UI says posting is not switched on. |
| `accounts` | `{ accounts, used }`. Account buttons use `id`. |
| `connect` | `{ url }` opened in a new tab. Platforms in the connect list: `facebook`, `instagram` (image required), `tiktok` (video required), `x`, `linkedin` (labelled “LinkedIn page”), `threads`. |
| `upload-url` | `{ uploadUrl, mediaUrl }`. The browser PUTs the file to `uploadUrl`. |
| `post` | Body includes `allowance`, `items` (`accountId`, `caption`, `title`), `media` (URLs), `scheduledAt` (ISO time or null). |
| `analytics` | `{ accounts }` for the admin. |
| `cancel` | Cancels a scheduled item by `id`. |
| `add-cta` | Optional `dryRun`. Updates scheduled Instagram and Facebook posts. |
| `admin` | Called with analytics when the admin dashboard loads. |

Error codes the client translates: `not_configured`, `monthly_limit`, `pro_only`, `busy`, `not_yours`. `not_yours` is shown as “That account isn’t connected to this device.”

Writing covers eight destinations: Facebook, Instagram, LinkedIn, TikTok, X, YouTube Shorts, Google Business Profile, Threads. **YouTube and Google Business Profile are not in the connect list.** Auto-post copy elsewhere in the same client names Facebook, Instagram, TikTok, X and LinkedIn, and omits Threads. The connect list and the marketing copy do not match.

The admin meter is labelled “Post for Me this month” and says each account a post goes to counts as one. That label is the evidence that the quota is Post for Me’s. The server module that calls Post for Me was not in any repository this audit could read, so the HTTP client, project id, and webhook handler are **not verified**.

### Live check on 28 October 2026

Unauthenticated `POST /api/social` with `action: "status"` and a workspace id that is not a real `ws_…` id returned `{"configured":true}`.

The same style of call with `action: "accounts"` returned `{"error":"no_workspace"}`.

So the posting integration is switched on at the server, and account data is refused without a workspace the server already knows. No account was connected and no post was created.

### Reuse for Marketing OS

Reuse the existing connection only after the server source is available to read. Practical shape, as a proposal:

- Keep one Post for Me account (the one already returning `configured: true`) so OAuth apps and media handling are not rebuilt.
- Do not share one workspace across customers. Each Marketing OS tenant gets its own workspace id, created and stored on the server, bound to the signed-in user. The current browser-generated id is not an isolation boundary.
- Confirm with Post for Me whether one API key’s monthly quota is shared. The client already treats “each account a post goes to” as one unit. A shared key means one busy tenant can exhaust publishing for every other tenant, including Wirral.ai. If the vendor bills per project, give Wirral.ai and each paying tenant their own project.
- Keep using `connect`, `upload-url`, `post` with `scheduledAt`, `cancel` and `analytics` rather than a second social API.
- Add YouTube only if Post for Me exposes it on this project. It is not in the current connect list.
- Video is already a first-class upload for TikTok (`needsMedia: "video"`). Content Studio can start with that path. Caption-only posts remain valid for Facebook, X, LinkedIn and Threads.
- Do not treat the client allowance numbers (0 or 200) as the Post for Me plan limit. Those are product limits. The vendor limit was not visible.

Webhook signature verification for Post for Me: **not verifiable**. No handler exists in this repo, and the server source was not available.

---

## 5. Stripe

### Not in this repo

No Stripe SDK, price id, checkout route, customer portal, or webhook.

### What the live Social App client does

`POST /api/billing`:

| Action | Client behaviour |
| --- | --- |
| `config` | Uses `response.stripe` as a boolean. |
| `checkout` | Body `{ action, tier }` where tier is `starter`, `pro` or `growth`. Redirects to `response.url`. |
| `portal` | Redirects to `response.url`. |
| `metrics` | Admin numbers. If `configured` is false, the UI says numbers appear once Clerk keys are set in Vercel. |

Query `?start=starter|pro|growth` opens checkout. `?billing=success` shows a trial-started message. Trial length in the client is 14 days, or 30 days when a referral code is present. The client also writes a trial object into `localStorage`. Server responses of HTTP 402 on `/api/content-hub` say a tool is on the Growth plan, so at least some tools are gated on the server as well.

### Live check on 28 October 2026

- `POST /api/billing` `{ "action": "config" }` → `{"stripe":false}`
- `POST /api/billing` `{ "action": "checkout", "tier": "pro" }` → HTTP 503 `{"error":"not_configured"}`

Checkout was not completed. No price id appeared in the client bundle (the server would create the Checkout Session).

**Stripe is not switched on for the live Social App**, even though the buttons exist. The owner’s note that Stripe is already in use is not what this deployment returns. Possible explanations, all unverified: keys were removed, this is a different Vercel environment from the one that charges, or Checkout was never given price ids. None of those can be confirmed without the Vercel project and the Stripe dashboard.

### Reuse for Marketing OS

The same Stripe **account** can be used later. The current products cannot be reused as-is:

- No price ids were found, so there is nothing to point at.
- Live Checkout returns `not_configured`.
- Content Hub prices in the client (£9 / £19 / £49, Done for you custom) are a different ladder from Marketing OS (proposed £19 / £39 / £79). Reusing a £9 price for a £19 product would be the wrong product.
- Course entitlements are a second product family. They should be separate Stripe products, not a side effect of the marketing subscription.
- Webhook signature verification: **not verifiable**. There is no webhook route in this repo. A new endpoint must verify the Stripe signature before it changes entitlements. That is a proposal, not a description of existing code.

The owner role that needs no subscription does not exist in Stripe or in this repo. Today “owner” on the Social App is a token in the URL hash `#owner=` (16 or more word characters), copied into `localStorage` and sent as `x-hub-owner`. `POST /api/content-hub` with `mode: "whoami"` returned `{"owner":false}` with no token. That mechanism must not become the Marketing OS owner role.

---

## 6. Other services

Verified unless marked.

| Concern | In git `main` | On the live sites |
| --- | --- | --- |
| CRM | Enquiry JSON in public Blob. Status only. | Social App posts some Content Hub leads to `https://www.wirral.ai/api/enquiries`. Not a CRM. |
| Email | None. | None found in either public bundle. |
| Messaging | WhatsApp link only. No WhatsApp Business API. | Same. GoHighLevel appears as a booking URL only: `https://link.gohighlevel.com/widget/booking/N3VjOqWz4rks3tHK5HRp`. No GHL API client. |
| Analytics | `<script src="/_vercel/insights/script.js">` on pages, including the dashboard. | Social App admin fetches `/api/billing` `metrics` and `/api/social` `analytics`. No product analytics warehouse. |
| Storage | Vercel Blob, public JSON. | Social App media goes to an upload URL returned by `/api/social`. The store behind that URL was not visible. |
| AI | Anthropic via `api/_brand.js`. Chat is unbounded except for a 16-message history cap. Opportunities uses Zod structured output. No rate limit on those two routes. | Social App `/api/content-hub` returns HTTP 429 when busy. Model vendor for that route was not visible (the call stays on the Social App server). |
| Auth provider | None. | Clerk, loaded from `clerkAccount-4feSGkHK.js`. The publishable key in the public bundle is a **test** key (`pk_test_…`) for a host ending in `.clerk.accounts.dev`. Sign-in copy says Google or Apple. |
| Queue / jobs | None. The only cron is the screenshot Action. | Scheduling is “send `scheduledAt` to `/api/social`”. Who wakes the job was not visible. |
| Referrals | None. | `POST /api/referrals` actions `count` and `join`. |

There is no tenant id anywhere in git `main`.

---

## 7. Brand, type and components

Two systems exist. They should not be mixed by accident.

### Live site and Social App (what visitors see)

From the live CSS (`index-BNVxvAPZ.css`, Tailwind 4.3.3):

- `--color-canvas: #fff`
- `--color-mist: #f3f6fb`
- `--color-ink: #0f1a33`
- `--color-muted: #5a6780`
- `--color-line: #dfe5ee`
- `--color-accent: #2563eb`
- `--color-deep: #1e3a8a`
- `--font-display: Inter`
- `--font-serif: Instrument Serif` (loaded from Google Fonts)
- UI is utility classes (`rounded-3xl`, `bg-accent`, `text-ink`), not a shared component library.
- British English in the copy that was read.
- Logo files on the live site are under `/brand/` (`logo-mark-96.png`, favicons).

The Social App shell uses the same ink / mist / accent language. The injected website assistant forces its own primary colour to `#1b3a6b` on that host.

### Git `main` (not what www.wirral.ai serves)

`style.css`: paper `#f5f3ee`, pine `#1f4e3d`, copper `#a5643c`, ink `#171a16`, dark theme via `data-theme` and `prefers-color-scheme`. Type: Satoshi and Cabinet Grotesk from Fontshare. Reusable classes include `.btn`, `.btn--primary`, `.btn--ghost`, `.btn--wa`, `.field`, `.wrap`, `.eyebrow`, `.site-header`. Logo files live in `/assets/` (`logo-mark-96.png`, badge PNGs, favicon SVG).

Owner direction is to keep branding and restructure freely. **Proposal:** treat the live Inter / Instrument Serif / ink / blue accent system as the brand to keep, because that is what is deployed. Do not resurrect the pine and copper tokens unless the owner says the live site drifted from the brand they want.

---

## 8. Reuse, gaps and risks

### Reuse

- Live visual system, logo, British English, and the line the business already uses (“let us automate the boring tasks”).
- The assistant script bridge between www.wirral.ai and socialapp.wirral.ai, once its API is authenticated properly.
- Anthropic calling pattern in `api/_brand.js` for site chat. Marketing OS agents need a stricter caller (tenant id, tool allow-list, no public CORS).
- Enquiry capture shape (`service`, `answers`, `summary`) as a temporary lead pipe. It is not the CRM.
- GoHighLevel booking link and WhatsApp handoff for “book a call” on path B and done-for-you. They are links, not platforms to extend.
- Post for Me **behaviour** already on socialapp (`connect`, upload, `post`, `scheduledAt`, cancel, analytics), after the server source is recovered.
- Vercel as the host. Assumption: both current projects stay on Vercel.

### Must be built

- A real multi-tenant database. Blob JSON cannot be the system of record.
- Server-side sessions and roles (owner, member, learner). Clerk can stay if it moves off the development instance. Assumption, not a finding: Clerk is acceptable to keep.
- Brand Brain, Approvals, agent runs, and a job runner. None of these exist.
- Stripe products for the new ladder, with signature-checked webhooks.
- The three-path website. The live information architecture is still a list of services and tools.

### Risks verified in code or in live responses

1. **Source drift.** Git `main` is not the live website and is not the Social App. Building on the wrong tree will not ship.
2. **Public enquiry blobs.** `api/enquiries.js` stores personal data with `access: 'public'`. Anyone who obtains the blob URL can read it. The list route is token-gated; the file URL is not.
3. **Shared dashboard secret** in `localStorage`, compared with `===`, sent on every request. One leaked token is full access to every enquiry. There is no per-user audit.
4. **CORS `Access-Control-Allow-Origin: *`** on the enquiry, chat and opportunities routes, and on the live Social App APIs (those also allow `Authorization` and `x-hub-owner`).
5. **No rate limit** on `api/chat.js` or `api/opportunities.js`. They spend the Anthropic key. The live content-hub route does return 429.
6. **Social App owner token in the URL hash**, then `localStorage`. That is a bearer secret, not a role, and it can leak via history, referrers and shared screens.
7. **Workspace id created in the browser.** Combined with the copy “isn’t connected to this device”, isolation looks like a client id rather than a user id. Whether the server checks the Clerk user against the workspace was **not visible**. This is the main tenant-isolation risk.
8. **Clerk development publishable key on the production Social App bundle.**
9. **Stripe reports `not_configured` on production** while the UI offers trials and checkout. Visitors can be shown a trial state from `localStorage`.
10. **`.gitignore` does not include `.env`.** Nothing secret is committed today. The ignore file should grow before new keys are added. Proposal, not a current leak.
11. **Enquiry PATCH finds a blob by “pathname includes id”.** A short or colliding id could update the wrong file.
12. **No webhook verification code exists** for Stripe or Post for Me in anything this audit could read.

---

## 9. Proposed architecture

Marketing OS is a tenant product on the Social App host (socialapp.wirral.ai), not a new pile of pages in the static repo. The marketing site (www.wirral.ai) is the front door and is free to be restructured. Branding stays as deployed (section 7).

Positioning, including on the public site: **“Built for us first, so we know it works.”** Wirral.ai is customer zero. Its own marketing runs through the product from the first release that can publish. A public page, `/how-we-use-it`, shows only results the owner has approved for publication.

### Tenants, roles, entitlements

- `tenant` is the isolation key on every row.
- Wirral.ai is a normal tenant with `is_operator = true`. The operator role skips subscription checks. It is a row on the user, not a hash secret.
- Roles inside a tenant: `owner`, `member`. Learners on the free kit are users with entitlement `starter_kit`, not a second login system.
- Entitlements, stored from Stripe webhooks once Stripe exists, and editable by hand for the operator: `starter_kit`, `marketing_starter`, `marketing_pro`, `marketing_business`, `academy_course`. Course access does not turn on outreach or email. A marketing subscription does not unlock the course unless the price says so.
- Every query is scoped by `tenant_id` taken from the session. The client does not choose another tenant’s id.

Assumption: Postgres (or another relational database with row ownership) is the system of record. It is not in the stack today. Blob stays for temporary media, with private access.

### Brand Brain

One row per tenant, required before any agent runs:

- Voice (how they sound, words they use, words they avoid)
- Offers (what they sell, prices they are willing to publish, what must stay as `[placeholder]`)
- Audience
- Banned claims (including regulated categories already mentioned in the content briefing: health, finance, alcohol, and similar)
- Optional: location, proof points the owner has actually supplied, links

Every agent’s prompt starts by reading this row. Agents may not invent reviews, prices, or years in business. The existing content briefing on the unmerged branch already says that; Brand Brain is the stored version of it, per tenant.

The Social App already keeps a browser-side profile (`name`, `industry`, `location`, `objective`, `audience`). That is a draft of the fields, not the Brain. It must move server-side or it vanishes between devices and is invisible to other agents.

### Approvals inbox

One queue for anything that leaves the building:

- Social post or scheduled post
- Email
- Outreach message

Agents write a draft. The draft waits in the inbox. A person approves, edits, or rejects with one action. Post for Me, email, and outreach are called only after approval. There is no agent path that publishes directly.

The inbox is tenant-scoped. The operator sees only the Wirral.ai tenant unless they explicitly open support tools, which are out of scope for the first build.

### Agents

Not built in the first slice. When they start, they are jobs, not a chat that calls Post for Me itself.

- Master Marketing Director is the only chat the customer sees at first.
- Specialists (research, content, video, publishing, outreach, email, CRM, funnels, analytics, customer success, course, compliance) are invoked by the director or by a saved automation, and only with the tools that match their job.
- Compliance reads Brand Brain banned claims and blocks the draft before it reaches Approvals.
- Publishing specialist creates an approval item. It does not call `/api/social` `post` until the item is approved.
- Runs, tool calls and token use are stored on the tenant.

### Jobs

Nothing in the current stack can hold a queue. Proposal: a small job table in the same database, drained by a Vercel cron or a worker, with retries and a visible failure on the draft. Do not rely on an in-memory `Map` (the unmerged content-hub route does that for rate limits; it resets when the instance dies).

Post for Me remains the scheduler for social once a post is approved. The app’s job runner is for agent work, reminder email, and “approval still waiting”, not a second social scheduler.

### Free Starter Kit and the director chat

The free AI Business Starter Kit is the path A lead magnet. It includes a **limited** Marketing Director chat inside the app:

- Signed-in learner, entitlement `starter_kit`
- Brand Brain required, even if short
- A monthly or daily message cap (the number is an open decision)
- Tools: advice, a single post draft, a weekly outline
- No auto-post, no outreach, no email sends, no multi-brand
- Drafts still go through Approvals if they are ever allowed to publish; on the free cap they are copy-only until the person subscribes
- Upgrade path is the marketing subscription, not a second checkout brand

The public kit page collects the email through the existing enquiry route only until the real account exists. Do not store kit progress in public Blob.

### Customer zero and the public case study

From the first publishing release:

- Tenant “Wirral.ai” uses Content Studio and Post for Me for the company’s own channels.
- The owner approves every post in the same inbox customers will use.
- `/how-we-use-it` is a normal marketing page. It is fed by a **published snapshot**: counts and examples the owner marks public (posts shipped, channels connected, a quoted caption, a lesson). It is not a live query of the tenant. Drafts, leads, inboxes and rejected claims never appear there.
- Copy on the homepage and on the Marketing OS page uses “Built for us first, so we know it works.” The case-study page is the proof, so it should not launch until there is at least one approved, published result.

### Data sketch

`users`, `tenants`, `memberships`, `entitlements`, `brand_brains`, `social_accounts` (Post for Me account id, platform, tenant), `drafts`, `approvals`, `publications`, `agent_runs`, `chat_messages`, `kit_progress`, `course_enrolments`, `public_snapshots`.

`social_accounts.tenant_id` is set when OAuth returns, not by trusting a workspace id from the browser.

### Permissions sketch

| Action | Learner (kit) | Starter | Pro / Business | Tenant owner | Operator (Wirral.ai staff on the Wirral.ai tenant) |
| --- | --- | --- | --- | --- | --- |
| Director chat | Cap | Fair use | Higher cap | Same as plan | No subscription check |
| Brand Brain edit | Own tenant | Yes | Yes | Yes | Yes, own tenant only |
| Content drafts | Yes | Yes | Yes | Yes | Yes |
| Approve and publish | No | If the plan includes posting | Yes | Yes | Yes |
| Outreach / email | No | No until those products exist | Plan-gated | Yes | Yes |
| Billing portal | No | Yes | Yes | Yes | Not required |
| See another tenant | No | No | No | No | No |

Exact plan gates stay configurable. The client’s current split (posting starts at Pro, 200 posts) should not be copied forward without a decision, because the new prices are different.

---

## 10. Website restructure

Owner direction: a full restructure is allowed. Keep the live brand. Route visitors by stage. This is a proposal for the Vite site that actually deploys to www.wirral.ai, not a patch on the stale static files.

### Homepage

One question above the fold: **Which are you?**

Three choices, each a link, not a quiz with a dead end:

1. **I’m just starting out.** I need content, a plan, and a first offer. Path A.
2. **I have a business. I need a website.** Path B.
3. **I already have a website.** I need AI to handle marketing, SEO and the boring jobs. Path C.

Under the choices, a short proof strip: “Built for us first, so we know it works.” linking to `/how-we-use-it` once that page has real results. Until then the strip can state the intention and link to `/work` (client sites that already exist). Do not invent metrics.

Keep a text link for “Not sure — help me choose” that opens the existing assistant, and a header link for Book a call.

Header after the change: Start, Websites, Marketing OS, How we use it, Work, Book a call. Service names move inside path C. Location pages stay for search but leave the header.

### Path A — just starting out / needs content

Offer: free AI Business Starter Kit, then AI Mastery Academy, with Marketing OS as the later upgrade.

| Page | Job |
| --- | --- |
| `/start` | Path hub. Who it is for. What they get this week. Primary button: get the Starter Kit. Secondary: see the Academy. |
| `/start/starter-kit` | The lead magnet. Email and business name. Creates the learner and the limited director chat. |
| `/academy` | Course outline, who it is for, separate price. Checkout only after Stripe exists. |
| `/social-content-hub` | Keep as the try-the-writer page. Point “post it for me” at the app, not at a second writer. |
| `/free/boring-jobs-checklist` | Keep. End the checklist with path A or path C, based on whether they said they have a site. |

Flow: homepage → `/start` → kit signup → app chat (capped) → Academy or Marketing OS subscription. People who only wanted a post can still use the free writer without a card. The kit is the piece that creates an account.

### Path B — has a business, needs a website

Offer: a fixed-price website build. Not a subscription.

| Page | Job |
| --- | --- |
| `/websites` | Path hub. What a wirral.ai site includes (fast, assistant, found in search). Examples from `/work`. |
| `/build-with-us` | The existing wizard, opened on the website service. Other services remain available from path C so the wizard is not deleted. |
| `/work` and case studies | Proof. |
| `/book` | GoHighLevel booking link, already used. |

Flow: homepage → `/websites` → a few proof shots → Build with us or Book a call. A quiet cross-link: “Already have a site? Path C.” After a site is handed over, the same customer is introduced to path C. That hand-off is copy, not an automation, until CRM exists.

### Path C — has a website, needs automation, SEO, marketing

Offer: Marketing OS subscription, or done-for-you automation if they want the team to run it.

| Page | Job |
| --- | --- |
| `/automate` | Path hub. Two columns: run it yourself (Marketing OS) and have us run it (fixed-price or Done for you). |
| `/marketing-os` | Product page. Tagline: Your AI Marketing Team. One Dashboard. Proof line: Built for us first. Prices shown as proposed until Stripe is live, or hidden until they are. |
| `/ai-automation`, `/ai-consulting`, `/ai-implementation`, `/ai-training-for-business` | Keep the URLs for search. Reframe the top of each page so it sits in path C and links to `/automate` or `/marketing-os`. |
| `/ai-opportunity-finder` | Keep. Its result page offers path C, and path B if they have no site. |
| `/discord-community-setup` | Leave as a specialist offer linked from path C, not from the homepage. |

Flow: homepage → `/automate` → `/marketing-os` → socialapp sign-up, or → Book a call for done-for-you. SEO and training are sections on `/automate`, not competing homepages.

### Shared pages

- `/how-we-use-it` — public case study, snapshot only, as in section 9.
- `/work`, `/insights`, `/areas`, location URLs — retained.
- `/book` — one booking page.
- `/dashboard` on the website stays the internal lead list until leads move into the product. It should not be linked in the public header.

### What not to do in the restructure

- Do not merge `feature/social-content-hub`. It is an older free writer and it denies publishing.
- Do not add Marketing OS screens to the static HTML in this `main` and expect socialapp.wirral.ai to change.
- Do not publish a price on `/marketing-os` that Checkout cannot charge. Today Checkout returns `not_configured`.

---

## 11. Staged build

Owner order: **Content Studio and Post for Me first, then the Marketing Director on real data.** Website restructure can proceed in parallel on the marketing repo once its real source is the one being edited. It does not block publishing.

0. **Source and safety.** Get the deploying repositories and Vercel projects. Stop treating git `main` as production. Add `.env` to gitignore when that tree is the real one. Move Clerk off the development instance before any new customer. Replace the `#owner=` token. Decide Post for Me quota isolation.
1. **Dashboard foundation.** Tenant, user, Brand Brain, empty Approvals inbox, Wirral.ai as the operator tenant. No public feature flag until a post can be approved.
2. **Content Studio and Post for Me.** Move the existing writer and the existing `connect` / upload / `post` / `scheduledAt` flow behind the tenant and the inbox. Video upload stays the TikTok path. Wirral.ai connects its own accounts and publishes only through Approvals. This is customer zero.
3. **Public proof, thin.** After at least one real approved post, publish `/how-we-use-it` from a snapshot. Homepage proof strip points at it.
4. **Marketing Director.** One chat, reading Brand Brain and the tenant’s real drafts and results. It may create drafts. It may not publish. The Starter Kit cap ships with this step, because the kit’s promise is this chat.
5. **Website paths.** Homepage selector, `/start`, `/websites`, `/automate`, `/marketing-os`. Old service URLs rewritten at the top, not deleted.
6. **CRM, outreach, email.** Same Approvals inbox. New channels only. No second inbox.
7. **Academy and path A funnel.** Course entitlement separate from the marketing subscription. Kit remains the free front door.
8. **Stripe.** New products and prices. Webhook signatures verified. Operator tenant exempt. Do not repoint the £9 / £19 / £49 client copy unless those prices are intentionally kept for Content Hub alone.
9. **Analytics.** Tenant-level results inside the product. Public numbers only via the snapshot.
10. **QA and a controlled launch.** One external tenant after Wirral.ai has used it for its own posting. Watch Post for Me quota, approval bypass, and cross-tenant reads.

---

## 12. Decisions

### Already set by the owner (this plan follows them)

- Brand Brain on every tenant; every agent reads it.
- One Approvals inbox for posts, email and outreach.
- Starter Kit includes a limited Marketing Director chat in the app.
- Wirral.ai is customer zero from the first publishing release.
- Public line: “Built for us first, so we know it works.” Case study fed by real approved results.
- Build Content Studio and Post for Me before the director chat.
- The website may be fully restructured, branding kept, into the three paths in section 10.

### Still needs the owner

1. **Where is the Vite source for www.wirral.ai and for socialapp.wirral.ai?** Please add this work to those repositories. This public `main` is not those apps.
2. **Stripe.** Production billing returns `not_configured`. Confirm whether an older Stripe setup should be revived or whether Marketing OS starts clean on the same Stripe account. Confirm the live ladder: proposed £19 / £39 / £79 versus the prices already written in the Social App (£9 / £19 / £49 and custom Done for you).
3. **Post for Me account shape.** One shared API key or one project per tenant? Wirral.ai’s own channels must not stop because a customer used the monthly allowance.
4. **Starter Kit cap.** How many director messages, and is publishing locked until they pay?
5. **Academy price** and whether it is a one-off or a subscription. It needs its own Stripe product either way.
6. **Canonical brand.** This plan keeps the live ink / blue / Inter / Instrument Serif system. Say if the pine and copper system in git should return instead.
7. **Path B commercial model.** Assumption: websites stay fixed-price via Build with us, not a Marketing OS subscription.
8. **Location pages.** Assumption: keep the URLs for search, remove them from the header.
9. **Clerk.** Confirm the production Social App should leave the development instance (`pk_test` on a `.clerk.accounts.dev` host) before any new customer signs up.
10. **“Done for you” at a custom quote.** Does that remain a call with the team, beside the self-serve subscriptions?

### Access this audit did not have

- Private GitHub repositories (the token cannot list them).
- Vercel project settings for either host (no Vercel credentials in this environment).
- Stripe dashboard (no price ids, no webhook endpoint, and the live Checkout action says not configured).
- Post for Me dashboard (the live status flag is on; the project, key name, and quota are not visible).
- Clerk dashboard.
- Any email provider, queue, or database. None is referenced in git `main`.

No secret values were copied into this document.
