"use client";

import { Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  type Product,
  type CostBreakdown,
  type Tier,
  costFields,
  totalCost,
  grossProfit,
  marginPct,
  tierTargetMargin,
  formatPKR,
} from "@/lib/product-data";

const tiers: Tier[] = ["Classic", "Signature", "Luxury"];

function marginTone(product: Product) {
  const target = tierTargetMargin[product.tier];
  const m = marginPct(product);
  if (m < target.min) return "destructive";
  if (m > target.max) return "success";
  return "neutral";
}

function NumberCell({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
      className="w-20 rounded-md border border-transparent bg-transparent px-1.5 py-1 text-right text-sm tabular-nums text-foreground hover:border-border focus:border-primary focus:bg-background focus:outline-none"
    />
  );
}

export function ProductTable({
  products,
  onChange,
  onRemove,
}: {
  products: Product[];
  onChange: (id: string, updater: (p: Product) => Product) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-3 py-2.5 font-medium">SKU</th>
            <th className="px-3 py-2.5 font-medium">Product</th>
            <th className="px-3 py-2.5 font-medium">Tier</th>
            {costFields.map((f) => (
              <th key={f.key} className="px-3 py-2.5 font-medium text-right whitespace-nowrap">
                {f.label}
              </th>
            ))}
            <th className="px-3 py-2.5 font-medium text-right">Total cost</th>
            <th className="px-3 py-2.5 font-medium text-right">Price</th>
            <th className="px-3 py-2.5 font-medium text-right">Profit</th>
            <th className="px-3 py-2.5 font-medium text-right">Margin</th>
            <th className="px-3 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const cost = totalCost(p.costs);
            const profit = grossProfit(p);
            const margin = marginPct(p);
            const tone = marginTone(p);
            return (
              <tr key={p.id} className="border-b border-border/70 last:border-0 hover:bg-secondary/20">
                <td className="px-3 py-2 font-mono text-xs text-muted-foreground whitespace-nowrap">
                  {p.sku}
                </td>
                <td className="px-3 py-2">
                  <input
                    value={p.name}
                    onChange={(e) =>
                      onChange(p.id, (prod) => ({ ...prod, name: e.target.value }))
                    }
                    className="w-40 rounded-md border border-transparent bg-transparent px-1.5 py-1 text-sm text-foreground hover:border-border focus:border-primary focus:bg-background focus:outline-none"
                  />
                </td>
                <td className="px-3 py-2">
                  <select
                    value={p.tier}
                    onChange={(e) =>
                      onChange(p.id, (prod) => ({ ...prod, tier: e.target.value as Tier }))
                    }
                    className="rounded-md border border-border bg-transparent px-1.5 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
                  >
                    {tiers.map((t) => (
                      <option key={t} value={t} className="bg-card">
                        {t}
                      </option>
                    ))}
                  </select>
                </td>
                {costFields.map((f) => (
                  <td key={f.key} className="px-3 py-2 text-right">
                    <NumberCell
                      value={p.costs[f.key]}
                      onChange={(v) =>
                        onChange(p.id, (prod) => ({
                          ...prod,
                          costs: { ...prod.costs, [f.key]: v } as CostBreakdown,
                        }))
                      }
                    />
                  </td>
                ))}
                <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
                  {formatPKR(cost)}
                </td>
                <td className="px-3 py-2 text-right">
                  <NumberCell
                    value={p.price}
                    onChange={(v) => onChange(p.id, (prod) => ({ ...prod, price: v }))}
                  />
                </td>
                <td
                  className={cn(
                    "px-3 py-2 text-right tabular-nums font-medium",
                    profit >= 0 ? "text-foreground" : "text-destructive"
                  )}
                >
                  {formatPKR(profit)}
                </td>
                <td className="px-3 py-2 text-right">
                  <Badge
                    variant={
                      tone === "destructive"
                        ? "destructive"
                        : tone === "success"
                        ? "success"
                        : "secondary"
                    }
                    className="tabular-nums"
                  >
                    {margin.toFixed(1)}%
                  </Badge>
                </td>
                <td className="px-2 py-2 text-right">
                  <button
                    onClick={() => onRemove(p.id)}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
                    aria-label={`Remove ${p.name}`}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
