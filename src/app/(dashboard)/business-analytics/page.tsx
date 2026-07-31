"use client";

import { Wallet, Package2, Grid3x3, Tags } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useOrders } from "@/lib/orders-context";
import { useInstagramPosts } from "@/lib/instagram-context";
import { useProducts } from "@/lib/products-context";
import { orderTotal } from "@/lib/orders-data";
import { formatPKR, marginPct } from "@/lib/product-data";

export default function BusinessAnalyticsPage() {
  const { orders } = useOrders();
  const { posts } = useInstagramPosts();
  const { products } = useProducts();

  const completed = orders.filter((o) => o.status === "Completed");
  const revenue = completed.reduce((sum, o) => sum + orderTotal(o), 0);
  const avgMargin =
    products.reduce((sum, p) => sum + marginPct(p), 0) / (products.length || 1);

  const published = posts.filter((p) => p.status === "Published").length;
  const scheduled = posts.filter((p) => p.status === "Scheduled").length;
  const inPipeline = posts.filter((p) => p.status === "Draft" || p.status === "Backlog").length;

  const kpis = [
    { label: "Completed revenue", value: formatPKR(revenue), icon: Wallet, note: `${completed.length} completed orders` },
    { label: "Orders in flight", value: String(orders.filter((o) => o.status === "Pending" || o.status === "Confirmed").length), icon: Package2, note: "Pending + Confirmed" },
    { label: "Catalogue", value: `${products.length} SKUs`, icon: Tags, note: `${avgMargin.toFixed(1)}% avg margin` },
    { label: "Content pipeline", value: `${published} published`, icon: Grid3x3, note: `${scheduled} scheduled, ${inPipeline} in progress` },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Badge variant="outline" className="mb-4 text-muted-foreground">
          Business
        </Badge>
        <h1 className="font-display text-3xl text-foreground mb-2">Business Analytics</h1>
        <p className="text-muted-foreground max-w-xl">
          The top-level read across every venture line, pulled from the same live data as
          Orders, Revenue, Product Management, and Instagram Manager, not a separate set of
          numbers.
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
              <p className="text-xs text-muted-foreground">{k.note}</p>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What this is actually built from</CardTitle>
          <CardDescription>
            Every number above traces to a real page in this dashboard, not a separate analytics
            data source.
          </CardDescription>
        </CardHeader>
        <ul className="space-y-2 text-sm text-foreground/85">
          <li>• Revenue and order counts — live from the shared Orders context (Orders page)</li>
          <li>• Catalogue size and average margin — live from Product Management&apos;s SKU list</li>
          <li>• Content pipeline counts — live from the shared Instagram posts context (Instagram Manager)</li>
        </ul>
        <p className="text-xs text-muted-foreground pt-2">
          Nothing here is fabricated for this page specifically, if a number looks low, it&apos;s
          because the underlying page has little data in it yet, not because this page is
          summarizing something different.
        </p>
      </Card>
    </div>
  );
}
