# Florenza Business Dashboard — CLAUDE.md

Internal reference for anyone (human or Claude) working on this codebase.
Read this before adding a feature or a new section.

## Tech stack

- **Next.js 16** (App Router, Turbopack, `src/` directory, TypeScript)
- **Tailwind CSS v4** (CSS-first config via `@theme inline` in `globals.css`, no `tailwind.config.ts`)
- **shadcn/ui conventions**, hand-authored (see "Why no shadcn CLI" below)
- **Radix UI primitives** (`@radix-ui/react-dialog`, `react-separator`, etc.) under the shadcn components
- **lucide-react** for icons
- **class-variance-authority** + **tailwind-merge** + **clsx** for variant-driven component styling

No backend, no database, no auth yet. Six sections (Product Management, Instagram Manager, Content Calendar, Competitor Tracker, News Consolidator, Website Builder) are built out with real client-side state — News Consolidator and Website Builder's domain check also have real server-side API routes (live RSS fetch, and a real DNS lookup, respectively). The rest are routed placeholders. Data layer gets wired in per-section as each one gets built out.

## Why no shadcn CLI

`npx shadcn@latest init` timed out repeatedly in the sandbox this was built in (network-dependent registry fetch). Rather than block on it, the standard shadcn primitives (`button`, `card`, `badge`, `separator`, `sheet`) were hand-written in `src/components/ui/` following the exact conventions the CLI would generate (`cva` variants, `data-slot` attributes, `cn()` utility). `components.json` is still present and correctly configured, so `npx shadcn@latest add <component>` should work normally going forward once you have network access — it will slot new components into `src/components/ui/` alongside the existing ones without conflicts.

## Folder structure

```
src/
  app/
    layout.tsx              # Root layout: html/body, dark mode class, Google Fonts <link>
    page.tsx                 # Redirects "/" -> "/business-analytics"
    globals.css               # Theme tokens (colors, fonts, radius) + Tailwind v4 @theme
    api/
      news/route.ts            # Server-side RSS fetch + parse for News Consolidator
      domain/verify/route.ts    # Server-side real DNS TXT lookup for Website Builder's domain check
      hosting/
        export/route.ts          # Returns the built page as a downloadable static index.html
        deploy/route.ts          # Zips the static export and deploys to Netlify via the user's own token
    (dashboard)/              # Route group — everything that gets the sidebar shell
      layout.tsx               # Renders <AppSidebar/> + <Topbar/> + page content
      business-analytics/page.tsx
      business-structure/page.tsx
      product-management/page.tsx  # BUILT OUT — see below
      revenue/page.tsx
      vendor-management/page.tsx
      orders/page.tsx
      order-fulfillment/page.tsx
      content-dashboard/page.tsx
      instagram-manager/page.tsx   # BUILT OUT — see below
      analytics/page.tsx
      content-calendar/page.tsx    # BUILT OUT — see below
      competitor-tracker/page.tsx  # BUILT OUT — see below
      news-consolidator/page.tsx   # BUILT OUT — see below
      website-builder/page.tsx     # BUILT OUT — see below
  components/
    layout/
      sidebar.tsx             # Desktop fixed sidebar, grouped nav, active-state highlighting
      topbar.tsx               # Sticky header, mobile nav trigger (Sheet), current page title
      page-shell.tsx           # Shared placeholder layout used by every unbuilt section page
    product-management/        # KPI cards, editable table, margin/cost charts, pricing strategy panel
    instagram-manager/         # Board columns, post cards, add-post dialog
    content-calendar/          # Month grid, day detail dialog, platform filters, add-item dialog
    competitor-tracker/        # Sortable table, add-competitor dialog
    news-consolidator/         # News card, topic filter
    website-builder/           # Block list, inspector panel, site preview, domain dialog
    ui/                        # Hand-authored shadcn-style primitives: button, card, badge, separator,
                                # sheet, dialog, input, textarea, label, select, dropdown-menu
  lib/
    nav-config.ts              # SINGLE SOURCE OF TRUTH for every section: title, route, icon, description, "coming soon" bullets
    product-data.ts            # Product Management data model, seed data, margin math (also consumed by Website Builder)
    instagram-data.ts          # Instagram Manager data model, seed data
    calendar-data.ts           # Content Calendar data model, seed data, month-grid helper
    competitor-data.ts         # Competitor Tracker data model, seed data
    news-data.ts                # News Consolidator types, feed source list, topic classifier, fallback data
    website-data.ts             # Website Builder block types, starter template, storefront palette
    export-html.ts               # Plain-string-template HTML generation for Website Builder's export/deploy (deliberately not React SSR — see Website Builder notes), including the vanilla-JS cart
    utils.ts                   # `cn()` class merge helper
```

## The one file to know: `src/lib/nav-config.ts`

Every section — sidebar entry, mobile nav entry, topbar title, and (for unbuilt sections) placeholder page content — is driven from `navGroups` in this file. **To add a new placeholder section:**

1. Add a `NavItem` to the relevant group (or a new group) in `nav-config.ts`.
2. Create `src/app/(dashboard)/<route>/page.tsx` following the pattern already used by the placeholder pages (pull the item via `getNavItem("/<route>")`, pass it into `<PageShell />`).

When a section gets built out for real (like the five listed above), its `NavItem.comingSoon` array gets set to `[]` since it's no longer showing the "coming soon" bullet list — the sidebar/topbar entry still comes from `nav-config.ts`, only the page content stops using `PageShell`.

Don't hardcode nav labels or routes anywhere else. If the sidebar and a page ever disagree, `nav-config.ts` is wrong and everything downstream needs fixing, not patched around.

## Built-out sections vs. placeholders

Every section starts as a `PageShell` placeholder (see below). **Product Management, Instagram Manager, Content Calendar, Competitor Tracker, News Consolidator, and Website Builder are built out for real** — not placeholders, working dashboards. Use them as reference patterns when building out the next section.

### Website Builder (`/website-builder`)

Section-based builder for the Florenza storefront: add/reorder/edit content blocks, live preview with a working cart, device toggle, real domain verification, real hosting deploy. Read this section before extending it, the scope was deliberately drawn in a specific place and it's easy to accidentally promise more than the code delivers.

**Payments were deliberately removed (2026-07).** An earlier pass wired up real Stripe Checkout, both in-app (`/api/checkout/create-session`) and on the deployed site (a bundled Netlify Function reading a `STRIPE_SECRET_KEY` env var). All of that was pulled out on request — Florenza wants a different payment provider added later, and didn't want a Stripe integration left half-connected in the meantime. If you're reading old context (a summary, a stale doc, an old commit) that describes checkout as working, it no longer is, don't rebuild toward that until asked. What's gone: `src/app/api/checkout/`, `src/lib/netlify-function.ts`, `payments-dialog.tsx`, the `netlify.toml`/function bundling in the deploy zip, and the "Checkout with Stripe" button. What's still there: the cart itself (add to cart, quantities, subtotal, in both the in-app preview and the deployed static export) — its checkout button is present but disabled, labeled "Checkout coming soon," in both `site-preview.tsx` and `export-html.ts`. When a payment provider is chosen, wire the button in both places, they're independent implementations (see the React-SSR note below for why).

**What's real:**
- The block editor is fully functional — add, reorder (up/down, not drag-and-drop), edit, delete blocks; every field updates the live preview immediately.
- **Featured Products pulls actual data from Product Management** (`seedProducts` in `src/lib/product-data.ts`) — this is the one place in the dashboard where two built-out sections are wired together. If Product Management's catalogue gets replaced with real SKUs, this block picks it up automatically.
- **The cart is real**, not a mock, checkout just isn't connected to anything yet. `site-preview.tsx` has an actual cart (add/remove/adjust quantity, running subtotal), same in the deployed static export via `localStorage` and vanilla JS (`cartScript()` in `export-html.ts`).
- **Domain verification is a real DNS lookup.** `src/app/api/domain/verify/route.ts` uses Node's `dns.promises.resolveTxt()` server-side to check for a TXT record on a domain the person actually controls. This genuinely works on any real domain, it is not a simulated/fake check.
- **Hosting is a real deploy**, not a mock. `src/app/api/hosting/deploy/route.ts` zips a generated `index.html` (via `jszip`) and POSTs it to Netlify's zip-deploy API (`api.netlify.com/api/v1/sites` or `/sites/{id}/deploys`) using the person's own Netlify personal access token, entered in `hosting-dialog.tsx` and sent straight through, never stored or logged. First deploy creates a new Netlify site and returns its `site_id`; pass that `site_id` back in on the next deploy to update the same site instead of creating a new one each time. There's also a no-token-required path, `src/app/api/hosting/export/route.ts` renders the same static HTML and returns it as a direct file download, for anyone who wants to host it themselves anywhere, not just Netlify.
- **HTML generation is plain string templating, not React SSR.** `src/lib/export-html.ts` intentionally does *not* import `<SitePreview>` or `react-dom/server` — App Router route handlers run under React's `react-server` module condition, which blocks importing `react-dom/server` (Next/Turbopack errors on it at build time). So the exported HTML, including its cart markup and JS, is generated by hand-written template strings in `export-html.ts` that mirror `site-preview.tsx`'s structure and behavior. **These two files can drift out of sync** — if you change the cart or a block's layout in `site-preview.tsx`, update the matching code in `export-html.ts` by hand. There's no shared source of truth between the in-app preview and the exported/deployed HTML.

**What's not real, and is labeled as such on the page:**
- Checkout, on both the in-app preview and the deployed site, see above.
- "Publish" (the button separate from Hosting) only saves the layout in React state for the current session — it does not deploy anything. Use the **Hosting** dialog for an actual live URL.
- Images are placeholder blocks (a gradient + a text note describing what should go there), not generated or real photography. Swapping in real Florenza photography is a future step, not something this tool does.
- The exported/deployed page loads Tailwind via a CDN `<script>` tag at runtime rather than a compiled stylesheet — fine for a real preview or a low-traffic deploy, not something to leave in place if this becomes the actual production storefront serving real customer traffic.
- The domain dialog verifies ownership (TXT record); it does not by itself connect that domain to the Netlify site you deploy. After deploying, the person still needs to add the verified domain as a custom domain in Netlify (dashboard or API) and point its DNS at Netlify, per Netlify's own instructions. Both dialogs say this, don't let a future edit soften or merge that distinction away.
- No inventory, order storage, shipping calculation, or tax handling. There's currently no way for a real order to happen at all (checkout is disabled), so there's nothing here that could produce an order to manage yet.

**Data model**: `src/lib/website-data.ts` — `Block` (discriminated union over `BlockType`: hero, featured-products, about, testimonial, newsletter, footer), `createDefaultBlock()` for sensible per-type defaults (pre-filled with real Florenza brand voice, not lorem ipsum), `defaultPage()` for the starter template, and `storefront` — a small, deliberately separate color palette (light, warm) for the site being built, independent from the dashboard's dark theme tokens. Don't reuse `--background`/`--foreground` etc. for anything in `site-preview.tsx`, the whole point is that the tool is dark and the thing it's building is not.

**Components** (`src/components/website-builder/`):
- `block-list.tsx` — left panel, section list with reorder/delete, "Add" dropdown menu (uses the new `ui/dropdown-menu.tsx` primitive)
- `inspector-panel.tsx` — right panel, renders the correct field set per block type; the Featured Products block's product picker is a checklist against `seedProducts`
- `site-preview.tsx` — the actual rendered storefront, one function per block type, all using the `storefront` palette via inline styles (intentionally not Tailwind theme classes, since it's a separate design system from the dashboard); also owns the cart state (`useState`, session-only, not persisted) and the `CartDrawer` sub-component (checkout button disabled)
- `domain-dialog.tsx` — domain input, generates a verification token client-side, shows the TXT record to add, calls the real verify API, copy-to-clipboard, regenerate token
- `hosting-dialog.tsx` — static HTML download (no token needed) plus the real Netlify token + deploy flow, shows the live URL with copy/open actions on success

Added `src/components/ui/dropdown-menu.tsx` (Radix dropdown, same pattern as the other hand-authored primitives) for the "Add block" menu.

### Content Calendar (`/content-calendar`)

- **Data model**: `src/lib/calendar-data.ts` — `CalendarItem` (platform, title, date, status), `platformColor`, and the `getMonthGrid()` helper that builds the 6×7 day grid (including leading/trailing days from adjacent months) for any given month.
- **Seed data is a placeholder** (`seedCalendarItems`), spread across past ("Posted") and future ("Scheduled") dates so the calendar isn't empty on load.
- **Components** (`src/components/content-calendar/`):
  - `calendar-grid.tsx` — the month grid itself; each day shows up to 3 chips (solid fill = Posted, dashed outline = Scheduled) then a "+N more" that opens `day-detail-dialog.tsx` with the full list for that day
  - `platform-filters.tsx` — toggle chips, multiple platforms can be active at once (it's a `Set<Platform>`, not a single value)
  - `add-item-dialog.tsx` — modal form (title, platform, status, date) that adds directly to the calendar
- Month navigation is local state in the page (`{ year, month }`), not URL-driven — add query params later if deep-linking to a specific month matters.

### Competitor Tracker (`/competitor-tracker`)

Sortable table of competitor accounts across Instagram, Facebook, and TikTok: followers, posts/week, engagement %, 30-day growth, last post. Client-side state only.

- **Honest limitation, read this before extending the section**: there is no live connection to any social platform. Instagram, Facebook, and TikTok don't expose competitor-level follower counts, engagement, or growth through public unauthenticated access. Getting real numbers requires either the official Meta Graph API / TikTok API (which mostly needs the *target* account's own cooperation/auth, not useful for watching competitors) or a paid third-party social analytics/scraping service (Social Blade, Phyllo, Apify, etc.) wired in as a backend integration. This is stated on the page itself — don't remove that banner without replacing it with a real data source.
- **Data model**: `src/lib/competitor-data.ts` — `Competitor` (name, notes) and `CompetitorAccount` (one row per platform per competitor: handle, followers, postsPerWeek, avgEngagementPct, growth30dPct, lastPostDate, lastPostSummary).
- **Seed data is a placeholder** (`seedCompetitors` / `seedCompetitorAccounts`), 3 competitors across 6 accounts.
- **Adding a competitor**: `add-competitor-dialog.tsx` matches the typed name against existing competitors (case-insensitive) so adding a second platform for the same competitor joins to the existing record instead of creating a duplicate. New accounts get zeroed metrics (`0`, `null` last post date) — there's genuinely no data to show until a real source is connected, this isn't a display bug.
- **Sorting**: `competitor-table.tsx` sorts client-side on followers / posts-per-week / engagement / growth, click a column header to sort, click again to reverse.

### News Consolidator (`/news-consolidator`)

The one built-out section with a **real, live backend** — no seed-data disclaimer needed for the happy path.

- **Route handler**: `src/app/api/news/route.ts` fetches RSS server-side (avoids CORS entirely, which is why this couldn't be a client-side `fetch()`), parses with `fast-xml-parser`, normalizes into `NewsItem[]`, sorts newest first, and caches for 15 minutes (`export const revalidate = 900`). Runs on every page load via the client calling `GET /api/news`.
- **Feed sources**: `feedSources` in `src/lib/news-data.ts` — currently FloralDaily (`floraldaily.com/rss.xml`, broad international horticulture/business/research news) and Floranext's blog (`floranext.com/feed`, florist software/marketing/ops, skews toward the Tools topic). Add more sources by appending to that array, the route handler picks them up automatically. `Promise.allSettled` means one dead feed doesn't take down the others.
- **Topic classification is a keyword heuristic**, not a real classifier — see `classifyTopic()` in `news-data.ts`. It checks the headline + summary against fixed keyword lists for Tools and Research, and falls back to Business. This is flagged on the page itself. If topic accuracy matters more later, swap this for an LLM call or a proper taxonomy, the call site (`route.ts`) is a single function call, easy to replace.
- **No network in the sandbox this was built in** means the live fetch couldn't be tested end-to-end during development — the RSS URLs were verified reachable and returning valid XML via direct fetch, and the route/parsing logic was built against that real response shape, but confirm it end-to-end on first run. If both feeds are unreachable, the page falls back to `fallbackNewsItems` (one placeholder card) rather than rendering empty — this is the *only* section with a graceful degradation path instead of an "everything is sample data" banner, because the normal path is real data.

### Instagram Manager (`/instagram-manager`)

Card-based status board for content ideas: Backlog → Draft → Scheduled → Published. Client-side state only.

- **Data model**: `src/lib/instagram-data.ts` — `Post` (caption, type, status, pillar, scheduled date), plus the fixed option lists (`postStatuses`, `postTypes`, `contentPillars`) and `formatDate`. The five content pillars match the ones already locked for Florenza's Instagram (Soft Life, For Them, Just Because, Dark Romance, Golden Hour) — if that list changes, update `contentPillars` and every dropdown/badge picks it up automatically.
- **Seed data is a placeholder.** The 8 sample posts in `seedPosts` are illustrative, spread across all four statuses so the board isn't empty on first load. Clear the array or add real posts via the UI.
- **Components** (`src/components/instagram-manager/`):
  - `board-column.tsx` — one column per status, count badge, empty state when a column has nothing in it
  - `post-card.tsx` — caption preview (clamped to 4 lines), post type icon, scheduled date, pillar indicator dot, and a status `<select>` that moves the card between columns
  - `add-post-dialog.tsx` — modal form (caption, post type, pillar, status, scheduled date) that adds directly to the board on submit
- Added `src/components/ui/dialog.tsx`, `input.tsx`, `textarea.tsx`, `label.tsx`, and `select.tsx` as general-purpose form primitives for this — reuse them for any future add/edit form rather than building new ones. `select.tsx` is a styled native `<select>`, not Radix Select — fine for the simple single-choice dropdowns used so far, swap to Radix if a searchable/multi-select need ever comes up.

### Product Management (`/product-management`)

Full SKU-level pricing, cost, profit, and margin dashboard. Everything is client-side state (`useState` in the page component) — there's no persistence yet, edits reset on reload. That's a known gap, not a bug.

- **Data model**: `src/lib/product-data.ts` — `Product` (sku, name, tier, price, cost breakdown), plus the calculation functions (`totalCost`, `grossProfit`, `marginPct`, `markupPct`) and `formatPKR`. This is the source of truth for how margin is calculated everywhere on the page — don't recompute margin math inline in a component, import from here.
- **Seed data is a placeholder.** The 8 sample SKUs in `seedProducts` are illustrative, not Florenza's real locked 15-SKU catalogue. They're clearly commented as such in the file, and there's a banner on the page itself saying so. **Replace them with the real catalogue** (either edit inline in the UI, or hand the real SKU/price/cost list to Claude to swap into `product-data.ts` directly).
- **Components** (`src/components/product-management/`):
  - `kpi-cards.tsx` — blended average margin, best/worst SKU, total profit across one of each SKU, count of SKUs under the 40% margin floor
  - `product-table.tsx` — fully editable: name, tier, all 5 cost fields, and price are live inputs, total cost / profit / margin recalculate on every keystroke, rows can be removed
  - `margin-chart.tsx` / `cost-breakdown-chart.tsx` — recharts bar charts, themed off the CSS variables in `globals.css` (not hardcoded hex), so they stay in sync if the palette changes
  - `pricing-strategy.tsx` — the three pricing tiers (Classic/Signature/Luxury) with target margin bands (`tierTargetMargin` in `product-data.ts`) and a short rationale per tier
- **Cost fields** are fixed at flowers, wrap/packaging, labor, delivery, overhead (`costFields` in `product-data.ts`). If Florenza's real cost structure has different line items, change the array there — the table and charts pick it up automatically, nothing else needs editing.
- **recharts** was added as a dependency for this section specifically. It's the only chart library in the project — use it for any future chart rather than introducing a second one.

## Section map (as scaffolded)

The brief's "Business Structure,, Revenue Vendor Management" had a typo (duplicate comma, missing separator). It was interpreted as **two separate sections** — "Revenue" and "Vendor Management" — giving a clean 6/6 split between the two nav groups. Flag this if it should have been one combined "Revenue & Vendor Management" section instead.

**Business**
- Business Analytics — cross-venture performance read
- Business Structure — org, roles, SOPs
- Product Management — SKU catalogue, cost stack, pricing, margin (**built out**, see below)
- Revenue — money in, by SKU/channel/margin
- Vendor Management — florists, wrap suppliers, delivery partners
- Orders — order queue and history
- Order Fulfillment — sourced → assembled → QC → dispatched pipeline

**Content**
- Content Dashboard — command center across content pillars
- Instagram Manager — status board for post ideas, backlog through published (**built out**, see below)
- Analytics — content/engagement performance
- Content Calendar — cross-channel posting schedule, monthly view (**built out**, see below)
- Competitor Tracker — competitor grid/pricing/positioning (**built out**, see below)
- News Consolidator — industry/market signal feed, live RSS (**built out**, see below)

**Website**
- Website Builder — section-based storefront builder, real product catalogue integration, real cart (checkout intentionally disabled pending a payment provider), real domain DNS verification, real Netlify hosting deploy (**built out**, see below). This group didn't exist in the original brief, it was added because the site builder doesn't fit under Business or Content, it's its own capability.

## Design system

Dark theme is global (`<html class="dark">`, no light mode toggle — not requested, and a toggle would fight the deliberate palette). The palette was chosen to match Florenza's actual brand direction (documented in the `florenza-instagram` skill) rather than a generic dark-mode default:

- **Background**: warm espresso (`#14110d`), not pure black
- **Primary accent**: brass/gold (`#c9a668`) — pulls from the brand's brass pendant / gold-foil visual language
- **Secondary signals**: muted clay-red for destructive/alerts (`#9a4c42`), sage for success (`#7c8b6f`)
- **Display type**: Fraunces (serif, editorial) for headings — matches the documentary-editorial brand direction
- **Body/UI type**: Manrope
- **Data/mono**: IBM Plex Mono (reserved for future tables/figures, not yet used on placeholder pages)

Fonts are loaded via a `<link>` tag in `layout.tsx` rather than `next/font/google`, because `next/font` fetches from `fonts.googleapis.com` at **build time**, and that domain wasn't reachable in the sandbox this was built in. This works fine with normal internet access but if you want the `next/font` optimization (self-hosted, zero layout shift) later, swap it in — it's a drop-in replacement.

All theme tokens live in `globals.css` under `:root` and are exposed to Tailwind via `@theme inline` (Tailwind v4's CSS-first config — there's no `tailwind.config.ts` file, that's expected).

## Component conventions

- Every `ui/` primitive is a small, unstyled-by-default Radix wrapper with Tailwind classes, following shadcn's `data-slot` + `cva` pattern. Copy this pattern for any new primitive rather than pulling in a different component library.
- `cn()` (in `lib/utils.ts`) is the only way classNames get merged/overridden — always use it when a component accepts a `className` prop.
- Section pages are server components. `sidebar.tsx` and `topbar.tsx` are client components (`usePathname`, mobile menu state) — keep that boundary; don't make a page a client component just to read the current route, use `PageShell` + `getNavItem` instead.
- `PageShell` is intentionally generic (icon + title + description + bullet list). When a section gets built out for real, that page stops importing `PageShell` and gets its own layout — `PageShell` is a placeholder pattern, not meant to be stretched to hold real data views.

## Known gaps / next steps

- No auth, no data fetching, no persistence layer for client-side state. Product Management, Instagram Manager, Content Calendar, Competitor Tracker, and Website Builder all live in React state only and reset on reload — deliberately out of scope for this pass, but the first thing to fix once these sections need to survive a refresh.
- Product Management's catalogue, Instagram Manager's post board, Content Calendar's schedule, Competitor Tracker's competitor list, and Website Builder's page layout are all placeholder/session-only data — see each section's notes above for how to swap in the real thing. **News Consolidator is the exception** — it pulls real, live data, no placeholder swap needed.
- Competitor Tracker specifically has no path to real metrics without a paid third-party service or official platform API access — this isn't a "wire up a fetch call" gap like the others, it's a "need to buy or build a data source" gap. Don't treat it the same as the others when planning next steps.
- **Website Builder has a real hosting path (Netlify, bring-your-own-token) but no payment processing right now, on purpose.** Stripe was built, tested, and then deliberately removed on request, Florenza wants a different provider added later rather than a half-finished Stripe integration sitting around. See the "Payments were deliberately removed" note at the top of the Website Builder section above before adding any payment provider back, it explains exactly what was pulled out and why, and where the two checkout buttons (in-app preview, deployed static site) are sitting disabled and ready to be wired up. Also still missing regardless of payment provider: real product photography (placeholders only), a compiled stylesheet instead of the Tailwind CDN script for the exported HTML, and any automation connecting a verified domain to the deployed Netlify site (manual step in Netlify's dashboard/DNS).
- No light theme — confirm before adding one; palette was built dark-only.
- `Instagram` icon isn't available in the installed `lucide-react` version (brand icons were removed upstream); sections needing it use generic substitutes instead (`Grid3x3` for Instagram, `ThumbsUp` for Facebook, `Music2` for TikTok, `Pin` for Pinterest). Swap if better icons show up.
- Mobile nav uses a hand-built `Sheet` (Radix Dialog) rather than shadcn's packaged one — same API surface, fine to replace via `shadcn add sheet` later if you want it CLI-managed.
- `recharts` (Product Management), `fast-xml-parser` (News Consolidator), `@radix-ui/react-dropdown-menu` (Website Builder's "Add block" menu, via `ui/dropdown-menu.tsx`), and `jszip` (Website Builder's Netlify zip-deploy) were added as dependencies for their specific sections. Reuse them rather than introducing alternatives.
