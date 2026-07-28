"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { seedProducts, formatPKR } from "@/lib/product-data";
import { type Order, type OrderLineItem, lineItemFromProduct } from "@/lib/orders-data";

export function AddOrderDialog({
  nextOrderNumber,
  onAdd,
}: {
  nextOrderNumber: string;
  onAdd: (order: Order) => void;
}) {
  const [open, setOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [notes, setNotes] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  function reset() {
    setCustomerName("");
    setCustomerContact("");
    setDeliveryDate("");
    setNotes("");
    setQuantities({});
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) reset();
  }

  const items: OrderLineItem[] = seedProducts
    .filter((p) => (quantities[p.id] ?? 0) > 0)
    .map((p) => lineItemFromProduct(p, quantities[p.id]));
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customerName.trim() || items.length === 0) return;
    onAdd({
      id: crypto.randomUUID(),
      orderNumber: nextOrderNumber,
      customerName: customerName.trim(),
      customerContact: customerContact.trim(),
      items,
      status: "Pending",
      fulfillmentStage: "Sourced",
      createdDate: new Date().toISOString().slice(0, 10),
      deliveryDate: deliveryDate || null,
      notes: notes.trim(),
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-4" />
          Record order
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Record order {nextOrderNumber}</DialogTitle>
          <DialogDescription>
            For orders taken by phone/WhatsApp, or once real checkout exists, this becomes where
            those orders land automatically instead.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cust-name">Customer name</Label>
              <Input id="cust-name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cust-contact">Contact</Label>
              <Input id="cust-contact" value={customerContact} onChange={(e) => setCustomerContact(e.target.value)} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Items</Label>
            <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto rounded-md border border-border p-2">
              {seedProducts.map((p) => (
                <div key={p.id} className="flex items-center gap-2.5 rounded px-1.5 py-1 text-sm">
                  <span className="flex-1 truncate">{p.name}</span>
                  <span className="text-xs text-muted-foreground tabular-nums w-20 text-right">
                    {formatPKR(p.price)}
                  </span>
                  <Input
                    type="number"
                    min={0}
                    value={quantities[p.id] ?? 0}
                    onChange={(e) =>
                      setQuantities((q) => ({ ...q, [p.id]: Number(e.target.value) || 0 }))
                    }
                    className="h-7 w-14 text-right"
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-right">Total: {formatPKR(total)}</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="delivery-date">Delivery date</Label>
            <Input id="delivery-date" type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="order-notes">Notes</Label>
            <Textarea id="order-notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={items.length === 0 || !customerName.trim()}>
              Record order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
