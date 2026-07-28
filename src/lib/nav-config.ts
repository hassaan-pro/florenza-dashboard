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
        description: "Cross-venture rollup, live from Orders, Product Management, and Instagram Manager.",
        comingSoon: [],
      },
      {
        title: "Business Structure",
        href: "/business-structure",
        icon: Building2,
        description: "Org structure, reporting lines, and SOPs across marketing, ops, fulfillment, finance.",
        comingSoon: [],
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
        description: "Real revenue and margin, calculated from completed orders against real cost data.",
        comingSoon: [],
      },
      {
        title: "Vendor Management",
        href: "/vendor-management",
        icon: Truck,
        description: "Florists, wrap suppliers, and delivery partners, with scorecards and purchase orders.",
        comingSoon: [],
      },
      {
        title: "Orders",
        href: "/orders",
        icon: ShoppingCart,
        description: "Every order, from record-taking to delivered — the shared source of truth for Revenue and Fulfillment.",
        comingSoon: [],
      },
      {
        title: "Order Fulfillment",
        href: "/order-fulfillment",
        icon: PackageCheck,
        description: "The handoff from order confirmed to bouquet delivered, same orders as the Orders page.",
        comingSoon: [],
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
        description: "Pillar breakdown (live from Instagram Manager), grid batches, and the asset library.",
        comingSoon: [],
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
        description: "Content pipeline performance, live from Instagram Manager. Engagement metrics pending the real Instagram connection.",
        comingSoon: [],
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
