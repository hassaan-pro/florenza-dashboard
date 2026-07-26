import { seedProducts, formatPKR } from "@/lib/product-data";
import { storefront, type Block } from "@/lib/website-data";

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function imagePlaceholder(note: string, className: string): string {
  return `<div class="${className}" style="background:linear-gradient(135deg, ${storefront.accentSoft}, ${storefront.border});border:1px solid ${storefront.border};">
    <div class="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
      <p class="text-xs" style="color:${storefront.muted}">${escapeHtml(note)}</p>
    </div>
  </div>`;
}

function renderBlock(block: Block): string {
  switch (block.type) {
    case "hero":
      return `<section class="flex flex-col gap-6 px-6 py-14 md:px-14 md:py-20 items-start">
        <span class="text-xs font-medium uppercase" style="letter-spacing:0.14em;color:${storefront.accent}">${escapeHtml(block.eyebrow)}</span>
        <h1 class="text-3xl md:text-5xl leading-tight max-w-xl" style="font-family:var(--font-display);color:${storefront.ink}">${escapeHtml(block.headline)}</h1>
        <p class="text-sm md:text-base max-w-md leading-relaxed" style="color:${storefront.muted}">${escapeHtml(block.subheadline)}</p>
        <button class="rounded-full px-6 py-2.5 text-sm font-medium text-white" style="background:${storefront.accent}">${escapeHtml(block.ctaText)}</button>
        ${imagePlaceholder(block.imageNote, "mt-4 h-56 w-full rounded-xl")}
      </section>`;

    case "featured-products": {
      const products = seedProducts.filter((p) => block.productIds.includes(p.id));
      const shown = products.length > 0 ? products : seedProducts.slice(0, 4);
      const cards = shown
        .map(
          (p) => `<div class="flex flex-col gap-2">
            ${imagePlaceholder(p.tier, "aspect-square rounded-lg")}
            <p class="text-sm" style="color:${storefront.ink}">${escapeHtml(p.name)}</p>
            <p class="text-xs font-medium" style="color:${storefront.accent}">${escapeHtml(formatPKR(p.price))}</p>
            <button
              class="fz-add-to-cart mt-1 rounded-full px-3 py-1.5 text-xs font-medium"
              style="border:1px solid ${storefront.accent};color:${storefront.accent};background:transparent"
              data-id="${escapeHtml(p.id)}"
              data-name="${escapeHtml(p.name)}"
              data-price="${p.price}"
            >Add to cart</button>
          </div>`
        )
        .join("\n");

      return `<section class="px-6 py-12 md:px-14" style="background:${storefront.surface}">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-2xl" style="font-family:var(--font-display);color:${storefront.ink}">${escapeHtml(block.heading)}</h2>
            <p class="text-sm mt-1" style="color:${storefront.muted}">${escapeHtml(block.subheading)}</p>
          </div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">${cards}</div>
      </section>`;
    }

    case "about":
      return `<section class="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 py-14 md:px-14 items-center">
        ${imagePlaceholder(block.imageNote, "h-56 md:h-72 rounded-xl order-2 md:order-1")}
        <div class="order-1 md:order-2">
          <h2 class="text-2xl md:text-3xl mb-4" style="font-family:var(--font-display);color:${storefront.ink}">${escapeHtml(block.heading)}</h2>
          <p class="text-sm md:text-base leading-relaxed" style="color:${storefront.muted}">${escapeHtml(block.body)}</p>
        </div>
      </section>`;

    case "testimonial":
      return `<section class="px-6 py-14 md:px-14 text-center flex flex-col items-center gap-4" style="background:${storefront.accentSoft}">
        <p class="text-lg md:text-xl max-w-xl italic leading-relaxed" style="font-family:var(--font-display);color:${storefront.ink}">&ldquo;${escapeHtml(block.quote)}&rdquo;</p>
        <p class="text-xs" style="color:${storefront.muted}">${escapeHtml(block.author)} · ${escapeHtml(block.authorContext)}</p>
      </section>`;

    case "newsletter":
      return `<section class="px-6 py-14 md:px-14 text-center flex flex-col items-center gap-4">
        <h2 class="text-2xl" style="font-family:var(--font-display);color:${storefront.ink}">${escapeHtml(block.heading)}</h2>
        <p class="text-sm max-w-sm" style="color:${storefront.muted}">${escapeHtml(block.subheading)}</p>
        <div class="flex w-full max-w-sm gap-2">
          <input disabled placeholder="you@email.com" class="flex-1 rounded-full border px-4 py-2 text-sm" style="border-color:${storefront.border};color:${storefront.muted}" />
          <button class="rounded-full px-5 py-2 text-sm font-medium text-white shrink-0" style="background:${storefront.accent}">${escapeHtml(block.buttonText)}</button>
        </div>
      </section>`;

    case "footer":
      return `<footer class="px-6 py-10 md:px-14 flex flex-col md:flex-row md:items-center md:justify-between gap-3" style="background:${storefront.ink};color:${storefront.bg}">
        <div>
          <p class="text-base" style="font-family:var(--font-display)">${escapeHtml(block.businessName)}</p>
          <p class="text-xs opacity-70 mt-0.5">${escapeHtml(block.tagline)}</p>
        </div>
        <div class="text-xs opacity-70 flex flex-col md:items-end gap-0.5">
          <span>${escapeHtml(block.city)}</span>
          <span>${escapeHtml(block.instagramHandle)}</span>
        </div>
      </footer>`;
  }
}

/**
 * Renders the current block list to a standalone, deployable HTML document
 * via plain string templates (not React SSR — App Router route handlers
 * run under React's "react-server" condition, which disallows importing
 * react-dom/server, so this intentionally does not reuse <SitePreview>).
 * Keep the markup here in sync with site-preview.tsx by hand if that
 * component's structure changes.
 *
 * Includes a real cart: vanilla JS (no framework at runtime), cart
 * persisted in localStorage, add/remove/adjust quantity all work.
 * Checkout is intentionally disabled ("Checkout coming soon") — payment
 * processing was deliberately removed pending a different provider, see
 * CLAUDE.md's Website Builder notes for why Stripe was pulled out.
 *
 * Honest limitation: layout classes are Tailwind utility classes with no
 * build step to compile them, this loads Tailwind via the public CDN
 * script (`cdn.tailwindcss.com`) at runtime instead. Fine for a quick
 * deploy/preview, not what you'd want serving real production traffic —
 * swap for a proper compiled stylesheet before this is Florenza's real
 * storefront.
 */
export function renderSiteHtml(blocks: Block[]): string {
  const footer = blocks.find((b): b is Extract<Block, { type: "footer" }> => b.type === "footer");
  const title = footer?.businessName ?? "Florenza Flourish";
  const description = footer?.tagline ?? "Luxury floral gifting.";

  const bodyMarkup = blocks.map(renderBlock).join("\n");
  const hasProducts = blocks.some((b) => b.type === "featured-products");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Manrope:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    :root { --font-display: 'Fraunces', ui-serif, Georgia, serif; }
    body { margin: 0; font-family: 'Manrope', ui-sans-serif, system-ui, sans-serif; background: ${storefront.bg}; }
    #fz-cart-drawer { display: none; }
    #fz-cart-drawer.open { display: flex; }
  </style>
</head>
<body>
${hasProducts ? cartBarMarkup() : ""}
${bodyMarkup}
${hasProducts ? cartDrawerMarkup() : ""}
${hasProducts ? `<script>${cartScript()}</script>` : ""}
</body>
</html>`;
}

function cartBarMarkup(): string {
  return `<div style="position:sticky;top:0;z-index:10;display:flex;justify-content:flex-end;padding:12px 16px;background:${storefront.bg}">
    <button id="fz-cart-toggle" style="position:relative;display:flex;align-items:center;gap:6px;border-radius:9999px;padding:6px 12px;font-size:12px;font-weight:500;border:1px solid ${storefront.border};color:${storefront.ink};background:${storefront.surface}">
      Cart <span id="fz-cart-count" style="display:none;position:absolute;right:-6px;top:-6px;width:16px;height:16px;border-radius:9999px;background:${storefront.accent};color:white;font-size:10px;align-items:center;justify-content:center;">0</span>
    </button>
  </div>`;
}

function cartDrawerMarkup(): string {
  return `<div id="fz-cart-drawer" style="position:fixed;inset:0;z-index:20;justify-content:flex-end;background:rgba(36,29,21,0.45)">
    <div style="height:100%;width:100%;max-width:384px;display:flex;flex-direction:column;background:${storefront.surface}">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid ${storefront.border}">
        <p style="font-size:14px;font-weight:500;color:${storefront.ink}">Your cart</p>
        <button id="fz-cart-close" style="color:${storefront.muted}">&times;</button>
      </div>
      <div id="fz-cart-items" style="flex:1;overflow-y:auto;padding:16px 20px;display:flex;flex-direction:column;gap:12px;"></div>
      <div style="padding:16px 20px;border-top:1px solid ${storefront.border};display:flex;flex-direction:column;gap:12px;">
        <div style="display:flex;justify-content:space-between;font-size:14px;">
          <span style="color:${storefront.muted}">Subtotal</span>
          <span id="fz-cart-subtotal" style="color:${storefront.ink}">Rs 0</span>
        </div>
        <button disabled style="display:flex;align-items:center;justify-content:center;gap:8px;border-radius:9999px;padding:10px 20px;font-size:14px;font-weight:500;color:white;background:${storefront.accent};opacity:0.5;cursor:not-allowed;">Checkout coming soon</button>
        <p style="font-size:11px;text-align:center;color:${storefront.muted}">Payment processing isn't connected yet.</p>
      </div>
    </div>
  </div>`;
}

/**
 * Cart state lives in localStorage under "fz-cart" (fine here — this is a
 * real deployed static site's own runtime JS, not a Claude.ai artifact,
 * localStorage is the correct and standard choice for a client-side cart).
 */
function cartScript(): string {
  return `
(function () {
  var STORAGE_KEY = "fz-cart";
  function getCart() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch (e) { return []; } }
  function setCart(cart) { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); render(); }
  function formatMoney(n) { return "Rs " + Number(n).toLocaleString("en-PK"); }

  function render() {
    var cart = getCart();
    var count = cart.reduce(function (s, i) { return s + i.quantity; }, 0);
    var countEl = document.getElementById("fz-cart-count");
    countEl.style.display = count > 0 ? "flex" : "none";
    countEl.textContent = count;

    var itemsEl = document.getElementById("fz-cart-items");
    itemsEl.innerHTML = "";
    if (cart.length === 0) {
      itemsEl.innerHTML = '<p style="font-size:12px;text-align:center;margin-top:16px;color:${storefront.muted}">Nothing in the cart yet.</p>';
    }
    var subtotal = 0;
    cart.forEach(function (item) {
      subtotal += item.price * item.quantity;
      var row = document.createElement("div");
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.gap = "12px";
      row.innerHTML =
        '<div style="flex:1;min-width:0"><p style="font-size:14px;color:${storefront.ink}">' + item.name + '</p>' +
        '<p style="font-size:12px;color:${storefront.accent}">' + formatMoney(item.price) + '</p></div>' +
        '<button data-action="dec" data-id="' + item.id + '" style="border:1px solid ${storefront.border};border-radius:4px;padding:2px 6px;color:${storefront.ink}">-</button>' +
        '<span style="width:16px;text-align:center;font-size:12px;color:${storefront.ink}">' + item.quantity + '</span>' +
        '<button data-action="inc" data-id="' + item.id + '" style="border:1px solid ${storefront.border};border-radius:4px;padding:2px 6px;color:${storefront.ink}">+</button>' +
        '<button data-action="remove" data-id="' + item.id + '" style="color:${storefront.muted}">&times;</button>';
      itemsEl.appendChild(row);
    });
    document.getElementById("fz-cart-subtotal").textContent = formatMoney(subtotal);
  }

  document.addEventListener("click", function (e) {
    var target = e.target;
    if (target.classList.contains("fz-add-to-cart")) {
      var id = target.getAttribute("data-id");
      var name = target.getAttribute("data-name");
      var price = Number(target.getAttribute("data-price"));
      var cart = getCart();
      var existing = cart.find(function (i) { return i.id === id; });
      if (existing) { existing.quantity += 1; } else { cart.push({ id: id, name: name, price: price, quantity: 1 }); }
      setCart(cart);
      document.getElementById("fz-cart-drawer").classList.add("open");
    }
    if (target.id === "fz-cart-toggle") document.getElementById("fz-cart-drawer").classList.add("open");
    if (target.id === "fz-cart-close" || target.id === "fz-cart-drawer") document.getElementById("fz-cart-drawer").classList.remove("open");
    if (target.getAttribute("data-action") === "inc" || target.getAttribute("data-action") === "dec") {
      var cid = target.getAttribute("data-id");
      var delta = target.getAttribute("data-action") === "inc" ? 1 : -1;
      var c = getCart().map(function (i) { return i.id === cid ? Object.assign({}, i, { quantity: i.quantity + delta }) : i; }).filter(function (i) { return i.quantity > 0; });
      setCart(c);
    }
    if (target.getAttribute("data-action") === "remove") {
      var rid = target.getAttribute("data-id");
      setCart(getCart().filter(function (i) { return i.id !== rid; }));
    }
  });

  render();
})();`;
}
