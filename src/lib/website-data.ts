export type BlockType =
  | "hero"
  | "featured-products"
  | "about"
  | "testimonial"
  | "newsletter"
  | "footer";

export type HeroBlock = {
  id: string;
  type: "hero";
  eyebrow: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  imageNote: string; // placeholder description, not a real generated image
};

export type FeaturedProductsBlock = {
  id: string;
  type: "featured-products";
  heading: string;
  subheading: string;
  productIds: string[]; // references Product.id from src/lib/product-data.ts
};

export type AboutBlock = {
  id: string;
  type: "about";
  heading: string;
  body: string;
  imageNote: string;
};

export type TestimonialBlock = {
  id: string;
  type: "testimonial";
  quote: string;
  author: string;
  authorContext: string;
};

export type NewsletterBlock = {
  id: string;
  type: "newsletter";
  heading: string;
  subheading: string;
  buttonText: string;
};

export type FooterBlock = {
  id: string;
  type: "footer";
  businessName: string;
  tagline: string;
  city: string;
  instagramHandle: string;
};

export type Block =
  | HeroBlock
  | FeaturedProductsBlock
  | AboutBlock
  | TestimonialBlock
  | NewsletterBlock
  | FooterBlock;

export const blockLabels: Record<BlockType, string> = {
  hero: "Hero",
  "featured-products": "Featured Products",
  about: "About / Story",
  testimonial: "Testimonial",
  newsletter: "Newsletter Signup",
  footer: "Footer",
};

export const blockDescriptions: Record<BlockType, string> = {
  hero: "Full-width opener, headline and a call to action",
  "featured-products": "Pulls live SKUs straight from Product Management",
  about: "Brand story block with a supporting image",
  testimonial: "Single-quote social proof block",
  newsletter: "Email capture with a heading and a button",
  footer: "Business name, tagline, and social links",
};

function id() {
  return crypto.randomUUID();
}

export function createDefaultBlock(type: BlockType): Block {
  switch (type) {
    case "hero":
      return {
        id: id(),
        type: "hero",
        eyebrow: "Lahore · Same-day delivery",
        headline: "Flowers, arranged like they mean it",
        subheadline:
          "Documentary-style bouquets composed for elite Pakistani homes, delivered same day across Lahore.",
        ctaText: "Shop the collection",
        imageNote: "Golden hour bouquet against a haveli doorway",
      };
    case "featured-products":
      return {
        id: id(),
        type: "featured-products",
        heading: "New this week",
        subheading: "A preview, see the full collection on the Shop page",
        productIds: [],
      };
    case "about":
      return {
        id: id(),
        type: "about",
        heading: "Not another delivery app",
        body: "Florenza composes every bouquet like it's being photographed for a magazine, real flowers, real Lahore light, no stock imagery, no faces, just the arrangement doing the talking.",
        imageNote: "Terrazzo floor, single potted tree, arched mirror motif",
      };
    case "testimonial":
      return {
        id: id(),
        type: "testimonial",
        quote:
          "Ordered for my mother's birthday and the arrangement looked exactly like the photos, better, actually.",
        author: "Sana R.",
        authorContext: "DHA Phase 5, repeat customer",
      };
    case "newsletter":
      return {
        id: id(),
        type: "newsletter",
        heading: "Get first look at new arrangements",
        subheading: "One email a week, new grid drops and seasonal collections.",
        buttonText: "Subscribe",
      };
    case "footer":
      return {
        id: id(),
        type: "footer",
        businessName: "Florenza Flourish",
        tagline: "Luxury floral gifting, composed for Lahore.",
        city: "Lahore, Pakistan",
        instagramHandle: "@florenzaflourish",
      };
  }
}

/**
 * The site now has real, separate pages (Home / Shop / Product / Cart)
 * instead of one long scrolling page — this replaced an earlier
 * single-page block list on request, see CLAUDE.md's Website Builder
 * notes for the "why."
 *
 * Home is still the free-form block editor (add/reorder/edit blocks).
 * Shop, Product, and Cart are templated pages, not block-built — they
 * have a small amount of editable copy (heading/subheading) but their
 * structure is fixed, the same way Shopify's collection/product/cart
 * page *templates* work versus its freely-editable home page sections.
 */
export type SitePageId = "home" | "shop" | "product" | "cart";

export const sitePages: { id: SitePageId; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "shop", label: "Shop" },
  { id: "product", label: "Product" },
  { id: "cart", label: "Cart" },
];

export type ShopConfig = {
  heading: string;
  subheading: string;
};

export type Site = {
  home: Block[];
  shop: ShopConfig;
};

export function defaultSite(): Site {
  return {
    home: [
      createDefaultBlock("hero"),
      createDefaultBlock("featured-products"),
      createDefaultBlock("about"),
      createDefaultBlock("testimonial"),
      createDefaultBlock("newsletter"),
      createDefaultBlock("footer"),
    ],
    shop: {
      heading: "The full collection",
      subheading: "Every arrangement, straight from the locked catalogue in Product Management.",
    },
  };
}

/**
 * Storefront palette — deliberately separate from the dashboard's dark
 * theme tokens. The site being built is a light, warm luxury e-commerce
 * front end; the tool building it is dark. Keeping these constants
 * independent (not reusing --background/--foreground) is intentional.
 */
export const storefront = {
  bg: "#faf6ee",
  surface: "#ffffff",
  ink: "#241d15",
  muted: "#8a7a63",
  border: "#e8ddc9",
  accent: "#b8804a",
  accentSoft: "#f1e2cd",
};
