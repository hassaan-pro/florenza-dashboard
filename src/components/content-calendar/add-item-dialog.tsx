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
import { Select } from "@/components/ui/select";
import {
  type CalendarItem,
  type Platform,
  type ContentStatus,
  platforms,
} from "@/lib/calendar-data";

function defaultForm(initialDate?: string) {
  return {
    title: "",
    platform: "Instagram" as Platform,
    status: "Scheduled" as ContentStatus,
    date: initialDate ?? new Date().toISOString().slice(0, 10),
  };
}

export function AddCalendarItemDialog({
  onAdd,
  initialDate,
  trigger,
}: {
  onAdd: (item: CalendarItem) => void;
  initialDate?: string;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(defaultForm(initialDate));

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) setForm(defaultForm(initialDate));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.date) return;

    onAdd({
      id: crypto.randomUUID(),
      title: form.title.trim(),
      platform: form.platform,
      status: form.status,
      date: form.date,
    });

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm">
            <Plus className="size-4" />
            New content item
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New content item</DialogTitle>
          <DialogDescription>Drops onto the calendar on the date you set below.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g. Golden Hour Reel, terrazzo + skylight"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="platform">Platform</Label>
              <Select
                id="platform"
                value={form.platform}
                onChange={(e) => setForm((f) => ({ ...f, platform: e.target.value as Platform }))}
              >
                {platforms.map((p) => (
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
                  setForm((f) => ({ ...f, status: e.target.value as ContentStatus }))
                }
              >
                <option value="Scheduled" className="bg-card">Scheduled</option>
                <option value="Posted" className="bg-card">Posted</option>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5 col-span-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add to calendar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
