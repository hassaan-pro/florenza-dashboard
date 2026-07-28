"use client";

import { Badge } from "@/components/ui/badge";
import { FulfillmentBoard } from "@/components/orders/fulfillment-board";
import { useOrders } from "@/lib/orders-context";

export default function OrderFulfillmentPage() {
  const { orders, updateFulfillmentStage } = useOrders();

  return (
    <div className="space-y-6">
      <div>
        <Badge variant="outline" className="mb-4 text-muted-foreground">
          Business
        </Badge>
        <h1 className="font-display text-3xl text-foreground mb-2">Order Fulfillment</h1>
        <p className="text-muted-foreground max-w-xl">
          The handoff from order confirmed to bouquet delivered. Same orders as the Orders page,
          move them through the pipeline here.
        </p>
      </div>

      <FulfillmentBoard orders={orders} onStageChange={updateFulfillmentStage} />
    </div>
  );
}
