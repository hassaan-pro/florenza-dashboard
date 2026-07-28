"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

import { type Order, type OrderStatus, type FulfillmentStage, seedOrders } from "@/lib/orders-data";

type OrdersContextValue = {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateStatus: (id: string, status: OrderStatus) => void;
  updateFulfillmentStage: (id: string, stage: FulfillmentStage) => void;
  removeOrder: (id: string) => void;
};

const OrdersContext = createContext<OrdersContextValue | null>(null);

/**
 * Wraps the (dashboard) route group (alongside InstagramPostsProvider)
 * so Orders is a single source of truth for Order Fulfillment, Revenue,
 * and Business Analytics — same pattern as instagram-context.tsx.
 * Session-only state, resets on reload, same gap as everything else.
 */
export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(seedOrders);

  function addOrder(order: Order) {
    setOrders((prev) => [order, ...prev]);
  }
  function updateStatus(id: string, status: OrderStatus) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }
  function updateFulfillmentStage(id: string, fulfillmentStage: FulfillmentStage) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, fulfillmentStage } : o)));
  }
  function removeOrder(id: string) {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  }

  return (
    <OrdersContext.Provider
      value={{ orders, addOrder, updateStatus, updateFulfillmentStage, removeOrder }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders(): OrdersContextValue {
  const ctx = useContext(OrdersContext);
  if (!ctx) {
    throw new Error("useOrders must be used within OrdersProvider");
  }
  return ctx;
}
