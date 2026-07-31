import { formatPKR, type Product, type Tier } from "@/lib/product-data";
import { storefront, tierCopy, type Block, type Site } from "@/lib/website-data";

const tiers: Tier[] = ["Classic", "Signature", "Luxury"];

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function imageOrPlaceholder(imageUrl: string | undefined, note: string, className: string): string {
  if (imageUrl) {
    return `<img src="${escapeHtml(imageUrl)}" alt="" class="${className} object-cover" />`;
  }
  return `<div class="${className}" style="background:linear-gradient(135deg, ${storefront.accentSoft}, ${storefront.border});border:1px solid ${storefront.border};">
    <div class="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
      <p class="text-xs" style="color:${storefront.muted}">${escapeHtml(note)}</p>
    </div>
  </div>`;
}

function productCard(p: Product): string {
  return `<div class="flex flex-col gap-2" data-fz-reveal>
    <a href="product.html?id=${escapeHtml(p.id)}">
      ${imageOrPlaceholder(p.imageUrl, p.tier, "aspect-square rounded-lg w-full")}
      <p class="text-sm mt-2" style="color:${storefront.ink}">${escapeHtml(p.name)}</p>
      <p class="text-xs font-medium" style="color:${storefront.accent}">${escapeHtml(formatPKR(p.price))}</p>
    </a>
    <button
      class="fz-add-to-cart rounded-full px-3 py-1.5 text-xs font-medium"
      style="border:1px solid ${storefront.accent};color:${storefront.accent};background:transparent"
      data-id="${escapeHtml(p.id)}" data-name="${escapeHtml(p.name)}" data-price="${p.price}"
    >Add to cart</button>
  </div>`;
}

function announcementBar(text: string): string {
  const repeated = `${text}      ·      ${text}      ·      ${text}      ·      `;
  return `<div style="overflow:hidden;padding:8px 0;background:${storefront.ink};color:${storefront.bg}">
    <div class="fz-marquee-track">
      <span style="font-size:11px;white-space:nowrap;padding:0 16px;">${escapeHtml(repeated)}</span>
      <span style="font-size:11px;white-space:nowrap;padding:0 16px;" aria-hidden="true">${escapeHtml(repeated)}</span>
    </div>
  </div>`;
}

function navBar(logoText: string): string {
  return `<div style="position:sticky;top:0;z-index:10;background:${storefront.bg};border-bottom:1px solid ${storefront.border}">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 24px;">
      <a href="index.html" style="display:flex;align-items:center;gap:8px;text-decoration:none;">
        <span style="font-family:var(--font-display);font-size:14px;color:${storefront.ink}">${escapeHtml(logoText)}</span>
      </a>
      <div class="hidden md:flex" style="align-items:center;gap:20px;">
        <a href="index.html" style="font-size:12px;color:${storefront.ink};text-decoration:none;">Home</a>
        <a href="shop.html" style="font-size:12px;color:${storefront.ink};text-decoration:none;">Shop</a>
        <a href="cart.html" style="position:relative;display:flex;align-items:center;gap:6px;border-radius:9999px;padding:6px 12px;font-size:12px;font-weight:500;border:1px solid ${storefront.border};color:${storefront.ink};background:${storefront.surface};text-decoration:none;">
          Cart <span id="fz-cart-count" style="display:none;position:absolute;right:-6px;top:-6px;width:16px;height:16px;border-radius:9999px;background:${storefront.accent};color:white;font-size:10px;align-items:center;justify-content:center;">0</span>
        </a>
      </div>
      <div class="flex md:hidden" style="align-items:center;gap:14px;">
        <a href="cart.html" style="position:relative;color:${storefront.ink};text-decoration:none;">
          Cart <span id="fz-cart-count-m" style="display:none;position:absolute;right:-10px;top:-6px;width:14px;height:14px;border-radius:9999px;background:${storefront.accent};color:white;font-size:9px;align-items:center;justify-content:center;">0</span>
        </a>
        <button id="fz-mobile-toggle" style="background:none;border:none;color:${storefront.ink};font-size:20px;line-height:1;cursor:pointer;">&#9776;</button>
      </div>
    </div>
    <div id="fz-mobile-menu" style="display:none;flex-direction:column;padding:12px 24px;gap:10px;border-top:1px solid ${storefront.border}">
      <a href="index.html" style="font-size:14px;color:${storefront.ink};text-decoration:none;">Home</a>
      <a href="shop.html" style="font-size:14px;color:${storefront.ink};text-decoration:none;">Shop</a>
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

function renderHomeBlock(block: Block, products: Product[]): string {
  switch (block.type) {
    case "hero":
      return `<section class="px-6 py-14 md:px-14 md:py-20 flex flex-col gap-6 items-start" data-fz-reveal>
        <span class="text-xs font-medium uppercase" style="letter-spacing:0.14em;color:${storefront.accent}">${escapeHtml(block.eyebrow)}</span>
        <h1 class="text-3xl md:text-5xl leading-tight max-w-xl" style="font-family:var(--font-display);color:${storefront.ink}">${escapeHtml(block.headline)}</h1>
        <p class="text-sm md:text-base max-w-md leading-relaxed" style="color:${storefront.muted}">${escapeHtml(block.subheadline)}</p>
        <a href="shop.html" class="rounded-full px-6 py-2.5 text-sm font-medium text-white" style="display:inline-block;text-decoration:none;background:${storefront.accent}">${escapeHtml(block.ctaText)}</a>
        ${imageOrPlaceholder(block.imageUrl, block.imageNote, "mt-4 h-56 md:h-80 w-full rounded-xl")}
      </section>`;

    case "featured-products": {
      const picked = products.filter((p) => block.productIds.includes(p.id));
      const shown = picked.length > 0 ? picked : products.slice(0, 4);
      return `<section class="px-6 py-12 md:px-14" style="background:${storefront.surface}" data-fz-reveal>
        <div class="mb-6">
          <h2 class="text-2xl" style="font-family:var(--font-display);color:${storefront.ink}">${escapeHtml(block.heading)}</h2>
          <p class="text-sm mt-1" style="color:${storefront.muted}">${escapeHtml(block.subheading)}</p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">${shown.map(productCard).join("\n")}</div>
      </section>`;
    }

    case "category-showcase": {
      const cards = tiers
        .map((tier) => {
          const tierProducts = products.filter((p) => p.tier === tier);
          const minPrice = tierProducts.length > 0 ? Math.min(...tierProducts.map((p) => p.price)) : 0;
          return `<a href="shop.html?tier=${escapeHtml(tier)}" style="display:flex;flex-direction:column;gap:12px;border-radius:12px;padding:24px;text-decoration:none;background:${storefront.accentSoft};border:1px solid ${storefront.border};">
            <span style="font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:0.05em;color:${storefront.accent}">${tier}</span>
            <p style="font-size:14px;line-height:1.6;color:${storefront.ink}">${escapeHtml(tierCopy[tier].blurb)}</p>
            ${tierProducts.length > 0 ? `<p style="font-size:12px;color:${storefront.muted}">From ${escapeHtml(formatPKR(minPrice))}</p>` : ""}
          </a>`;
        })
        .join("\n");
      return `<section class="px-6 py-14 md:px-14" data-fz-reveal>
        <div style="margin-bottom:32px;">
          <h2 class="text-2xl" style="font-family:var(--font-display);color:${storefront.ink}">${escapeHtml(block.heading)}</h2>
          <p class="text-sm mt-1" style="color:${storefront.muted}">${escapeHtml(block.subheading)}</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">${cards}</div>
      </section>`;
    }

    case "about":
      return `<section class="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 py-14 md:px-14 items-center" data-fz-reveal>
        ${imageOrPlaceholder(block.imageUrl, block.imageNote, "h-56 md:h-72 w-full rounded-xl")}
        <div>
          <h2 class="text-2xl md:text-3xl mb-4" style="font-family:var(--font-display);color:${storefront.ink}">${escapeHtml(block.heading)}</h2>
          <p class="text-sm md:text-base leading-relaxed" style="color:${storefront.muted}">${escapeHtml(block.body)}</p>
        </div>
      </section>`;

    case "testimonial":
      return `<section class="px-6 py-14 md:px-14 text-center flex flex-col items-center gap-4" style="background:${storefront.accentSoft}" data-fz-reveal>
        <p class="text-lg md:text-xl max-w-xl italic leading-relaxed" style="font-family:var(--font-display);color:${storefront.ink}">&ldquo;${escapeHtml(block.quote)}&rdquo;</p>
        <p class="text-xs" style="color:${storefront.muted}">${escapeHtml(block.author)} · ${escapeHtml(block.authorContext)}</p>
      </section>`;

    case "newsletter":
      return `<section class="px-6 py-14 md:px-14 text-center flex flex-col items-center gap-4" data-fz-reveal>
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
    @keyframes fz-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
    .fz-marquee-track { animation: fz-marquee 22s linear infinite; display: flex; width: max-content; }
    [data-fz-reveal] { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease-out, transform 0.7s ease-out; }
    [data-fz-reveal].fz-visible { opacity: 1; transform: translateY(0); }
    @media (min-width: 768px) { .hidden.md\\:flex { display: flex !important; } .md\\:hidden { display: none !important; } }
  </style>
</head>
<body>
${bodyMarkup}
<script>${sharedScript()}${extraScript}</script>
</body>
</html>`;
}

/**
 * Shared across all 4 pages: cart (localStorage), scroll-reveal
 * (IntersectionObserver adding .fz-visible to [data-fz-reveal]
 * elements), and the mobile nav hamburger toggle.
 */
function sharedScript(): string {
  return `
(function () {
  var STORAGE_KEY = "fz-cart";
  function getCart() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch (e) { return []; } }
  function setCart(cart) { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); if (window.__fzRenderCart) window.__fzRenderCart(); renderCount(); }
  function formatMoney(n) { return "Rs " + Number(n).toLocaleString("en-PK"); }
  function renderCount() {
    var cart = getCart();
    var count = cart.reduce(function (s, i) { return s + i.quantity; }, 0);
    ["fz-cart-count", "fz-cart-count-m"].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.style.display = count > 0 ? "flex" : "none";
      el.textContent = count;
    });
  }
  document.addEventListener("click", function (e) {
    var target = e.target;
    if (target.id === "fz-mobile-toggle") {
      var menu = document.getElementById("fz-mobile-menu");
      menu.style.display = menu.style.display === "flex" ? "none" : "flex";
    }
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

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("fz-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll("[data-fz-reveal]").forEach(function (el) { observer.observe(el); });
  } else {
    document.querySelectorAll("[data-fz-reveal]").forEach(function (el) { el.classList.add("fz-visible"); });
  }
})();`;
}

function homePageHtml(site: Site, products: Product[], title: string, description: string): string {
  const body = `${site.header.showAnnouncement ? announcementBar(site.header.announcementText) : ""}
${navBar(site.header.logoText)}
${site.home.filter((b) => b.type !== "footer").map((b) => renderHomeBlock(b, products)).join("\n")}
${footerHtml(site.home.find((b): b is Extract<Block, { type: "footer" }> => b.type === "footer"))}`;
  return documentShell(title, description, body, "");
}

function shopPageHtml(site: Site, products: Product[], title: string): string {
  const productsJson = JSON.stringify(products).replace(/</g, "\\u003c");
  const body = `${site.header.showAnnouncement ? announcementBar(site.header.announcementText) : ""}
${navBar(site.header.logoText)}
<section class="px-6 py-12 md:px-14">
  <h1 class="text-3xl mb-2" style="font-family:var(--font-display);color:${storefront.ink}">${escapeHtml(site.shop.heading)}</h1>
  <p class="text-sm mb-6" style="color:${storefront.muted}">${escapeHtml(site.shop.subheading)}</p>
  <div id="fz-shop-filters" style="display:flex;gap:8px;margin-bottom:32px;"></div>
  <div id="fz-shop-grid" class="grid grid-cols-2 md:grid-cols-4 gap-5"></div>
</section>
${footerHtml(site.home.find((b): b is Extract<Block, { type: "footer" }> => b.type === "footer"))}`;

  const script = `
(function () {
  var products = ${productsJson};
  var tiers = ["All", "Classic", "Signature", "Luxury"];
  var params = new URLSearchParams(window.location.search);
  var current = params.get("tier") || "All";

  function cardHtml(p) {
    var img = p.imageUrl
      ? '<img src="' + p.imageUrl + '" alt="" class="aspect-square rounded-lg w-full object-cover" />'
      : '<div class="aspect-square rounded-lg w-full" style="background:linear-gradient(135deg, ${storefront.accentSoft}, ${storefront.border});border:1px solid ${storefront.border};display:flex;align-items:center;justify-content:center;padding:12px;text-align:center;"><p style="font-size:12px;color:${storefront.muted}">' + p.tier + '</p></div>';
    return '<div class="flex flex-col gap-2" data-fz-reveal>' +
      '<a href="product.html?id=' + p.id + '">' + img +
      '<p class="text-sm mt-2" style="color:${storefront.ink}">' + p.name + '</p>' +
      '<p class="text-xs font-medium" style="color:${storefront.accent}">' + window.__fzFormatMoney(p.price) + '</p></a>' +
      '<button class="fz-add-to-cart rounded-full px-3 py-1.5 text-xs font-medium" style="border:1px solid ${storefront.accent};color:${storefront.accent};background:transparent" data-id="' + p.id + '" data-name="' + p.name + '" data-price="' + p.price + '">Add to cart</button></div>';
  }

  function render() {
    var filterEl = document.getElementById("fz-shop-filters");
    filterEl.innerHTML = tiers.map(function (t) {
      var active = t === current;
      return '<button data-tier="' + t + '" style="border-radius:9999px;padding:6px 14px;font-size:12px;font-weight:500;border:1px solid ${storefront.border};background:' + (active ? "${storefront.accent}" : "transparent") + ';color:' + (active ? "white" : "${storefront.ink}") + ';cursor:pointer;">' + t + '</button>';
    }).join("");

    var shown = current === "All" ? products : products.filter(function (p) { return p.tier === current; });
    var gridEl = document.getElementById("fz-shop-grid");
    gridEl.innerHTML = shown.map(cardHtml).join("");

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { entry.target.classList.add("fz-visible"); observer.unobserve(entry.target); }
        });
      }, { threshold: 0.15 });
      gridEl.querySelectorAll("[data-fz-reveal]").forEach(function (el) { observer.observe(el); });
    } else {
      gridEl.querySelectorAll("[data-fz-reveal]").forEach(function (el) { el.classList.add("fz-visible"); });
    }
  }

  document.addEventListener("click", function (e) {
    var tier = e.target.getAttribute && e.target.getAttribute("data-tier");
    if (tier) { current = tier; render(); }
  });

  render();
})();`;

  return documentShell(`Shop — ${title}`, "The full Florenza collection.", body, script);
}

function productPageHtml(site: Site, products: Product[], title: string): string {
  const productsJson = JSON.stringify(products).replace(/</g, "\\u003c");
  const body = `${site.header.showAnnouncement ? announcementBar(site.header.announcementText) : ""}
${navBar(site.header.logoText)}
<section class="px-6 py-10 md:px-14">
  <a href="shop.html" style="display:inline-flex;align-items:center;gap:6px;font-size:12px;margin-bottom:24px;color:${storefront.muted};text-decoration:none;">&larr; Back to shop</a>
  <div id="fz-product-root" class="grid grid-cols-1 md:grid-cols-2 gap-10"></div>
  <div id="fz-related-root" style="margin-top:64px;"></div>
</section>
${footerHtml(site.home.find((b): b is Extract<Block, { type: "footer" }> => b.type === "footer"))}`;

  const script = `
(function () {
  var products = ${productsJson};
  var params = new URLSearchParams(window.location.search);
  var id = params.get("id");
  var product = products.find(function (p) { return p.id === id; }) || products[0];
  var quantity = 1;
  var root = document.getElementById("fz-product-root");
  var relatedRoot = document.getElementById("fz-related-root");

  if (!product) { root.innerHTML = "<p style=\\"color:${storefront.muted}\\">Product not found.</p>"; return; }

  var img = product.imageUrl
    ? '<img src="' + product.imageUrl + '" alt="" class="aspect-square w-full rounded-xl object-cover" />'
    : '<div class="aspect-square w-full rounded-xl" style="background:linear-gradient(135deg, ${storefront.accentSoft}, ${storefront.border});border:1px solid ${storefront.border};display:flex;align-items:center;justify-content:center;padding:24px;text-align:center;"><p style="font-size:12px;color:${storefront.muted}">' + product.tier + ' tier arrangement</p></div>';

  function renderMain() {
    root.innerHTML =
      img +
      '<div style="display:flex;flex-direction:column;gap:16px;">' +
        '<span style="font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:0.05em;color:${storefront.accent}">' + product.tier + '</span>' +
        '<h1 style="font-family:var(--font-display);font-size:28px;color:${storefront.ink}">' + product.name + '</h1>' +
        '<p style="font-size:20px;color:${storefront.accent}">' + window.__fzFormatMoney(product.price) + '</p>' +
        '<p style="font-size:14px;line-height:1.6;color:${storefront.muted}">A ' + product.tier.toLowerCase() + '-tier arrangement from the Florenza catalogue, composed same-day with real flowers, documentary-style, no stock imagery.</p>' +
        '<div style="display:flex;align-items:center;gap:12px;">' +
          '<div style="display:flex;align-items:center;gap:8px;border-radius:9999px;border:1px solid ${storefront.border};">' +
            '<button id="fz-qty-dec" style="padding:10px;border:none;background:none;color:${storefront.ink};cursor:pointer;">-</button>' +
            '<span id="fz-qty-val" style="width:20px;text-align:center;font-size:14px;color:${storefront.ink}">' + quantity + '</span>' +
            '<button id="fz-qty-inc" style="padding:10px;border:none;background:none;color:${storefront.ink};cursor:pointer;">+</button>' +
          '</div>' +
          '<button class="fz-add-to-cart" data-id="' + product.id + '" data-name="' + product.name + '" data-price="' + product.price + '" style="flex:1;border-radius:9999px;padding:10px 24px;font-size:14px;font-weight:500;color:white;background:${storefront.accent};border:none;cursor:pointer;">Add to cart</button>' +
        '</div>' +
        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding-top:8px;">' +
          '<div style="display:flex;flex-direction:column;align-items:center;gap:6px;border-radius:8px;padding:12px;text-align:center;background:${storefront.accentSoft}"><span style="font-size:10px;color:${storefront.ink}">Same-day in Lahore</span></div>' +
          '<div style="display:flex;flex-direction:column;align-items:center;gap:6px;border-radius:8px;padding:12px;text-align:center;background:${storefront.accentSoft}"><span style="font-size:10px;color:${storefront.ink}">Real flowers, real photos</span></div>' +
          '<div style="display:flex;flex-direction:column;align-items:center;gap:6px;border-radius:8px;padding:12px;text-align:center;background:${storefront.accentSoft}"><span style="font-size:10px;color:${storefront.ink}">Composed to order</span></div>' +
        '</div>' +
        '<p style="font-size:11px;color:${storefront.muted}">Order by 2pm for same-day delivery across Lahore. Delivery windows and areas covered are confirmed at checkout.</p>' +
      '</div>';

    document.getElementById("fz-qty-dec").addEventListener("click", function () { quantity = Math.max(1, quantity - 1); document.getElementById("fz-qty-val").textContent = quantity; });
    document.getElementById("fz-qty-inc").addEventListener("click", function () { quantity++; document.getElementById("fz-qty-val").textContent = quantity; });

    root.querySelector(".fz-add-to-cart").addEventListener("click", function () {
      var cart = window.__fzGetCart();
      var existing = cart.find(function (i) { return i.id === product.id; });
      if (existing) { existing.quantity += quantity; } else { cart.push({ id: product.id, name: product.name, price: product.price, quantity: quantity }); }
      window.__fzSetCart(cart);
    });
  }

  function renderRelated() {
    var related = products.filter(function (p) { return p.tier === product.tier && p.id !== product.id; }).slice(0, 3);
    if (related.length === 0) return;
    relatedRoot.innerHTML =
      '<h2 style="font-family:var(--font-display);font-size:20px;margin-bottom:20px;color:${storefront.ink}">More from ' + product.tier + '</h2>' +
      '<div class="grid grid-cols-2 md:grid-cols-3 gap-5">' +
      related.map(function (p) {
        var rimg = p.imageUrl
          ? '<img src="' + p.imageUrl + '" alt="" class="aspect-square rounded-lg w-full object-cover" />'
          : '<div class="aspect-square rounded-lg w-full" style="background:linear-gradient(135deg, ${storefront.accentSoft}, ${storefront.border});display:flex;align-items:center;justify-content:center;"><p style="font-size:12px;color:${storefront.muted}">' + p.tier + '</p></div>';
        return '<a href="product.html?id=' + p.id + '" style="text-decoration:none;"><div class="flex flex-col gap-2">' + rimg +
          '<p style="font-size:14px;color:${storefront.ink}">' + p.name + '</p>' +
          '<p style="font-size:12px;color:${storefront.accent}">' + window.__fzFormatMoney(p.price) + '</p></div></a>';
      }).join("") +
      '</div>';
  }

  document.title = product.name + " — Florenza";
  renderMain();
  renderRelated();
})();`;

  return documentShell(`Product — ${title}`, "Product details.", body, script);
}

function cartPageHtml(site: Site, title: string): string {
  const body = `${site.header.showAnnouncement ? announcementBar(site.header.announcementText) : ""}
${navBar(site.header.logoText)}
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

  return documentShell(`Cart — ${title}`, "Your Florenza cart.", body, script);
}

/**
 * Renders the current site to a set of standalone, deployable HTML pages
 * via plain string templates (not React SSR — App Router route handlers
 * run under React's "react-server" condition, which disallows importing
 * react-dom/server, so this intentionally does not reuse <SitePreview>).
 * Keep this in sync with site-preview.tsx by hand if that changes — it's
 * gotten meaningfully bigger (header/marquee, category showcase, scroll
 * reveal, product page CRO) and the two are more likely to drift now,
 * not less. When in doubt, read both side by side before editing either.
 *
 * `products` is passed in rather than imported — Product Management's
 * catalogue (including uploaded images) lives in ProductsProvider's
 * React context on the client, this file runs server-side in a route
 * handler with no access to that context, so the caller (the deploy/
 * export route) must send the current product list in the request body,
 * same pattern already used for `site`.
 *
 * Four real pages: index.html (Home), shop.html (full catalogue, client-
 * side tier filter), product.html (reads ?id= client-side, related
 * products from the same tier), cart.html (full cart page). Cart state
 * is shared across all four via localStorage. Checkout is intentionally
 * absent — see CLAUDE.md's Website Builder notes on why Stripe was
 * removed. Cart pages ship a disabled "Checkout coming soon" button.
 */
export function renderSiteFiles(site: Site, products: Product[]): Record<string, string> {
  const footer = site.home.find((b): b is Extract<Block, { type: "footer" }> => b.type === "footer");
  const title = footer?.businessName ?? "Florenza Flourish";
  const description = footer?.tagline ?? "Luxury floral gifting.";

  return {
    "index.html": homePageHtml(site, products, title, description),
    "shop.html": shopPageHtml(site, products, title),
    "product.html": productPageHtml(site, products, title),
    "cart.html": cartPageHtml(site, title),
  };
}
