"use client";

import { useState } from "react";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
import { contentPillars, pillarColor, type ContentPillar } from "@/lib/instagram-data";
import { type Asset, type AssetType, assetTypes } from "@/lib/content-dashboard-data";

function AddAssetDialog({ onAdd }: { onAdd: (asset: Asset) => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "Bouquet Photo" as AssetType,
    pillar: "Soft Life" as ContentPillar,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onAdd({
      id: crypto.randomUUID(),
      name: form.name.trim(),
      type: form.type,
      pillar: form.pillar,
      addedDate: new Date().toISOString().slice(0, 10),
    });
    setForm({ name: "", type: "Bouquet Photo", pillar: "Soft Life" });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">
          <Plus className="size-3.5" />
          Add asset
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add asset</DialogTitle>
          <DialogDescription>
            A reference entry, not a file upload, this catalogues what exists and where, it
            doesn&apos;t store the file itself.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="asset-name">Name / description</Label>
            <Input
              id="asset-name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="asset-type">Type</Label>
              <Select
                id="asset-type"
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as AssetType }))}
              >
                {assetTypes.map((t) => (
                  <option key={t} value={t} className="bg-card">
                    {t}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="asset-pillar">Pillar</Label>
              <Select
                id="asset-pillar"
                value={form.pillar}
                onChange={(e) => setForm((f) => ({ ...f, pillar: e.target.value as ContentPillar }))}
              >
                {contentPillars.map((p) => (
                  <option key={p} value={p} className="bg-card">
                    {p}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add asset</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function AssetLibrary({
  assets,
  onAdd,
  onRemove,
}: {
  assets: Asset[];
  onAdd: (asset: Asset) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg text-foreground">Asset library</h2>
          <p className="text-xs text-muted-foreground">
            Reference entries for compositing sources and generated scenes, not a file store.
          </p>
        </div>
        <AddAssetDialog onAdd={onAdd} />
      </div>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-3 py-2.5 font-medium">Asset</th>
              <th className="px-3 py-2.5 font-medium">Type</th>
              <th className="px-3 py-2.5 font-medium">Pillar</th>
              <th className="px-3 py-2.5 font-medium">Added</th>
              <th className="px-2 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {assets.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-xs text-muted-foreground">
                  No assets logged yet.
                </td>
              </tr>
            ) : (
              assets.map((asset) => (
                <tr key={asset.id} className="border-b border-border/70 last:border-0 hover:bg-secondary/20">
                  <td className="px-3 py-2.5">
                    <span className="inline-flex items-center gap-2 text-foreground/90">
                      <ImageIcon className="size-3.5 text-muted-foreground" strokeWidth={1.75} />
                      {asset.name}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <Badge variant="secondary">{asset.type}</Badge>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="size-1.5 rounded-full" style={{ background: pillarColor[asset.pillar] }} />
                      {asset.pillar}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">{asset.addedDate}</td>
                  <td className="px-2 py-2.5 text-right">
                    <button
                      onClick={() => onRemove(asset.id)}
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
                      aria-label="Remove asset"
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
