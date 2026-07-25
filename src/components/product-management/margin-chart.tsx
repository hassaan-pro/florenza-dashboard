"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { type Product, marginPct, tierTargetMargin } from "@/lib/product-data";

const tierColor: Record<string, string> = {
  Classic: "var(--chart-4)",
  Signature: "var(--chart-1)",
  Luxury: "var(--chart-3)",
};

export function MarginChart({ products }: { products: Product[] }) {
  const data = [...products]
    .sort((a, b) => marginPct(b) - marginPct(a))
    .map((p) => ({
      name: p.sku,
      margin: Number(marginPct(p).toFixed(1)),
      tier: p.tier,
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Margin by SKU</CardTitle>
        <CardDescription>
          Gross margin against each product&apos;s cost stack. Dashed line marks the 40% floor.
        </CardDescription>
      </CardHeader>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              unit="%"
              width={40}
            />
            <ReferenceLine y={40} stroke="var(--destructive)" strokeDasharray="4 4" />
            <Tooltip
              cursor={{ fill: "var(--accent)" }}
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
                color: "var(--foreground)",
              }}
              formatter={(value) => [`${value}%`, "Margin"]}
            />
            <Bar dataKey="margin" radius={[4, 4, 0, 0]} maxBarSize={36}>
              {data.map((d) => (
                <Cell key={d.name} fill={tierColor[d.tier] ?? "var(--primary)"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-1.5 pt-1">
        {Object.entries(tierTargetMargin).map(([tier, range]) => (
          <div key={tier} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className="size-2 rounded-full"
              style={{ background: tierColor[tier] }}
            />
            {tier} target {range.min}–{range.max}%
          </div>
        ))}
      </div>
    </Card>
  );
}
