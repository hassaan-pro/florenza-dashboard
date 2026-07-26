"use client";

import { Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { type Role, type Department, departments, roleName } from "@/lib/business-structure-data";

export function OrgRoles({
  roles,
  onChange,
  onRemove,
}: {
  roles: Role[];
  onChange: (id: string, updater: (r: Role) => Role) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {departments.map((dept) => {
        const deptRoles = roles.filter((r) => r.department === dept);
        if (deptRoles.length === 0) return null;
        return (
          <div key={dept} className="rounded-lg border border-border p-4 space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {dept}
            </p>
            <div className="space-y-2.5">
              {deptRoles.map((role) => (
                <div key={role.id} className="rounded-md border border-border p-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <input
                        value={role.title}
                        onChange={(e) => onChange(role.id, (r) => ({ ...r, title: e.target.value }))}
                        className="w-full rounded-md border border-transparent bg-transparent px-1 py-0.5 text-sm font-medium text-foreground hover:border-border focus:border-primary focus:bg-background focus:outline-none"
                      />
                      <input
                        value={role.person}
                        onChange={(e) => onChange(role.id, (r) => ({ ...r, person: e.target.value }))}
                        className="w-full rounded-md border border-transparent bg-transparent px-1 py-0.5 text-xs text-muted-foreground hover:border-border focus:border-primary focus:bg-background focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={() => onRemove(role.id)}
                      className="rounded-md p-1 text-muted-foreground/60 hover:bg-destructive/15 hover:text-destructive shrink-0"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {role.responsibilities.map((r) => (
                      <Badge key={r} variant="secondary" className="text-[10px]">
                        {r}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] text-muted-foreground">Reports to</span>
                    <Select
                      value={role.reportsTo ?? ""}
                      onChange={(e) =>
                        onChange(role.id, (r) => ({ ...r, reportsTo: e.target.value || null }))
                      }
                      className="h-7 text-xs w-40"
                    >
                      <option value="" className="bg-card">
                        No one (top of chart)
                      </option>
                      {roles
                        .filter((r) => r.id !== role.id)
                        .map((r) => (
                          <option key={r.id} value={r.id} className="bg-card">
                            {r.title}
                          </option>
                        ))}
                    </Select>
                  </div>
                  {role.reportsTo && (
                    <p className="text-[10px] text-muted-foreground/70">
                      → {roleName(roles, role.reportsTo)}
                    </p>
                  )}

                  <Select
                    value={role.department}
                    onChange={(e) =>
                      onChange(role.id, (r) => ({ ...r, department: e.target.value as Department }))
                    }
                    className="h-7 text-xs"
                  >
                    {departments.map((d) => (
                      <option key={d} value={d} className="bg-card">
                        {d}
                      </option>
                    ))}
                  </Select>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
