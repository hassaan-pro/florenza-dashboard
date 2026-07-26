export type Department = "Marketing" | "Operations" | "Fulfillment" | "Finance";
export type SOPStatus = "Active" | "Draft";

export type Role = {
  id: string;
  title: string;
  person: string;
  department: Department;
  reportsTo: string | null; // Role id
  responsibilities: string[];
};

export type SOP = {
  id: string;
  title: string;
  department: Department;
  summary: string;
  status: SOPStatus;
  lastUpdated: string;
};

export const departments: Department[] = ["Marketing", "Operations", "Fulfillment", "Finance"];
export const sopStatuses: SOPStatus[] = ["Active", "Draft"];

/**
 * SAMPLE / PLACEHOLDER DATA. Illustrative org structure so the page works
 * out of the box. Replace with Florenza's real roles and reporting lines.
 */
export const seedRoles: Role[] = [
  {
    id: "r1",
    title: "Founder",
    person: "Hassaan",
    department: "Marketing",
    reportsTo: null,
    responsibilities: ["Overall strategy", "Brand direction", "Partnerships"],
  },
  {
    id: "r2",
    title: "Marketing & Partnerships Manager",
    person: "Hassaan",
    department: "Marketing",
    reportsTo: "r1",
    responsibilities: ["Content pipeline", "Paid acquisition", "Influencer outreach"],
  },
  {
    id: "r3",
    title: "Fulfillment Lead",
    person: "Unfilled",
    department: "Fulfillment",
    reportsTo: "r1",
    responsibilities: ["Vendor coordination", "QC gates", "Delivery scheduling"],
  },
  {
    id: "r4",
    title: "Finance & Ops",
    person: "Unfilled",
    department: "Finance",
    reportsTo: "r1",
    responsibilities: ["Vendor payments", "Pricing review", "Margin tracking"],
  },
];

export const seedSOPs: SOP[] = [
  {
    id: "s1",
    title: "Order QC gate before dispatch",
    department: "Fulfillment",
    summary:
      "Every bouquet is photographed against the original order spec before handoff to the delivery partner. Any mismatch holds the order.",
    status: "Active",
    lastUpdated: "2026-07-10",
  },
  {
    id: "s2",
    title: "Grid batch content approval",
    department: "Marketing",
    summary:
      "Each 9-post grid batch is reviewed against the pillar/mode rules in the Florenza Instagram skill before scheduling.",
    status: "Active",
    lastUpdated: "2026-07-20",
  },
  {
    id: "s3",
    title: "Vendor payment terms",
    department: "Finance",
    summary: "Draft policy on payment timing and terms per vendor category, not finalized.",
    status: "Draft",
    lastUpdated: "2026-07-15",
  },
];

export function roleName(roles: Role[], id: string | null): string {
  if (!id) return "—";
  return roles.find((r) => r.id === id)?.title ?? "—";
}
