"use client";

import { useState } from "react";
import { Plus, Trash2, Layers } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { contentPillars, type ContentPillar } from "@/lib/instagram-data";
import { type GridBatch, type BatchStatus, batchStatuses } from "@/lib/content-dashboard-data";

function batchTone(status: BatchStatus) {
  if (status === "Published") return "success" as const;
  if (status === "Ready") return "default" as const;
  if (status === "In Progress") return "secondary" as const;
  return "outline" as const;
}

function AddBatchDialog({ onAdd }: { onAdd: (batch: GridBatch) => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    pillarFocus: "Soft Life" as ContentPillar,
    targetCount: 9,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onAdd({
      id: crypto.randomUUID(),
      name: form.name.trim(),
      pillarFocus: form.pillarFocus,
      postCount: 0,
      targetCount: form.targetCount,
      status: "Planning",
      startDate: new Date().toISOString().slice(0, 10),
    });
    setForm({ name: "", pillarFocus: "Soft Life", targetCount: 9 });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">
          <Plus className="size-3.5" />
          New batch
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New grid batch</DialogTitle>
          <DialogDescription>Starts at 0 posts, planning status.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="batch-name">Name</Label>
            <Input
              id="batch-name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="batch-pillar">Pillar focus</Label>
              <Select
                id="batch-pillar"
                value={form.pillarFocus}
                onChange={(e) => setForm((f) => ({ ...f, pillarFocus: e.target.value as ContentPillar }))}
              >
                {contentPillars.map((p) => (
                  <option key={p} value={p} className="bg-card">
                    {p}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="batch-target">Target posts</Label>
              <Input
                id="batch-target"
                type="number"
                min={1}
                value={form.targetCount}
                onChange={(e) => setForm((f) => ({ ...f, targetCount: Number(e.target.value) || 9 }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add batch</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function BatchSection({
  batches,
  onAdd,
  onStatusChange,
  onPostCountChange,
  onRemove,
}: {
  batches: GridBatch[];
  onAdd: (batch: GridBatch) => void;
  onStatusChange: (id: string, status: BatchStatus) => void;
  onPostCountChange: (id: string, count: number) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-foreground">Grid batches</h2>
        <AddBatchDialog onAdd={onAdd} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {batches.map((batch) => (
          <Card key={batch.id} className="gap-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <Layers className="size-4 text-primary shrink-0" strokeWidth={1.75} />
                <p className="text-sm font-medium text-foreground">{batch.name}</p>
              </div>
              <button
                onClick={() => onRemove(batch.id)}
                className="rounded-md p-1 text-muted-foreground/60 hover:bg-destructive/15 hover:text-destructive shrink-0"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{batch.pillarFocus}</span>
              <span>·</span>
              <span>Started {batch.startDate}</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                value={batch.postCount}
                onChange={(e) => onPostCountChange(batch.id, Number(e.target.value) || 0)}
                className="w-12 rounded-md border border-border bg-transparent px-1.5 py-1 text-right text-sm tabular-nums"
              />
              <span className="text-xs text-muted-foreground">/ {batch.targetCount} posts</span>
              <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${Math.min(100, (batch.postCount / batch.targetCount) * 100)}%` }}
                />
              </div>
            </div>

            <Select
              value={batch.status}
              onChange={(e) => onStatusChange(batch.id, e.target.value as BatchStatus)}
              className="h-7 text-xs w-32"
            >
              {batchStatuses.map((s) => (
                <option key={s} value={s} className="bg-card">
                  {s}
                </option>
              ))}
            </Select>
            <Badge variant={batchTone(batch.status)} className="w-fit">
              {batch.status}
            </Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}
