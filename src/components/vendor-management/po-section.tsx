"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

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
import { Select } from "@/components/ui/select";
import {
  type Vendor,
  type PurchaseOrder,
  type POStatus,
  poStatuses,
  formatPKR,
} from "@/lib/vendor-data";

function AddPODialog({
  vendors,
  onAdd,
}: {
  vendors: Vendor[];
  onAdd: (po: PurchaseOrder) => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    vendorId: vendors[0]?.id ?? "",
    description: "",
    quantity: 1,
    cost: 0,
    expectedDate: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.vendorId || !form.description.trim()) return;
    onAdd({
      id: crypto.randomUUID(),
      vendorId: form.vendorId,
      description: form.description.trim(),
      quantity: form.quantity,
      cost: form.cost,
      status: "Draft",
      orderedDate: new Date().toISOString().slice(0, 10),
      expectedDate: form.expectedDate || null,
    });
    setForm({ vendorId: vendors[0]?.id ?? "", description: "", quantity: 1, cost: 0, expectedDate: "" });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">
          <Plus className="size-3.5" />
          New PO
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New purchase order</DialogTitle>
          <DialogDescription>Starts as Draft, update its status once it&apos;s actually sent.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="po-vendor">Vendor</Label>
            <Select
              id="po-vendor"
              value={form.vendorId}
              onChange={(e) => setForm((f) => ({ ...f, vendorId: e.target.value }))}
            >
              {vendors.map((v) => (
                <option key={v.id} value={v.id} className="bg-card">
                  {v.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="po-desc">Description</Label>
            <Input
              id="po-desc"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="po-qty">Quantity</Label>
              <Input
                id="po-qty"
                type="number"
                min={1}
                value={form.quantity}
                onChange={(e) => setForm((f) => ({ ...f, quantity: Number(e.target.value) || 1 }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="po-cost">Cost (PKR)</Label>
              <Input
                id="po-cost"
                type="number"
                min={0}
                value={form.cost}
                onChange={(e) => setForm((f) => ({ ...f, cost: Number(e.target.value) || 0 }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="po-date">Expected</Label>
              <Input
                id="po-date"
                type="date"
                value={form.expectedDate}
                onChange={(e) => setForm((f) => ({ ...f, expectedDate: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={vendors.length === 0}>
              Add PO
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function PurchaseOrderSection({
  vendors,
  orders,
  onAdd,
  onStatusChange,
  onRemove,
}: {
  vendors: Vendor[];
  orders: PurchaseOrder[];
  onAdd: (po: PurchaseOrder) => void;
  onStatusChange: (id: string, status: POStatus) => void;
  onRemove: (id: string) => void;
}) {
  function vendorName(id: string) {
    return vendors.find((v) => v.id === id)?.name ?? "Unknown vendor";
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-foreground">Purchase orders</h2>
        <AddPODialog vendors={vendors} onAdd={onAdd} />
      </div>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-3 py-2.5 font-medium">Vendor</th>
              <th className="px-3 py-2.5 font-medium">Description</th>
              <th className="px-3 py-2.5 font-medium text-right">Qty</th>
              <th className="px-3 py-2.5 font-medium text-right">Cost</th>
              <th className="px-3 py-2.5 font-medium">Ordered</th>
              <th className="px-3 py-2.5 font-medium">Expected</th>
              <th className="px-3 py-2.5 font-medium">Status</th>
              <th className="px-2 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-3 py-6 text-center text-xs text-muted-foreground">
                  No purchase orders yet.
                </td>
              </tr>
            ) : (
              orders.map((po) => (
                <tr key={po.id} className="border-b border-border/70 last:border-0 hover:bg-secondary/20">
                  <td className="px-3 py-2.5 whitespace-nowrap">{vendorName(po.vendorId)}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{po.description}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{po.quantity}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{formatPKR(po.cost)}</td>
                  <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">{po.orderedDate}</td>
                  <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                    {po.expectedDate ?? "—"}
                  </td>
                  <td className="px-3 py-2.5">
                    <Select
                      value={po.status}
                      onChange={(e) => onStatusChange(po.id, e.target.value as POStatus)}
                      className="h-8 text-xs w-28"
                    >
                      {poStatuses.map((s) => (
                        <option key={s} value={s} className="bg-card">
                          {s}
                        </option>
                      ))}
                    </Select>
                  </td>
                  <td className="px-2 py-2.5 text-right">
                    <button
                      onClick={() => onRemove(po.id)}
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
                      aria-label="Remove PO"
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
    </div>
  );
}
