"use client";

import { Star, Trash2 } from "lucide-react";

import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  type Vendor,
  type VendorCategory,
  type VendorStatus,
  vendorCategories,
  vendorStatuses,
} from "@/lib/vendor-data";

function ScoreStars({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} onClick={() => onChange(n)} className="p-0.5">
          <Star
            className={cn("size-3.5", n <= value ? "fill-primary text-primary" : "text-muted-foreground/30")}
          />
        </button>
      ))}
    </div>
  );
}

function statusTone(status: VendorStatus) {
  if (status === "Active") return "success";
  if (status === "On Hold") return "destructive";
  return "secondary";
}

export function VendorTable({
  vendors,
  onChange,
  onRemove,
}: {
  vendors: Vendor[];
  onChange: (id: string, updater: (v: Vendor) => Vendor) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-3 py-2.5 font-medium">Vendor</th>
            <th className="px-3 py-2.5 font-medium">Category</th>
            <th className="px-3 py-2.5 font-medium">Contact</th>
            <th className="px-3 py-2.5 font-medium text-right">Lead time</th>
            <th className="px-3 py-2.5 font-medium">Reliability</th>
            <th className="px-3 py-2.5 font-medium">Quality</th>
            <th className="px-3 py-2.5 font-medium">Price</th>
            <th className="px-3 py-2.5 font-medium">Status</th>
            <th className="px-2 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {vendors.map((v) => (
            <tr key={v.id} className="border-b border-border/70 last:border-0 hover:bg-secondary/20 align-top">
              <td className="px-3 py-2.5">
                <input
                  value={v.name}
                  onChange={(e) => onChange(v.id, (p) => ({ ...p, name: e.target.value }))}
                  className="w-44 rounded-md border border-transparent bg-transparent px-1.5 py-1 text-sm text-foreground hover:border-border focus:border-primary focus:bg-background focus:outline-none"
                />
                <textarea
                  value={v.notes}
                  onChange={(e) => onChange(v.id, (p) => ({ ...p, notes: e.target.value }))}
                  rows={2}
                  className="mt-1 w-44 resize-none rounded-md border border-transparent bg-transparent px-1.5 py-1 text-xs text-muted-foreground hover:border-border focus:border-primary focus:bg-background focus:outline-none"
                />
              </td>
              <td className="px-3 py-2.5">
                <Select
                  value={v.category}
                  onChange={(e) =>
                    onChange(v.id, (p) => ({ ...p, category: e.target.value as VendorCategory }))
                  }
                  className="h-8 text-xs"
                >
                  {vendorCategories.map((c) => (
                    <option key={c} value={c} className="bg-card">
                      {c}
                    </option>
                  ))}
                </Select>
              </td>
              <td className="px-3 py-2.5">
                <input
                  value={v.contact}
                  onChange={(e) => onChange(v.id, (p) => ({ ...p, contact: e.target.value }))}
                  className="w-36 rounded-md border border-transparent bg-transparent px-1.5 py-1 text-xs text-muted-foreground hover:border-border focus:border-primary focus:bg-background focus:outline-none"
                />
              </td>
              <td className="px-3 py-2.5 text-right">
                <input
                  type="number"
                  value={v.leadTimeDays}
                  onChange={(e) =>
                    onChange(v.id, (p) => ({ ...p, leadTimeDays: Number(e.target.value) || 0 }))
                  }
                  className="w-14 rounded-md border border-transparent bg-transparent px-1.5 py-1 text-right text-sm tabular-nums hover:border-border focus:border-primary focus:bg-background focus:outline-none"
                />
                <span className="text-xs text-muted-foreground">d</span>
              </td>
              <td className="px-3 py-2.5">
                <ScoreStars value={v.reliability} onChange={(n) => onChange(v.id, (p) => ({ ...p, reliability: n }))} />
              </td>
              <td className="px-3 py-2.5">
                <ScoreStars value={v.quality} onChange={(n) => onChange(v.id, (p) => ({ ...p, quality: n }))} />
              </td>
              <td className="px-3 py-2.5">
                <ScoreStars value={v.priceRating} onChange={(n) => onChange(v.id, (p) => ({ ...p, priceRating: n }))} />
              </td>
              <td className="px-3 py-2.5">
                <Select
                  value={v.status}
                  onChange={(e) => onChange(v.id, (p) => ({ ...p, status: e.target.value as VendorStatus }))}
                  className={cn(
                    "h-8 text-xs",
                    statusTone(v.status) === "success" && "text-success border-success/30",
                    statusTone(v.status) === "destructive" && "text-destructive border-destructive/30"
                  )}
                >
                  {vendorStatuses.map((s) => (
                    <option key={s} value={s} className="bg-card">
                      {s}
                    </option>
                  ))}
                </Select>
              </td>
              <td className="px-2 py-2.5 text-right">
                <button
                  onClick={() => onRemove(v.id)}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
                  aria-label={`Remove ${v.name}`}
                >
                  <Trash2 className="size-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
