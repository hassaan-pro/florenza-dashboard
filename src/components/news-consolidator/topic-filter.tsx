"use client";

import { Wrench, FlaskConical, Briefcase, LayoutGrid } from "lucide-react";

import { cn } from "@/lib/utils";
import { type NewsTopic, newsTopics } from "@/lib/news-data";

const topicIcon = {
  Tools: Wrench,
  Research: FlaskConical,
  Business: Briefcase,
} as const;

export function TopicFilter({
  active,
  onChange,
}: {
  active: NewsTopic | "All";
  onChange: (topic: NewsTopic | "All") => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange("All")}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
          active === "All"
            ? "border-transparent bg-primary text-primary-foreground"
            : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
        )}
      >
        <LayoutGrid className="size-3.5" strokeWidth={2} />
        All
      </button>
      {newsTopics.map((topic) => {
        const Icon = topicIcon[topic];
        const isActive = active === topic;
        return (
          <button
            key={topic}
            onClick={() => onChange(topic)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              isActive
                ? "border-transparent bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
            )}
          >
            <Icon className="size-3.5" strokeWidth={2} />
            {topic}
          </button>
        );
      })}
    </div>
  );
}
