# Botstryx handoff

Botstryx is a fresh rebuild of botlane.io on Meta's Astryx design system. It is a design showcase, not a
migration: the existing site (private repo `botlaneio/botpro`) is the source of truth for words, prices and
offers only. The design is free.

## Run it

```bash
npm install
npm run dev
```

Opens on http://localhost:3000. To view on a phone or iPad on the same network, `next.config.ts` lists
the computer's LAN address in `allowedDevOrigins`; change it if the address changes.

Before finishing any change: `npx tsc --noEmit` and `npx eslint src` must both pass.

## Deploy (Cloudflare Workers)

The site runs on Cloudflare Workers through the OpenNext adapter (`@opennextjs/cloudflare`). Config is in
`wrangler.jsonc` (Worker name, bindings) and `open-next.config.ts`.

```bash
npx wrangler login                      # once, in a browser
npx wrangler secret put GEMINI_API_KEY  # once: agentLane's key, kept as a Worker secret
npx wrangler secret put RESEND_API_KEY  # once: sends the new-brief email
npx wrangler secret put BRIEF_NOTIFY_TO # once: who gets new-brief emails (comma-separate several)
npm run preview                         # build and run the Worker locally
npm run deploy                          # build and publish to Cloudflare
```

Cloudflare builds every push (Workers Builds: Workers → botstryx → Settings → Build). `main` runs
`npx opennextjs-cloudflare deploy`. Other branches run `npx opennextjs-cloudflare build`, then
`npx wrangler preview`, which needs the `previews` block in `wrangler.jsonc`. When you add or change a
binding, add it to `previews` too, or the PR check fails.

- agentLane's rate limit (12 messages a minute per visitor) is the `LANE_LIMITER` binding in
  `wrangler.jsonc`, counted by Cloudflare. `next dev` simulates it; elsewhere the route counts in memory.
- Contact briefs are saved to the D1 database `botstryx` (binding `DB`, table `briefs`) and emailed to
  `BRIEF_NOTIFY_TO` from `briefs@botlane.io` via Resend (`src/lib/briefs.ts`). The email's Reply-To is the
  visitor. Without the Resend secrets briefs are still saved. The form is limited to 5 briefs a minute per
  visitor (`BRIEF_LIMITER`).
- Database schema lives in `migrations/`. Add a new numbered `.sql` file for each change, then
  `npm run db:migrate` (live) and `npm run db:migrate:local` (the copy `next dev` uses).
- Read briefs: `npx wrangler d1 execute botstryx --remote --command "SELECT * FROM briefs ORDER BY id DESC"`
  or the D1 page in the Cloudflare dashboard.
- agentLane's voice agent is ElevenLabs agent `agent_7301m6k3hy5bfrmbtnbnr8q64760` (src/components/brand/lane-voice.tsx). It only
  accepts calls from botlane.io and www.botlane.io. Its client tools run in the browser: show_section, open_page,
  fill_brief (fills the contact form; the visitor sends it), find_call_times and book_intro_call.
- Intro calls: 20 minutes, weekdays 10:00-18:00 India time, 12 hours' notice, two weeks ahead (`CALL` in
  src/lib/calendar.ts). Booked into Google Calendar with a Meet link by a Workspace service account with
  domain-wide delegation. Secrets: `GOOGLE_SERVICE_ACCOUNT` (the JSON key) and `GOOGLE_CALENDAR_ID` (the calendar's
  address). Without them, Lane says booking isn't switched on. Limited to 3 bookings a minute per visitor.
- After changing bindings in `wrangler.jsonc`, run `npm run cf-typegen` to refresh `cloudflare-env.d.ts`.
- No incremental cache is set up. If pages start using ISR or cached fetches, add an R2 bucket
  (https://opennext.js.org/cloudflare/caching).

## Stack

- Next.js 16.4.6 (App Router, Turbopack, `cacheComponents`). This version differs from older Next.js:
  read `node_modules/next/dist/docs/` before using an API you're unsure of (see `AGENTS.md`).
- React 19.3, TypeScript, Tailwind v4 (utilities only; most styling is plain CSS in `src/app/globals.css`).
- Astryx: `@astryxdesign/core` components, theme in `src/themes/botlane/botlaneTheme.ts`.
  After changing tokens: `npx astryx theme build src/themes/botlane/botlaneTheme.ts`.
  Docs: `npx astryx component <Name>`, `npx astryx docs <topic>`, `npx astryx template <name>`,
  `npx astryx build "<what you want>"`.
- Fonts: Instrument Sans and JetBrains Mono via `next/font`.
- `recharts` and `@heroicons/react` are installed for the client portal (not built yet, see below).

## Rules the owner has set (follow these)

1. **Copy comes from botpro.** Every word, price, offer and product name comes from `botlaneio/botpro`
   (read it with `gh api repos/botlaneio/botpro/contents/<path> --jq .content | base64 -d`). Key files:
   `src/lib/catalog.ts` (offers and page copy), `src/lib/pricing/plans.ts` (price book),
   `src/lib/nav.ts`, `src/lib/lanes.ts`, `src/lib/products.ts`, `src/lib/process.ts`,
   `src/components/catalog/*` (offer page copy), `src/components/site/site-footer.tsx`.
   Don't invent labels or claims. **Exception:** the owner can introduce their own wording or offer. If a
   request doesn't match botpro, say so once; if they confirm, use it and note in the code that it is theirs.
2. **Buttons hug their label and align left.** Never let a button stretch to fill its container (grid items
   stretch by default; add `justify-self: start`). Target the button itself in CSS, not `:first-child`.
   The owner has asked for this three times.
3. **Restrained motion.** The owner removed a cursor-following "x-ray lens" from the hero as distracting.
   Aim for wow through type, composition and detail, not effects that follow the pointer or move over
   content. Describe a bold interactive idea and ask before building it.
4. **Light theme by default**, whatever the device setting. The toggle switches to dark.
5. **Accents:** electric blue `--bl-blue` (#2f55f0) is the brand accent, used sparingly. Teal is the second
   accent: `--bl-teal` for small marks and `--bl-teal-text` for text (slotLane's colour in botpro).
6. **Corners:** buttons use `--radius-element` (9px). Small badges use `calc(var(--radius-element) - 4px)`.
7. **Check your work in the browser** at desktop (1440) and phone (375) widths, light and dark, before
   saying it is done. Say plainly what you could not check.

## What exists

| Route | State |
|---|---|
| `/` | Home: hero, brief box, price rail, footer. Done. |
| `/websites/business-sites` | **Core** offer page. Done (see below). |
| `/account` | Sign in / sign up tabs. Preview only: nothing is sent or saved, and it says so. |
| 20 other routes | Placeholder pages (title only), from `src/components/site/placeholder-page.tsx`. |

Shared pieces in `src/components/site/`: `site-header.tsx` (header with the Solutions mega menu),
`solutions-menu.tsx` (mega menu, lanes: buildLane, slotLane, "More lanes opening up soon"),
`mobile-menu.tsx` (hamburger + drawer with nested folds), `hamburger.tsx`, `site-footer.tsx`,
`theme-toggle.tsx`. Hero in `src/components/hero/`. Account page in `src/components/account/`.

### The Core page (`src/components/offers/core-page.tsx`)

Hero, then a **pinned scroll walkthrough** of the five pages (`page-explorer.tsx`, `PageWalkthrough`):
the section stays on screen while scrolling steps through Home, About, Services, Your choice, Contact, then
narrows the frame to a phone. At the last step a button appears: "Get your Core website today" with a
"10% discount" badge. **The 10% discount is the owner's own offer**, not in botpro. The Founding Ten
offer (20% off) is deliberately removed from this page and hidden from the mobile menu on it.
Then: what's included with a price card, the path to launch (`path-timeline.tsx`), fit, closing CTA.
With reduced motion on, the walkthrough falls back to a tap-to-explore version.

## What's next

1. **Client portal dashboard (in progress, nothing written yet).** The owner wants a dashboard for website
   and web-app clients, started from an Astryx template. Plan agreed so far:
   - Start from the `dashboard-progress` template (`npx astryx template dashboard-progress --type page <path>`)
     inside an `AppShell` with a `SideNav` (`npx astryx template AppShellSideNavOnly`).
   - Replace its launch-tracker content with a client's project: the five steps from botpro's
     `src/lib/process.ts` (Intro call, Scope and fixed quote, Design, Build, Launch) as the timeline;
     design review rounds (Core includes 2); the agreed scope, timeline and fixed price; things waiting on
     the client; Care requests; files and handover; invoices.
   - All data is sample data and should say so. No real login exists.
   - Suggested route: `/portal`.
2. **Ascend and Apex offer pages** (`/websites/company-sites`, `/websites/brand-sites`), as interactive as
   Core. Copy: botpro `src/lib/catalog.ts` (offers `company-sites`, `brand-sites`),
   `src/lib/pricing/plans.ts` (`website-ascend` $4,900, `website-apex` $7,900),
   `src/components/catalog/ascend-page.tsx` and `apex-page.tsx`.

## Known gaps

- Founding Ten is a static badge; botpro reads it live from Stripe and hides it when the offer closes.
- No production build has been run recently (`npm run build`).
- Not tested on a real iPad or phone since the latest changes.
