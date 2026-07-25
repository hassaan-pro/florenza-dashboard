"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { costFields, type Product } from "@/lib/product-data";

const segmentColor: Record<string, string> = {
  flowers: "var(--chart-1)",
  wrap: "var(--chart-5)",
  labor: "var(--chart-2)",
  delivery: "var(--chart-4)",
  overhead: "var(--chart-3)",
};

export function CostBreakdownChart({ products }: { products: Product[] }) {
  const data = products.map((p) => ({
    name: p.sku,
    ...p.costs,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost composition</CardTitle>
        <CardDescription>What each SKU&apos;s cost stack is made of, in PKR.</CardDescription>
      </CardHeader>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
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
              width={46}
            />
            <Tooltip
              cursor={{ fill: "var(--accent)" }}
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
                color: "var(--foreground)",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, color: "var(--muted-foreground)" }}
              formatter={(value: string) => costFields.find((f) => f.key === value)?.label ?? value}
            />
            {costFields.map((f, i) => (
              <Bar
                key={f.key}
                dataKey={f.key}
                stackId="cost"
                fill={segmentColor[f.key]}
                radius={i === costFields.length - 1 ? [4, 4, 0, 0] : undefined}
                maxBarSize={36}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
