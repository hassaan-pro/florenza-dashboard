import { seedProducts, formatPKR } from "@/lib/product-data";
import { storefront, type Block, type Site } from "@/lib/website-data";

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

function productCard(p: (typeof seedProducts)[number]): string {
  return `<div class="flex flex-col gap-2">
    <a href="product.html?id=${escapeHtml(p.id)}">
      ${imagePlaceholder(p.tier, "aspect-square rounded-lg")}
      <p class="text-sm mt-2" style="color:${storefront.ink}">${escapeHtml(p.name)}</p>
      <p class="text-xs font-medium" style="color:${storefront.accent}">${escapeHtml(formatPKR(p.price))}</p>
    </a>
    <button class="fz-add-to-cart rounded-full px-3 py-1.5 text-xs font-medium" style="border:1px solid ${storefront.accent};color:${storefront.accent};background:transparent"
      data-id="${escapeHtml(p.id)}" data-name="${escapeHtml(p.name)}" data-price="${p.price}">Add to cart</button>
  </div>`;
}

function navBar(): string {
  return `<div style="position:sticky;top:0;z-index:10;display:flex;align-items:center;justify-content:space-between;padding:14px 24px;background:${storefront.bg};border-bottom:1px solid ${storefront.border}">
    <a href="index.html" style="display:flex;align-items:center;gap:8px;text-decoration:none;">
      <span style="font-family:var(--font-display);font-size:14px;color:${storefront.ink}">Florenza</span>
    </a>
    <div style="display:flex;align-items:center;gap:20px;">
      <a href="index.html" style="font-size:12px;color:${storefront.ink};text-decoration:none;">Home</a>
      <a href="shop.html" style="font-size:12px;color:${storefront.ink};text-decoration:none;">Shop</a>
      <a href="cart.html" style="position:relative;display:flex;align-items:center;gap:6px;border-radius:9999px;padding:6px 12px;font-size:12px;font-weight:500;border:1px solid ${storefront.border};color:${storefront.ink};background:${storefront.surface};text-decoration:none;">
        Cart <span id="fz-cart-count" style="display:none;position:absolute;right:-6px;top:-6px;width:16px;height:16px;border-radius:9999px;background:${storefront.accent};color:white;font-size:10px;align-items:center;justify-content:center;">0</span>
      </a>
    </div>
  </div>`;
}

function footerHtml(footer: Extract<Block, { type: "footer" }> | undefined): string {
  if (!footer) return "";
  return `<footer style="padding:40px 24px;display:flex;flex-direction:column;gap:12px;background:${storefront.ink};color:${storefront.bg}">
    <div>
      <p style="font-family:var(--font-display);font-size:16px;">${escapeHtml(footer.businessName)}</p>
      <p style="font-size:12px;opacity:0.7;margin-top:2px;">${escapeHtml(footer.tagline)}</p>
    </div>
    <div style="font-size:12px;opacity:0.7;">
      <span>${escapeHtml(footer.city)}</span> · <span>${escapeHtml(footer.instagramHandle)}</span>
    </div>
  </footer>`;
}

function renderHomeBlock(block: Block): string {
  switch (block.type) {
    case "hero":
      return `<section class="flex flex-col gap-6 px-6 py-14 md:px-14 md:py-20 items-start">
        <span class="text-xs font-medium uppercase" style="letter-spacing:0.14em;color:${storefront.accent}">${escapeHtml(block.eyebrow)}</span>
        <h1 class="text-3xl md:text-5xl leading-tight max-w-xl" style="font-family:var(--font-display);color:${storefront.ink}">${escapeHtml(block.headline)}</h1>
        <p class="text-sm md:text-base max-w-md leading-relaxed" style="color:${storefront.muted}">${escapeHtml(block.subheadline)}</p>
        <a href="shop.html" class="rounded-full px-6 py-2.5 text-sm font-medium text-white" style="display:inline-block;text-decoration:none;background:${storefront.accent}">${escapeHtml(block.ctaText)}</a>
        ${imagePlaceholder(block.imageNote, "mt-4 h-56 w-full rounded-xl")}
      </section>`;

    case "featured-products": {
      const products = seedProducts.filter((p) => block.productIds.includes(p.id));
      const shown = products.length > 0 ? products : seedProducts.slice(0, 4);
      return `<section class="px-6 py-12 md:px-14" style="background:${storefront.surface}">
        <div class="mb-6">
          <h2 class="text-2xl" style="font-family:var(--font-display);color:${storefront.ink}">${escapeHtml(block.heading)}</h2>
          <p class="text-sm mt-1" style="color:${storefront.muted}">${escapeHtml(block.subheading)}</p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">${shown.map(productCard).join("\n")}</div>
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
      return ""; // rendered once globally via footerHtml(), not inline in the block stack
  }
}

function documentShell(title: string, description: string, bodyMarkup: string, extraScript: string): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    :root { --font-display: 'Fraunces', ui-serif, Georgia, serif; }
    body { margin: 0; font-family: 'Manrope', ui-sans-serif, system-ui, sans-serif; background: ${storefront.bg}; }
  </style>
</head>
<body>
${bodyMarkup}
<script>${cartScript()}${extraScript}</script>
</body>
</html>`;
}

/**
 * Cart lives in localStorage under "fz-cart", shared across all four
 * static pages since they're same-origin — no SPA router needed, plain
 * links + a page reload is enough, this is a real deployed multi-page
 * site, not a single-page app.
 */
function cartScript(): string {
  return `
(function () {
  var STORAGE_KEY = "fz-cart";
  function getCart() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch (e) { return []; } }
  function setCart(cart) { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); if (window.__fzRenderCart) window.__fzRenderCart(); renderCount(); }
  function formatMoney(n) { return "Rs " + Number(n).toLocaleString("en-PK"); }
  function renderCount() {
    var cart = getCart();
    var count = cart.reduce(function (s, i) { return s + i.quantity; }, 0);
    var el = document.getElementById("fz-cart-count");
    if (!el) return;
    el.style.display = count > 0 ? "flex" : "none";
    el.textContent = count;
  }
  document.addEventListener("click", function (e) {
    var target = e.target;
    if (target.classList && target.classList.contains("fz-add-to-cart")) {
      e.preventDefault();
      var id = target.getAttribute("data-id");
      var name = target.getAttribute("data-name");
      var price = Number(target.getAttribute("data-price"));
      var cart = getCart();
      var existing = cart.find(function (i) { return i.id === id; });
      if (existing) { existing.quantity += 1; } else { cart.push({ id: id, name: name, price: price, quantity: 1 }); }
      setCart(cart);
    }
  });
  window.__fzGetCart = getCart;
  window.__fzSetCart = setCart;
  window.__fzFormatMoney = formatMoney;
  renderCount();
})();`;
}

function homePageHtml(site: Site, title: string, description: string): string {
  const body = `${navBar()}
${site.home.filter((b) => b.type !== "footer").map(renderHomeBlock).join("\n")}
${footerHtml(site.home.find((b): b is Extract<Block, { type: "footer" }> => b.type === "footer"))}`;
  return documentShell(title, description, body, "");
}

function shopPageHtml(site: Site, title: string): string {
  const body = `${navBar()}
<section class="px-6 py-12 md:px-14">
  <h1 class="text-3xl mb-2" style="font-family:var(--font-display);color:${storefront.ink}">${escapeHtml(site.shop.heading)}</h1>
  <p class="text-sm mb-8" style="color:${storefront.muted}">${escapeHtml(site.shop.subheading)}</p>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-5">${seedProducts.map(productCard).join("\n")}</div>
</section>
${footerHtml(site.home.find((b): b is Extract<Block, { type: "footer" }> => b.type === "footer"))}`;
  return documentShell(title, "The full Florenza collection.", body, "");
}

function productPageHtml(site: Site, title: string): string {
  const productsJson = JSON.stringify(seedProducts).replace(/</g, "\\u003c");
  const body = `${navBar()}
<section class="px-6 py-10 md:px-14">
  <a href="shop.html" style="display:inline-flex;align-items:center;gap:6px;font-size:12px;margin-bottom:24px;color:${storefront.muted};text-decoration:none;">&larr; Back to shop</a>
  <div id="fz-product-root" class="grid grid-cols-1 md:grid-cols-2 gap-10"></div>
</section>
${footerHtml(site.home.find((b): b is Extract<Block, { type: "footer" }> => b.type === "footer"))}`;

  const script = `
(function () {
  var products = ${productsJson};
  var params = new URLSearchParams(window.location.search);
  var id = params.get("id");
  var product = products.find(function (p) { return p.id === id; }) || products[0];
  var root = document.getElementById("fz-product-root");
  if (!product) { root.innerHTML = "<p style=\\"color:${storefront.muted}\\">Product not found.</p>"; return; }
  root.innerHTML =
    '<div style="aspect-ratio:1;border-radius:12px;background:linear-gradient(135deg, ${storefront.accentSoft}, ${storefront.border});border:1px solid ${storefront.border};display:flex;align-items:center;justify-content:center;padding:24px;text-align:center;">' +
      '<p style="font-size:12px;color:${storefront.muted}">' + product.tier + ' tier arrangement</p></div>' +
    '<div style="display:flex;flex-direction:column;gap:16px;">' +
      '<span style="font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:0.05em;color:${storefront.accent}">' + product.tier + '</span>' +
      '<h1 style="font-family:var(--font-display);font-size:28px;color:${storefront.ink}">' + product.name + '</h1>' +
      '<p style="font-size:20px;color:${storefront.accent}">' + window.__fzFormatMoney(product.price) + '</p>' +
      '<p style="font-size:14px;line-height:1.6;color:${storefront.muted}">A ' + product.tier.toLowerCase() + '-tier arrangement from the Florenza catalogue, composed same-day with real flowers, documentary-style, no stock imagery.</p>' +
      '<button class="fz-add-to-cart" data-id="' + product.id + '" data-name="' + product.name + '" data-price="' + product.price + '" style="width:fit-content;border-radius:9999px;padding:10px 24px;font-size:14px;font-weight:500;color:white;background:${storefront.accent};border:none;cursor:pointer;">Add to cart</button>' +
    '</div>';
  document.title = product.name + " — Florenza";
})();`;

  return documentShell(title, "Product details.", body, script);
}

function cartPageHtml(site: Site, title: string): string {
  const body = `${navBar()}
<section class="px-6 py-12 md:px-14" style="max-width:640px;margin:0 auto;">
  <h1 class="text-3xl mb-8" style="font-family:var(--font-display);color:${storefront.ink}">Your cart</h1>
  <div id="fz-cart-root"></div>
</section>
${footerHtml(site.home.find((b): b is Extract<Block, { type: "footer" }> => b.type === "footer"))}`;

  const script = `
(function () {
  function render() {
    var cart = window.__fzGetCart();
    var root = document.getElementById("fz-cart-root");
    if (cart.length === 0) {
      root.innerHTML = '<div style="text-align:center;padding:40px 0;"><p style="font-size:14px;margin-bottom:16px;color:${storefront.muted}">Nothing in the cart yet.</p><a href="shop.html" style="font-size:12px;text-decoration:underline;color:${storefront.accent}">Continue shopping</a></div>';
      return;
    }
    var subtotal = cart.reduce(function (s, i) { return s + i.price * i.quantity; }, 0);
    var rows = cart.map(function (item) {
      return '<div style="display:flex;align-items:center;gap:16px;padding:12px 0;border-bottom:1px solid ${storefront.border};">' +
        '<div style="flex:1;min-width:0"><p style="font-size:14px;color:${storefront.ink}">' + item.name + '</p><p style="font-size:12px;color:${storefront.accent}">' + window.__fzFormatMoney(item.price) + '</p></div>' +
        '<button data-action="dec" data-id="' + item.id + '" style="border:1px solid ${storefront.border};border-radius:6px;padding:4px 8px;color:${storefront.ink};background:none;cursor:pointer;">-</button>' +
        '<span style="width:20px;text-align:center;font-size:14px;color:${storefront.ink}">' + item.quantity + '</span>' +
        '<button data-action="inc" data-id="' + item.id + '" style="border:1px solid ${storefront.border};border-radius:6px;padding:4px 8px;color:${storefront.ink};background:none;cursor:pointer;">+</button>' +
        '<button data-action="remove" data-id="' + item.id + '" style="color:${storefront.muted};background:none;border:none;cursor:pointer;">&times;</button></div>';
    }).join("");
    root.innerHTML = rows +
      '<div style="display:flex;justify-content:space-between;padding-top:16px;"><span style="font-size:14px;color:${storefront.muted}">Subtotal</span><span style="font-family:var(--font-display);font-size:18px;color:${storefront.ink}">' + window.__fzFormatMoney(subtotal) + '</span></div>' +
      '<button disabled style="margin-top:16px;width:100%;border-radius:9999px;padding:12px 24px;font-size:14px;font-weight:500;color:white;background:${storefront.accent};opacity:0.5;cursor:not-allowed;border:none;">Checkout coming soon</button>' +
      '<p style="margin-top:8px;font-size:11px;text-align:center;color:${storefront.muted}">Payment processing isn\\'t connected yet.</p>';
  }
  document.addEventListener("click", function (e) {
    var t = e.target;
    var action = t.getAttribute && t.getAttribute("data-action");
    if (!action) return;
    var id = t.getAttribute("data-id");
    var cart = window.__fzGetCart();
    if (action === "inc" || action === "dec") {
      var delta = action === "inc" ? 1 : -1;
      cart = cart.map(function (i) { return i.id === id ? Object.assign({}, i, { quantity: i.quantity + delta }) : i; }).filter(function (i) { return i.quantity > 0; });
    } else if (action === "remove") {
      cart = cart.filter(function (i) { return i.id !== id; });
    }
    window.__fzSetCart(cart);
  });
  window.__fzRenderCart = render;
  render();
})();`;

  return documentShell(title, "Your Florenza cart.", body, script);
}

/**
 * Renders the current site to a set of standalone, deployable HTML pages
 * via plain string templates (not React SSR — App Router route handlers
 * run under React's "react-server" condition, which disallows importing
 * react-dom/server, so this intentionally does not reuse <SitePreview>).
 * Keep this in sync with site-preview.tsx by hand if that changes.
 *
 * Four real pages, matching the in-app builder: index.html (Home),
 * shop.html (full catalogue), product.html (reads ?id= client-side),
 * cart.html (full cart page). Cart state is shared across all four via
 * localStorage, same origin, plain links, no SPA router needed.
 *
 * Checkout is intentionally absent — see CLAUDE.md's Website Builder
 * notes on why Stripe was removed. Cart pages ship a disabled
 * "Checkout coming soon" button.
 */
export function renderSiteFiles(site: Site): Record<string, string> {
  const footer = site.home.find((b): b is Extract<Block, { type: "footer" }> => b.type === "footer");
  const title = footer?.businessName ?? "Florenza Flourish";
  const description = footer?.tagline ?? "Luxury floral gifting.";

  return {
    "index.html": homePageHtml(site, title, description),
    "shop.html": shopPageHtml(site, `Shop — ${title}`),
    "product.html": productPageHtml(site, `Product — ${title}`),
    "cart.html": cartPageHtml(site, `Cart — ${title}`),
  };
}
