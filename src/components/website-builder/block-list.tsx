"use client";

import {
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Sparkles,
  ShoppingBag,
  LayoutGrid,
  Type,
  Star,
  Mail,
  Layers3,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { type Block, type BlockType, blockLabels, blockDescriptions } from "@/lib/website-data";

const blockIcon: Record<BlockType, typeof Sparkles> = {
  hero: Sparkles,
  "featured-products": ShoppingBag,
  "category-showcase": LayoutGrid,
  about: Type,
  testimonial: Star,
  newsletter: Mail,
  footer: Layers3,
};

const allBlockTypes: BlockType[] = [
  "hero",
  "featured-products",
  "category-showcase",
  "about",
  "testimonial",
  "newsletter",
  "footer",
];

export function BlockList({
  blocks,
  selectedId,
  onSelect,
  onMove,
  onRemove,
  onAdd,
}: {
  blocks: Block[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onMove: (id: string, direction: -1 | 1) => void;
  onRemove: (id: string) => void;
  onAdd: (type: BlockType) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Page sections
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="secondary">
              <Plus className="size-3.5" />
              Add
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {allBlockTypes.map((type) => {
              const Icon = blockIcon[type];
              return (
                <DropdownMenuItem key={type} onSelect={() => onAdd(type)}>
                  <span className="flex items-center gap-2 text-foreground">
                    <Icon className="size-3.5 text-primary" strokeWidth={1.75} />
                    {blockLabels[type]}
                  </span>
                  <span className="text-xs text-muted-foreground pl-5.5">
                    {blockDescriptions[type]}
                  </span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-col gap-1.5">
        {blocks.map((block, i) => {
          const Icon = blockIcon[block.type];
          const active = block.id === selectedId;
          return (
            <div
              key={block.id}
              className={cn(
                "flex items-center gap-2 rounded-md border px-2.5 py-2 cursor-pointer transition-colors",
                active
                  ? "border-primary/40 bg-primary/10"
                  : "border-border hover:bg-secondary/40"
              )}
              onClick={() => onSelect(block.id)}
            >
              <Icon
                className={cn("size-3.5 shrink-0", active ? "text-primary" : "text-muted-foreground")}
                strokeWidth={1.75}
              />
              <span className="flex-1 min-w-0 truncate text-sm text-foreground/90">
                {blockLabels[block.type]}
              </span>
              <div className="flex items-center shrink-0" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onMove(block.id, -1)}
                  disabled={i === 0}
                  className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
                  aria-label="Move up"
                >
                  <ArrowUp className="size-3" />
                </button>
                <button
                  onClick={() => onMove(block.id, 1)}
                  disabled={i === blocks.length - 1}
                  className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
                  aria-label="Move down"
                >
                  <ArrowDown className="size-3" />
                </button>
                <button
                  onClick={() => onRemove(block.id)}
                  className="rounded p-1 text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
                  aria-label="Remove block"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
