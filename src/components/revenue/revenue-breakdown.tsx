"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { type Order } from "@/lib/orders-data";
import { seedProducts, totalCost, formatPKR } from "@/lib/product-data";

function productCost(productId: string): number {
  const product = seedProducts.find((p) => p.id === productId);
  return product ? totalCost(product.costs) : 0;
}

export function RevenueBySKU({ orders }: { orders: Order[] }) {
  const bySku = new Map<string, { name: string; revenue: number; cost: number }>();

  orders
    .filter((o) => o.status === "Completed")
    .forEach((order) => {
      order.items.forEach((item) => {
        const entry = bySku.get(item.productId) ?? { name: item.name, revenue: 0, cost: 0 };
        entry.revenue += item.price * item.quantity;
        entry.cost += productCost(item.productId) * item.quantity;
        bySku.set(item.productId, entry);
      });
    });

  const data = Array.from(bySku.values())
    .map((d) => ({ name: d.name, revenue: d.revenue, profit: d.revenue - d.cost }))
    .sort((a, b) => b.revenue - a.revenue);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue by SKU</CardTitle>
        <CardDescription>
          From completed orders only, real margin against Product Management&apos;s cost data.
        </CardDescription>
      </CardHeader>
      {data.length === 0 ? (
        <p className="text-xs text-muted-foreground">No completed orders yet.</p>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={false}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} width={44} />
              <Tooltip
                cursor={{ fill: "var(--accent)" }}
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                  color: "var(--foreground)",
                }}
                formatter={(value) => formatPKR(Number(value))}
              />
              <Bar dataKey="revenue" fill="var(--chart-1)" radius={[4, 4, 0, 0]} maxBarSize={36} />
              <Bar dataKey="profit" fill="var(--chart-2)" radius={[4, 4, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      <div className="flex gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full" style={{ background: "var(--chart-1)" }} /> Revenue
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full" style={{ background: "var(--chart-2)" }} /> Gross profit
        </span>
      </div>
    </Card>
  );
}
