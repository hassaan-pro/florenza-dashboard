"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { seedProducts, formatPKR } from "@/lib/product-data";
import { blockLabels, type Block } from "@/lib/website-data";

export function InspectorPanel({
  block,
  onChange,
}: {
  block: Block | null;
  onChange: (updater: (b: Block) => Block) => void;
}) {
  if (!block) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-border p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Select a section on the left to edit its content.
        </p>
      </div>
    );
  }

  function field<K extends string>(key: K, value: string, label: string, multiline = false) {
    const Comp = multiline ? Textarea : Input;
    return (
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={key}>{label}</Label>
        <Comp
          id={key}
          value={value}
          rows={multiline ? 4 : undefined}
          onChange={(e) =>
            onChange((b) => ({ ...b, [key]: e.target.value }) as Block)
          }
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Editing · {blockLabels[block.type]}
      </p>

      {block.type === "hero" && (
        <>
          {field("eyebrow", block.eyebrow, "Eyebrow")}
          {field("headline", block.headline, "Headline", true)}
          {field("subheadline", block.subheadline, "Subheadline", true)}
          {field("ctaText", block.ctaText, "Button text")}
          {field("imageNote", block.imageNote, "Image placeholder note")}
        </>
      )}

      {block.type === "featured-products" && (
        <>
          {field("heading", block.heading, "Heading")}
          {field("subheading", block.subheading, "Subheading")}
          <div className="flex flex-col gap-1.5">
            <Label>Products shown</Label>
            <p className="text-xs text-muted-foreground/80 -mt-1">
              Pulled from Product Management&apos;s catalogue.
            </p>
            <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto rounded-md border border-border p-2">
              {seedProducts.map((p) => {
                const checked = block.productIds.includes(p.id);
                return (
                  <label
                    key={p.id}
                    className="flex items-center gap-2.5 rounded px-1.5 py-1 text-sm hover:bg-secondary/40 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        onChange((b) => {
                          if (b.type !== "featured-products") return b;
                          const productIds = checked
                            ? b.productIds.filter((id) => id !== p.id)
                            : [...b.productIds, p.id];
                          return { ...b, productIds };
                        })
                      }
                      className="size-3.5 accent-[var(--primary)]"
                    />
                    <span className="flex-1 truncate">{p.name}</span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {formatPKR(p.price)}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </>
      )}

      {block.type === "about" && (
        <>
          {field("heading", block.heading, "Heading")}
          {field("body", block.body, "Body text", true)}
          {field("imageNote", block.imageNote, "Image placeholder note")}
        </>
      )}

      {block.type === "testimonial" && (
        <>
          {field("quote", block.quote, "Quote", true)}
          {field("author", block.author, "Author name")}
          {field("authorContext", block.authorContext, "Author context")}
        </>
      )}

      {block.type === "newsletter" && (
        <>
          {field("heading", block.heading, "Heading")}
          {field("subheading", block.subheading, "Subheading")}
          {field("buttonText", block.buttonText, "Button text")}
        </>
      )}

      {block.type === "footer" && (
        <>
          {field("businessName", block.businessName, "Business name")}
          {field("tagline", block.tagline, "Tagline")}
          {field("city", block.city, "City")}
          {field("instagramHandle", block.instagramHandle, "Instagram handle")}
        </>
      )}
    </div>
  );
}
