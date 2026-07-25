"use client";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  type Product,
  type Tier,
  marginPct,
  tierTargetMargin,
} from "@/lib/product-data";

const tierNotes: Record<Tier, string> = {
  Classic:
    "Entry point of the catalogue. Priced to win first-time and impulse orders without training customers to expect discounts. Margin is thinner here on purpose, it's the acquisition tier.",
  Signature:
    "The volume tier and the one the pillar content (Soft Life, For Them, Just Because) is built to sell. This is where blended margin should live.",
  Luxury:
    "Positioning tier, not a volume tier. Priced against elite residential gifting, not against other flower delivery apps. Margin should be the widest here since the buyer isn't price-anchoring the way they would on Classic.",
};

export function PricingStrategy({ products }: { products: Product[] }) {
  const tiers: Tier[] = ["Classic", "Signature", "Luxury"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing strategy</CardTitle>
        <CardDescription>
          Tiered, cost-plus pricing. Each tier has a target margin band, not a fixed markup, so individual SKUs can flex with cost of flowers without breaking the tier&apos;s position.
        </CardDescription>
      </CardHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tiers.map((tier) => {
          const tierProducts = products.filter((p) => p.tier === tier);
          const avg =
            tierProducts.length === 0
              ? 0
              : tierProducts.reduce((s, p) => s + marginPct(p), 0) / tierProducts.length;
          const target = tierTargetMargin[tier];
          const inBand = avg >= target.min && avg <= target.max;

          return (
            <div key={tier} className="rounded-lg border border-border p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="font-display text-base text-foreground">{tier}</p>
                <span
                  className={cn(
                    "text-xs rounded-full px-2 py-0.5 border",
                    inBand
                      ? "border-success/30 bg-success/15 text-success"
                      : "border-destructive/30 bg-destructive/15 text-destructive"
                  )}
                >
                  {tierProducts.length} SKU{tierProducts.length === 1 ? "" : "s"}
                </span>
              </div>

              <div>
                <p className="text-2xl font-display text-foreground">
                  {avg.toFixed(1)}%
                  <span className="text-sm text-muted-foreground font-sans"> avg margin</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  target {target.min}–{target.max}%
                </p>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">{tierNotes[tier]}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
