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

No backend, no database, no auth yet. Nine sections (Product Management, Instagram Manager, Content Calendar, Competitor Tracker, News Consolidator, Website Builder, Vendor Management, Business Structure, Content Dashboard) are built out with real client-side state — News Consolidator, Website Builder's domain check, and Website Builder's hosting deploy also have real server-side API routes (live RSS fetch, a real DNS lookup, and a real Netlify deploy, respectively). The rest are routed placeholders. Data layer gets wired in per-section as each one gets built out.

This repo is connected to GitHub (`hassaan-pro/florenza-dashboard`) and deployed on Vercel from the `main` branch — pushes to `main` auto-deploy. Vercel's Framework Preset must be set to Next.js in Project Settings (it does **not** auto-redetect after the project already exists, only at creation, this bit Hassaan once already after a broken GitHub web-upload nested the project in subfolders and Vercel locked in "Other").

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
        export/route.ts          # Zips all 4 site pages, returns florenza-site.zip for direct download
        deploy/route.ts          # Zips all 4 site pages and deploys to Netlify via the user's own token
    (dashboard)/              # Route group — everything that gets the sidebar shell
      layout.tsx               # Renders <AppSidebar/> + <Topbar/> + page content, wrapped in InstagramPostsProvider
      business-analytics/page.tsx
      business-structure/page.tsx  # BUILT OUT — see below
      product-management/page.tsx  # BUILT OUT — see below
      revenue/page.tsx
      vendor-management/page.tsx   # BUILT OUT — see below
      orders/page.tsx
      order-fulfillment/page.tsx
      content-dashboard/page.tsx   # BUILT OUT — see below
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
    website-builder/           # Block list, inspector panel, Shop config panel, site preview (multi-page), domain dialog, hosting dialog
    vendor-management/         # Vendor table, add-vendor dialog, purchase order section
    business-structure/        # Org roles grouped by department, add-role dialog, SOP section
    content-dashboard/         # Pillar breakdown (real data via shared context), grid batch section, asset library
    ui/                        # Hand-authored shadcn-style primitives: button, card, badge, separator,
                                # sheet, dialog, input, textarea, label, select, dropdown-menu
  lib/
    nav-config.ts              # SINGLE SOURCE OF TRUTH for every section: title, route, icon, description, "coming soon" bullets
    product-data.ts            # Product Management data model, seed data, margin math (also consumed by Website Builder)
    instagram-data.ts          # Instagram Manager data model, seed data
    instagram-context.tsx      # Shared InstagramPostsProvider/useInstagramPosts — real cross-section data source (Instagram Manager <-> Content Dashboard)
    calendar-data.ts           # Content Calendar data model, seed data, month-grid helper
    competitor-data.ts         # Competitor Tracker data model, seed data
    news-data.ts                # News Consolidator types, feed source list, topic classifier, fallback data
    website-data.ts             # Website Builder: Block/Site types, defaultSite(), sitePages list, storefront palette
    export-html.ts               # Plain-string-template HTML generation for all 4 Website Builder pages (deliberately not React SSR — see Website Builder notes)
    vendor-data.ts               # Vendor Management data model, seed data
    business-structure-data.ts   # Business Structure data model (roles, SOPs), seed data
    content-dashboard-data.ts    # Content Dashboard's own data model (grid batches, assets) — pillar breakdown itself comes from instagram-context.tsx, not this file
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

Real, separate pages, not one long scrolling page. Home, Shop, Product, Cart, matching how an actual e-commerce site (and Shopify's own template model) is structured. This replaced an earlier single-page block-list design on request (2026-07) — if you're reading anything older that describes Website Builder as one continuous page, that's stale.

**Page model**: `Home` is the free-form block editor (add/reorder/edit/delete blocks, same UX as before). `Shop`, `Product`, and `Cart` are **templated pages**, not block-built — fixed structure, a small amount of editable copy where it makes sense (Shop has an editable heading/subheading), the rest driven entirely by real data (the product catalogue, the cart). This mirrors how Shopify itself works: you freely edit the home page's sections, but the collection/product/cart page *templates* have a fixed shape you configure, not rebuild from blocks.

**Payments were deliberately removed (2026-07).** An earlier pass wired up real Stripe Checkout, both in-app and on the deployed site (a bundled Netlify Function). All of that was pulled out on request — Florenza wants a different payment provider added later, and didn't want a Stripe integration left half-connected in the meantime. If you're reading old context describing checkout as working, it isn't, don't rebuild toward that until asked. Every page's checkout button is present but disabled, labeled "Checkout coming soon."

**What's real:**
- The Home block editor is fully functional — add, reorder (up/down, not drag-and-drop), edit, delete blocks; every field updates the live preview immediately.
- **Shop shows the entire real product catalogue** from Product Management (`seedProducts` in `src/lib/product-data.ts`), not a curated subset — Home's Featured Products block still shows a picked subset as a teaser, matching the real-site pattern of "home page highlights, full catalogue lives on the shop page."
- **Product pages are real and dynamic.** Click any product card anywhere (Home teaser, Shop grid) and the preview actually navigates to that product's own page, showing its real name/price/tier from Product Management. In the exported/deployed site this works via `product.html?id=<sku-id>`, read client-side from an embedded JSON array of the catalogue (`productPageHtml()` in `export-html.ts`) — there's no per-product static file generated, one `product.html` handles all of them via the query string.
- **The cart is real**, not a mock, checkout just isn't connected to anything yet. In-app: `site-preview.tsx` owns cart state (`useState`, session-only). Deployed: `localStorage`-backed, shared across all four static pages via plain `<a href>` links and a page reload, no SPA router needed since it's the same origin (`cartScript()` in `export-html.ts`).
- **Domain verification is a real DNS lookup.** `src/app/api/domain/verify/route.ts` uses Node's `dns.promises.resolveTxt()` server-side to check for a TXT record on a domain the person actually controls.
- **Hosting is a real deploy of all four pages.** `src/app/api/hosting/deploy/route.ts` zips `index.html` + `shop.html` + `product.html` + `cart.html` (via `jszip`) and POSTs to Netlify's zip-deploy API using the person's own Netlify personal access token, sent straight through, never stored or logged. First deploy creates a new Netlify site and returns its `site_id`; pass that back in on the next deploy to update the same site. `src/app/api/hosting/export/route.ts` is the no-token path — same four-page zip, returned as a direct `florenza-site.zip` download for self-hosting anywhere.
- **HTML generation is plain string templating, not React SSR**, and it's genuinely a *separate* implementation from `site-preview.tsx`, not a shared renderer. App Router route handlers run under React's `react-server` module condition, which blocks importing `react-dom/server` — Next/Turbopack errors on it at build time. So `src/lib/export-html.ts` hand-builds each of the four HTML documents (`homePageHtml`, `shopPageHtml`, `productPageHtml`, `cartPageHtml`) from scratch, sharing only small helpers (`navBar()`, `footerHtml()`, `cartScript()`, `productCard()`) within that same file. **`export-html.ts` and `site-preview.tsx` can drift out of sync** — any layout or behavior change to one needs the matching change made by hand in the other. There's no shared source of truth between the in-app preview and the exported/deployed site.

**What's not real, and is labeled as such on the page:**
- Checkout, everywhere, see above.
- "Publish" (separate from Hosting) only saves the layout in React state for the session — it does not deploy anything. Use **Hosting** for an actual live URL.
- Images are placeholder blocks (gradient + a text note), not real photography.
- The exported/deployed pages load Tailwind via a CDN `<script>` tag rather than a compiled stylesheet — fine for a preview or a low-traffic deploy, not for real production traffic long-term.
- The domain dialog verifies ownership only; it doesn't connect that domain to the deployed Netlify site. That's still a manual step in Netlify's own dashboard/DNS after deploying.
- No inventory, order storage, shipping, or tax handling — there's no way for a real order to happen at all yet (checkout is disabled).

**Data model**: `src/lib/website-data.ts` — `Block` (discriminated union over `BlockType`, used only by Home: hero, featured-products, about, testimonial, newsletter, footer), `Site` (`{ home: Block[], shop: ShopConfig }` — the top-level state shape for the whole builder now, not just a block array), `SitePageId` (`"home" | "shop" | "product" | "cart"`), `sitePages` (the tab list), `createDefaultBlock()` / `defaultSite()` for starter content (real Florenza brand voice, not lorem ipsum), and `storefront` — the deliberately separate light/warm color palette for the site being built, independent from the dashboard's dark theme tokens.

**Components** (`src/components/website-builder/`):
- `block-list.tsx` / `inspector-panel.tsx` — unchanged in behavior, just now only rendered when the Home tab is active (they operate on `site.home`)
- `shop-config-panel.tsx` — new, the right-panel form for Shop's heading/subheading, shown when the Shop tab is active
- `site-preview.tsx` — now takes `{ site, currentPage, selectedProductId, onNavigate }` instead of a flat block list. Renders a real `NavBar` (Home/Shop/Cart links + cart count) on every page, switches on `currentPage` to render `HomePage`/`ShopPage`/`ProductPage`/`CartPage`, and renders the Home block list's footer block once globally underneath every page (extracted out of Home's own block loop so it doesn't double-render when Home is active)
- `domain-dialog.tsx` — unchanged
- `hosting-dialog.tsx` — now takes `{ site }` instead of `{ blocks }`; both download and deploy send/receive the full four-page zip

The page component (`src/app/(dashboard)/website-builder/page.tsx`) owns `site`, `currentPage`, `selectedBlockId` (Home only), and `selectedProductId` (Product only) as top-level state, and a `navigate(page, productId?)` function passed into `SitePreview` so that clicking a product card *inside the preview* drives the exact same state as the page tabs above it — the tabs and the in-preview navigation are the same source of truth, not two separate mechanisms that could disagree.

Added `src/components/ui/dropdown-menu.tsx` (Radix dropdown, same pattern as the other hand-authored primitives) for the "Add block" menu on Home.

### Vendor Management (`/vendor-management`)

Editable vendor directory plus purchase order tracking. Client-side state only, same persistence gap as everything else in this list.

- **Data model**: `src/lib/vendor-data.ts` — `Vendor` (category, contact, lead time, three 1–5 star scores: reliability/quality/price, status), `PurchaseOrder` (tied to a vendor by id, quantity, cost, status, dates).
- **Seed data is placeholder** (`seedVendors` / `seedPurchaseOrders`), 5 illustrative vendors across florist/wrap/delivery categories.
- **Components** (`src/components/vendor-management/`): `vendor-table.tsx` (inline-editable, star-rating clicks, status select), `add-vendor-dialog.tsx` (new vendors start "Under Review" with neutral 3-star scores, deliberately not pre-rated), `po-section.tsx` (purchase order table + its own add-dialog, joins to vendors by id for the vendor name column).

### Business Structure (`/business-structure`)

Org roles grouped by department with reporting lines, plus a separate SOP list. Client-side state only.

- **Data model**: `src/lib/business-structure-data.ts` — `Role` (title, person, department, `reportsTo` as another role's id or `null` for top-of-chart), `SOP` (title, department, summary, Active/Draft status).
- This is a grouped-list-with-a-"reports to"-tag layout, **not a rendered org chart with connecting lines** — that was judged out of scope for this pass given the size of everything else being built at once. If a real visual tree becomes worth the effort later, `Role.reportsTo` already has everything needed to compute one.
- **Components** (`src/components/business-structure/`): `org-roles.tsx` (cards grouped by department, inline-editable title/person/reports-to/department), `add-role-dialog.tsx`, `sop-section.tsx` (card grid, click the status badge to toggle Active/Draft, plus its add-dialog).

### Content Dashboard (`/content-dashboard`)

The pillar breakdown here is **real data pulled from Instagram Manager**, not a second disconnected fake dataset — the one deliberate cross-section architecture change in this batch of work, worth understanding before touching either page.

- **New shared state**: `src/lib/instagram-context.tsx` defines `InstagramPostsProvider` (wraps the whole `(dashboard)` route group in `layout.tsx`) and a `useInstagramPosts()` hook. Instagram Manager's post board now reads/writes through this context instead of its own local `useState` — same `seedPosts` starting data, same behavior from the user's point of view, but now any other page inside `(dashboard)` can read the same live post list. Content Dashboard's `PillarBreakdown` component is the first (only, so far) consumer: add a post in Instagram Manager, tagged to a pillar, and Content Dashboard's counts update without any manual sync code. If a future section needs the same kind of real cross-page data (Orders reading from Website Builder's cart, for instance), this is the pattern to follow — a context provider at the `(dashboard)` layout level, not prop-drilling and not a second copy of the data.
- **Grid batches and the asset library are still placeholder data** (`src/lib/content-dashboard-data.ts` — `seedBatches`, `seedAssets`), there was no existing real source to wire them to the way pillar breakdown could tap Instagram Manager.
- **Components** (`src/components/content-dashboard/`): `pillar-breakdown.tsx` (takes real `posts` as a prop, computes per-pillar counts by status), `batch-section.tsx` (grid batch cards with a progress bar toward the target post count, add-dialog), `asset-library.tsx` (a reference table, explicitly **not a file upload** — it catalogues what exists and where, it doesn't store any actual file, said directly in the add-dialog's copy so it isn't mistaken for real asset storage).

### Content Calendar (`/content-calendar`)

Monthly calendar view of scheduled and posted content across Instagram, Facebook, TikTok, and Pinterest. Client-side state only, same persistence gap as the other built-out sections.

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
- Business Structure — org, roles, SOPs (**built out**, see below)
- Product Management — SKU catalogue, cost stack, pricing, margin (**built out**, see below)
- Revenue — money in, by SKU/channel/margin
- Vendor Management — florists, wrap suppliers, delivery partners (**built out**, see below)
- Orders — order queue and history
- Order Fulfillment — sourced → assembled → QC → dispatched pipeline

**Content**
- Content Dashboard — command center across content pillars (**built out**, see below)
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

- **Deployed and live**: `hassaan-pro/florenza-dashboard` on GitHub, auto-deploying to Vercel from `main`. Claude has push access via a fine-grained PAT (repo-scoped, Contents: Read/write) supplied directly in chat — treat any token shared this way as compromised the moment it's pasted, ask for a fresh one before pushing again if a long time has passed or the token's origin is unclear. Push directly rather than handing back zip files now that this is wired up.
- No auth, no data fetching, no persistence layer for client-side state. Product Management, Instagram Manager, Content Calendar, Competitor Tracker, Website Builder, Vendor Management, and Business Structure all live in React state only and reset on reload — deliberately out of scope for this pass, but the first thing to fix once these sections need to survive a refresh. Content Dashboard is a partial exception: its pillar breakdown reads live from `instagram-context.tsx`'s shared provider, so it stays in sync with Instagram Manager for the session, but that shared state still resets on reload same as everything else.
- Product Management's catalogue, Instagram Manager's post board, Content Calendar's schedule, Competitor Tracker's competitor list, Website Builder's page layout, Vendor Management's vendors/POs, Business Structure's roles/SOPs, and Content Dashboard's batches/assets are all placeholder/session-only data — see each section's notes above for how to swap in the real thing. **News Consolidator is the exception** — it pulls real, live data, no placeholder swap needed.
- Competitor Tracker specifically has no path to real metrics without a paid third-party service or official platform API access — this isn't a "wire up a fetch call" gap like the others, it's a "need to buy or build a data source" gap. Don't treat it the same as the others when planning next steps.
- **Website Builder has a real hosting path (Netlify, bring-your-own-token) but no payment processing right now, on purpose.** Stripe was built, tested, and then deliberately removed on request, Florenza wants a different provider added later rather than a half-finished Stripe integration sitting around. See the "Payments were deliberately removed" note in the Website Builder section above before adding any payment provider back. Also still missing regardless of payment provider: real product photography (placeholders only), a compiled stylesheet instead of the Tailwind CDN script for the exported HTML, checkout/order storage, and any automation connecting a verified domain to the deployed Netlify site (manual step in Netlify's dashboard/DNS).
- Business Structure's org view is a grouped list with "reports to" tags, not a rendered chart with connecting lines — flagged as out of scope for this pass in that section's notes, revisit if it's actually needed.
- Content Dashboard's grid batches and asset library are placeholder data (no real source to wire them to yet, unlike the pillar breakdown); the asset library is explicitly a reference catalogue, not real file storage.
- No light theme — confirm before adding one; palette was built dark-only.
- `Instagram` icon isn't available in the installed `lucide-react` version (brand icons were removed upstream); sections needing it use generic substitutes instead (`Grid3x3` for Instagram, `ThumbsUp` for Facebook, `Music2` for TikTok, `Pin` for Pinterest). Swap if better icons show up.
- Mobile nav uses a hand-built `Sheet` (Radix Dialog) rather than shadcn's packaged one — same API surface, fine to replace via `shadcn add sheet` later if you want it CLI-managed.
- `recharts` (Product Management), `fast-xml-parser` (News Consolidator), `@radix-ui/react-dropdown-menu` (Website Builder's "Add block" menu, via `ui/dropdown-menu.tsx`), and `jszip` (Website Builder's Netlify zip-deploy) were added as dependencies for their specific sections. Reuse them rather than introducing alternatives.
