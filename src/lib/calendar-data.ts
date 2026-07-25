export type Platform = "Instagram" | "Facebook" | "TikTok" | "Pinterest";

export type ContentStatus = "Scheduled" | "Posted";

export type CalendarItem = {
  id: string;
  platform: Platform;
  title: string;
  date: string; // ISO date, "YYYY-MM-DD"
  status: ContentStatus;
};

export const platforms: Platform[] = ["Instagram", "Facebook", "TikTok", "Pinterest"];

export const platformColor: Record<Platform, string> = {
  Instagram: "var(--chart-1)",
  Facebook: "var(--chart-2)",
  TikTok: "var(--chart-3)",
  Pinterest: "var(--chart-4)",
};

/**
 * SAMPLE / PLACEHOLDER DATA.
 * Illustrative posts spread across the current and next month, mixing
 * past ("Posted") and future ("Scheduled") dates so the calendar reads
 * correctly out of the box. Replace with the real posting schedule, or
 * clear this array and start from an empty calendar.
 */
export const seedCalendarItems: CalendarItem[] = [
  { id: "c1", platform: "Instagram", title: "Golden Hour haveli doorway grid post", date: "2026-07-02", status: "Posted" },
  { id: "c2", platform: "Facebook", title: "Weekend gifting reminder cross-post", date: "2026-07-03", status: "Posted" },
  { id: "c3", platform: "Instagram", title: "Just Because Reel, vintage Corolla POV", date: "2026-07-08", status: "Posted" },
  { id: "c4", platform: "Pinterest", title: "Soft Life mood board pin set", date: "2026-07-08", status: "Posted" },
  { id: "c5", platform: "TikTok", title: "Behind the compositing workflow", date: "2026-07-12", status: "Posted" },
  { id: "c6", platform: "Instagram", title: "For Them mixed vase carousel", date: "2026-07-18", status: "Posted" },
  { id: "c7", platform: "Instagram", title: "Dark Romance statement piece", date: "2026-07-24", status: "Scheduled" },
  { id: "c8", platform: "Facebook", title: "Dark Romance cross-post + caption", date: "2026-07-24", status: "Scheduled" },
  { id: "c9", platform: "Pinterest", title: "Dark Romance pin set", date: "2026-07-25", status: "Scheduled" },
  { id: "c10", platform: "Instagram", title: "Grand Haveli Centrepiece launch post", date: "2026-07-29", status: "Scheduled" },
  { id: "c11", platform: "TikTok", title: "Third grid batch teaser", date: "2026-07-30", status: "Scheduled" },
  { id: "c12", platform: "Instagram", title: "Golden Hour Reel, terrazzo + skylight", date: "2026-08-02", status: "Scheduled" },
  { id: "c13", platform: "Instagram", title: "Signature Gift Trunk feed post", date: "2026-08-06", status: "Scheduled" },
  { id: "c14", platform: "Facebook", title: "Signature Gift Trunk cross-post", date: "2026-08-06", status: "Scheduled" },
  { id: "c15", platform: "Pinterest", title: "Grid three moodboard pin set", date: "2026-08-10", status: "Scheduled" },
];

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function monthLabel(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
}

/** Returns a 6x7 grid of Dates covering the given month, including leading/trailing days. */
export function getMonthGrid(year: number, month: number): Date[] {
  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = firstOfMonth.getDay(); // 0 = Sunday
  const gridStart = new Date(year, month, 1 - startWeekday);

  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return d;
  });
}
