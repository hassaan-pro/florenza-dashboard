"use client";

import { TrendingUp, TrendingDown, Percent, Wallet } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  type Product,
  marginPct,
  grossProfit,
  formatPKR,
} from "@/lib/product-data";

function average(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function KpiCards({ products }: { products: Product[] }) {
  const margins = products.map(marginPct);
  const avgMargin = average(margins);

  const best = products.reduce(
    (acc, p) => (marginPct(p) > marginPct(acc) ? p : acc),
    products[0]
  );
  const worst = products.reduce(
    (acc, p) => (marginPct(p) < marginPct(acc) ? p : acc),
    products[0]
  );

  const totalProfitIfOneEach = products.reduce((sum, p) => sum + grossProfit(p), 0);

  const belowTarget = products.filter((p) => marginPct(p) < 40).length;

  const cards = [
    {
      label: "Blended average margin",
      value: `${avgMargin.toFixed(1)}%`,
      icon: Percent,
      note: `across ${products.length} SKUs`,
    },
    {
      label: "Best margin SKU",
      value: best ? `${marginPct(best).toFixed(1)}%` : "—",
      icon: TrendingUp,
      note: best?.name ?? "",
      tone: "success" as const,
    },
    {
      label: "Lowest margin SKU",
      value: worst ? `${marginPct(worst).toFixed(1)}%` : "—",
      icon: TrendingDown,
      note: worst?.name ?? "",
      tone: worst && marginPct(worst) < 30 ? ("destructive" as const) : undefined,
    },
    {
      label: "Profit, one of each SKU",
      value: formatPKR(totalProfitIfOneEach),
      icon: Wallet,
      note: belowTarget > 0 ? `${belowTarget} SKU${belowTarget > 1 ? "s" : ""} below 40% margin` : "all SKUs at or above 40%",
      tone: belowTarget > 0 ? ("destructive" as const) : ("success" as const),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <Card key={c.label} className="gap-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{c.label}</p>
              <Icon
                className={cn(
                  "size-4",
                  c.tone === "success" && "text-success",
                  c.tone === "destructive" && "text-destructive",
                  !c.tone && "text-primary"
                )}
                strokeWidth={1.75}
              />
            </div>
            <p className="font-display text-2xl text-foreground">{c.value}</p>
            <p
              className={cn(
                "text-xs truncate",
                c.tone === "success" && "text-success",
                c.tone === "destructive" && "text-destructive",
                !c.tone && "text-muted-foreground"
              )}
            >
              {c.note}
            </p>
          </Card>
        );
      })}
    </div>
  );
}
