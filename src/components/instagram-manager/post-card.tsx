"use client";

import { CalendarClock, Clapperboard, CircleDot, Image as ImageIcon, Layers, Trash2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  type Post,
  type PostStatus,
  postStatuses,
  pillarColor,
  formatDate,
} from "@/lib/instagram-data";

const typeIcon = {
  "Feed Post": ImageIcon,
  Reel: Clapperboard,
  Story: CircleDot,
  Carousel: Layers,
} as const;

export function PostCard({
  post,
  onStatusChange,
  onRemove,
}: {
  post: Post;
  onStatusChange: (id: string, status: PostStatus) => void;
  onRemove: (id: string) => void;
}) {
  const TypeIcon = typeIcon[post.type];

  return (
    <Card className="gap-3 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span
            className="size-1.5 rounded-full shrink-0"
            style={{ background: pillarColor[post.pillar] }}
          />
          {post.pillar}
        </div>
        <button
          onClick={() => onRemove(post.id)}
          className="rounded-md p-1 text-muted-foreground/60 hover:bg-destructive/15 hover:text-destructive shrink-0"
          aria-label="Remove post idea"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>

      <p className="text-sm text-foreground/90 leading-relaxed line-clamp-4">{post.caption}</p>

      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
        <span className="inline-flex items-center gap-1.5">
          <TypeIcon className="size-3.5" strokeWidth={1.75} />
          {post.type}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1.5",
            !post.scheduledDate && "text-muted-foreground/50"
          )}
        >
          <CalendarClock className="size-3.5" strokeWidth={1.75} />
          {formatDate(post.scheduledDate)}
        </span>
      </div>

      <div className="flex items-center gap-2 pt-0.5">
        <span className="text-xs text-muted-foreground shrink-0">Status</span>
        <Select
          value={post.status}
          onChange={(e) => onStatusChange(post.id, e.target.value as PostStatus)}
          className="h-8 text-xs"
        >
          {postStatuses.map((s) => (
            <option key={s} value={s} className="bg-card">
              {s}
            </option>
          ))}
        </Select>
      </div>
    </Card>
  );
}
