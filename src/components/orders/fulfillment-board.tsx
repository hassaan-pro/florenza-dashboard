"use client";

import { Inbox } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import {
  type Order,
  type FulfillmentStage,
  fulfillmentStages,
  orderTotal,
  formatPKR,
} from "@/lib/orders-data";

const stageHint: Record<FulfillmentStage, string> = {
  Sourced: "Flowers/materials secured",
  Assembled: "Bouquet composed",
  QC: "Photographed against order spec",
  Dispatched: "Handed to delivery",
  Delivered: "Confirmed at destination",
};

export function FulfillmentBoard({
  orders,
  onStageChange,
}: {
  orders: Order[];
  onStageChange: (id: string, stage: FulfillmentStage) => void;
}) {
  const active = orders.filter((o) => o.status !== "Cancelled");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
      {fulfillmentStages.map((stage) => {
        const stageOrders = active.filter((o) => o.fulfillmentStage === stage);
        return (
          <div key={stage} className="flex flex-col gap-3 min-w-0">
            <div>
              <div className="flex items-center justify-between">
                <p className="font-display text-sm text-foreground">{stage}</p>
                <Badge variant="secondary">{stageOrders.length}</Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">{stageHint[stage]}</p>
            </div>

            <div className="flex flex-col gap-3">
              {stageOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-8 text-center">
                  <Inbox className="size-4 text-muted-foreground/50" strokeWidth={1.75} />
                  <p className="text-xs text-muted-foreground/70">Nothing here</p>
                </div>
              ) : (
                stageOrders.map((order) => (
                  <Card key={order.id} className="gap-2 p-3.5">
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-xs text-muted-foreground">{order.orderNumber}</p>
                      <p className="text-xs font-medium text-foreground">{formatPKR(orderTotal(order))}</p>
                    </div>
                    <p className="text-sm text-foreground/90">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {order.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}
                    </p>
                    {order.deliveryDate && (
                      <p className="text-[11px] text-muted-foreground/70">Due {order.deliveryDate}</p>
                    )}
                    <Select
                      value={order.fulfillmentStage}
                      onChange={(e) => onStageChange(order.id, e.target.value as FulfillmentStage)}
                      className="h-7 text-xs mt-1"
                    >
                      {fulfillmentStages.map((s) => (
                        <option key={s} value={s} className="bg-card">
                          {s}
                        </option>
                      ))}
                    </Select>
                  </Card>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
