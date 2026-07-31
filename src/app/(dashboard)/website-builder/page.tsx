"use client";

import { useState } from "react";
import { Monitor, Smartphone, Rocket, CheckCircle2, Info } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BlockList } from "@/components/website-builder/block-list";
import { InspectorPanel } from "@/components/website-builder/inspector-panel";
import { ShopConfigPanel } from "@/components/website-builder/shop-config-panel";
import { HeaderConfigPanel } from "@/components/website-builder/header-config-panel";
import { SitePreview } from "@/components/website-builder/site-preview";
import { DomainDialog } from "@/components/website-builder/domain-dialog";
import { HostingDialog } from "@/components/website-builder/hosting-dialog";
import {
  type Block,
  type BlockType,
  type Site,
  type SitePageId,
  sitePages,
  defaultSite,
  createDefaultBlock,
} from "@/lib/website-data";
import { useProducts } from "@/lib/products-context";
import { cn } from "@/lib/utils";

type EditTarget = "header" | SitePageId;

export default function WebsiteBuilderPage() {
  const { products } = useProducts();
  const [site, setSite] = useState<Site>(defaultSite());
  const [currentPage, setCurrentPage] = useState<SitePageId>("home");
  const [editTarget, setEditTarget] = useState<EditTarget>("home");
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(site.home[0]?.id ?? null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [published, setPublished] = useState(false);

  const selectedBlock = site.home.find((b) => b.id === selectedBlockId) ?? null;

  function navigate(page: SitePageId, opts?: { productId?: string }) {
    setCurrentPage(page);
    if (opts?.productId) setSelectedProductId(opts.productId);
  }

  function selectTab(target: EditTarget) {
    setEditTarget(target);
    if (target !== "header") setCurrentPage(target);
  }

  function addBlock(type: BlockType) {
    const block = createDefaultBlock(type);
    setSite((prev) => ({ ...prev, home: [...prev.home, block] }));
    setSelectedBlockId(block.id);
  }

  function moveBlock(id: string, direction: -1 | 1) {
    setSite((prev) => {
      const blocks = prev.home;
      const index = blocks.findIndex((b) => b.id === id);
      const target = index + direction;
      if (target < 0 || target >= blocks.length) return prev;
      const next = [...blocks];
      [next[index], next[target]] = [next[target], next[index]];
      return { ...prev, home: next };
    });
  }

  function removeBlock(id: string) {
    setSite((prev) => ({ ...prev, home: prev.home.filter((b) => b.id !== id) }));
    if (selectedBlockId === id) setSelectedBlockId(null);
  }

  function updateSelectedBlock(updater: (b: Block) => Block) {
    if (!selectedBlockId) return;
    setSite((prev) => ({
      ...prev,
      home: prev.home.map((b) => (b.id === selectedBlockId ? updater(b) : b)),
    }));
  }

  function updateShopConfig(updater: (c: Site["shop"]) => Site["shop"]) {
    setSite((prev) => ({ ...prev, shop: updater(prev.shop) }));
  }

  function updateHeaderConfig(updater: (c: Site["header"]) => Site["header"]) {
    setSite((prev) => ({ ...prev, header: updater(prev.header) }));
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
            Real pages, real product images, a responsive header with a scrolling announcement
            bar, and scroll-reveal animations on every section, not another templated-looking
            single scroller.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DomainDialog />
          <HostingDialog site={site} products={products} />
          <Button size="sm" onClick={handlePublish}>
            {published ? <CheckCircle2 className="size-4" /> : <Rocket className="size-4" />}
            {published ? "Saved" : "Publish"}
          </Button>
        </div>
      </div>

      <div className="flex items-start gap-2.5 rounded-lg border border-primary/25 bg-primary/5 px-4 py-3 text-sm text-foreground/85">
        <Info className="size-4 shrink-0 mt-0.5 text-primary" strokeWidth={1.75} />
        <p>
          Product images upload right in Product Management now and show up here immediately,
          same shared catalogue, not a copy. Checkout is intentionally disabled,
          &quot;Checkout coming soon,&quot; payment processing comes later with a different
          provider. &quot;Publish&quot; saves your layout for this session, use{" "}
          <span className="text-foreground">Hosting</span> for a real deployed URL, all four
          pages, real images, animations included.
        </p>
      </div>

      <div className="flex items-center gap-1 rounded-lg border border-border p-1 w-fit overflow-x-auto">
        <button
          onClick={() => selectTab("header")}
          className={cn(
            "rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors whitespace-nowrap",
            editTarget === "header"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Header
        </button>
        {sitePages.map((p) => (
          <button
            key={p.id}
            onClick={() => selectTab(p.id)}
            className={cn(
              "rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors whitespace-nowrap",
              editTarget === p.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[260px_1fr_300px] gap-5">
        <div className="rounded-lg border border-border p-4 xl:order-1 order-2">
          {editTarget === "home" ? (
            <BlockList
              blocks={site.home}
              selectedId={selectedBlockId}
              onSelect={setSelectedBlockId}
              onMove={moveBlock}
              onRemove={removeBlock}
              onAdd={addBlock}
            />
          ) : (
            <p className="text-xs text-muted-foreground">
              {editTarget === "header"
                ? "The header has no block list, it's one site-wide config, edit it on the right."
                : `${sitePages.find((p) => p.id === editTarget)?.label} is a templated page, not block-built, there's nothing to add or reorder here.`}{" "}
              Switch to{" "}
              <button onClick={() => selectTab("home")} className="text-primary underline">
                Home
              </button>{" "}
              to use the block editor.
            </p>
          )}
        </div>

        <div className="rounded-lg border border-border overflow-hidden xl:order-2 order-1">
          <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-4 py-2.5">
            <p className="text-xs text-muted-foreground">
              florenzaflourish.com{currentPage !== "home" ? `/${currentPage}` : ""}
            </p>
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
              <SitePreview
                site={site}
                products={products}
                currentPage={currentPage}
                selectedProductId={selectedProductId}
                onNavigate={navigate}
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border p-4 xl:order-3 order-3">
          {editTarget === "header" && (
            <HeaderConfigPanel config={site.header} onChange={updateHeaderConfig} />
          )}
          {editTarget === "home" && (
            <InspectorPanel block={selectedBlock} products={products} onChange={updateSelectedBlock} />
          )}
          {editTarget === "shop" && <ShopConfigPanel config={site.shop} onChange={updateShopConfig} />}
          {(editTarget === "product" || editTarget === "cart") && (
            <p className="text-xs text-muted-foreground">
              This page is fully dynamic, driven by the product catalogue and the cart, nothing
              to configure here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
