"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarGrid } from "@/components/content-calendar/calendar-grid";
import { PlatformFilters } from "@/components/content-calendar/platform-filters";
import { AddCalendarItemDialog } from "@/components/content-calendar/add-item-dialog";
import {
  type CalendarItem,
  type Platform,
  platforms,
  platformColor,
  seedCalendarItems,
  monthLabel,
} from "@/lib/calendar-data";

export default function ContentCalendarPage() {
  const [items, setItems] = useState<CalendarItem[]>(seedCalendarItems);
  const [active, setActive] = useState<Set<Platform>>(new Set(platforms));
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const label = useMemo(() => monthLabel(cursor.year, cursor.month), [cursor]);

  function togglePlatform(platform: Platform) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(platform)) next.delete(platform);
      else next.add(platform);
      return next;
    });
  }

  function shiftMonth(delta: number) {
    setCursor((prev) => {
      const d = new Date(prev.year, prev.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }

  function addItem(item: CalendarItem) {
    setItems((prev) => [...prev, item]);
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <Badge variant="outline" className="mb-4 text-muted-foreground">
            Content
          </Badge>
          <h1 className="font-display text-3xl text-foreground mb-2">Content Calendar</h1>
          <p className="text-muted-foreground max-w-xl">
            Scheduled and published content across every channel, on one month view. Solid
            chips are posted, dashed outlines are scheduled.
          </p>
        </div>
        <AddCalendarItemDialog onAdd={addItem} />
      </div>

      <div className="flex items-start gap-2.5 rounded-lg border border-primary/25 bg-primary/5 px-4 py-3 text-sm text-foreground/85">
        <Info className="size-4 shrink-0 mt-0.5 text-primary" strokeWidth={1.75} />
        <p>
          The items on this calendar are placeholder sample content so the view works out of
          the box. Add your own via <span className="text-foreground">New content item</span>,
          or clear the seed list in <code className="text-xs">src/lib/calendar-data.ts</code>.
          Nothing persists between reloads yet, there&apos;s no data layer wired up.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => shiftMonth(-1)} aria-label="Previous month">
            <ChevronLeft className="size-4" />
          </Button>
          <p className="font-display text-lg text-foreground w-40 text-center">{label}</p>
          <Button variant="outline" size="icon" onClick={() => shiftMonth(1)} aria-label="Next month">
            <ChevronRight className="size-4" />
          </Button>
        </div>
        <PlatformFilters active={active} onToggle={togglePlatform} />
      </div>

      <CalendarGrid
        year={cursor.year}
        month={cursor.month}
        items={items}
        activePlatforms={active}
        onRemoveItem={removeItem}
      />

      <div className="flex flex-wrap gap-x-5 gap-y-1.5">
        {platforms.map((p) => (
          <div key={p} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-2 rounded-full" style={{ background: platformColor[p] }} />
            {p}
          </div>
        ))}
      </div>
    </div>
  );
}
