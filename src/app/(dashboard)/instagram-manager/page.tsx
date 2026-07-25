"use client";

import { useState } from "react";
import { Info } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { BoardColumn } from "@/components/instagram-manager/board-column";
import { AddPostDialog } from "@/components/instagram-manager/add-post-dialog";
import {
  type Post,
  type PostStatus,
  postStatuses,
  seedPosts,
} from "@/lib/instagram-data";

export default function InstagramManagerPage() {
  const [posts, setPosts] = useState<Post[]>(seedPosts);

  function addPost(post: Post) {
    setPosts((prev) => [post, ...prev]);
  }

  function changeStatus(id: string, status: PostStatus) {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  }

  function removePost(id: string) {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

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
          the seed list in <code className="text-xs">src/lib/instagram-data.ts</code>. Nothing
          persists between reloads yet, there&apos;s no data layer wired up.
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
