"use client";

import { useState } from "react";
import { Info, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KpiCards } from "@/components/product-management/kpi-cards";
import { ProductTable } from "@/components/product-management/product-table";
import { MarginChart } from "@/components/product-management/margin-chart";
import { CostBreakdownChart } from "@/components/product-management/cost-breakdown-chart";
import { PricingStrategy } from "@/components/product-management/pricing-strategy";
import { type Product, seedProducts } from "@/lib/product-data";

function newProduct(index: number): Product {
  return {
    id: crypto.randomUUID(),
    sku: `FLZ-NEW-${String(index).padStart(2, "0")}`,
    name: "New product",
    tier: "Classic",
    price: 0,
    costs: { flowers: 0, wrap: 0, labor: 0, delivery: 0, overhead: 0 },
  };
}

export default function ProductManagementPage() {
  const [products, setProducts] = useState<Product[]>(seedProducts);

  function updateProduct(id: string, updater: (p: Product) => Product) {
    setProducts((prev) => prev.map((p) => (p.id === id ? updater(p) : p)));
  }

  function removeProduct(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  function addProduct() {
    setProducts((prev) => [...prev, newProduct(prev.length + 1)]);
  }

  return (
    <div className="space-y-6">
      <div>
        <Badge variant="outline" className="mb-4 text-muted-foreground">
          Business
        </Badge>
        <h1 className="font-display text-3xl text-foreground mb-2">Product Management</h1>
        <p className="text-muted-foreground max-w-2xl">
          Every SKU with its full cost stack, selling price, profit, and margin. Edit any
          number inline, everything downstream recalculates live.
        </p>
      </div>

      <div className="flex items-start gap-2.5 rounded-lg border border-primary/25 bg-primary/5 px-4 py-3 text-sm text-foreground/85">
        <Info className="size-4 shrink-0 mt-0.5 text-primary" strokeWidth={1.75} />
        <p>
          The 8 SKUs below are placeholder sample data so the dashboard works out of the box.
          Replace them with the real, locked 15-SKU catalogue (edit inline, or hand me the
          list and I&apos;ll swap it into <code className="text-xs">src/lib/product-data.ts</code>).
          Nothing here persists between page reloads yet, there&apos;s no data layer wired up.
        </p>
      </div>

      <KpiCards products={products} />

      <PricingStrategy products={products} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <MarginChart products={products} />
        <CostBreakdownChart products={products} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg text-foreground">Catalogue</h2>
          <Button size="sm" variant="secondary" onClick={addProduct}>
            <Plus className="size-4" />
            Add product
          </Button>
        </div>
        <ProductTable products={products} onChange={updateProduct} onRemove={removeProduct} />
      </div>
    </div>
  );
}
