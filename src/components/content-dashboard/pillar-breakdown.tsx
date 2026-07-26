"use client";

import { contentPillars, pillarColor, type Post } from "@/lib/instagram-data";
import { Card } from "@/components/ui/card";

export function PillarBreakdown({ posts }: { posts: Post[] }) {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="font-display text-lg text-foreground">Pillar breakdown</h2>
        <p className="text-xs text-muted-foreground">
          Live from Instagram Manager, add or move a post there and this updates.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
        {contentPillars.map((pillar) => {
          const pillarPosts = posts.filter((p) => p.pillar === pillar);
          const published = pillarPosts.filter((p) => p.status === "Published").length;
          const scheduled = pillarPosts.filter((p) => p.status === "Scheduled").length;
          const inProgress = pillarPosts.filter((p) => p.status === "Draft" || p.status === "Backlog").length;

          return (
            <Card key={pillar} className="gap-2">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full" style={{ background: pillarColor[pillar] }} />
                <p className="text-xs font-medium text-foreground truncate">{pillar}</p>
              </div>
              <p className="font-display text-2xl text-foreground">{pillarPosts.length}</p>
              <p className="text-[11px] text-muted-foreground">
                {published} published · {scheduled} scheduled · {inProgress} in progress
              </p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
