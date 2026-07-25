import {
  BarChart3,
  Building2,
  Wallet,
  Truck,
  ShoppingCart,
  PackageCheck,
  LayoutDashboard,
  Grid3x3,
  TrendingUp,
  CalendarRange,
  Radar,
  Newspaper,
  Tags,
  Globe,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
  /** What this page will eventually surface, shown in the placeholder state */
  comingSoon: string[];
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const navGroups: NavGroup[] = [
  {
    label: "Business",
    items: [
      {
        title: "Business Analytics",
        href: "/business-analytics",
        icon: BarChart3,
        description:
          "The top-level read on how Florenza is actually doing, across every venture line.",
        comingSoon: [
          "Revenue, margin, and order volume trends by week and month",
          "Channel performance breakdown (paid, organic, referral)",
          "SKU-level sell-through and pricing tier performance",
        ],
      },
      {
        title: "Business Structure",
        href: "/business-structure",
        icon: Building2,
        description:
          "How Florenza is organized: entity setup, roles, ownership, and operating workflows.",
        comingSoon: [
          "Org chart and role ownership across marketing, ops, and fulfillment",
          "Documented SOPs and decision rights",
          "Entity and compliance reference docs",
        ],
      },
      {
        title: "Product Management",
        href: "/product-management",
        icon: Tags,
        description:
          "Every SKU with its cost stack, pricing, and margin, so pricing decisions are made on real numbers.",
        comingSoon: [],
      },
      {
        title: "Revenue",
        href: "/revenue",
        icon: Wallet,
        description: "Where the money is actually coming from, and where it's going.",
        comingSoon: [
          "Revenue by SKU, pricing tier, and campaign",
          "Cost of goods and margin by bouquet type",
          "Payment method and settlement tracking",
        ],
      },
      {
        title: "Vendor Management",
        href: "/vendor-management",
        icon: Truck,
        description: "Florists, wrap suppliers, and delivery partners in one place.",
        comingSoon: [
          "Vendor directory with lead times and QC history",
          "Purchase order tracking",
          "Vendor scorecards (reliability, quality, price)",
        ],
      },
      {
        title: "Orders",
        href: "/orders",
        icon: ShoppingCart,
        description: "Every order, from checkout to delivered.",
        comingSoon: [
          "Live order queue with status filters",
          "Customer order history and repeat-order rate",
          "Order-level notes for gifting occasions and instructions",
        ],
      },
      {
        title: "Order Fulfillment",
        href: "/order-fulfillment",
        icon: PackageCheck,
        description: "The handoff from order confirmed to bouquet delivered.",
        comingSoon: [
          "Fulfillment pipeline board (sourced, assembled, QC, dispatched)",
          "Delivery partner SLAs and on-time rate",
          "Exception queue for delayed or failed deliveries",
        ],
      },
    ],
  },
  {
    label: "Content",
    items: [
      {
        title: "Content Dashboard",
        href: "/content-dashboard",
        icon: LayoutDashboard,
        description: "The command center for everything Florenza is publishing.",
        comingSoon: [
          "Content pipeline across pillars: Soft Life, For Them, Just Because, Dark Romance, Golden Hour",
          "Grid batch status and post queue",
          "Asset library for compositing sources and generated scenes",
        ],
      },
      {
        title: "Instagram Manager",
        href: "/instagram-manager",
        icon: Grid3x3,
        description:
          "Post ideas moving from backlog through draft, scheduled, and published, in one board.",
        comingSoon: [],
      },
      {
        title: "Analytics",
        href: "/analytics",
        icon: TrendingUp,
        description: "How content is actually performing, pillar by pillar.",
        comingSoon: [
          "Reach, saves, and engagement rate by content pillar",
          "Best-performing post and Reel breakdown",
          "Follower growth against grid batch releases",
        ],
      },
      {
        title: "Content Calendar",
        href: "/content-calendar",
        icon: CalendarRange,
        description:
          "Scheduled and published posts across every channel, one month at a time.",
        comingSoon: [],
      },
      {
        title: "Competitor Tracker",
        href: "/competitor-tracker",
        icon: Radar,
        description:
          "Competitor handles across Instagram, Facebook, and TikTok — followers, posting frequency, engagement, growth.",
        comingSoon: [],
      },
      {
        title: "News Consolidator",
        href: "/news-consolidator",
        icon: Newspaper,
        description:
          "Live flower and bouquet industry headlines, pulled from RSS and filterable by topic.",
        comingSoon: [],
      },
    ],
  },
  {
    label: "Website",
    items: [
      {
        title: "Website Builder",
        href: "/website-builder",
        icon: Globe,
        description:
          "Build the Florenza storefront section by section, with real SKUs pulled from Product Management, plus domain connectivity.",
        comingSoon: [],
      },
    ],
  },
];

export const allNavItems: NavItem[] = navGroups.flatMap((g) => g.items);

export function getNavItem(href: string) {
  for (const group of navGroups) {
    const item = group.items.find((i) => i.href === href);
    if (item) return { ...item, group: group.label };
  }
  throw new Error(`No nav item registered for route "${href}". Add it to nav-config.ts.`);
}
