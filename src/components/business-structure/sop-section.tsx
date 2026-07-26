"use client";

import { useState } from "react";
import { Plus, Trash2, FileText } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
  type SOP,
  type Department,
  type SOPStatus,
  departments,
} from "@/lib/business-structure-data";

function AddSOPDialog({ onAdd }: { onAdd: (sop: SOP) => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    department: "Marketing" as Department,
    summary: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    onAdd({
      id: crypto.randomUUID(),
      title: form.title.trim(),
      department: form.department,
      summary: form.summary.trim(),
      status: "Draft",
      lastUpdated: new Date().toISOString().slice(0, 10),
    });
    setForm({ title: "", department: "Marketing", summary: "" });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-4" />
          Add SOP
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add SOP</DialogTitle>
          <DialogDescription>Starts as Draft, flip to Active once it&apos;s actually being followed.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sop-title">Title</Label>
            <Input
              id="sop-title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sop-dept">Department</Label>
            <Select
              id="sop-dept"
              value={form.department}
              onChange={(e) => setForm((f) => ({ ...f, department: e.target.value as Department }))}
            >
              {departments.map((d) => (
                <option key={d} value={d} className="bg-card">
                  {d}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sop-summary">Summary</Label>
            <Textarea
              id="sop-summary"
              rows={3}
              value={form.summary}
              onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add SOP</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function SOPSection({
  sops,
  onAdd,
  onStatusChange,
  onRemove,
}: {
  sops: SOP[];
  onAdd: (sop: SOP) => void;
  onStatusChange: (id: string, status: SOPStatus) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-foreground">SOPs</h2>
        <AddSOPDialog onAdd={onAdd} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sops.map((sop) => (
          <Card key={sop.id} className="gap-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-primary shrink-0" strokeWidth={1.75} />
                <p className="text-sm font-medium text-foreground">{sop.title}</p>
              </div>
              <button
                onClick={() => onRemove(sop.id)}
                className="rounded-md p-1 text-muted-foreground/60 hover:bg-destructive/15 hover:text-destructive shrink-0"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{sop.summary}</p>
            <div className="flex items-center justify-between pt-1">
              <Badge variant="secondary">{sop.department}</Badge>
              <button
                onClick={() => onStatusChange(sop.id, sop.status === "Active" ? "Draft" : "Active")}
              >
                <Badge variant={sop.status === "Active" ? "success" : "outline"}>{sop.status}</Badge>
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground/60">Updated {sop.lastUpdated}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
