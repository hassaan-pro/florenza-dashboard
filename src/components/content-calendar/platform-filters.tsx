"use client";

import { Grid3x3, ThumbsUp, Music2, Pin } from "lucide-react";

import { cn } from "@/lib/utils";
import { type Platform, platforms, platformColor } from "@/lib/calendar-data";

const platformIcon = {
  Instagram: Grid3x3,
  Facebook: ThumbsUp,
  TikTok: Music2,
  Pinterest: Pin,
} as const;

export function PlatformFilters({
  active,
  onToggle,
}: {
  active: Set<Platform>;
  onToggle: (platform: Platform) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {platforms.map((platform) => {
        const Icon = platformIcon[platform];
        const isActive = active.has(platform);
        return (
          <button
            key={platform}
            onClick={() => onToggle(platform)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              isActive
                ? "border-transparent text-primary-foreground"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
            )}
            style={isActive ? { background: platformColor[platform] } : undefined}
          >
            <Icon className="size-3.5" strokeWidth={2} />
            {platform}
          </button>
        );
      })}
    </div>
  );
}
