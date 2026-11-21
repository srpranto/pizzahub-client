"use client";

import Link from "next/link";
import { PlusCircle, RefreshCw } from "lucide-react";
import { ItemTable } from "@/components/dashboard/item-table";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/common/loader";
import { useApiQuery } from "@/lib/use-api-query";
import type { MenuItem } from "@/types";

export default function VendorMenuPage() {
  const { data, loading, refetch } = useApiQuery<MenuItem[]>("/api/vendor/menu", {
    initialData: [],
    errorMessage: "Failed to load kitchen menu items",
  });
  const items = data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            My Menu Items
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage your artisanal recipes, toggle availability, or submit new items for approval.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refetch} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button asChild size="sm">
            <Link href="/dashboard/vendor/add-item">
              <PlusCircle className="h-4 w-4 mr-1.5" />
              Add Menu Item
            </Link>
          </Button>
        </div>
      </div>

      {loading ? (
        <Loader text="Loading your kitchen items..." />
      ) : (
        <ItemTable items={items} onRefresh={refetch} />
      )}
    </div>
  );
}
