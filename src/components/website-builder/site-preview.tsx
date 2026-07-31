"use client";

import { useState } from "react";
import {
  ImagePlus,
  ShoppingBag,
  Star,
  Mail,
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  Clock,
  ArrowLeft,
  Flower2,
  Menu,
  X,
  Truck,
  Camera,
  Sparkles,
} from "lucide-react";

import { formatPKR, type Product, type Tier } from "@/lib/product-data";
import { storefront, tierCopy, type Block, type Site, type SitePageId } from "@/lib/website-data";
import { Reveal } from "@/components/website-builder/reveal";

type CartItem = { productId: string; name: string; price: number; quantity: number };
type NavigateOpts = { productId?: string; tier?: Tier };

const tiers: Tier[] = ["Classic", "Signature", "Luxury"];

function ImagePlaceholder({
  note,
  imageUrl,
  className,
}: {
  note: string;
  imageUrl?: string;
  className?: string;
}) {
  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- base64 data URL, not a remote asset
      <img src={imageUrl} alt="" className={`${className} object-cover`} />
    );
  }
  return (
    <div
      className={className}
      style={{
        background: `linear-gradient(135deg, ${storefront.accentSoft}, ${storefront.border})`,
        border: `1px solid ${storefront.border}`,
      }}
    >
      <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
        <ImagePlus className="size-5" style={{ color: storefront.accent }} strokeWidth={1.5} />
        <p className="text-xs" style={{ color: storefront.muted }}>
          {note}
        </p>
      </div>
    </div>
  );
}

function AnnouncementBar({ text }: { text: string }) {
  const repeated = `${text}      ·      ${text}      ·      ${text}      ·      `;
  return (
    <div
      className="overflow-hidden py-2"
      style={{ background: storefront.ink, color: storefront.bg }}
    >
      <div className="fz-marquee-track">
        <span className="text-[11px] whitespace-nowrap px-4">{repeated}</span>
        <span className="text-[11px] whitespace-nowrap px-4" aria-hidden>
          {repeated}
        </span>
      </div>
    </div>
  );
}

function NavBar({
  logoText,
  itemCount,
  onNavigate,
}: {
  logoText: string;
  itemCount: number;
  onNavigate: (page: SitePageId) => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      className="sticky top-0 z-10"
      style={{ background: storefront.bg, borderBottom: `1px solid ${storefront.border}` }}
    >
      <div className="flex items-center justify-between px-6 md:px-14 py-3.5">
        <button onClick={() => onNavigate("home")} className="flex items-center gap-2">
          <Flower2 className="size-4" style={{ color: storefront.accent }} strokeWidth={1.75} />
          <span className="text-sm font-medium" style={{ fontFamily: "var(--font-display)", color: storefront.ink }}>
            {logoText}
          </span>
        </button>

        <div className="hidden md:flex items-center gap-5">
          <button onClick={() => onNavigate("home")} className="text-xs" style={{ color: storefront.ink }}>
            Home
          </button>
          <button onClick={() => onNavigate("shop")} className="text-xs" style={{ color: storefront.ink }}>
            Shop
          </button>
          <button
            onClick={() => onNavigate("cart")}
            className="relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
            style={{ border: `1px solid ${storefront.border}`, color: storefront.ink, background: storefront.surface }}
          >
            <ShoppingCart className="size-3.5" />
            Cart
            {itemCount > 0 && (
              <span
                className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full text-[10px] text-white"
                style={{ background: storefront.accent }}
              >
                {itemCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex md:hidden items-center gap-3">
          <button onClick={() => onNavigate("cart")} className="relative" style={{ color: storefront.ink }}>
            <ShoppingCart className="size-4" />
            {itemCount > 0 && (
              <span
                className="absolute -right-1.5 -top-1.5 flex size-3.5 items-center justify-center rounded-full text-[9px] text-white"
                style={{ background: storefront.accent }}
              >
                {itemCount}
              </span>
            )}
          </button>
          <button onClick={() => setMobileOpen((o) => !o)} style={{ color: storefront.ink }} aria-label="Menu">
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="md:hidden flex flex-col px-6 py-3 gap-3"
          style={{ borderTop: `1px solid ${storefront.border}` }}
        >
          <button
            onClick={() => {
              onNavigate("home");
              setMobileOpen(false);
            }}
            className="text-left text-sm"
            style={{ color: storefront.ink }}
          >
            Home
          </button>
          <button
            onClick={() => {
              onNavigate("shop");
              setMobileOpen(false);
            }}
            className="text-left text-sm"
            style={{ color: storefront.ink }}
          >
            Shop
          </button>
        </div>
      )}
    </div>
  );
}

function Hero({ block }: { block: Extract<Block, { type: "hero" }> }) {
  return (
    <section className="flex flex-col gap-6 px-6 py-14 md:px-14 md:py-20 items-start">
      <span className="text-xs font-medium uppercase tracking-[0.14em]" style={{ color: storefront.accent }}>
        {block.eyebrow}
      </span>
      <h1
        className="text-3xl md:text-5xl leading-tight max-w-xl"
        style={{ fontFamily: "var(--font-display)", color: storefront.ink }}
      >
        {block.headline}
      </h1>
      <p className="text-sm md:text-base max-w-md leading-relaxed" style={{ color: storefront.muted }}>
        {block.subheadline}
      </p>
      <button className="rounded-full px-6 py-2.5 text-sm font-medium text-white" style={{ background: storefront.accent }}>
        {block.ctaText}
      </button>
      <ImagePlaceholder
        note={block.imageNote}
        imageUrl={block.imageUrl}
        className="mt-4 h-56 md:h-80 w-full rounded-xl"
      />
    </section>
  );
}

function ProductCard({
  product,
  inCart,
  onView,
  onAdd,
}: {
  product: Product;
  inCart: number;
  onView: () => void;
  onAdd: () => void;
}) {
  return (
    <div className="flex flex-col gap-2 group">
      <button onClick={onView} className="text-left">
        <ImagePlaceholder
          note={product.tier}
          imageUrl={product.imageUrl}
          className="aspect-square rounded-lg w-full transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <p className="text-sm mt-2" style={{ color: storefront.ink }}>
          {product.name}
        </p>
        <p className="text-xs font-medium" style={{ color: storefront.accent }}>
          {formatPKR(product.price)}
        </p>
      </button>
      <button
        onClick={onAdd}
        className="rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
        style={{
          borderColor: storefront.accent,
          color: inCart ? "white" : storefront.accent,
          background: inCart ? storefront.accent : "transparent",
        }}
      >
        {inCart > 0 ? `In cart · ${inCart}` : "Add to cart"}
      </button>
    </div>
  );
}

function FeaturedProducts({
  block,
  products,
  cartQuantity,
  onView,
  onAdd,
}: {
  block: Extract<Block, { type: "featured-products" }>;
  products: Product[];
  cartQuantity: (id: string) => number;
  onView: (id: string) => void;
  onAdd: (product: Product) => void;
}) {
  const picked = products.filter((p) => block.productIds.includes(p.id));
  const shown = picked.length > 0 ? picked : products.slice(0, 4);

  return (
    <section className="px-6 py-12 md:px-14" style={{ background: storefront.surface }}>
      <Reveal>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl" style={{ fontFamily: "var(--font-display)", color: storefront.ink }}>
              {block.heading}
            </h2>
            <p className="text-sm mt-1" style={{ color: storefront.muted }}>
              {block.subheading}
            </p>
          </div>
          <ShoppingBag className="size-5 hidden sm:block" style={{ color: storefront.accent }} strokeWidth={1.5} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {shown.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              inCart={cartQuantity(p.id)}
              onView={() => onView(p.id)}
              onAdd={() => onAdd(p)}
            />
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function CategoryShowcase({
  block,
  products,
  onShopTier,
}: {
  block: Extract<Block, { type: "category-showcase" }>;
  products: Product[];
  onShopTier: (tier: Tier) => void;
}) {
  return (
    <section className="px-6 py-14 md:px-14">
      <Reveal>
        <div className="mb-8">
          <h2 className="text-2xl" style={{ fontFamily: "var(--font-display)", color: storefront.ink }}>
            {block.heading}
          </h2>
          <p className="text-sm mt-1" style={{ color: storefront.muted }}>
            {block.subheading}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {tiers.map((tier) => {
            const tierProducts = products.filter((p) => p.tier === tier);
            const minPrice = tierProducts.length > 0 ? Math.min(...tierProducts.map((p) => p.price)) : 0;
            return (
              <button
                key={tier}
                onClick={() => onShopTier(tier)}
                className="flex flex-col gap-3 rounded-xl p-6 text-left transition-transform hover:-translate-y-1"
                style={{ background: storefront.accentSoft, border: `1px solid ${storefront.border}` }}
              >
                <span className="text-xs font-medium uppercase tracking-wide" style={{ color: storefront.accent }}>
                  {tier}
                </span>
                <p className="text-sm leading-relaxed" style={{ color: storefront.ink }}>
                  {tierCopy[tier].blurb}
                </p>
                {tierProducts.length > 0 && (
                  <p className="text-xs" style={{ color: storefront.muted }}>
                    From {formatPKR(minPrice)}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}

function About({ block }: { block: Extract<Block, { type: "about" }> }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 py-14 md:px-14 items-center">
      <Reveal>
        <ImagePlaceholder
          note={block.imageNote}
          imageUrl={block.imageUrl}
          className="h-56 md:h-72 w-full rounded-xl"
        />
      </Reveal>
      <Reveal delay={120}>
        <div>
          <h2 className="text-2xl md:text-3xl mb-4" style={{ fontFamily: "var(--font-display)", color: storefront.ink }}>
            {block.heading}
          </h2>
          <p className="text-sm md:text-base leading-relaxed" style={{ color: storefront.muted }}>
            {block.body}
          </p>
        </div>
      </Reveal>
    </section>
  );
}

function Testimonial({ block }: { block: Extract<Block, { type: "testimonial" }> }) {
  return (
    <section className="px-6 py-14 md:px-14 text-center flex flex-col items-center gap-4" style={{ background: storefront.accentSoft }}>
      <Reveal>
        <div className="flex flex-col items-center gap-4">
          <Star className="size-5" style={{ color: storefront.accent }} strokeWidth={1.5} />
          <p className="text-lg md:text-xl max-w-xl italic leading-relaxed" style={{ fontFamily: "var(--font-display)", color: storefront.ink }}>
            &ldquo;{block.quote}&rdquo;
          </p>
          <p className="text-xs" style={{ color: storefront.muted }}>
            {block.author} · {block.authorContext}
          </p>
        </div>
      </Reveal>
    </section>
  );
}

function Newsletter({ block }: { block: Extract<Block, { type: "newsletter" }> }) {
  return (
    <section className="px-6 py-14 md:px-14 text-center flex flex-col items-center gap-4">
      <Mail className="size-5" style={{ color: storefront.accent }} strokeWidth={1.5} />
      <h2 className="text-2xl" style={{ fontFamily: "var(--font-display)", color: storefront.ink }}>
        {block.heading}
      </h2>
      <p className="text-sm max-w-sm" style={{ color: storefront.muted }}>
        {block.subheading}
      </p>
      <div className="flex w-full max-w-sm gap-2">
        <input
          disabled
          placeholder="you@email.com"
          className="flex-1 rounded-full border px-4 py-2 text-sm"
          style={{ borderColor: storefront.border, color: storefront.muted }}
        />
        <button className="rounded-full px-5 py-2 text-sm font-medium text-white shrink-0" style={{ background: storefront.accent }}>
          {block.buttonText}
        </button>
      </div>
    </section>
  );
}

function Footer({ block }: { block: Extract<Block, { type: "footer" }> }) {
  return (
    <footer
      className="px-6 py-10 md:px-14 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
      style={{ background: storefront.ink, color: storefront.bg }}
    >
      <div>
        <p className="text-base" style={{ fontFamily: "var(--font-display)" }}>
          {block.businessName}
        </p>
        <p className="text-xs opacity-70 mt-0.5">{block.tagline}</p>
      </div>
      <div className="text-xs opacity-70 flex flex-col md:items-end gap-0.5">
        <span>{block.city}</span>
        <span>{block.instagramHandle}</span>
      </div>
    </footer>
  );
}

function HomePage({
  blocks,
  products,
  cartQuantity,
  onView,
  onAdd,
  onShopTier,
}: {
  blocks: Block[];
  products: Product[];
  cartQuantity: (id: string) => number;
  onView: (id: string) => void;
  onAdd: (product: Product) => void;
  onShopTier: (tier: Tier) => void;
}) {
  return (
    <>
      {blocks
        .filter((b) => b.type !== "footer")
        .map((block) => {
          switch (block.type) {
            case "hero":
              return <Hero key={block.id} block={block} />;
            case "featured-products":
              return (
                <FeaturedProducts
                  key={block.id}
                  block={block}
                  products={products}
                  cartQuantity={cartQuantity}
                  onView={onView}
                  onAdd={onAdd}
                />
              );
            case "category-showcase":
              return <CategoryShowcase key={block.id} block={block} products={products} onShopTier={onShopTier} />;
            case "about":
              return <About key={block.id} block={block} />;
            case "testimonial":
              return <Testimonial key={block.id} block={block} />;
            case "newsletter":
              return <Newsletter key={block.id} block={block} />;
            default:
              return null;
          }
        })}
    </>
  );
}

function ShopPage({
  heading,
  subheading,
  products,
  filter,
  onFilterChange,
  cartQuantity,
  onView,
  onAdd,
}: {
  heading: string;
  subheading: string;
  products: Product[];
  filter: Tier | "All";
  onFilterChange: (filter: Tier | "All") => void;
  cartQuantity: (id: string) => number;
  onView: (id: string) => void;
  onAdd: (product: Product) => void;
}) {
  const shown = filter === "All" ? products : products.filter((p) => p.tier === filter);

  return (
    <section className="px-6 py-12 md:px-14">
      <h1 className="text-3xl mb-2" style={{ fontFamily: "var(--font-display)", color: storefront.ink }}>
        {heading}
      </h1>
      <p className="text-sm mb-6" style={{ color: storefront.muted }}>
        {subheading}
      </p>
      <div className="flex gap-2 mb-8">
        {(["All", ...tiers] as const).map((t) => (
          <button
            key={t}
            onClick={() => onFilterChange(t)}
            className="rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors"
            style={{
              border: `1px solid ${storefront.border}`,
              background: filter === t ? storefront.accent : "transparent",
              color: filter === t ? "white" : storefront.ink,
            }}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {shown.map((p, i) => (
          <Reveal key={p.id} delay={(i % 4) * 80}>
            <ProductCard product={p} inCart={cartQuantity(p.id)} onView={() => onView(p.id)} onAdd={() => onAdd(p)} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ProductPage({
  product,
  products,
  inCart,
  onAdd,
  onView,
  onBack,
}: {
  product: Product | undefined;
  products: Product[];
  inCart: number;
  onAdd: (quantity: number) => void;
  onView: (id: string) => void;
  onBack: () => void;
}) {
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <section className="px-6 py-14 md:px-14 text-center">
        <p style={{ color: storefront.muted }}>Product not found.</p>
      </section>
    );
  }

  const related = products.filter((p) => p.tier === product.tier && p.id !== product.id).slice(0, 3);

  return (
    <section className="px-6 py-10 md:px-14">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs mb-6" style={{ color: storefront.muted }}>
        <ArrowLeft className="size-3.5" />
        Back to shop
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <ImagePlaceholder
          note={`${product.tier} tier arrangement`}
          imageUrl={product.imageUrl}
          className="aspect-square w-full rounded-xl"
        />
        <div className="flex flex-col gap-4">
          <span className="text-xs font-medium uppercase tracking-wide" style={{ color: storefront.accent }}>
            {product.tier}
          </span>
          <h1 className="text-2xl md:text-3xl" style={{ fontFamily: "var(--font-display)", color: storefront.ink }}>
            {product.name}
          </h1>
          <p className="text-xl" style={{ color: storefront.accent }}>
            {formatPKR(product.price)}
          </p>
          <p className="text-sm leading-relaxed" style={{ color: storefront.muted }}>
            A {product.tier.toLowerCase()}-tier arrangement from the Florenza catalogue, composed
            same-day with real flowers, documentary-style, no stock imagery.
          </p>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full" style={{ border: `1px solid ${storefront.border}` }}>
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2.5"
                style={{ color: storefront.ink }}
                aria-label="Decrease quantity"
              >
                <Minus className="size-3.5" />
              </button>
              <span className="w-5 text-center text-sm" style={{ color: storefront.ink }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="p-2.5"
                style={{ color: storefront.ink }}
                aria-label="Increase quantity"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
            <button
              onClick={() => onAdd(quantity)}
              className="flex-1 rounded-full px-6 py-2.5 text-sm font-medium text-white"
              style={{ background: storefront.accent }}
            >
              {inCart > 0 ? `In cart · ${inCart}, add ${quantity} more` : "Add to cart"}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2">
            {[
              { icon: Truck, label: "Same-day in Lahore" },
              { icon: Camera, label: "Real flowers, real photos" },
              { icon: Sparkles, label: "Composed to order" },
            ].map((t) => {
              const Icon = t.icon;
              return (
                <div
                  key={t.label}
                  className="flex flex-col items-center gap-1.5 rounded-lg p-3 text-center"
                  style={{ background: storefront.accentSoft }}
                >
                  <Icon className="size-4" style={{ color: storefront.accent }} strokeWidth={1.5} />
                  <span className="text-[10px] leading-tight" style={{ color: storefront.ink }}>
                    {t.label}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-[11px]" style={{ color: storefront.muted }}>
            Order by 2pm for same-day delivery across Lahore. Delivery windows and areas covered
            are confirmed at checkout.
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl mb-5" style={{ fontFamily: "var(--font-display)", color: storefront.ink }}>
            More from {product.tier}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} inCart={0} onView={() => onView(p.id)} onAdd={() => onAdd(1)} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function CartPage({
  items,
  onUpdateQty,
  onRemove,
  onContinue,
}: {
  items: CartItem[];
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onContinue: () => void;
}) {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <section className="px-6 py-12 md:px-14 max-w-2xl mx-auto">
      <h1 className="text-3xl mb-8" style={{ fontFamily: "var(--font-display)", color: storefront.ink }}>
        Your cart
      </h1>
      {items.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-sm mb-4" style={{ color: storefront.muted }}>
            Nothing in the cart yet.
          </p>
          <button onClick={onContinue} className="text-xs underline" style={{ color: storefront.accent }}>
            Continue shopping
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center gap-4 py-3" style={{ borderBottom: `1px solid ${storefront.border}` }}>
              <div className="flex-1 min-w-0">
                <p className="text-sm" style={{ color: storefront.ink }}>
                  {item.name}
                </p>
                <p className="text-xs" style={{ color: storefront.accent }}>
                  {formatPKR(item.price)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => onUpdateQty(item.productId, -1)} className="rounded p-1.5" style={{ border: `1px solid ${storefront.border}`, color: storefront.ink }}>
                  <Minus className="size-3" />
                </button>
                <span className="w-5 text-center text-sm" style={{ color: storefront.ink }}>
                  {item.quantity}
                </span>
                <button onClick={() => onUpdateQty(item.productId, 1)} className="rounded p-1.5" style={{ border: `1px solid ${storefront.border}`, color: storefront.ink }}>
                  <Plus className="size-3" />
                </button>
              </div>
              <button onClick={() => onRemove(item.productId)} style={{ color: storefront.muted }}>
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}

          <div className="flex items-center justify-between pt-4">
            <span className="text-sm" style={{ color: storefront.muted }}>
              Subtotal
            </span>
            <span className="text-lg" style={{ fontFamily: "var(--font-display)", color: storefront.ink }}>
              {formatPKR(subtotal)}
            </span>
          </div>
          <button
            disabled
            className="flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white opacity-50 cursor-not-allowed"
            style={{ background: storefront.accent }}
          >
            <Clock className="size-3.5" />
            Checkout coming soon
          </button>
          <p className="text-[11px] text-center" style={{ color: storefront.muted }}>
            Payment processing isn&apos;t connected yet, cart and quantities work, checkout is next.
          </p>
        </div>
      )}
    </section>
  );
}

export function SitePreview({
  site,
  products,
  currentPage,
  selectedProductId,
  onNavigate,
}: {
  site: Site;
  products: Product[];
  currentPage: SitePageId;
  selectedProductId: string | null;
  onNavigate: (page: SitePageId, opts?: NavigateOpts) => void;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [shopFilter, setShopFilter] = useState<Tier | "All">("All");
  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  function handleNavigate(page: SitePageId, opts?: NavigateOpts) {
    if (opts?.tier) setShopFilter(opts.tier);
    onNavigate(page, opts);
  }

  function addToCart(product: Product, quantity = 1) {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) => (i.productId === product.id ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [...prev, { productId: product.id, name: product.name, price: product.price, quantity }];
    });
  }
  function updateQty(id: string, delta: number) {
    setCart((prev) =>
      prev.map((i) => (i.productId === id ? { ...i, quantity: i.quantity + delta } : i)).filter((i) => i.quantity > 0)
    );
  }
  function removeItem(id: string) {
    setCart((prev) => prev.filter((i) => i.productId !== id));
  }
  function cartQuantity(id: string) {
    return cart.find((i) => i.productId === id)?.quantity ?? 0;
  }

  const footerBlock = site.home.find((b): b is Extract<Block, { type: "footer" }> => b.type === "footer");
  const selectedProduct = products.find((p) => p.id === selectedProductId) ?? products[0];

  return (
    <div style={{ background: storefront.bg }}>
      {site.header.showAnnouncement && <AnnouncementBar text={site.header.announcementText} />}
      <NavBar logoText={site.header.logoText} itemCount={itemCount} onNavigate={handleNavigate} />

      {currentPage === "home" && (
        <HomePage
          blocks={site.home}
          products={products}
          cartQuantity={cartQuantity}
          onView={(id) => handleNavigate("product", { productId: id })}
          onAdd={(p) => addToCart(p)}
          onShopTier={(tier) => handleNavigate("shop", { tier })}
        />
      )}
      {currentPage === "shop" && (
        <ShopPage
          heading={site.shop.heading}
          subheading={site.shop.subheading}
          products={products}
          filter={shopFilter}
          onFilterChange={setShopFilter}
          cartQuantity={cartQuantity}
          onView={(id) => handleNavigate("product", { productId: id })}
          onAdd={(p) => addToCart(p)}
        />
      )}
      {currentPage === "product" && (
        <ProductPage
          product={selectedProduct}
          products={products}
          inCart={cartQuantity(selectedProduct?.id ?? "")}
          onAdd={(qty) => selectedProduct && addToCart(selectedProduct, qty)}
          onView={(id) => handleNavigate("product", { productId: id })}
          onBack={() => handleNavigate("shop")}
        />
      )}
      {currentPage === "cart" && (
        <CartPage items={cart} onUpdateQty={updateQty} onRemove={removeItem} onContinue={() => handleNavigate("shop")} />
      )}

      {footerBlock && <Footer block={footerBlock} />}
    </div>
  );
}
