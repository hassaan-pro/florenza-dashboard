"use client";

import { Info } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { BoardColumn } from "@/components/instagram-manager/board-column";
import { AddPostDialog } from "@/components/instagram-manager/add-post-dialog";
import { postStatuses } from "@/lib/instagram-data";
import { useInstagramPosts } from "@/lib/instagram-context";

export default function InstagramManagerPage() {
  const { posts, addPost, changeStatus, removePost } = useInstagramPosts();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <Badge variant="outline" className="mb-4 text-muted-foreground">
            Content
          </Badge>
          <h1 className="font-display text-3xl text-foreground mb-2">Instagram Manager</h1>
          <p className="text-muted-foreground max-w-xl">
            Every post idea, from rough thought to published, moved along one board. Add an
            idea, set its status, watch it move through the pipeline.
          </p>
        </div>
        <AddPostDialog onAdd={addPost} />
      </div>

      <div className="flex items-start gap-2.5 rounded-lg border border-primary/25 bg-primary/5 px-4 py-3 text-sm text-foreground/85">
        <Info className="size-4 shrink-0 mt-0.5 text-primary" strokeWidth={1.75} />
        <p>
          The posts below are placeholder sample content so the board works out of the box.
          Add your own via <span className="text-foreground">New post idea</span>, or clear
          the seed list in <code className="text-xs">src/lib/instagram-data.ts</code>. This data
          is shared with Content Dashboard&apos;s pillar breakdown, add a post here and it shows
          up there. Nothing persists between reloads yet, there&apos;s no data layer wired up.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {postStatuses.map((status) => (
          <BoardColumn
            key={status}
            status={status}
            posts={posts.filter((p) => p.status === status)}
            onStatusChange={changeStatus}
            onRemove={removePost}
          />
        ))}
      </div>
    </div>
  );
}
