export type Tier = "Classic" | "Signature" | "Luxury";

export type CostBreakdown = {
  flowers: number;
  wrap: number;
  labor: number;
  delivery: number;
  overhead: number;
};

export type Product = {
  id: string;
  sku: string;
  name: string;
  tier: Tier;
  price: number;
  costs: CostBreakdown;
  imageUrl?: string; // base64 data URL from the image uploader, or unset for the placeholder
};

export const costFields: { key: keyof CostBreakdown; label: string }[] = [
  { key: "flowers", label: "Flowers & foliage" },
  { key: "wrap", label: "Wrap & packaging" },
  { key: "labor", label: "Labor / arranging" },
  { key: "delivery", label: "Delivery" },
  { key: "overhead", label: "Overhead" },
];

export const tierTargetMargin: Record<Tier, { min: number; max: number }> = {
  Classic: { min: 35, max: 45 },
  Signature: { min: 45, max: 55 },
  Luxury: { min: 50, max: 60 },
};

/**
 * SAMPLE / PLACEHOLDER DATA.
 * Florenza's real, locked 15-SKU catalogue (with pricing tiers and SKU codes)
 * lives outside this repo. These 8 rows are illustrative so the dashboard is
 * usable and demonstrates the calculations correctly — swap them for the
 * real catalogue before using this for actual pricing decisions.
 * All figures in PKR.
 */
export const seedProducts: Product[] = [
  {
    id: "1",
    sku: "FLZ-CLS-01",
    name: "Everyday Blush Bouquet",
    tier: "Classic",
    price: 3800,
    costs: { flowers: 1450, wrap: 280, labor: 350, delivery: 400, overhead: 220 },
  },
  {
    id: "2",
    sku: "FLZ-CLS-02",
    name: "Just Because Posy",
    tier: "Classic",
    price: 3200,
    costs: { flowers: 1250, wrap: 250, labor: 300, delivery: 400, overhead: 200 },
  },
  {
    id: "3",
    sku: "FLZ-SIG-01",
    name: "Golden Hour Arrangement",
    tier: "Signature",
    price: 6500,
    costs: { flowers: 2400, wrap: 450, labor: 550, delivery: 450, overhead: 350 },
  },
  {
    id: "4",
    sku: "FLZ-SIG-02",
    name: "Soft Life Hat Box",
    tier: "Signature",
    price: 7200,
    costs: { flowers: 2650, wrap: 600, labor: 600, delivery: 450, overhead: 380 },
  },
  {
    id: "5",
    sku: "FLZ-SIG-03",
    name: "For Them Mixed Vase",
    tier: "Signature",
    price: 6800,
    costs: { flowers: 2500, wrap: 480, labor: 580, delivery: 450, overhead: 360 },
  },
  {
    id: "6",
    sku: "FLZ-LUX-01",
    name: "Dark Romance Statement",
    tier: "Luxury",
    price: 12500,
    costs: { flowers: 4600, wrap: 900, labor: 950, delivery: 500, overhead: 650 },
  },
  {
    id: "7",
    sku: "FLZ-LUX-02",
    name: "Grand Haveli Centrepiece",
    tier: "Luxury",
    price: 15800,
    costs: { flowers: 5900, wrap: 1100, labor: 1150, delivery: 500, overhead: 780 },
  },
  {
    id: "8",
    sku: "FLZ-LUX-03",
    name: "Signature Gift Trunk",
    tier: "Luxury",
    price: 13900,
    costs: { flowers: 5100, wrap: 1400, labor: 1000, delivery: 500, overhead: 700 },
  },
];

export function totalCost(costs: CostBreakdown): number {
  return costs.flowers + costs.wrap + costs.labor + costs.delivery + costs.overhead;
}

export function grossProfit(product: Product): number {
  return product.price - totalCost(product.costs);
}

export function marginPct(product: Product): number {
  if (product.price === 0) return 0;
  return (grossProfit(product) / product.price) * 100;
}

export function markupPct(product: Product): number {
  const cost = totalCost(product.costs);
  if (cost === 0) return 0;
  return (grossProfit(product) / cost) * 100;
}

export function formatPKR(value: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value);
}
