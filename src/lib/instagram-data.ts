export type PostStatus = "Backlog" | "Draft" | "Scheduled" | "Published";

export type PostType = "Feed Post" | "Reel" | "Story" | "Carousel";

export type ContentPillar =
  | "Soft Life"
  | "For Them"
  | "Just Because"
  | "Dark Romance"
  | "Golden Hour";

export type Post = {
  id: string;
  caption: string;
  type: PostType;
  status: PostStatus;
  pillar: ContentPillar;
  scheduledDate: string | null; // ISO date string, e.g. "2026-08-02"
  createdAt: string;
};

export const postStatuses: PostStatus[] = ["Backlog", "Draft", "Scheduled", "Published"];
export const postTypes: PostType[] = ["Feed Post", "Reel", "Story", "Carousel"];
export const contentPillars: ContentPillar[] = [
  "Soft Life",
  "For Them",
  "Just Because",
  "Dark Romance",
  "Golden Hour",
];

export const pillarColor: Record<ContentPillar, string> = {
  "Soft Life": "var(--chart-1)",
  "For Them": "var(--chart-2)",
  "Just Because": "var(--chart-4)",
  "Dark Romance": "var(--chart-3)",
  "Golden Hour": "var(--chart-5)",
};

/**
 * SAMPLE / PLACEHOLDER DATA.
 * Illustrative posts across all four statuses so the board is usable
 * out of the box. Replace with real grid batch content, or clear this
 * array and start from an empty board.
 */
export const seedPosts: Post[] = [
  {
    id: "p1",
    caption:
      "Golden hour on a haveli doorway, blush garden roses against sandstone. No faces, just the light doing the work.",
    type: "Feed Post",
    status: "Published",
    pillar: "Golden Hour",
    scheduledDate: "2026-07-14",
    createdAt: "2026-07-01",
  },
  {
    id: "p2",
    caption:
      "POV: it showed up before you even said you needed it. Just Because bouquet, vintage Corolla, DHA driveway.",
    type: "Reel",
    status: "Published",
    pillar: "Just Because",
    scheduledDate: "2026-07-18",
    createdAt: "2026-07-02",
  },
  {
    id: "p3",
    caption:
      "For the ones who don't wait for an occasion. Soft Life pillar, jali screen backdrop, linen and khussa mood.",
    type: "Carousel",
    status: "Scheduled",
    pillar: "Soft Life",
    scheduledDate: "2026-07-29",
    createdAt: "2026-07-10",
  },
  {
    id: "p4",
    caption: "Dark Romance statement piece against a plain modern wall. Single vintage motorcycle as the anchor object.",
    type: "Feed Post",
    status: "Scheduled",
    pillar: "Dark Romance",
    scheduledDate: "2026-08-01",
    createdAt: "2026-07-15",
  },
  {
    id: "p5",
    caption: "For Them: draft caption, needs a stronger hook in the first line before this goes out.",
    type: "Story",
    status: "Draft",
    pillar: "For Them",
    scheduledDate: null,
    createdAt: "2026-07-19",
  },
  {
    id: "p6",
    caption: "Terrazzo floor, single potted tree under a skylight, arched mirror motif. Caption not started.",
    type: "Reel",
    status: "Draft",
    pillar: "Golden Hour",
    scheduledDate: null,
    createdAt: "2026-07-20",
  },
  {
    id: "p7",
    caption: "Idea: banana leaf frame edges, brass pendant cluster, third grid batch opener.",
    type: "Feed Post",
    status: "Backlog",
    pillar: "Soft Life",
    scheduledDate: null,
    createdAt: "2026-07-21",
  },
  {
    id: "p8",
    caption: "Idea: Dark Romance Reel, arched doorway reveal, directional single-source lighting.",
    type: "Reel",
    status: "Backlog",
    pillar: "Dark Romance",
    scheduledDate: null,
    createdAt: "2026-07-22",
  },
];

export function formatDate(iso: string | null): string {
  if (!iso) return "No date set";
  return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
