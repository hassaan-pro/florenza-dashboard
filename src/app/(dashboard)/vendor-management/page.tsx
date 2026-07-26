"use client";

import { useState } from "react";
import { Truck, Clock, Star, ClipboardList } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { VendorTable } from "@/components/vendor-management/vendor-table";
import { AddVendorDialog } from "@/components/vendor-management/add-vendor-dialog";
import { PurchaseOrderSection } from "@/components/vendor-management/po-section";
import {
  type Vendor,
  type PurchaseOrder,
  type POStatus,
  seedVendors,
  seedPurchaseOrders,
  averageScore,
} from "@/lib/vendor-data";

export default function VendorManagementPage() {
  const [vendors, setVendors] = useState<Vendor[]>(seedVendors);
  const [orders, setOrders] = useState<PurchaseOrder[]>(seedPurchaseOrders);

  function updateVendor(id: string, updater: (v: Vendor) => Vendor) {
    setVendors((prev) => prev.map((v) => (v.id === id ? updater(v) : v)));
  }
  function removeVendor(id: string) {
    setVendors((prev) => prev.filter((v) => v.id !== id));
    setOrders((prev) => prev.filter((po) => po.vendorId !== id));
  }
  function addVendor(v: Vendor) {
    setVendors((prev) => [...prev, v]);
  }
  function addPO(po: PurchaseOrder) {
    setOrders((prev) => [po, ...prev]);
  }
  function updatePOStatus(id: string, status: POStatus) {
    setOrders((prev) => prev.map((po) => (po.id === id ? { ...po, status } : po)));
  }
  function removePO(id: string) {
    setOrders((prev) => prev.filter((po) => po.id !== id));
  }

  const activeVendors = vendors.filter((v) => v.status === "Active").length;
  const avgLeadTime =
    vendors.length === 0 ? 0 : vendors.reduce((s, v) => s + v.leadTimeDays, 0) / vendors.length;
  const openPOs = orders.filter((po) => po.status === "Draft" || po.status === "Sent").length;

  const kpis = [
    { label: "Active vendors", value: `${activeVendors} / ${vendors.length}`, icon: Truck },
    { label: "Avg lead time", value: `${avgLeadTime.toFixed(1)} days`, icon: Clock },
    { label: "Avg reliability", value: `${averageScore(vendors, "reliability").toFixed(1)} / 5`, icon: Star },
    { label: "Open purchase orders", value: String(openPOs), icon: ClipboardList },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <Badge variant="outline" className="mb-4 text-muted-foreground">
            Business
          </Badge>
          <h1 className="font-display text-3xl text-foreground mb-2">Vendor Management</h1>
          <p className="text-muted-foreground max-w-xl">
            Florists, wrap suppliers, and delivery partners, with lead times, scorecards, and
            purchase order tracking. Everything below is editable.
          </p>
        </div>
        <AddVendorDialog onAdd={addVendor} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.label} className="gap-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{k.label}</p>
                <Icon className="size-4 text-primary" strokeWidth={1.75} />
              </div>
              <p className="font-display text-2xl text-foreground">{k.value}</p>
            </Card>
          );
        })}
      </div>

      <div className="space-y-3">
        <h2 className="font-display text-lg text-foreground">Vendor directory</h2>
        <VendorTable vendors={vendors} onChange={updateVendor} onRemove={removeVendor} />
      </div>

      <PurchaseOrderSection
        vendors={vendors}
        orders={orders}
        onAdd={addPO}
        onStatusChange={updatePOStatus}
        onRemove={removePO}
      />
    </div>
  );
}
