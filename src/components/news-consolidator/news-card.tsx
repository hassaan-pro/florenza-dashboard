import { Wrench, FlaskConical, Briefcase, ExternalLink } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type NewsItem, formatPublishDate } from "@/lib/news-data";

const topicIcon = {
  Tools: Wrench,
  Research: FlaskConical,
  Business: Briefcase,
} as const;

const topicVariant = {
  Tools: "secondary",
  Research: "success",
  Business: "default",
} as const;

export function NewsCard({ item }: { item: NewsItem }) {
  const Icon = topicIcon[item.topic];

  return (
    <Card className="gap-3">
      <div className="flex items-center justify-between">
        <Badge variant={topicVariant[item.topic]}>
          <Icon className="size-3" strokeWidth={2} />
          {item.topic}
        </Badge>
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {formatPublishDate(item.publishDate)}
        </span>
      </div>

      <a
        href={item.url}
        target="_blank"
        rel="noreferrer noopener"
        className="group"
      >
        <h3 className="font-display text-base text-foreground leading-snug group-hover:text-primary transition-colors">
          {item.headline}
        </h3>
      </a>

      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
        {item.summary}
      </p>

      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-muted-foreground">{item.source}</span>
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
        >
          Read article
          <ExternalLink className="size-3" />
        </a>
      </div>
    </Card>
  );
}
