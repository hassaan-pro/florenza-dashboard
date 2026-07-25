"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Grid3x3, ThumbsUp, Music2, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  type Competitor,
  type CompetitorAccount,
  type SocialPlatform,
  formatFollowers,
  formatDate,
} from "@/lib/competitor-data";

const platformIcon: Record<SocialPlatform, typeof Grid3x3> = {
  Instagram: Grid3x3,
  Facebook: ThumbsUp,
  TikTok: Music2,
};

type Row = CompetitorAccount & { competitorName: string };

type SortKey = "followers" | "postsPerWeek" | "avgEngagementPct" | "growth30dPct";

const columns: { key: SortKey; label: string }[] = [
  { key: "followers", label: "Followers" },
  { key: "postsPerWeek", label: "Posts / wk" },
  { key: "avgEngagementPct", label: "Engagement" },
  { key: "growth30dPct", label: "Growth (30d)" },
];

export function CompetitorTable({
  competitors,
  accounts,
  onRemove,
}: {
  competitors: Competitor[];
  accounts: CompetitorAccount[];
  onRemove: (id: string) => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("followers");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const rows: Row[] = useMemo(() => {
    return accounts.map((a) => ({
      ...a,
      competitorName: competitors.find((c) => c.id === a.competitorId)?.name ?? "Unknown",
    }));
  }, [accounts, competitors]);

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const diff = a[sortKey] - b[sortKey];
      return sortDir === "asc" ? diff : -diff;
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-3 py-2.5 font-medium">Competitor</th>
            <th className="px-3 py-2.5 font-medium">Platform</th>
            <th className="px-3 py-2.5 font-medium">Handle</th>
            {columns.map((col) => (
              <th key={col.key} className="px-3 py-2.5 font-medium text-right">
                <button
                  onClick={() => handleSort(col.key)}
                  className="inline-flex items-center gap-1 hover:text-foreground"
                >
                  {col.label}
                  {sortKey === col.key ? (
                    sortDir === "asc" ? (
                      <ArrowUp className="size-3" />
                    ) : (
                      <ArrowDown className="size-3" />
                    )
                  ) : (
                    <ArrowUpDown className="size-3 opacity-40" />
                  )}
                </button>
              </th>
            ))}
            <th className="px-3 py-2.5 font-medium">Last post</th>
            <th className="px-2 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => {
            const Icon = platformIcon[row.platform];
            return (
              <tr key={row.id} className="border-b border-border/70 last:border-0 hover:bg-secondary/20">
                <td className="px-3 py-2.5 text-foreground/90 whitespace-nowrap">
                  {row.competitorName}
                </td>
                <td className="px-3 py-2.5">
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Icon className="size-3.5" strokeWidth={1.75} />
                    {row.platform}
                  </span>
                </td>
                <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground whitespace-nowrap">
                  {row.handle}
                </td>
                <td className="px-3 py-2.5 text-right tabular-nums">
                  {row.followers > 0 ? formatFollowers(row.followers) : "—"}
                </td>
                <td className="px-3 py-2.5 text-right tabular-nums text-muted-foreground">
                  {row.postsPerWeek > 0 ? row.postsPerWeek : "—"}
                </td>
                <td className="px-3 py-2.5 text-right">
                  {row.avgEngagementPct > 0 ? (
                    <Badge variant="secondary" className="tabular-nums">
                      {row.avgEngagementPct.toFixed(1)}%
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td
                  className={cn(
                    "px-3 py-2.5 text-right tabular-nums",
                    row.growth30dPct > 0 && "text-success",
                    row.growth30dPct < 0 && "text-destructive"
                  )}
                >
                  {row.followers > 0
                    ? `${row.growth30dPct > 0 ? "+" : ""}${row.growth30dPct.toFixed(1)}%`
                    : "—"}
                </td>
                <td className="px-3 py-2.5 text-muted-foreground max-w-[220px] truncate" title={row.lastPostSummary}>
                  <span className="block truncate">{row.lastPostSummary}</span>
                  <span className="text-xs text-muted-foreground/70">{formatDate(row.lastPostDate)}</span>
                </td>
                <td className="px-2 py-2.5 text-right">
                  <button
                    onClick={() => onRemove(row.id)}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
                    aria-label={`Stop tracking ${row.handle}`}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
