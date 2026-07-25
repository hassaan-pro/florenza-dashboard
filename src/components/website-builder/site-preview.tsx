"use client";

import { useState } from "react";
import {
  ImagePlus,
  ShoppingBag,
  Star,
  Mail,
  ShoppingCart,
  X,
  Minus,
  Plus,
  Trash2,
  Lock,
  Loader2,
} from "lucide-react";

import { seedProducts, formatPKR, type Product } from "@/lib/product-data";
import { storefront, type Block } from "@/lib/website-data";

type CartItem = { productId: string; name: string; price: number; quantity: number };
type CheckoutState = "idle" | "loading" | "error";

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

function Hero({ block }: { block: Extract<Block, { type: "hero" }> }) {
  return (
    <section className="flex flex-col gap-6 px-6 py-14 md:px-14 md:py-20 items-start">
      <span
        className="text-xs font-medium uppercase tracking-[0.14em]"
        style={{ color: storefront.accent }}
      >
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
      <button
        className="rounded-full px-6 py-2.5 text-sm font-medium text-white"
        style={{ background: storefront.accent }}
      >
        {block.ctaText}
      </button>
      <ImagePlaceholder note={block.imageNote} className="mt-4 h-56 w-full rounded-xl" />
    </section>
  );
}

function FeaturedProducts({
  block,
  cartQuantity,
  onAdd,
}: {
  block: Extract<Block, { type: "featured-products" }>;
  cartQuantity: (id: string) => number;
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
        {shown.map((p) => {
          const inCart = cartQuantity(p.id);
          return (
            <div key={p.id} className="flex flex-col gap-2">
              <ImagePlaceholder note={p.tier} className="aspect-square rounded-lg" />
              <p className="text-sm" style={{ color: storefront.ink }}>
                {p.name}
              </p>
              <p className="text-xs font-medium" style={{ color: storefront.accent }}>
                {formatPKR(p.price)}
              </p>
              <button
                onClick={() => onAdd(p)}
                className="mt-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
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
        })}
      </div>
      {products.length === 0 && (
        <p className="mt-4 text-xs" style={{ color: storefront.muted }}>
          No SKUs picked yet, showing the first 4 from the catalogue. Pick specific products in
          the panel on the right.
        </p>
      )}
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
    <section
      className="px-6 py-14 md:px-14 text-center flex flex-col items-center gap-4"
      style={{ background: storefront.accentSoft }}
    >
      <Star className="size-5" style={{ color: storefront.accent }} strokeWidth={1.5} />
      <p
        className="text-lg md:text-xl max-w-xl italic leading-relaxed"
        style={{ fontFamily: "var(--font-display)", color: storefront.ink }}
      >
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
        <button
          className="rounded-full px-5 py-2 text-sm font-medium text-white shrink-0"
          style={{ background: storefront.accent }}
        >
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

function CartDrawer({
  items,
  onClose,
  onUpdateQty,
  onRemove,
  onCheckout,
  checkoutState,
  checkoutError,
  hasStripeKey,
}: {
  items: CartItem[];
  onClose: () => void;
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
  checkoutState: CheckoutState;
  checkoutError: string | null;
  hasStripeKey: boolean;
}) {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="absolute inset-0 z-20 flex justify-end" style={{ background: "rgba(36,29,21,0.45)" }}>
      <div className="h-full w-full max-w-sm flex flex-col" style={{ background: storefront.surface }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${storefront.border}` }}>
          <p className="text-sm font-medium" style={{ color: storefront.ink }}>
            Your cart
          </p>
          <button onClick={onClose} className="rounded-md p-1" style={{ color: storefront.muted }}>
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
          {items.length === 0 ? (
            <p className="text-xs mt-4 text-center" style={{ color: storefront.muted }}>
              Nothing in the cart yet.
            </p>
          ) : (
            items.map((item) => (
              <div key={item.productId} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate" style={{ color: storefront.ink }}>
                    {item.name}
                  </p>
                  <p className="text-xs" style={{ color: storefront.accent }}>
                    {formatPKR(item.price)}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onUpdateQty(item.productId, -1)}
                    className="rounded p-1"
                    style={{ border: `1px solid ${storefront.border}`, color: storefront.ink }}
                  >
                    <Minus className="size-3" />
                  </button>
                  <span className="w-4 text-center text-xs" style={{ color: storefront.ink }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQty(item.productId, 1)}
                    className="rounded p-1"
                    style={{ border: `1px solid ${storefront.border}`, color: storefront.ink }}
                  >
                    <Plus className="size-3" />
                  </button>
                </div>
                <button onClick={() => onRemove(item.productId)} style={{ color: storefront.muted }}>
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="px-5 py-4 flex flex-col gap-3" style={{ borderTop: `1px solid ${storefront.border}` }}>
          <div className="flex items-center justify-between text-sm">
            <span style={{ color: storefront.muted }}>Subtotal</span>
            <span style={{ color: storefront.ink }}>{formatPKR(subtotal)}</span>
          </div>
          <button
            onClick={onCheckout}
            disabled={items.length === 0 || checkoutState === "loading" || !hasStripeKey}
            className="flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
            style={{ background: storefront.accent }}
          >
            {checkoutState === "loading" ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Lock className="size-3.5" />
            )}
            Checkout with Stripe
          </button>
          {!hasStripeKey && (
            <p className="text-[11px] text-center" style={{ color: storefront.muted }}>
              Add a Stripe key in the Payments dialog above to enable checkout.
            </p>
          )}
          {checkoutState === "error" && checkoutError && (
            <p className="text-[11px] text-center text-red-600">{checkoutError}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function SitePreview({
  blocks,
  stripeKey,
  currency,
}: {
  blocks: Block[];
  stripeKey: string;
  currency: string;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutState, setCheckoutState] = useState<CheckoutState>("idle");
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { productId: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
    setCartOpen(true);
  }

  function updateQty(id: string, delta: number) {
    setCart((prev) =>
      prev
        .map((i) => (i.productId === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  }

  function removeItem(id: string) {
    setCart((prev) => prev.filter((i) => i.productId !== id));
  }

  function cartQuantity(id: string) {
    return cart.find((i) => i.productId === id)?.quantity ?? 0;
  }

  async function handleCheckout() {
    setCheckoutState("loading");
    setCheckoutError(null);
    try {
      const res = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((i) => ({ name: i.name, unitAmountMajor: i.price, quantity: i.quantity })),
          secretKey: stripeKey,
          currency,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCheckoutState("error");
        setCheckoutError(data.error ?? "Checkout failed.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setCheckoutState("error");
      setCheckoutError("Couldn't reach the checkout service.");
    }
  }

  return (
    <div className="relative" style={{ background: storefront.bg }}>
      <div className="sticky top-0 z-10 flex justify-end px-4 py-3" style={{ background: storefront.bg }}>
        <button
          onClick={() => setCartOpen(true)}
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

      {blocks.map((block) => {
        switch (block.type) {
          case "hero":
            return <Hero key={block.id} block={block} />;
          case "featured-products":
            return (
              <FeaturedProducts key={block.id} block={block} cartQuantity={cartQuantity} onAdd={addToCart} />
            );
          case "about":
            return <About key={block.id} block={block} />;
          case "testimonial":
            return <Testimonial key={block.id} block={block} />;
          case "newsletter":
            return <Newsletter key={block.id} block={block} />;
          case "footer":
            return <Footer key={block.id} block={block} />;
          default:
            return null;
        }
      })}

      {cartOpen && (
        <CartDrawer
          items={cart}
          onClose={() => setCartOpen(false)}
          onUpdateQty={updateQty}
          onRemove={removeItem}
          onCheckout={handleCheckout}
          checkoutState={checkoutState}
          checkoutError={checkoutError}
          hasStripeKey={stripeKey.trim().length > 0}
        />
      )}
    </div>
  );
}
