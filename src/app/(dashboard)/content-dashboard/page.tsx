"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { PillarBreakdown } from "@/components/content-dashboard/pillar-breakdown";
import { BatchSection } from "@/components/content-dashboard/batch-section";
import { AssetLibrary } from "@/components/content-dashboard/asset-library";
import { useInstagramPosts } from "@/lib/instagram-context";
import {
  type GridBatch,
  type BatchStatus,
  type Asset,
  seedBatches,
  seedAssets,
} from "@/lib/content-dashboard-data";

export default function ContentDashboardPage() {
  const { posts } = useInstagramPosts();
  const [batches, setBatches] = useState<GridBatch[]>(seedBatches);
  const [assets, setAssets] = useState<Asset[]>(seedAssets);

  function addBatch(batch: GridBatch) {
    setBatches((prev) => [batch, ...prev]);
  }
  function updateBatchStatus(id: string, status: BatchStatus) {
    setBatches((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  }
  function updatePostCount(id: string, count: number) {
    setBatches((prev) => prev.map((b) => (b.id === id ? { ...b, postCount: count } : b)));
  }
  function removeBatch(id: string) {
    setBatches((prev) => prev.filter((b) => b.id !== id));
  }
  function addAsset(asset: Asset) {
    setAssets((prev) => [asset, ...prev]);
  }
  function removeAsset(id: string) {
    setAssets((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="space-y-6">
      <div>
        <Badge variant="outline" className="mb-4 text-muted-foreground">
          Content
        </Badge>
        <h1 className="font-display text-3xl text-foreground mb-2">Content Dashboard</h1>
        <p className="text-muted-foreground max-w-xl">
          The command center across every content pillar: what&apos;s live, what grid batch
          is in motion, and what assets exist to build the next one.
        </p>
      </div>

      <PillarBreakdown posts={posts} />
      <BatchSection
        batches={batches}
        onAdd={addBatch}
        onStatusChange={updateBatchStatus}
        onPostCountChange={updatePostCount}
        onRemove={removeBatch}
      />
      <AssetLibrary assets={assets} onAdd={addAsset} onRemove={removeAsset} />
    </div>
  );
}
