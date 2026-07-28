"use client";

import { Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import {
  type Order,
  type OrderStatus,
  orderStatuses,
  orderTotal,
  formatPKR,
} from "@/lib/orders-data";

function statusVariant(status: OrderStatus) {
  if (status === "Completed") return "success" as const;
  if (status === "Cancelled") return "destructive" as const;
  if (status === "Confirmed") return "default" as const;
  return "secondary" as const;
}

export function OrderTable({
  orders,
  onStatusChange,
  onRemove,
}: {
  orders: Order[];
  onStatusChange: (id: string, status: OrderStatus) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-3 py-2.5 font-medium">Order</th>
            <th className="px-3 py-2.5 font-medium">Customer</th>
            <th className="px-3 py-2.5 font-medium">Items</th>
            <th className="px-3 py-2.5 font-medium text-right">Total</th>
            <th className="px-3 py-2.5 font-medium">Placed</th>
            <th className="px-3 py-2.5 font-medium">Delivery</th>
            <th className="px-3 py-2.5 font-medium">Status</th>
            <th className="px-2 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-3 py-6 text-center text-xs text-muted-foreground">
                No orders yet.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id} className="border-b border-border/70 last:border-0 hover:bg-secondary/20 align-top">
                <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground whitespace-nowrap">
                  {order.orderNumber}
                </td>
                <td className="px-3 py-2.5">
                  <p className="text-foreground/90">{order.customerName}</p>
                  <p className="text-xs text-muted-foreground">{order.customerContact}</p>
                </td>
                <td className="px-3 py-2.5 text-xs text-muted-foreground">
                  {order.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}
                </td>
                <td className="px-3 py-2.5 text-right tabular-nums whitespace-nowrap">
                  {formatPKR(orderTotal(order))}
                </td>
                <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                  {order.createdDate}
                </td>
                <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                  {order.deliveryDate ?? "—"}
                </td>
                <td className="px-3 py-2.5">
                  <Select
                    value={order.status}
                    onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
                    className="h-8 text-xs w-28"
                  >
                    {orderStatuses.map((s) => (
                      <option key={s} value={s} className="bg-card">
                        {s}
                      </option>
                    ))}
                  </Select>
                  <Badge variant={statusVariant(order.status)} className="mt-1.5">
                    {order.status}
                  </Badge>
                </td>
                <td className="px-2 py-2.5 text-right">
                  <button
                    onClick={() => onRemove(order.id)}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
                    aria-label={`Remove ${order.orderNumber}`}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
