"use client";

import { useEffect, useState } from "react";
import { Info, RefreshCw, Rss } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NewsCard } from "@/components/news-consolidator/news-card";
import { TopicFilter } from "@/components/news-consolidator/topic-filter";
import {
  type NewsItem,
  type NewsTopic,
  feedSources,
  fallbackNewsItems,
} from "@/lib/news-data";

type LoadState = "loading" | "ready" | "error";

export default function NewsConsolidatorPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const [topic, setTopic] = useState<NewsTopic | "All">("All");
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  async function load() {
    setState("loading");
    try {
      const res = await fetch("/api/news");
      const data = await res.json();
      if (data.items?.length > 0) {
        setItems(data.items);
        setState("ready");
      } else {
        setItems(fallbackNewsItems);
        setState("error");
      }
      setLastFetched(new Date());
    } catch {
      setItems(fallbackNewsItems);
      setState("error");
      setLastFetched(new Date());
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount, load() intentionally sets a loading state synchronously so the refresh button and initial mount share one code path
    load();
  }, []);

  const filtered = topic === "All" ? items : items.filter((i) => i.topic === topic);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <Badge variant="outline" className="mb-4 text-muted-foreground">
            Content
          </Badge>
          <h1 className="font-display text-3xl text-foreground mb-2">News Consolidator</h1>
          <p className="text-muted-foreground max-w-xl">
            The latest flower and bouquet industry news, pulled live from RSS and sorted
            newest first.
          </p>
        </div>
        <Button size="sm" variant="secondary" onClick={load} disabled={state === "loading"}>
          <RefreshCw className={state === "loading" ? "size-4 animate-spin" : "size-4"} />
          Refresh
        </Button>
      </div>

      <div className="flex items-start gap-2.5 rounded-lg border border-primary/25 bg-primary/5 px-4 py-3 text-sm text-foreground/85">
        <Rss className="size-4 shrink-0 mt-0.5 text-primary" strokeWidth={1.75} />
        <p>
          Pulled server-side from {feedSources.map((f) => f.name).join(" and ")} on every
          load (cached 15 minutes). Topic tags (Tools / Research / Business) are assigned by
          a keyword match against the headline and summary, not a real classifier, so
          double-check before relying on a tag for anything important.
          {state === "error" && (
            <span className="block mt-1 text-destructive">
              Couldn&apos;t reach the live feeds just now, showing placeholder content instead.
              This is expected in a sandboxed environment with no outbound network access —
              it will pull real headlines once running with normal internet access.
            </span>
          )}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <TopicFilter active={topic} onChange={setTopic} />
        {lastFetched && (
          <p className="text-xs text-muted-foreground">
            Last fetched {lastFetched.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
          </p>
        )}
      </div>

      {state === "loading" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-44 rounded-lg border border-border bg-card animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-16 text-center">
          <Info className="size-5 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No headlines in this topic right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
