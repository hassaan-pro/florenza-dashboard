"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type ShopConfig } from "@/lib/website-data";

export function ShopConfigPanel({
  config,
  onChange,
}: {
  config: ShopConfig;
  onChange: (updater: (c: ShopConfig) => ShopConfig) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Editing · Shop page
      </p>
      <p className="text-xs text-muted-foreground/80 -mt-2">
        The Shop page always shows the full product catalogue from Product Management, that part
        isn&apos;t editable here. Just the heading copy is.
      </p>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="shop-heading">Heading</Label>
        <Input
          id="shop-heading"
          value={config.heading}
          onChange={(e) => onChange((c) => ({ ...c, heading: e.target.value }))}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="shop-subheading">Subheading</Label>
        <Textarea
          id="shop-subheading"
          rows={3}
          value={config.subheading}
          onChange={(e) => onChange((c) => ({ ...c, subheading: e.target.value }))}
        />
      </div>
    </div>
  );
}
