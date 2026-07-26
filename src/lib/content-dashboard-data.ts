import type { ContentPillar } from "@/lib/instagram-data";

export type BatchStatus = "Planning" | "In Progress" | "Ready" | "Published";
export type AssetType = "Bouquet Photo" | "Generated Scene" | "Composite" | "Caption Bank";

export type GridBatch = {
  id: string;
  name: string;
  pillarFocus: ContentPillar;
  postCount: number;
  targetCount: number;
  status: BatchStatus;
  startDate: string;
};

export type Asset = {
  id: string;
  name: string;
  type: AssetType;
  pillar: ContentPillar;
  addedDate: string;
};

export const batchStatuses: BatchStatus[] = ["Planning", "In Progress", "Ready", "Published"];
export const assetTypes: AssetType[] = [
  "Bouquet Photo",
  "Generated Scene",
  "Composite",
  "Caption Bank",
];

/**
 * SAMPLE / PLACEHOLDER DATA for batches and assets specifically (the
 * pillar breakdown on this page pulls real data from Instagram Manager
 * via the shared context, this part doesn't).
 */
export const seedBatches: GridBatch[] = [
  {
    id: "b1",
    name: "Grid batch two",
    pillarFocus: "Golden Hour",
    postCount: 9,
    targetCount: 9,
    status: "Published",
    startDate: "2026-07-01",
  },
  {
    id: "b2",
    name: "Grid batch three",
    pillarFocus: "Dark Romance",
    postCount: 4,
    targetCount: 9,
    status: "In Progress",
    startDate: "2026-07-21",
  },
];

export const seedAssets: Asset[] = [
  { id: "a1", name: "Blush garden roses, haveli doorway", type: "Bouquet Photo", pillar: "Golden Hour", addedDate: "2026-07-14" },
  { id: "a2", name: "Terrazzo + skylight compositing scene", type: "Generated Scene", pillar: "Golden Hour", addedDate: "2026-07-20" },
  { id: "a3", name: "Arched mirror motif reference set", type: "Generated Scene", pillar: "Soft Life", addedDate: "2026-07-18" },
  { id: "a4", name: "Grid three caption bank draft", type: "Caption Bank", pillar: "Dark Romance", addedDate: "2026-07-22" },
];
