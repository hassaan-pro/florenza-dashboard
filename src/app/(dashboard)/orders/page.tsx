"use client";

import { Package2, DollarSign, Clock, CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { OrderTable } from "@/components/orders/order-table";
import { AddOrderDialog } from "@/components/orders/add-order-dialog";
import { useOrders } from "@/lib/orders-context";
import { orderTotal, generateOrderNumber, formatPKR } from "@/lib/orders-data";

export default function OrdersPage() {
  const { orders, addOrder, updateStatus, removeOrder } = useOrders();

  const activeOrders = orders.filter((o) => o.status !== "Cancelled");
  const completedRevenue = orders
    .filter((o) => o.status === "Completed")
    .reduce((sum, o) => sum + orderTotal(o), 0);
  const pendingCount = orders.filter((o) => o.status === "Pending").length;
  const avgOrderValue =
    activeOrders.length === 0
      ? 0
      : activeOrders.reduce((sum, o) => sum + orderTotal(o), 0) / activeOrders.length;

  const kpis = [
    { label: "Orders", value: String(orders.length), icon: Package2 },
    { label: "Completed revenue", value: formatPKR(completedRevenue), icon: DollarSign },
    { label: "Pending", value: String(pendingCount), icon: Clock },
    { label: "Avg order value", value: formatPKR(avgOrderValue), icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <Badge variant="outline" className="mb-4 text-muted-foreground">
            Business
          </Badge>
          <h1 className="font-display text-3xl text-foreground mb-2">Orders</h1>
          <p className="text-muted-foreground max-w-xl">
            Every order, real checkout isn&apos;t connected yet (see Website Builder), so this
            is where orders taken by phone or WhatsApp get recorded. This same data feeds Order
            Fulfillment, Revenue, and Business Analytics.
          </p>
        </div>
        <AddOrderDialog nextOrderNumber={generateOrderNumber(orders)} onAdd={addOrder} />
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

      <OrderTable orders={orders} onStatusChange={updateStatus} onRemove={removeOrder} />
    </div>
  );
}
