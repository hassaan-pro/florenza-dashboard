"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Flower2 } from "lucide-react";

import { navGroups } from "@/lib/nav-config";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Topbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const current = navGroups
    .flatMap((g) => g.items)
    .find((item) => item.href === pathname);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur md:px-8">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground">
          <Menu className="size-5" />
          <span className="sr-only">Open navigation</span>
        </SheetTrigger>
        <SheetContent>
          <div className="flex h-16 items-center gap-2.5 px-5 border-b border-sidebar-border">
            <span className="flex size-8 items-center justify-center rounded-t-full rounded-b-md bg-primary/15 border border-primary/30 text-primary">
              <Flower2 className="size-4" strokeWidth={1.75} />
            </span>
            <span className="font-display text-[15px] text-foreground tracking-wide">
              Florenza
            </span>
          </div>
          <nav className="px-3 py-5 space-y-6 overflow-y-auto">
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="px-2.5 mb-2 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground/70">
                  {group.label}
                </p>
                <ul className="space-y-0.5">
                  {group.items.map((item) => {
                    const active = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm",
                            active
                              ? "bg-sidebar-accent text-foreground"
                              : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
                          )}
                        >
                          <Icon className="size-[17px]" strokeWidth={1.75} />
                          {item.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="flex flex-col leading-none">
        <span className="font-display text-[15px] text-foreground">
          {current?.title ?? "Florenza"}
        </span>
        <span className="text-[11px] text-muted-foreground hidden sm:inline">
          {current?.description ?? "Business Dashboard"}
        </span>
      </div>
    </header>
  );
}
