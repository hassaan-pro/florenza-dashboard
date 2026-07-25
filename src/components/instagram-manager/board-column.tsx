"use client";

import { Inbox } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { PostCard } from "@/components/instagram-manager/post-card";
import { type Post, type PostStatus } from "@/lib/instagram-data";

const statusAccent: Record<PostStatus, string> = {
  Backlog: "var(--chart-4)",
  Draft: "var(--chart-5)",
  Scheduled: "var(--primary)",
  Published: "var(--success)",
};

const statusHint: Record<PostStatus, string> = {
  Backlog: "Ideas, not started",
  Draft: "In progress",
  Scheduled: "Locked, going out",
  Published: "Already live",
};

export function BoardColumn({
  status,
  posts,
  onStatusChange,
  onRemove,
}: {
  status: PostStatus;
  posts: Post[];
  onStatusChange: (id: string, status: PostStatus) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3 min-w-0">
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-2">
          <span
            className="size-2 rounded-full"
            style={{ background: statusAccent[status] }}
          />
          <p className="font-display text-sm text-foreground">{status}</p>
        </div>
        <Badge variant="secondary">{posts.length}</Badge>
      </div>
      <p className="px-0.5 -mt-2 text-[11px] text-muted-foreground">{statusHint[status]}</p>

      <div className="flex flex-col gap-3">
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-10 text-center">
            <Inbox className="size-4 text-muted-foreground/50" strokeWidth={1.75} />
            <p className="text-xs text-muted-foreground/70">Nothing here yet</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onStatusChange={onStatusChange}
              onRemove={onRemove}
            />
          ))
        )}
      </div>
    </div>
  );
}
