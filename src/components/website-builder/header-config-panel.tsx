"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { type HeaderConfig } from "@/lib/website-data";

export function HeaderConfigPanel({
  config,
  onChange,
}: {
  config: HeaderConfig;
  onChange: (updater: (c: HeaderConfig) => HeaderConfig) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Editing · Header
      </p>
      <p className="text-xs text-muted-foreground/80 -mt-2">
        Appears on all four pages, this is site-wide, not per-page. Nav links themselves
        (Home/Shop/Cart) are fixed since the site only has four pages.
      </p>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="header-logo">Logo text</Label>
        <Input
          id="header-logo"
          value={config.logoText}
          onChange={(e) => onChange((c) => ({ ...c, logoText: e.target.value }))}
        />
      </div>

      <div className="flex items-center gap-2.5 pt-1">
        <input
          id="header-announcement-toggle"
          type="checkbox"
          checked={config.showAnnouncement}
          onChange={(e) => onChange((c) => ({ ...c, showAnnouncement: e.target.checked }))}
          className="size-3.5 accent-[var(--primary)]"
        />
        <Label htmlFor="header-announcement-toggle" className="cursor-pointer">
          Show scrolling announcement bar
        </Label>
      </div>

      {config.showAnnouncement && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="header-announcement-text">Announcement text</Label>
          <Input
            id="header-announcement-text"
            value={config.announcementText}
            onChange={(e) => onChange((c) => ({ ...c, announcementText: e.target.value }))}
          />
          <p className="text-[11px] text-muted-foreground/70">
            Scrolls continuously, keep it short, it repeats.
          </p>
        </div>
      )}
    </div>
  );
}
