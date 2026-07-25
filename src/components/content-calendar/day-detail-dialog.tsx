"use client";

import { Grid3x3, ThumbsUp, Music2, Pin, Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { type CalendarItem, platformColor } from "@/lib/calendar-data";

const platformIcon = {
  Instagram: Grid3x3,
  Facebook: ThumbsUp,
  TikTok: Music2,
  Pinterest: Pin,
} as const;

export function DayDetailDialog({
  open,
  onOpenChange,
  dateLabel,
  items,
  onRemove,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dateLabel: string;
  items: CalendarItem[];
  onRemove: (id: string) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dateLabel}</DialogTitle>
          <DialogDescription>
            {items.length} item{items.length === 1 ? "" : "s"} on this day.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2.5">
          {items.map((item) => {
            const Icon = platformIcon[item.platform];
            return (
              <div
                key={item.id}
                className="flex items-start gap-3 rounded-lg border border-border p-3"
              >
                <span
                  className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md"
                  style={{ background: `${platformColor[item.platform]}26` }}
                >
                  <Icon className="size-3.5" style={{ color: platformColor[item.platform] }} strokeWidth={2} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground/90">{item.title}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{item.platform}</span>
                    <Badge variant={item.status === "Posted" ? "success" : "default"}>
                      {item.status}
                    </Badge>
                  </div>
                </div>
                <button
                  onClick={() => onRemove(item.id)}
                  className="rounded-md p-1 text-muted-foreground/60 hover:bg-destructive/15 hover:text-destructive shrink-0"
                  aria-label="Remove item"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
