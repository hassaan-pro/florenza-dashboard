export type NewsTopic = "Tools" | "Research" | "Business";

export type NewsItem = {
  id: string;
  headline: string;
  source: string;
  url: string;
  publishDate: string; // ISO
  summary: string;
  topic: NewsTopic;
};

export const newsTopics: NewsTopic[] = ["Tools", "Research", "Business"];

/**
 * RSS sources this dashboard pulls from server-side (see src/app/api/news/route.ts).
 * FloralDaily covers broad horticulture/business/research news; Floranext covers
 * florist software, marketing, and operations, which skews toward "Tools".
 */
export const feedSources: { name: string; url: string }[] = [
  { name: "FloralDaily", url: "https://www.floraldaily.com/rss.xml" },
  { name: "Floranext Blog", url: "https://www.floranext.com/feed" },
];

const toolsKeywords = [
  "software", "app", "platform", "system", "pos", "point of sale", "tool", "technology",
  "automation", "ai ", "artificial intelligence", "website", "online ordering", "crm",
];

const researchKeywords = [
  "research", "study", "trial", "science", "scientific", "university", "breeding",
  "genetics", "nanotechnology", "sustainability", "biological", "climate", "survey",
];

export function classifyTopic(title: string, description: string): NewsTopic {
  const text = `${title} ${description}`.toLowerCase();
  if (toolsKeywords.some((k) => text.includes(k))) return "Tools";
  if (researchKeywords.some((k) => text.includes(k))) return "Research";
  return "Business";
}

export function stripHtml(input: string): string {
  return input
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function truncate(input: string, max: number): string {
  if (input.length <= max) return input;
  return input.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

export function formatPublishDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

/**
 * SAMPLE / PLACEHOLDER FALLBACK.
 * Used only if the live RSS fetch fails (no network in this environment,
 * a feed is temporarily down, etc.) so the page never renders empty.
 */
export const fallbackNewsItems: NewsItem[] = [
  {
    id: "fallback-1",
    headline: "Live feed unavailable — showing sample headline",
    source: "FloralDaily",
    url: "https://www.floraldaily.com/",
    publishDate: new Date().toISOString(),
    summary:
      "This is placeholder content shown when the RSS fetch fails (for example, no network access). Once deployed with normal internet access, this section pulls real, current headlines.",
    topic: "Business",
  },
];
