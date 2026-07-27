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
} from "lucide-react";

import { seedProducts, formatPKR, type Product } from "@/lib/product-data";
import { storefront, type Block, type Site, type SitePageId } from "@/lib/website-data";

type CartItem = { productId: string; name: string; price: number; quantity: number };

function ImagePlaceholder({ note, className }: { note: string; className?: string }) {
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

function NavBar({
  itemCount,
  onNavigate,
}: {
  itemCount: number;
  onNavigate: (page: SitePageId) => void;
}) {
  return (
    <div
      className="sticky top-0 z-10 flex items-center justify-between px-6 md:px-14 py-3.5"
      style={{ background: storefront.bg, borderBottom: `1px solid ${storefront.border}` }}
    >
      <button onClick={() => onNavigate("home")} className="flex items-center gap-2">
        <Flower2 className="size-4" style={{ color: storefront.accent }} strokeWidth={1.75} />
        <span className="text-sm font-medium" style={{ fontFamily: "var(--font-display)", color: storefront.ink }}>
          Florenza
        </span>
      </button>
      <div className="flex items-center gap-5">
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
      <ImagePlaceholder note={block.imageNote} className="mt-4 h-56 w-full rounded-xl" />
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
    <div className="flex flex-col gap-2">
      <button onClick={onView} className="text-left">
        <ImagePlaceholder note={product.tier} className="aspect-square rounded-lg" />
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
  cartQuantity,
  onView,
  onAdd,
}: {
  block: Extract<Block, { type: "featured-products" }>;
  cartQuantity: (id: string) => number;
  onView: (id: string) => void;
  onAdd: (product: Product) => void;
}) {
  const products = seedProducts.filter((p) => block.productIds.includes(p.id));
  const shown = products.length > 0 ? products : seedProducts.slice(0, 4);

  return (
    <section className="px-6 py-12 md:px-14" style={{ background: storefront.surface }}>
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
    </section>
  );
}

function About({ block }: { block: Extract<Block, { type: "about" }> }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 py-14 md:px-14 items-center">
      <ImagePlaceholder note={block.imageNote} className="h-56 md:h-72 rounded-xl order-2 md:order-1" />
      <div className="order-1 md:order-2">
        <h2 className="text-2xl md:text-3xl mb-4" style={{ fontFamily: "var(--font-display)", color: storefront.ink }}>
          {block.heading}
        </h2>
        <p className="text-sm md:text-base leading-relaxed" style={{ color: storefront.muted }}>
          {block.body}
        </p>
      </div>
    </section>
  );
}

function Testimonial({ block }: { block: Extract<Block, { type: "testimonial" }> }) {
  return (
    <section className="px-6 py-14 md:px-14 text-center flex flex-col items-center gap-4" style={{ background: storefront.accentSoft }}>
      <Star className="size-5" style={{ color: storefront.accent }} strokeWidth={1.5} />
      <p className="text-lg md:text-xl max-w-xl italic leading-relaxed" style={{ fontFamily: "var(--font-display)", color: storefront.ink }}>
        &ldquo;{block.quote}&rdquo;
      </p>
      <p className="text-xs" style={{ color: storefront.muted }}>
        {block.author} · {block.authorContext}
      </p>
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
  cartQuantity,
  onView,
  onAdd,
}: {
  blocks: Block[];
  cartQuantity: (id: string) => number;
  onView: (id: string) => void;
  onAdd: (product: Product) => void;
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
                <FeaturedProducts key={block.id} block={block} cartQuantity={cartQuantity} onView={onView} onAdd={onAdd} />
              );
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
  cartQuantity,
  onView,
  onAdd,
}: {
  heading: string;
  subheading: string;
  cartQuantity: (id: string) => number;
  onView: (id: string) => void;
  onAdd: (product: Product) => void;
}) {
  return (
    <section className="px-6 py-12 md:px-14">
      <h1 className="text-3xl mb-2" style={{ fontFamily: "var(--font-display)", color: storefront.ink }}>
        {heading}
      </h1>
      <p className="text-sm mb-8" style={{ color: storefront.muted }}>
        {subheading}
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {seedProducts.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            inCart={cartQuantity(p.id)}
            onView={() => onView(p.id)}
            onAdd={() => onAdd(p)}
          />
        ))}
      </div>
    </section>
  );
}

function ProductPage({
  product,
  inCart,
  onAdd,
  onBack,
}: {
  product: Product | undefined;
  inCart: number;
  onAdd: () => void;
  onBack: () => void;
}) {
  if (!product) {
    return (
      <section className="px-6 py-14 md:px-14 text-center">
        <p style={{ color: storefront.muted }}>Product not found.</p>
      </section>
    );
  }

  return (
    <section className="px-6 py-10 md:px-14">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs mb-6" style={{ color: storefront.muted }}>
        <ArrowLeft className="size-3.5" />
        Back to shop
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <ImagePlaceholder note={`${product.tier} tier arrangement`} className="aspect-square rounded-xl" />
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
          <button
            onClick={onAdd}
            className="mt-2 w-fit rounded-full px-6 py-2.5 text-sm font-medium text-white"
            style={{ background: storefront.accent }}
          >
            {inCart > 0 ? `In cart · ${inCart}, add another` : "Add to cart"}
          </button>
        </div>
      </div>
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
  currentPage,
  selectedProductId,
  onNavigate,
}: {
  site: Site;
  currentPage: SitePageId;
  selectedProductId: string | null;
  onNavigate: (page: SitePageId, productId?: string) => void;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) => (i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { productId: product.id, name: product.name, price: product.price, quantity: 1 }];
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
  const selectedProduct = seedProducts.find((p) => p.id === selectedProductId) ?? seedProducts[0];

  return (
    <div style={{ background: storefront.bg }}>
      <NavBar itemCount={itemCount} onNavigate={onNavigate} />

      {currentPage === "home" && (
        <HomePage
          blocks={site.home}
          cartQuantity={cartQuantity}
          onView={(id) => onNavigate("product", id)}
          onAdd={addToCart}
        />
      )}
      {currentPage === "shop" && (
        <ShopPage
          heading={site.shop.heading}
          subheading={site.shop.subheading}
          cartQuantity={cartQuantity}
          onView={(id) => onNavigate("product", id)}
          onAdd={addToCart}
        />
      )}
      {currentPage === "product" && (
        <ProductPage
          product={selectedProduct}
          inCart={cartQuantity(selectedProduct?.id ?? "")}
          onAdd={() => selectedProduct && addToCart(selectedProduct)}
          onBack={() => onNavigate("shop")}
        />
      )}
      {currentPage === "cart" && (
        <CartPage items={cart} onUpdateQty={updateQty} onRemove={removeItem} onContinue={() => onNavigate("shop")} />
      )}

      {footerBlock && <Footer block={footerBlock} />}
    </div>
  );
}
