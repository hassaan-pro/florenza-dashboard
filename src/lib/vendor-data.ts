export type VendorCategory = "Florist" | "Wrap & Packaging" | "Delivery Partner" | "Other";
export type VendorStatus = "Active" | "On Hold" | "Under Review";
export type POStatus = "Draft" | "Sent" | "Fulfilled" | "Cancelled";

export type Vendor = {
  id: string;
  name: string;
  category: VendorCategory;
  contact: string;
  leadTimeDays: number;
  reliability: number; // 1-5
  quality: number; // 1-5
  priceRating: number; // 1-5, higher = better value
  status: VendorStatus;
  notes: string;
};

export type PurchaseOrder = {
  id: string;
  vendorId: string;
  description: string;
  quantity: number;
  cost: number; // PKR
  status: POStatus;
  orderedDate: string;
  expectedDate: string | null;
};

export const vendorCategories: VendorCategory[] = [
  "Florist",
  "Wrap & Packaging",
  "Delivery Partner",
  "Other",
];
export const vendorStatuses: VendorStatus[] = ["Active", "On Hold", "Under Review"];
export const poStatuses: POStatus[] = ["Draft", "Sent", "Fulfilled", "Cancelled"];

/**
 * SAMPLE / PLACEHOLDER DATA. Illustrative vendor set so the page works
 * out of the box. Replace with Florenza's real vendor list.
 */
export const seedVendors: Vendor[] = [
  {
    id: "v1",
    name: "Lahore Wholesale Flower Market",
    category: "Florist",
    contact: "Zafar · 0300-1234567",
    leadTimeDays: 1,
    reliability: 4,
    quality: 4,
    priceRating: 5,
    status: "Active",
    notes: "Primary bulk flower source, early-morning pickup only.",
  },
  {
    id: "v2",
    name: "Rose Valley Farms",
    category: "Florist",
    contact: "Ahmed · rosevalley@example.com",
    leadTimeDays: 2,
    reliability: 5,
    quality: 5,
    priceRating: 3,
    status: "Active",
    notes: "Premium roses for Luxury tier, pricier but consistent stem quality.",
  },
  {
    id: "v3",
    name: "Sialkot Kraft & Wrap Co.",
    category: "Wrap & Packaging",
    contact: "Bilal · 0321-9876543",
    leadTimeDays: 5,
    reliability: 4,
    quality: 4,
    priceRating: 4,
    status: "Active",
    notes: "Kraft wrap, ribbon, and hat boxes. Bulk orders only, 5-day lead time.",
  },
  {
    id: "v4",
    name: "TCS Same-Day Lahore",
    category: "Delivery Partner",
    contact: "Corporate desk · 021-111-123456",
    leadTimeDays: 0,
    reliability: 4,
    quality: 3,
    priceRating: 3,
    status: "Active",
    notes: "Same-day DHA/Gulberg delivery, standard courier handling.",
  },
  {
    id: "v5",
    name: "In-house rider (part-time)",
    category: "Delivery Partner",
    contact: "Hamza · 0333-4567890",
    leadTimeDays: 0,
    reliability: 3,
    quality: 5,
    priceRating: 5,
    status: "Under Review",
    notes: "More careful handling for fragile Luxury arrangements, limited availability.",
  },
];

export const seedPurchaseOrders: PurchaseOrder[] = [
  {
    id: "po1",
    vendorId: "v1",
    description: "Mixed seasonal stems, weekly restock",
    quantity: 40,
    cost: 28000,
    status: "Fulfilled",
    orderedDate: "2026-07-18",
    expectedDate: "2026-07-19",
  },
  {
    id: "po2",
    vendorId: "v2",
    description: "Garden roses, Luxury tier batch",
    quantity: 15,
    cost: 22500,
    status: "Sent",
    orderedDate: "2026-07-23",
    expectedDate: "2026-07-25",
  },
  {
    id: "po3",
    vendorId: "v3",
    description: "Kraft wrap + ribbon restock, 200 units",
    quantity: 200,
    cost: 45000,
    status: "Draft",
    orderedDate: "2026-07-24",
    expectedDate: null,
  },
];

export function averageScore(vendors: Vendor[], field: "reliability" | "quality" | "priceRating"): number {
  if (vendors.length === 0) return 0;
  return vendors.reduce((sum, v) => sum + v[field], 0) / vendors.length;
}

export function formatPKR(value: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value);
}
