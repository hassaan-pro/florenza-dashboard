"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flower2 } from "lucide-react";

import { navGroups } from "@/lib/nav-config";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30 border-r border-sidebar-border bg-sidebar">
      <div className="flex h-16 items-center gap-2.5 px-5 border-b border-sidebar-border">
        <span className="flex size-8 items-center justify-center rounded-t-full rounded-b-md bg-primary/15 border border-primary/30 text-primary">
          <Flower2 className="size-4" strokeWidth={1.75} />
        </span>
        <div className="flex flex-col leading-none">
          <span className="font-display text-[15px] text-foreground tracking-wide">
            Florenza
          </span>
          <span className="text-[11px] text-muted-foreground tracking-wide">
            Business Dashboard
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
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
                      className={cn(
                        "group flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                        active
                          ? "bg-sidebar-accent text-foreground"
                          : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
                      )}
                    >
                      <Icon
                        strokeWidth={1.75}
                        className={cn(
                          "size-[17px] shrink-0",
                          active ? "text-primary" : "text-muted-foreground/80 group-hover:text-primary/80"
                        )}
                      />
                      <span className="truncate">{item.title}</span>
                      {active && (
                        <span className="ml-auto size-1.5 rounded-full bg-primary" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-sidebar-border">
        <p className="text-[11px] text-muted-foreground/70 leading-relaxed">
          Florenza Flourish · Lahore
        </p>
      </div>
    </aside>
  );
}
