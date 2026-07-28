"use client";

import { Heart, Eye, Bookmark, AlertCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PillarBreakdown } from "@/components/content-dashboard/pillar-breakdown";
import { useInstagramPosts } from "@/lib/instagram-context";

export default function AnalyticsPage() {
  const { posts } = useInstagramPosts();
  const published = posts.filter((p) => p.status === "Published");

  return (
    <div className="space-y-6">
      <div>
        <Badge variant="outline" className="mb-4 text-muted-foreground">
          Content
        </Badge>
        <h1 className="font-display text-3xl text-foreground mb-2">Analytics</h1>
        <p className="text-muted-foreground max-w-xl">
          Content pipeline performance, real data from Instagram Manager. Engagement metrics
          (reach, likes, saves) aren&apos;t here yet, that needs the real Instagram connection,
          see the note below.
        </p>
      </div>

      <PillarBreakdown posts={posts} />

      <Card className="gap-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="size-4 text-primary" strokeWidth={1.75} />
          <p className="text-sm font-medium text-foreground">Engagement metrics aren&apos;t connected</p>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {published.length} post{published.length === 1 ? "" : "s"} are marked Published in
          Instagram Manager, but this dashboard has no live connection to Instagram, so there&apos;s
          no real reach, likes, or save count to show for them. Faking those numbers here would
          be actively misleading for a page whose entire point is measurement. Once the real
          Instagram connection exists (Meta Graph API, currently blocked on the Meta App review
          + database setup, see the Instagram section on the dashboard), this page is where that
          data would surface: reach and engagement rate per post, best/worst performer by
          pillar, and follower growth against grid batch releases.
        </p>
        <div className="grid grid-cols-3 gap-3 pt-1">
          {[
            { label: "Reach", icon: Eye },
            { label: "Likes", icon: Heart },
            { label: "Saves", icon: Bookmark },
          ].map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.label} className="rounded-lg border border-dashed border-border p-3 text-center">
                <Icon className="size-4 mx-auto mb-1.5 text-muted-foreground/50" strokeWidth={1.75} />
                <p className="text-xs text-muted-foreground/70">{m.label}</p>
                <p className="text-sm text-muted-foreground/50">Not connected</p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
