export type SocialPlatform = "Instagram" | "Facebook" | "TikTok";

export type CompetitorAccount = {
  id: string;
  competitorId: string;
  platform: SocialPlatform;
  handle: string;
  followers: number;
  postsPerWeek: number;
  avgEngagementPct: number;
  growth30dPct: number;
  lastPostDate: string | null; // ISO date, null when no data source is connected yet
  lastPostSummary: string;
};

export type Competitor = {
  id: string;
  name: string;
  notes: string;
};

export const socialPlatforms: SocialPlatform[] = ["Instagram", "Facebook", "TikTok"];

/**
 * SAMPLE / PLACEHOLDER DATA.
 * These competitors and their metrics are illustrative, not pulled from
 * real accounts. There is no live data source wired up yet — see the
 * banner on the page and the CLAUDE.md notes for what that would take.
 */
export const seedCompetitors: Competitor[] = [
  { id: "comp1", name: "Bloomly Lahore", notes: "Direct competitor, DHA/Gulberg delivery focus." },
  { id: "comp2", name: "Petal & Co.", notes: "Subscription bouquet model, Karachi-based." },
  { id: "comp3", name: "The Flower Studio PK", notes: "Premium event + gifting hybrid." },
];

export const seedCompetitorAccounts: CompetitorAccount[] = [
  {
    id: "acc1",
    competitorId: "comp1",
    platform: "Instagram",
    handle: "@bloomly.lahore",
    followers: 18400,
    postsPerWeek: 5,
    avgEngagementPct: 3.2,
    growth30dPct: 4.1,
    lastPostDate: "2026-07-22",
    lastPostSummary: "Reel: same-day delivery across DHA phases",
  },
  {
    id: "acc2",
    competitorId: "comp1",
    platform: "Facebook",
    handle: "Bloomly Lahore",
    followers: 9200,
    postsPerWeek: 3,
    avgEngagementPct: 1.4,
    growth30dPct: 0.6,
    lastPostDate: "2026-07-19",
    lastPostSummary: "Album: wedding stage flowers, July batch",
  },
  {
    id: "acc3",
    competitorId: "comp2",
    platform: "Instagram",
    handle: "@petalandco.pk",
    followers: 27100,
    postsPerWeek: 6,
    avgEngagementPct: 4.6,
    growth30dPct: 6.8,
    lastPostDate: "2026-07-23",
    lastPostSummary: "Carousel: monthly subscription unboxing",
  },
  {
    id: "acc4",
    competitorId: "comp2",
    platform: "TikTok",
    handle: "@petalandco",
    followers: 41300,
    postsPerWeek: 8,
    avgEngagementPct: 7.9,
    growth30dPct: 11.2,
    lastPostDate: "2026-07-24",
    lastPostSummary: "Trend audio: bouquet wrap ASMR",
  },
  {
    id: "acc5",
    competitorId: "comp3",
    platform: "Instagram",
    handle: "@theflowerstudio.pk",
    followers: 12800,
    postsPerWeek: 2,
    avgEngagementPct: 2.1,
    growth30dPct: -0.4,
    lastPostDate: "2026-07-11",
    lastPostSummary: "Feed post: bridal consultation announcement",
  },
  {
    id: "acc6",
    competitorId: "comp3",
    platform: "Facebook",
    handle: "The Flower Studio PK",
    followers: 6400,
    postsPerWeek: 1,
    avgEngagementPct: 0.9,
    growth30dPct: -1.1,
    lastPostDate: "2026-07-05",
    lastPostSummary: "Event recap: corporate gifting client",
  },
];

export function formatFollowers(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return String(n);
}

export function formatDate(iso: string | null): string {
  if (!iso) return "No data yet";
  return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}
