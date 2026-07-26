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
import { type Role, type Department, departments } from "@/lib/business-structure-data";

export function AddRoleDialog({
  existingRoles,
  onAdd,
}: {
  existingRoles: Role[];
  onAdd: (role: Role) => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    person: "",
    department: "Marketing" as Department,
    reportsTo: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    onAdd({
      id: crypto.randomUUID(),
      title: form.title.trim(),
      person: form.person.trim() || "Unfilled",
      department: form.department,
      reportsTo: form.reportsTo || null,
      responsibilities: [],
    });
    setForm({ title: "", person: "", department: "Marketing", reportsTo: "" });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-4" />
          Add role
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add role</DialogTitle>
          <DialogDescription>Responsibilities can be added after, from the card itself.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="role-title">Title</Label>
            <Input
              id="role-title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="role-person">Person</Label>
            <Input
              id="role-person"
              placeholder="Leave blank for Unfilled"
              value={form.person}
              onChange={(e) => setForm((f) => ({ ...f, person: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="role-dept">Department</Label>
              <Select
                id="role-dept"
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
              <Label htmlFor="role-reports">Reports to</Label>
              <Select
                id="role-reports"
                value={form.reportsTo}
                onChange={(e) => setForm((f) => ({ ...f, reportsTo: e.target.value }))}
              >
                <option value="" className="bg-card">
                  No one
                </option>
                {existingRoles.map((r) => (
                  <option key={r.id} value={r.id} className="bg-card">
                    {r.title}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add role</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
