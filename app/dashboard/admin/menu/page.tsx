"use client";

import * as React from "react";
import { RefreshCw } from "lucide-react";
import { ItemTable } from "@/components/dashboard/item-table";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/common/loader";
import { PillTabs } from "@/components/motion-brew/pill-tabs";
import { useApiQuery } from "@/lib/use-api-query";
import type { MenuItem } from "@/types";

const MODERATION_TABS = [
  { id: "all", label: "All Items" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
];

export default function AdminMenuPage() {
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const query = statusFilter !== "all" ? `?status=${statusFilter}` : "";
  const { data, loading, refetch } = useApiQuery<MenuItem[]>(
    `/api/admin/menu${query}`,
    {
      initialData: [],
      errorMessage: "Failed to load menu items for moderation",
    }
  );
  const items = data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Menu Moderation &amp; Review
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Review submitted artisanal recipes, approve them for the public menu, or reject inappropriate submissions.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={refetch} disabled={loading} className="self-start sm:self-auto">
          <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="overflow-x-auto pb-1 max-w-full">
        <PillTabs
          tabs={MODERATION_TABS}
          value={statusFilter}
          onValueChange={(val) => setStatusFilter(val)}
          label="Filter moderation items by status"
          className="border border-border/60 bg-muted/50 p-1"
        />
      </div>

      {loading ? (
        <Loader text="Loading menu items for moderation..." />
      ) : (
        <ItemTable items={items} onRefresh={refetch} isAdmin={true} />
      )}
    </div>
  );
}
