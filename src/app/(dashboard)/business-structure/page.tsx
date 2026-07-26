"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { OrgRoles } from "@/components/business-structure/org-roles";
import { AddRoleDialog } from "@/components/business-structure/add-role-dialog";
import { SOPSection } from "@/components/business-structure/sop-section";
import {
  type Role,
  type SOP,
  type SOPStatus,
  seedRoles,
  seedSOPs,
} from "@/lib/business-structure-data";

export default function BusinessStructurePage() {
  const [roles, setRoles] = useState<Role[]>(seedRoles);
  const [sops, setSops] = useState<SOP[]>(seedSOPs);

  function updateRole(id: string, updater: (r: Role) => Role) {
    setRoles((prev) => prev.map((r) => (r.id === id ? updater(r) : r)));
  }
  function removeRole(id: string) {
    setRoles((prev) =>
      prev.filter((r) => r.id !== id).map((r) => (r.reportsTo === id ? { ...r, reportsTo: null } : r))
    );
  }
  function addRole(role: Role) {
    setRoles((prev) => [...prev, role]);
  }
  function addSOP(sop: SOP) {
    setSops((prev) => [sop, ...prev]);
  }
  function updateSOPStatus(id: string, status: SOPStatus) {
    setSops((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  }
  function removeSOP(id: string) {
    setSops((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <Badge variant="outline" className="mb-4 text-muted-foreground">
            Business
          </Badge>
          <h1 className="font-display text-3xl text-foreground mb-2">Business Structure</h1>
          <p className="text-muted-foreground max-w-xl">
            Who owns what, who reports to whom, and the SOPs that keep things from depending on
            memory. Everything below is editable.
          </p>
        </div>
        <AddRoleDialog existingRoles={roles} onAdd={addRole} />
      </div>

      <div className="space-y-3">
        <h2 className="font-display text-lg text-foreground">Org structure</h2>
        <OrgRoles roles={roles} onChange={updateRole} onRemove={removeRole} />
      </div>

      <SOPSection sops={sops} onAdd={addSOP} onStatusChange={updateSOPStatus} onRemove={removeSOP} />
    </div>
  );
}
