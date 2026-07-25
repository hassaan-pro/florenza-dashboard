"use client";

import { useState } from "react";
import { Grid3x3, ThumbsUp, Music2, Pin } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  type CalendarItem,
  type Platform,
  getMonthGrid,
  toISODate,
  platformColor,
} from "@/lib/calendar-data";
import { DayDetailDialog } from "@/components/content-calendar/day-detail-dialog";

const platformIcon = {
  Instagram: Grid3x3,
  Facebook: ThumbsUp,
  TikTok: Music2,
  Pinterest: Pin,
} as const;

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MAX_VISIBLE = 3;

export function CalendarGrid({
  year,
  month,
  items,
  activePlatforms,
  onRemoveItem,
}: {
  year: number;
  month: number;
  items: CalendarItem[];
  activePlatforms: Set<Platform>;
  onRemoveItem: (id: string) => void;
}) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const days = getMonthGrid(year, month);
  const today = toISODate(new Date());

  const itemsByDate = items.reduce<Record<string, CalendarItem[]>>((acc, item) => {
    if (!activePlatforms.has(item.platform)) return acc;
    (acc[item.date] ??= []).push(item);
    return acc;
  }, {});

  const selectedItems = selectedDate ? itemsByDate[selectedDate] ?? [] : [];

  return (
    <>
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="grid grid-cols-7 border-b border-border bg-secondary/40">
          {weekdays.map((wd) => (
            <div
              key={wd}
              className="px-2 py-2 text-center text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
            >
              {wd}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {days.map((date) => {
            const iso = toISODate(date);
            const inMonth = date.getMonth() === month;
            const isToday = iso === today;
            const dayItems = itemsByDate[iso] ?? [];
            const visible = dayItems.slice(0, MAX_VISIBLE);
            const overflow = dayItems.length - visible.length;

            return (
              <div
                key={iso}
                className={cn(
                  "min-h-[104px] border-b border-r border-border p-1.5 flex flex-col gap-1",
                  !inMonth && "bg-background/40"
                )}
              >
                <span
                  className={cn(
                    "self-start text-xs px-1.5 py-0.5 rounded-full",
                    !inMonth && "text-muted-foreground/40",
                    inMonth && !isToday && "text-muted-foreground",
                    isToday && "bg-primary text-primary-foreground font-medium"
                  )}
                >
                  {date.getDate()}
                </span>

                <div className="flex flex-col gap-1">
                  {visible.map((item) => {
                    const Icon = platformIcon[item.platform];
                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedDate(iso)}
                        title={item.title}
                        className={cn(
                          "flex items-center gap-1 rounded px-1.5 py-0.5 text-left text-[10.5px] leading-tight truncate transition-opacity",
                          item.status === "Scheduled" && "border border-dashed",
                          "hover:opacity-80"
                        )}
                        style={{
                          background:
                            item.status === "Posted" ? `${platformColor[item.platform]}30` : "transparent",
                          borderColor: platformColor[item.platform],
                          color: item.status === "Posted" ? "var(--foreground)" : platformColor[item.platform],
                        }}
                      >
                        <Icon className="size-2.5 shrink-0" strokeWidth={2.25} />
                        <span className="truncate">{item.title}</span>
                      </button>
                    );
                  })}
                  {overflow > 0 && (
                    <button
                      onClick={() => setSelectedDate(iso)}
                      className="text-left text-[10.5px] text-muted-foreground hover:text-foreground px-1.5"
                    >
                      +{overflow} more
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <DayDetailDialog
        open={selectedDate !== null}
        onOpenChange={(open) => !open && setSelectedDate(null)}
        dateLabel={
          selectedDate
            ? new Date(selectedDate + "T00:00:00").toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })
            : ""
        }
        items={selectedItems}
        onRemove={onRemoveItem}
      />
    </>
  );
}
