"use client";

import { useState } from "react";
import { Monitor, Smartphone, Rocket, CheckCircle2, Info } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BlockList } from "@/components/website-builder/block-list";
import { InspectorPanel } from "@/components/website-builder/inspector-panel";
import { SitePreview } from "@/components/website-builder/site-preview";
import { DomainDialog } from "@/components/website-builder/domain-dialog";
import { HostingDialog } from "@/components/website-builder/hosting-dialog";
import { PaymentsDialog } from "@/components/website-builder/payments-dialog";
import {
  type Block,
  type BlockType,
  defaultPage,
  createDefaultBlock,
} from "@/lib/website-data";
import { cn } from "@/lib/utils";

export default function WebsiteBuilderPage() {
  const [blocks, setBlocks] = useState<Block[]>(defaultPage());
  const [selectedId, setSelectedId] = useState<string | null>(blocks[0]?.id ?? null);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [published, setPublished] = useState(false);
  const [stripeKey, setStripeKey] = useState("");
  const [currency, setCurrency] = useState("PKR");

  const selected = blocks.find((b) => b.id === selectedId) ?? null;

  function addBlock(type: BlockType) {
    const block = createDefaultBlock(type);
    setBlocks((prev) => [...prev, block]);
    setSelectedId(block.id);
  }

  function moveBlock(id: string, direction: -1 | 1) {
    setBlocks((prev) => {
      const index = prev.findIndex((b) => b.id === id);
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function removeBlock(id: string) {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function updateSelected(updater: (b: Block) => Block) {
    if (!selectedId) return;
    setBlocks((prev) => prev.map((b) => (b.id === selectedId ? updater(b) : b)));
  }

  function handlePublish() {
    setPublished(true);
    setTimeout(() => setPublished(false), 3000);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <Badge variant="outline" className="mb-4 text-muted-foreground">
            Website
          </Badge>
          <h1 className="font-display text-3xl text-foreground mb-2">Website Builder</h1>
          <p className="text-muted-foreground max-w-xl">
            Build the Florenza storefront section by section. Pick a block, edit it on the
            right, watch the preview update. Featured Products pulls real SKUs straight from
            Product Management.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DomainDialog />
          <HostingDialog blocks={blocks} />
          <PaymentsDialog
            stripeKey={stripeKey}
            onStripeKeyChange={setStripeKey}
            currency={currency}
            onCurrencyChange={setCurrency}
          />
          <Button size="sm" onClick={handlePublish}>
            {published ? <CheckCircle2 className="size-4" /> : <Rocket className="size-4" />}
            {published ? "Saved" : "Publish"}
          </Button>
        </div>
      </div>

      <div className="flex items-start gap-2.5 rounded-lg border border-primary/25 bg-primary/5 px-4 py-3 text-sm text-foreground/85">
        <Info className="size-4 shrink-0 mt-0.5 text-primary" strokeWidth={1.75} />
        <p>
          The preview below has a real cart, add products, open the cart, hit checkout, it
          creates an actual Stripe Checkout session (add a key in{" "}
          <span className="text-foreground">Payments</span> first) and sends you to Stripe&apos;s
          real hosted payment page. &quot;Publish&quot; just saves your layout for this session.
          For a live URL, use <span className="text-foreground">Hosting</span>, it deploys a
          real static export, cart included, to your own Netlify account. The{" "}
          <span className="text-foreground">Domain</span> button does a real DNS ownership
          check. Images are still placeholders, drop in real Florenza photography before this
          goes anywhere near real customers.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[260px_1fr_300px] gap-5">
        <div className="rounded-lg border border-border p-4 xl:order-1 order-2">
          <BlockList
            blocks={blocks}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onMove={moveBlock}
            onRemove={removeBlock}
            onAdd={addBlock}
          />
        </div>

        <div className="rounded-lg border border-border overflow-hidden xl:order-2 order-1">
          <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-4 py-2.5">
            <p className="text-xs text-muted-foreground">florenzaflourish.com</p>
            <div className="flex items-center gap-1 rounded-md border border-border p-0.5">
              <button
                onClick={() => setDevice("desktop")}
                className={cn(
                  "rounded p-1.5",
                  device === "desktop" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                )}
                aria-label="Desktop preview"
              >
                <Monitor className="size-3.5" />
              </button>
              <button
                onClick={() => setDevice("mobile")}
                className={cn(
                  "rounded p-1.5",
                  device === "mobile" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                )}
                aria-label="Mobile preview"
              >
                <Smartphone className="size-3.5" />
              </button>
            </div>
          </div>
          <div className="max-h-[720px] overflow-y-auto bg-secondary/10 p-4">
            <div
              className={cn(
                "mx-auto overflow-hidden rounded-lg shadow-xl transition-all",
                device === "mobile" ? "max-w-[375px]" : "max-w-full"
              )}
            >
              <SitePreview blocks={blocks} stripeKey={stripeKey} currency={currency} />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border p-4 xl:order-3 order-3">
          <InspectorPanel block={selected} onChange={updateSelected} />
        </div>
      </div>
    </div>
  );
}
