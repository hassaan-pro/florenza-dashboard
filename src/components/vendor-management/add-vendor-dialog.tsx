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
import { Select } from "@/components/ui/select";
import { type Vendor, type VendorCategory, vendorCategories } from "@/lib/vendor-data";

const emptyForm = {
  name: "",
  category: "Florist" as VendorCategory,
  contact: "",
  leadTimeDays: 1,
  notes: "",
};

export function AddVendorDialog({ onAdd }: { onAdd: (vendor: Vendor) => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onAdd({
      id: crypto.randomUUID(),
      name: form.name.trim(),
      category: form.category,
      contact: form.contact.trim(),
      leadTimeDays: form.leadTimeDays,
      reliability: 3,
      quality: 3,
      priceRating: 3,
      status: "Under Review",
      notes: form.notes.trim(),
    });
    setForm(emptyForm);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-4" />
          Add vendor
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add vendor</DialogTitle>
          <DialogDescription>
            Starts as &quot;Under Review&quot; with neutral 3-star scores, adjust ratings once you
            have a track record with them.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="v-name">Vendor name</Label>
            <Input
              id="v-name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="v-category">Category</Label>
              <Select
                id="v-category"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as VendorCategory }))}
              >
                {vendorCategories.map((c) => (
                  <option key={c} value={c} className="bg-card">
                    {c}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="v-lead">Lead time (days)</Label>
              <Input
                id="v-lead"
                type="number"
                min={0}
                value={form.leadTimeDays}
                onChange={(e) => setForm((f) => ({ ...f, leadTimeDays: Number(e.target.value) || 0 }))}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="v-contact">Contact</Label>
            <Input
              id="v-contact"
              placeholder="Name · phone or email"
              value={form.contact}
              onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="v-notes">Notes</Label>
            <Textarea
              id="v-notes"
              rows={2}
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add vendor</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
