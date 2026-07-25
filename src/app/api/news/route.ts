import { XMLParser } from "fast-xml-parser";
import { NextResponse } from "next/server";

import {
  classifyTopic,
  feedSources,
  stripHtml,
  truncate,
  type NewsItem,
} from "@/lib/news-data";

export const revalidate = 900; // 15 minutes

type RssItem = {
  title?: string;
  link?: string;
  description?: string;
  pubDate?: string;
};

function toArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

async function fetchFeed(source: { name: string; url: string }): Promise<NewsItem[]> {
  const res = await fetch(source.url, {
    headers: { "User-Agent": "FlorenzaNewsConsolidator/1.0" },
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(`${source.name} responded with ${res.status}`);
  }

  const xml = await res.text();
  const parser = new XMLParser({ ignoreAttributes: false });
  const parsed = parser.parse(xml);

  const items: RssItem[] = toArray(parsed?.rss?.channel?.item);

  return items.map((item, i) => {
    const title = stripHtml(String(item.title ?? "Untitled"));
    const description = stripHtml(String(item.description ?? ""));
    const link = String(item.link ?? source.url);
    const pubDate = item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString();

    return {
      id: `${source.name}-${i}-${link}`,
      headline: title,
      source: source.name,
      url: link,
      publishDate: pubDate,
      summary: truncate(description, 220),
      topic: classifyTopic(title, description),
    };
  });
}

export async function GET() {
  const results = await Promise.allSettled(feedSources.map(fetchFeed));

  const items: NewsItem[] = results
    .flatMap((r) => (r.status === "fulfilled" ? r.value : []))
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

  const errors = results
    .map((r, i) => (r.status === "rejected" ? { source: feedSources[i].name, error: String(r.reason) } : null))
    .filter((e): e is { source: string; error: string } => e !== null);

  if (items.length === 0) {
    return NextResponse.json(
      { items: [], errors, ok: false },
      { status: 502 }
    );
  }

  return NextResponse.json({ items, errors, ok: true });
}
