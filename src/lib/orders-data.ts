import { seedProducts, type Product } from "@/lib/product-data";

export type OrderStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";
export type FulfillmentStage = "Sourced" | "Assembled" | "QC" | "Dispatched" | "Delivered";

export type OrderLineItem = {
  productId: string;
  name: string;
  price: number; // PKR, snapshotted at order time from Product Management
  quantity: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerContact: string;
  items: OrderLineItem[];
  status: OrderStatus;
  fulfillmentStage: FulfillmentStage;
  createdDate: string;
  deliveryDate: string | null;
  notes: string;
};

export const orderStatuses: OrderStatus[] = ["Pending", "Confirmed", "Completed", "Cancelled"];
export const fulfillmentStages: FulfillmentStage[] = [
  "Sourced",
  "Assembled",
  "QC",
  "Dispatched",
  "Delivered",
];

export function orderTotal(order: Order): number {
  return order.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

export function lineItemFromProduct(product: Product, quantity: number): OrderLineItem {
  return { productId: product.id, name: product.name, price: product.price, quantity };
}

function nextOrderNumber(existing: Order[]): string {
  const max = existing.reduce((m, o) => {
    const n = Number(o.orderNumber.replace("FLZ-", ""));
    return Number.isFinite(n) && n > m ? n : m;
  }, 1000);
  return `FLZ-${max + 1}`;
}

/**
 * SAMPLE / PLACEHOLDER DATA.
 * Manually-recordable orders since real checkout is disabled (see
 * Website Builder's Stripe-removal notes) — this is a "record a sale"
 * workflow, not evidence of a live storefront taking real orders yet.
 * Revenue, Business Analytics, and Order Fulfillment all read this same
 * data, so it's the closest thing this dashboard has to a real
 * transactional source of truth.
 */
export const seedOrders: Order[] = [
  {
    id: "o1",
    orderNumber: "FLZ-1001",
    customerName: "Sana Raza",
    customerContact: "0300-1112233",
    items: [lineItemFromProduct(seedProducts[2], 1)],
    status: "Completed",
    fulfillmentStage: "Delivered",
    createdDate: "2026-07-14",
    deliveryDate: "2026-07-14",
    notes: "Birthday gift, DHA Phase 5.",
  },
  {
    id: "o2",
    orderNumber: "FLZ-1002",
    customerName: "Bilal Aslam",
    customerContact: "0321-4445566",
    items: [lineItemFromProduct(seedProducts[5], 1), lineItemFromProduct(seedProducts[0], 2)],
    status: "Completed",
    fulfillmentStage: "Delivered",
    createdDate: "2026-07-19",
    deliveryDate: "2026-07-19",
    notes: "Anniversary, added a Classic bouquet for the parents too.",
  },
  {
    id: "o3",
    orderNumber: "FLZ-1003",
    customerName: "Ayesha Khan",
    customerContact: "0333-7778899",
    items: [lineItemFromProduct(seedProducts[6], 1)],
    status: "Confirmed",
    fulfillmentStage: "Assembled",
    createdDate: "2026-07-24",
    deliveryDate: "2026-07-26",
    notes: "Corporate gifting, needs a card with no pricing shown.",
  },
  {
    id: "o4",
    orderNumber: "FLZ-1004",
    customerName: "Omar Sheikh",
    customerContact: "0345-2223344",
    items: [lineItemFromProduct(seedProducts[3], 1)],
    status: "Pending",
    fulfillmentStage: "Sourced",
    createdDate: "2026-07-25",
    deliveryDate: "2026-07-27",
    notes: "",
  },
];

export function generateOrderNumber(existing: Order[]): string {
  return nextOrderNumber(existing);
}

export function formatPKR(value: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value);
}
