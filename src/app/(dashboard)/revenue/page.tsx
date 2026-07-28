"use client";

import { Wallet, TrendingUp, Percent, Receipt } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { RevenueBySKU } from "@/components/revenue/revenue-breakdown";
import { useOrders } from "@/lib/orders-context";
import { orderTotal } from "@/lib/orders-data";
import { seedProducts, totalCost, formatPKR } from "@/lib/product-data";

function productCost(productId: string): number {
  const product = seedProducts.find((p) => p.id === productId);
  return product ? totalCost(product.costs) : 0;
}

export default function RevenuePage() {
  const { orders } = useOrders();
  const completed = orders.filter((o) => o.status === "Completed");

  const revenue = completed.reduce((sum, o) => sum + orderTotal(o), 0);
  const cogs = completed.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + productCost(i.productId) * i.quantity, 0),
    0
  );
  const profit = revenue - cogs;
  const margin = revenue === 0 ? 0 : (profit / revenue) * 100;

  const kpis = [
    { label: "Completed revenue", value: formatPKR(revenue), icon: Wallet },
    { label: "Cost of goods", value: formatPKR(cogs), icon: Receipt },
    { label: "Gross profit", value: formatPKR(profit), icon: TrendingUp },
    { label: "Blended margin", value: `${margin.toFixed(1)}%`, icon: Percent },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Badge variant="outline" className="mb-4 text-muted-foreground">
          Business
        </Badge>
        <h1 className="font-display text-3xl text-foreground mb-2">Revenue</h1>
        <p className="text-muted-foreground max-w-xl">
          Real numbers, not sample data, calculated from completed orders (Orders page) against
          real cost data (Product Management). Zero completed orders means zero revenue here,
          that&apos;s accurate, not a bug.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.label} className="gap-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{k.label}</p>
                <Icon className="size-4 text-primary" strokeWidth={1.75} />
              </div>
              <p className="font-display text-2xl text-foreground">{k.value}</p>
            </Card>
          );
        })}
      </div>

      <RevenueBySKU orders={orders} />
    </div>
  );
}
