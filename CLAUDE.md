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

No backend, no real database yet (Vercel Postgres is the plan, not provisioned as of 2026-07, see the Instagram section below). **Every Business and Content section is built out** (Product Management, Instagram Manager, Content Calendar, Competitor Tracker, News Consolidator, Website Builder, Vendor Management, Business Structure, Content Dashboard, Orders, Order Fulfillment, Revenue, Business Analytics, Analytics) with real client-side state, three shared React Contexts (`ProductsProvider`, `InstagramPostsProvider`, `OrdersProvider`) keep related sections reading the same live data instead of holding disconnected copies — see "Orders, Order Fulfillment, Revenue, Business Analytics, Analytics" and the Website Builder section's "architectural fix" note below. News Consolidator, Website Builder's domain check, and Website Builder's hosting deploy also have real server-side API routes (live RSS fetch, a real DNS lookup, and a real Netlify deploy, respectively). `page-shell.tsx`'s placeholder pattern is currently unused but stays as the template for any new section added later.

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
      layout.tsx               # Renders <AppSidebar/> + <Topbar/> + page content, wrapped in InstagramPostsProvider + OrdersProvider
      business-analytics/page.tsx  # BUILT OUT — see below
      business-structure/page.tsx  # BUILT OUT — see below
      product-management/page.tsx  # BUILT OUT — see below
      revenue/page.tsx              # BUILT OUT — see below
      vendor-management/page.tsx   # BUILT OUT — see below
      orders/page.tsx                # BUILT OUT — see below
      order-fulfillment/page.tsx     # BUILT OUT — see below
      content-dashboard/page.tsx   # BUILT OUT — see below
      instagram-manager/page.tsx   # BUILT OUT — see below
      analytics/page.tsx             # BUILT OUT — see below
      content-calendar/page.tsx    # BUILT OUT — see below
      competitor-tracker/page.tsx  # BUILT OUT — see below
      news-consolidator/page.tsx   # BUILT OUT — see below
      website-builder/page.tsx     # BUILT OUT — see below
  components/
    layout/
      sidebar.tsx             # Desktop fixed sidebar, grouped nav, active-state highlighting
      topbar.tsx               # Sticky header, mobile nav trigger (Sheet), current page title
      page-shell.tsx           # Shared placeholder layout — as of 2026-07 every Business/Content section is built out, so nothing currently uses this, but it's still the pattern for any *new* section added later
    product-management/        # KPI cards, editable table (now with image upload), margin/cost charts, pricing strategy panel
    instagram-manager/         # Board columns, post cards, add-post dialog
    content-calendar/          # Month grid, day detail dialog, platform filters, add-item dialog
    competitor-tracker/        # Sortable table, add-competitor dialog
    news-consolidator/         # News card, topic filter
    website-builder/           # Block list, inspector panel, Shop/Header config panels, reveal wrapper, site preview (multi-page, header/marquee/category-showcase), domain dialog, hosting dialog
    vendor-management/         # Vendor table, add-vendor dialog, purchase order section
    business-structure/        # Org roles grouped by department, add-role dialog, SOP section
    content-dashboard/         # Pillar breakdown (real data via shared context), grid batch section, asset library
    orders/                     # Order table, add-order dialog, fulfillment board — shared across Orders and Order Fulfillment pages
    revenue/                     # Revenue-by-SKU chart, real cost/margin join against Product Management
    ui/                        # Hand-authored shadcn-style primitives: button, card, badge, separator,
                                # sheet, dialog, input, textarea, label, select, dropdown-menu, image-upload
  lib/
    nav-config.ts              # SINGLE SOURCE OF TRUTH for every section: title, route, icon, description, "coming soon" bullets
    product-data.ts            # Product Management data model (Product now has optional imageUrl), margin math
    products-context.tsx        # Shared ProductsProvider/useProducts — real cross-section data source (Product Management <-> Website Builder <-> Orders <-> Revenue). Read this before importing seedProducts directly anywhere.
    image-upload.ts              # Client-side canvas resize/compress -> base64 data URL, backs every image upload in the dashboard
    instagram-data.ts          # Instagram Manager data model, seed data
    instagram-context.tsx      # Shared InstagramPostsProvider/useInstagramPosts — real cross-section data source (Instagram Manager <-> Content Dashboard <-> Analytics <-> Business Analytics)
    calendar-data.ts           # Content Calendar data model, seed data, month-grid helper
    competitor-data.ts         # Competitor Tracker data model, seed data
    news-data.ts                # News Consolidator types, feed source list, topic classifier, fallback data
    website-data.ts             # Website Builder: Block/Site/HeaderConfig types, defaultSite(), sitePages list, storefront palette, tierCopy
    export-html.ts               # Plain-string-template HTML generation for all 4 Website Builder pages, takes (site, products) as params (deliberately not React SSR — see Website Builder notes)
    vendor-data.ts               # Vendor Management data model, seed data
    business-structure-data.ts   # Business Structure data model (roles, SOPs), seed data
    content-dashboard-data.ts    # Content Dashboard's own data model (grid batches, assets) — pillar breakdown itself comes from instagram-context.tsx, not this file
    orders-data.ts                # Order/OrderLineItem types, orderTotal(), lineItemFromProduct() — the shared transactional data model
    orders-context.tsx            # Shared OrdersProvider/useOrders — real cross-section data source (Orders <-> Order Fulfillment <-> Revenue <-> Business Analytics)
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

**Page model**: `Home` is the free-form block editor (add/reorder/edit/delete blocks). `Shop`, `Product`, and `Cart` are **templated pages**, not block-built — fixed structure, a small amount of editable copy where it makes sense, the rest driven entirely by real data. There's also a site-wide **Header** tab (not a page — it's config that renders on all four pages: logo text, and an optional scrolling announcement/marquee bar). This mirrors how Shopify itself works: you freely edit the home page's sections, header/announcement is a theme-level setting, and the collection/product/cart page *templates* have a fixed shape you configure, not rebuild from blocks.

**Payments were deliberately removed (2026-07).** An earlier pass wired up real Stripe Checkout, both in-app and on the deployed site. All of that was pulled out on request — Florenza wants a different payment provider added later. Every page's checkout button is present but disabled, labeled "Checkout coming soon."

**Design/CRO pass (2026-07).** Hassaan pushed back hard that this "looked like every other AI-generated site" and was missing basic things a real builder needs — image upload, a proper header, and a product page that doesn't just have an "Add to cart" button floating with no real content around it. That prompted two kinds of changes: a real architectural fix (below), and a genuine design upgrade (further below). Both are real, not cosmetic tweaks to make the same thing look busier.

**The architectural fix — `ProductsProvider` (`src/lib/products-context.tsx`).** Before this, Product Management held its own local `useState(seedProducts)` and Website Builder separately imported the static `seedProducts` array — so editing a product, or uploading an image to it, in Product Management **never actually reached the builder**, despite CLAUDE.md previously (incorrectly) claiming it did. This is now fixed the same way Instagram/Orders were: `ProductsProvider` wraps the `(dashboard)` layout, and Product Management, Website Builder, Orders' product picker, and Revenue's cost lookups all read from `useProducts()` now, not from the static `seedProducts` export. If you add a new page that needs product data, use the context, importing `seedProducts` directly anywhere except inside `products-context.tsx` itself (and `orders-data.ts`'s static seed order construction, which is fine since it's just building illustrative starting data) is the bug this fix exists to prevent from recurring.

**Real image upload.** `src/lib/image-upload.ts` (`resizeImageFile()`) and `src/components/ui/image-upload.tsx` (`<ImageUpload>`) — click-to-upload, resizes/compresses client-side via `<canvas>` to a JPEG data URL (default max width 1200px, quality 0.82), no image host or CDN wired up. Used in: Product Management's table (per-product thumbnail, `imageUrl` field added to `Product`), and the Hero/About blocks' inspector fields (`imageUrl` added to `HeroBlock`/`AboutBlock`). Honest tradeoff, stated in the code comment and worth repeating here: data URLs bloat page weight with no caching/lazy-load story, fine for a handful of photos, not how you'd ship dozens of full-res images to real production traffic.

**What's real:**
- The Home block editor is fully functional — add, reorder, edit, delete blocks, live preview.
- **Shop shows the entire real product catalogue** from the shared `ProductsProvider`, with client-side tier filter tabs (All/Classic/Signature/Luxury). Home's Featured Products block still shows a picked subset as a teaser.
- **A new "Category Showcase" block type** — three cards (Classic/Signature/Luxury) with real per-tier lowest-price ("From Rs X", computed from the live catalogue) that deep-link to the Shop page pre-filtered to that tier (`shop.html?tier=Classic`). Tier blurb copy lives in `tierCopy` in `website-data.ts`.
- **Product pages are real, dynamic, and now built for actual conversion, not just a name and a button.** Real image (falls back to the placeholder gradient if none uploaded), a quantity selector, three honest trust badges (same-day Lahore delivery, real flowers/real photos, composed to order — real Florenza operational claims, not fabricated), a delivery-cutoff line, and a "More from [tier]" related-products row (same tier, excluding the current product). Deliberately **no star ratings or fake review counts** — there's no real review data anywhere in this system, inventing plausible-looking social proof on a page whose whole job is to be trusted would be a straightforwardly dishonest design choice, don't add it later without a real review data source behind it.
- **Scroll-reveal animations.** Sections fade/slide in on scroll. In-app: `<Reveal>` (`src/components/website-builder/reveal.tsx`), an `IntersectionObserver` wrapper. Exported/deployed: the same effect via a shared vanilla-JS `IntersectionObserver` in `export-html.ts`'s `sharedScript()` (dashboard) / inline per-page script, toggling a `.fz-visible` class on `[data-fz-reveal]` elements, CSS transition defined in each page's `<style>` block (and mirrored in the dashboard's own `globals.css` for the in-app preview, `[data-fz-reveal]` rules there).
- **A responsive header with a real mobile menu**, not just a nav bar that quietly breaks at small widths. Desktop shows inline Home/Shop/Cart links; below `md`, that collapses to a hamburger toggle revealing a stacked menu (`NavBar` in `site-preview.tsx`; vanilla-JS toggle on `#fz-mobile-toggle` in the exported HTML).
- **A scrolling announcement/marquee bar**, optional, toggleable, editable text, pure CSS animation (`@keyframes fz-marquee` in `globals.css` for the dashboard preview, inlined per-document in `export-html.ts` for the deployed site) — no JS needed for the scroll itself, just a doubled-up text track sliding via `transform: translateX`.
- **The cart is real**, checkout just isn't connected. In-app: `site-preview.tsx` owns cart state. Deployed: `localStorage`-backed, shared across all four static pages.
- **Domain verification is a real DNS lookup** (`src/app/api/domain/verify/route.ts`, unchanged from before).
- **Hosting is a real deploy of all four pages**, now including whatever images were uploaded — `products` (with their `imageUrl`s) is sent in the request body alongside `site` from `hosting-dialog.tsx`, since the export/deploy route handlers run server-side and have no access to the browser's `ProductsProvider` context. `renderSiteFiles(site, products)` takes both as parameters now, it does not import `seedProducts`.
- **HTML generation is plain string templating, not React SSR**, and it's a genuinely separate implementation from `site-preview.tsx` — App Router route handlers run under React's `react-server` condition, which blocks `react-dom/server`. **This file got meaningfully bigger and more detailed in this pass** (header/marquee markup, category showcase, scroll reveal, product CRO, tier-filtered shop), which means `export-html.ts` and `site-preview.tsx` are *more* likely to drift apart now, not less — if you change one, read the other side by side before you consider the change done.

**What's not real, and is labeled as such on the page:**
- Checkout, everywhere, see above.
- "Publish" (separate from Hosting) only saves the layout in React state for the session.
- The exported/deployed pages load Tailwind via a CDN `<script>` tag rather than a compiled stylesheet.
- The domain dialog verifies ownership only; connecting that domain to the deployed Netlify site is still a manual step in Netlify's dashboard/DNS.
- No inventory, order storage, shipping, or tax handling — there's no way for a real order to happen at all yet (checkout is disabled).
- Uploaded images are base64 data URLs with no optimization pipeline (no resizing per-breakpoint, no WebP/AVIF, no lazy-loading beyond what the browser does natively) — fine for a handful of photos per product/section, a real image host is the next step if this catalogue grows.

**Data model**: `src/lib/website-data.ts` — `Block` (discriminated union over `BlockType`, now 7 variants including `category-showcase`; `hero`/`about` carry an optional `imageUrl`), `Site` (`{ header: HeaderConfig, home: Block[], shop: ShopConfig }`), `HeaderConfig` (`{ logoText, showAnnouncement, announcementText }`), `SitePageId`, `sitePages`, `createDefaultBlock()` / `defaultSite()`, `storefront` (the light/warm palette), and `tierCopy` (per-tier blurb text for Category Showcase).

**Components** (`src/components/website-builder/`):
- `block-list.tsx` / `inspector-panel.tsx` — Home-only; `inspector-panel.tsx` now takes a `products` prop (from `useProducts()`, threaded down from the page) instead of importing `seedProducts`, and renders `<ImageUpload>` for Hero/About's image fields
- `shop-config-panel.tsx` — Shop's heading/subheading form
- `header-config-panel.tsx` — new, Header tab's form (logo text, announcement toggle + text)
- `reveal.tsx` — new, the `<Reveal>` scroll-animation wrapper
- `site-preview.tsx` — takes `{ site, products, currentPage, selectedProductId, onNavigate }`; `onNavigate` now accepts an options object (`{ productId?, tier? }`) instead of a second positional arg, since Category Showcase needs to pass a tier filter through to the Shop page — the Shop tier filter is lifted to `SitePreview`-level state (not local to `ShopPage`) specifically so it survives being set by a Category Showcase click and read when the Shop page renders
- `domain-dialog.tsx` — unchanged
- `hosting-dialog.tsx` — takes `{ site, products }`; both download and deploy send the full four-page zip plus the live product list

The page component (`src/app/(dashboard)/website-builder/page.tsx`) owns `site`, `currentPage` (drives the preview), `editTarget` (drives the left/right panels — `"header" | SitePageId`, separate from `currentPage` because selecting the Header tab shouldn't navigate the preview away from whatever page you were looking at), `selectedBlockId`, and `selectedProductId`, plus reads `products` from `useProducts()`.

Added `src/components/ui/dropdown-menu.tsx` (Radix dropdown) for the "Add block" menu on Home, and `src/components/ui/image-upload.tsx` for every image field in this pass.

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

Full SKU-level pricing, cost, profit, and margin dashboard, plus per-SKU image upload. **State moved from a local `useState` to the shared `ProductsProvider` context (2026-07)** — see the Website Builder section's "architectural fix" note above for exactly why (short version: Website Builder was silently reading a disconnected static copy of the catalogue, so edits and uploaded images made here never showed up there; that's fixed now). Still no real persistence — the shared context is still just React state, edits reset on reload, that's a known gap, not a bug.

- **Data model**: `src/lib/product-data.ts` — `Product` (sku, name, tier, price, cost breakdown, optional `imageUrl`), plus the calculation functions (`totalCost`, `grossProfit`, `marginPct`, `markupPct`) and `formatPKR`. This is the source of truth for how margin is calculated everywhere — don't recompute margin math inline in a component, import from here. **State lives in `src/lib/products-context.tsx` (`ProductsProvider`/`useProducts`)**, not in `product-management/page.tsx` — that page, Website Builder, Orders, and Revenue are all consumers of the same context now, not independent holders of their own copy.
- **Seed data is a placeholder.** The 8 sample SKUs are illustrative, not Florenza's real locked 15-SKU catalogue. **Replace them with the real catalogue** (edit inline in the UI — including uploading real product photos — or hand the real SKU/price/cost list to Claude to swap into `product-data.ts` directly).
- **Image upload** — click a product's thumbnail in `product-table.tsx` to upload/replace/remove a photo, via the shared `<ImageUpload>` component (`src/components/ui/image-upload.tsx`), resized client-side (`src/lib/image-upload.ts`). See the Website Builder section for the full honest tradeoff on data-URL images (no CDN, no optimization pipeline).
- **Components** (`src/components/product-management/`):
  - `kpi-cards.tsx` — blended average margin, best/worst SKU, total profit across one of each SKU, count of SKUs under the 40% margin floor
  - `product-table.tsx` — fully editable: image, name, tier, all 5 cost fields, and price are live inputs, total cost / profit / margin recalculate on every keystroke, rows can be removed
  - `margin-chart.tsx` / `cost-breakdown-chart.tsx` — recharts bar charts, themed off the CSS variables in `globals.css` (not hardcoded hex), so they stay in sync if the palette changes
  - `pricing-strategy.tsx` — the three pricing tiers (Classic/Signature/Luxury) with target margin bands (`tierTargetMargin` in `product-data.ts`) and a short rationale per tier
- **Cost fields** are fixed at flowers, wrap/packaging, labor, delivery, overhead (`costFields` in `product-data.ts`). If Florenza's real cost structure has different line items, change the array there — the table and charts pick it up automatically, nothing else needs editing.
- **recharts** was added as a dependency for this section specifically. It's the only chart library in the project — use it for any future chart rather than introducing a second one.

### Orders, Order Fulfillment, Revenue, Business Analytics, Analytics — the shared-data cluster

These five were built together (2026-07) because they only make sense together: Orders is the transactional source of truth, everything else reads from it (or from another section's shared context) rather than holding a second, disconnected copy of "how much money did we make." This is the same pattern as `instagram-context.tsx` feeding Content Dashboard, applied one level further.

- **`src/lib/orders-context.tsx`** (`OrdersProvider`/`useOrders`) is the new shared context, wrapped around the `(dashboard)` layout alongside `InstagramPostsProvider`. `src/lib/orders-data.ts` has the `Order`/`OrderLineItem` types, `orderTotal()`, and `lineItemFromProduct()` (snapshots a Product Management SKU's name/price onto the order at record time, so later catalogue price changes don't silently rewrite historical order totals).
- **Orders** (`/orders`) — records orders manually (`add-order-dialog.tsx`, product picker joined live to `seedProducts`), since real checkout is disabled (see Website Builder's Stripe-removal notes). This is explicitly a "record a sale taken by phone/WhatsApp" workflow, not evidence of a working storefront. Once real checkout exists, this is where those orders should land automatically instead of the manual dialog.
- **Order Fulfillment** (`/order-fulfillment`) — a pipeline board (Sourced → Assembled → QC → Dispatched → Delivered) over the *same* orders via `useOrders()`. Moving a card's stage here and changing an order's status on the Orders page are two different fields (`fulfillmentStage` vs `status`) on the same `Order` record, don't conflate them.
- **Revenue** (`/revenue`) — real math, not sample data: sums `orderTotal()` across orders with `status: "Completed"`, and computes cost of goods by joining each line item's `productId` back to Product Management's `seedProducts` and calling `totalCost()`. Revenue by SKU chart in `revenue-breakdown.tsx`. **Zero completed orders means the page correctly shows ₨0 everywhere** — that's accurate given the current data, not a bug to "fix" by adding fake orders.
- **Business Analytics** (`/business-analytics`) — top-level rollup pulling from three live sources: `useOrders()` for revenue/order counts, `seedProducts` for catalogue size/margin, `useInstagramPosts()` for content pipeline counts. The page includes an explicit "what this is built from" card so nobody mistakes it for a separate analytics pipeline — there isn't one, it's the same data as the pages it summarizes.
- **Analytics** (`/analytics`, content performance) — reuses `PillarBreakdown` from `content-dashboard/` directly (same component, same live Instagram data) rather than rebuilding it. Below that is an explicit, non-fabricated "engagement metrics aren't connected" card — reach/likes/saves need the real Instagram API connection (see below), and this page says so instead of inventing plausible-looking numbers. If the Instagram connection gets built, this is the page those metrics should land on.

### Instagram real connection — planned, not built

As of 2026-07 this is scoped but not started, blocked on two things only Hassaan can do:

1. **A Meta Developer App** (developers.facebook.com), Instagram Business/Creator account linked to a Facebook Page, and **App Review** for `instagram_business_content_publish` + related scopes — Meta's review takes **2–4 weeks** once submitted, this is not something Claude or faster engineering can shortcut. Development-mode testing works immediately with accounts added as testers/admins in the Meta dashboard, but publishing on behalf of any other account requires the review to pass.
2. **A real database** — decided as **Vercel Postgres** (2026-07). Claude has no tool that can provision this; it's a dashboard action (Vercel project → Storage → Create Database → Postgres), which auto-injects connection env vars into the project once created. This is required because: (a) Instagram's API has **no native "schedule for the future"** — you create a media container then publish it immediately, so "scheduling" means storing the target time ourselves and triggering the publish call at that time, and (b) Vercel serverless functions don't hold state between invocations, so both the scheduled-post queue and the OAuth tokens need real persistent storage, not React state.
3. Once both exist, the remaining build is: an OAuth connect flow (authorization redirect + callback route storing the long-lived token in Postgres), a scheduled-posts table, and a Vercel Cron Job (`vercel.json` cron config, documented via `search_vercel_documentation`) that polls due posts and calls the Graph API's create-container-then-publish sequence. None of this exists in the codebase yet — don't assume a `/api/instagram/*` route or an `instagram-data.ts` schema exists until this note is updated to say it was actually built.

## Section map (as scaffolded)

The brief's "Business Structure,, Revenue Vendor Management" had a typo (duplicate comma, missing separator). It was interpreted as **two separate sections** — "Revenue" and "Vendor Management" — giving a clean 6/6 split between the two nav groups. Flag this if it should have been one combined "Revenue & Vendor Management" section instead.

**Business**
- Business Analytics — cross-venture rollup, live from Orders/Product Management/Instagram Manager (**built out**, see below)
- Business Structure — org, roles, SOPs (**built out**, see below)
- Product Management — SKU catalogue, cost stack, pricing, margin (**built out**, see below)
- Revenue — real revenue/margin from completed Orders (**built out**, see below)
- Vendor Management — florists, wrap suppliers, delivery partners (**built out**, see below)
- Orders — shared transactional source of truth (**built out**, see below)
- Order Fulfillment — pipeline board over the same Orders (**built out**, see below)

**Content**
- Content Dashboard — command center across content pillars (**built out**, see below)
- Instagram Manager — status board for post ideas, backlog through published (**built out**, see below)
- Analytics — content pipeline performance, engagement pending real Instagram connection (**built out**, see below)
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
- `sidebar.tsx`/`topbar.tsx` and every built-out section page are client components (`useState`/context hooks). Only the still-hypothetical placeholder pattern (`PageShell` + `getNavItem`) is server-renderable — if a brand new section starts as a placeholder, keep that page a server component per the original pattern, don't add `"use client"` until it actually needs state.
- `PageShell` is intentionally generic (icon + title + description + bullet list) for sections that haven't been built out yet. As of 2026-07 nothing currently imports it — every Business/Content section is built out — but it stays as the template for the next new section, whatever that ends up being.

## Known gaps / next steps

- **Deployed and live**: `hassaan-pro/florenza-dashboard` on GitHub, auto-deploying to Vercel from `main`. Claude has push access via a fine-grained PAT (repo-scoped, Contents: Read/write) supplied directly in chat — treat any token shared this way as compromised the moment it's pasted, ask for a fresh one before pushing again if a long time has passed or the token's origin is unclear. Push directly rather than handing back zip files now that this is wired up.
- **Every Business and Content section is built out as of 2026-07** — there are no more `PageShell` placeholders in either group. The next new section (if any) starts from the placeholder pattern described in Component Conventions above.
- No auth, no persistence layer. Every built-out section's data — including the three shared contexts (`products-context.tsx`, `instagram-context.tsx`, `orders-context.tsx`) — lives in React state only and resets on reload. This is deliberate for now, but it's the single biggest gap left: Orders, Revenue, and Business Analytics all being "real" only holds within one browser session, and every uploaded product/section image is lost on reload too. **A database is already planned** (Vercel Postgres, chosen 2026-07 for the Instagram scheduling work below) — once it's provisioned, migrating these contexts from `useState` to real persisted reads/writes is the natural next step, don't treat it as a separate future decision. Uploaded images specifically will also want real file storage (not a database column) once that happens — base64 data URLs work for now but aren't what you'd store long-term.
- Most sections' seed data is illustrative placeholder content, not Florenza's real numbers — see each section's own notes above for specifics (Product Management's catalogue, Instagram Manager's posts, Vendor Management's vendors, etc.). **The exceptions**: News Consolidator pulls real live RSS, and the Orders/Revenue/Business Analytics/Analytics cluster computes real math off of whatever orders and posts actually exist in the session, it just starts from a small seeded set of each.
- Competitor Tracker specifically has no path to real metrics without a paid third-party service or official platform API access — this isn't a "wire up a fetch call" gap like the others, it's a "need to buy or build a data source" gap.
- **Website Builder has a real hosting path (Netlify, bring-your-own-token) but no payment processing right now, on purpose.** Stripe was built, tested, and then deliberately removed on request, Florenza wants a different provider added later rather than a half-finished Stripe integration sitting around. See the "Payments were deliberately removed" note in the Website Builder section above before adding any payment provider back. Also still missing regardless of payment provider: real photography still needs to actually be uploaded (the upload pipeline is real now, but nothing's been uploaded to the seed data yet), a compiled stylesheet instead of the Tailwind CDN script for the exported HTML, an image host/CDN instead of embedded base64 data URLs, checkout/order storage, and any automation connecting a verified domain to the deployed Netlify site (manual step in Netlify's dashboard/DNS).
- **Instagram real connection is scoped, not built** — see the dedicated section above. Blocked on Meta App Review (2-4 weeks, external, not an engineering task) and Vercel Postgres provisioning (a dashboard click only Hassaan can do). Don't assume any Instagram API code exists until that note says otherwise.
- Business Structure's org view is a grouped list with "reports to" tags, not a rendered chart with connecting lines — flagged as out of scope for this pass in that section's notes, revisit if it's actually needed.
- Content Dashboard's grid batches and asset library are placeholder data (no real source to wire them to yet, unlike the pillar breakdown); the asset library is explicitly a reference catalogue, not real file storage.
- No light theme — confirm before adding one; palette was built dark-only.
- `Instagram` icon isn't available in the installed `lucide-react` version (brand icons were removed upstream); sections needing it use generic substitutes instead (`Grid3x3` for Instagram, `ThumbsUp` for Facebook, `Music2` for TikTok, `Pin` for Pinterest). Swap if better icons show up.
- Mobile nav uses a hand-built `Sheet` (Radix Dialog) rather than shadcn's packaged one — same API surface, fine to replace via `shadcn add sheet` later if you want it CLI-managed.
- `recharts` (Product Management), `fast-xml-parser` (News Consolidator), `@radix-ui/react-dropdown-menu` (Website Builder's "Add block" menu, via `ui/dropdown-menu.tsx`), and `jszip` (Website Builder's Netlify zip-deploy) were added as dependencies for their specific sections. Reuse them rather than introducing alternatives.
