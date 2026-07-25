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
import {
  type Competitor,
  type CompetitorAccount,
  type SocialPlatform,
  socialPlatforms,
} from "@/lib/competitor-data";

const emptyForm = {
  competitorName: "",
  notes: "",
  platform: "Instagram" as SocialPlatform,
  handle: "",
};

export function AddCompetitorDialog({
  existingCompetitors,
  onAdd,
}: {
  existingCompetitors: Competitor[];
  onAdd: (competitor: Competitor | null, account: CompetitorAccount) => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) setForm(emptyForm);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.competitorName.trim() || !form.handle.trim()) return;

    const trimmedName = form.competitorName.trim();
    const match = existingCompetitors.find(
      (c) => c.name.toLowerCase() === trimmedName.toLowerCase()
    );

    const newCompetitor: Competitor | null = match
      ? null
      : { id: crypto.randomUUID(), name: trimmedName, notes: form.notes.trim() };

    const account: CompetitorAccount = {
      id: crypto.randomUUID(),
      competitorId: match ? match.id : (newCompetitor as Competitor).id,
      platform: form.platform,
      handle: form.handle.trim(),
      followers: 0,
      postsPerWeek: 0,
      avgEngagementPct: 0,
      growth30dPct: 0,
      lastPostDate: null,
      lastPostSummary: "No data yet — connect a source to pull real metrics.",
    };

    onAdd(newCompetitor, account);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-4" />
          Track competitor
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Track a competitor</DialogTitle>
          <DialogDescription>
            Add a handle to watch. Metrics start empty until a real data source is connected —
            see the note on the page for what that takes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="competitorName">Competitor name</Label>
            <Input
              id="competitorName"
              placeholder="e.g. Bloomly Lahore (matches an existing name to add another platform to it)"
              value={form.competitorName}
              onChange={(e) => setForm((f) => ({ ...f, competitorName: e.target.value }))}
              required
              list="existing-competitors"
            />
            <datalist id="existing-competitors">
              {existingCompetitors.map((c) => (
                <option key={c.id} value={c.name} />
              ))}
            </datalist>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="platform">Platform</Label>
              <Select
                id="platform"
                value={form.platform}
                onChange={(e) =>
                  setForm((f) => ({ ...f, platform: e.target.value as SocialPlatform }))
                }
              >
                {socialPlatforms.map((p) => (
                  <option key={p} value={p} className="bg-card">
                    {p}
                  </option>
                ))}
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="handle">Handle</Label>
              <Input
                id="handle"
                placeholder="@handle"
                value={form.handle}
                onChange={(e) => setForm((f) => ({ ...f, handle: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">Notes (new competitor only)</Label>
            <Textarea
              id="notes"
              rows={2}
              placeholder="Why they're worth tracking..."
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
