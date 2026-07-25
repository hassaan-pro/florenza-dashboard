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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  type Post,
  type PostStatus,
  type PostType,
  type ContentPillar,
  postStatuses,
  postTypes,
  contentPillars,
} from "@/lib/instagram-data";

const emptyForm = {
  caption: "",
  type: "Feed Post" as PostType,
  pillar: "Soft Life" as ContentPillar,
  status: "Backlog" as PostStatus,
  scheduledDate: "",
};

export function AddPostDialog({ onAdd }: { onAdd: (post: Post) => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.caption.trim()) return;

    onAdd({
      id: crypto.randomUUID(),
      caption: form.caption.trim(),
      type: form.type,
      pillar: form.pillar,
      status: form.status,
      scheduledDate: form.scheduledDate || null,
      createdAt: new Date().toISOString().slice(0, 10),
    });

    setForm(emptyForm);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-4" />
          New post idea
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New post idea</DialogTitle>
          <DialogDescription>
            Drops straight into the board in whatever status you set below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="caption">Caption</Label>
            <Textarea
              id="caption"
              rows={4}
              placeholder="Write the caption, or a rough version of it..."
              value={form.caption}
              onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="type">Post type</Label>
              <Select
                id="type"
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as PostType }))}
              >
                {postTypes.map((t) => (
                  <option key={t} value={t} className="bg-card">
                    {t}
                  </option>
                ))}
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pillar">Content pillar</Label>
              <Select
                id="pillar"
                value={form.pillar}
                onChange={(e) =>
                  setForm((f) => ({ ...f, pillar: e.target.value as ContentPillar }))
                }
              >
                {contentPillars.map((p) => (
                  <option key={p} value={p} className="bg-card">
                    {p}
                  </option>
                ))}
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="status">Status</Label>
              <Select
                id="status"
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: e.target.value as PostStatus }))
                }
              >
                {postStatuses.map((s) => (
                  <option key={s} value={s} className="bg-card">
                    {s}
                  </option>
                ))}
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="scheduledDate">Scheduled date</Label>
              <Input
                id="scheduledDate"
                type="date"
                value={form.scheduledDate}
                onChange={(e) => setForm((f) => ({ ...f, scheduledDate: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add to board</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
