"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { CompetitorTable } from "@/components/competitor-tracker/competitor-table";
import { AddCompetitorDialog } from "@/components/competitor-tracker/add-competitor-dialog";
import {
  type Competitor,
  type CompetitorAccount,
  seedCompetitors,
  seedCompetitorAccounts,
} from "@/lib/competitor-data";

export default function CompetitorTrackerPage() {
  const [competitors, setCompetitors] = useState<Competitor[]>(seedCompetitors);
  const [accounts, setAccounts] = useState<CompetitorAccount[]>(seedCompetitorAccounts);

  function handleAdd(newCompetitor: Competitor | null, account: CompetitorAccount) {
    if (newCompetitor) setCompetitors((prev) => [...prev, newCompetitor]);
    setAccounts((prev) => [...prev, account]);
  }

  function removeAccount(id: string) {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <Badge variant="outline" className="mb-4 text-muted-foreground">
            Content
          </Badge>
          <h1 className="font-display text-3xl text-foreground mb-2">Competitor Tracker</h1>
          <p className="text-muted-foreground max-w-xl">
            Every competitor handle worth watching, followers, posting frequency, engagement,
            and 30-day growth, across Instagram, Facebook, and TikTok, in one sortable table.
          </p>
        </div>
        <AddCompetitorDialog existingCompetitors={competitors} onAdd={handleAdd} />
      </div>

      <div className="flex items-start gap-2.5 rounded-lg border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-foreground/85">
        <AlertTriangle className="size-4 shrink-0 mt-0.5 text-destructive" strokeWidth={1.75} />
        <p>
          Being direct about a limit here: this dashboard has no live connection to Instagram,
          Facebook, or TikTok. Platforms don&apos;t expose competitor follower counts, engagement,
          or growth through public, unauthenticated access, pulling real numbers needs either
          the official Meta Graph API / TikTok API (which requires the competitor account&apos;s
          cooperation for most metrics) or a paid social analytics service (Social Blade,
          Phyllo, Apify, etc.). The 3 competitors below are placeholder sample data so the
          table and sorting work correctly. Anything you add gets tracked with empty metrics
          until a real data source is wired in.
        </p>
      </div>

      <CompetitorTable competitors={competitors} accounts={accounts} onRemove={removeAccount} />
    </div>
  );
}
