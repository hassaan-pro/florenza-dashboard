import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type PageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  comingSoon: string[];
};

/**
 * Shared placeholder layout used by every section page until the real
 * views are built out. Keeps a consistent header + "what's coming" card
 * so the dashboard feels considered even before data is wired up.
 */
export function PageShell({ eyebrow, title, description, icon: Icon, comingSoon }: PageShellProps) {
  return (
    <div className="max-w-4xl">
      <Badge variant="outline" className="mb-4 text-muted-foreground">
        {eyebrow}
      </Badge>
      <h1 className="font-display text-3xl text-foreground mb-2">{title}</h1>
      <p className="text-muted-foreground max-w-xl mb-8">{description}</p>

      <Card className="border-dashed">
        <CardContent className="flex flex-col gap-5 py-2">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-md bg-primary/10 border border-primary/25 text-primary">
              <Icon className="size-[18px]" strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">Not built yet</p>
              <p className="text-xs text-muted-foreground">
                This section is scaffolded and routed. Here&apos;s what it&apos;s planned to hold.
              </p>
            </div>
          </div>

          <ul className="space-y-2.5 pl-1">
            {comingSoon.map((line) => (
              <li key={line} className="flex items-start gap-2.5 text-sm text-foreground/85">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-primary/70" />
                {line}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
