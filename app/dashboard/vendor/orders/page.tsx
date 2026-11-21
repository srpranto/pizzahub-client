"use client";

import * as React from "react";
import { RefreshCw } from "lucide-react";
import { OrderTable } from "@/components/dashboard/order-table";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/common/loader";
import { PillTabs } from "@/components/motion-brew/pill-tabs";
import { useApiQuery } from "@/lib/use-api-query";
import type { Order } from "@/types";

const ORDER_TABS = [
  { id: "all", label: "All Orders" },
  { id: "pending", label: "Pending" },
  { id: "accepted", label: "Preparing" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];

export default function VendorOrdersPage() {
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const { data, loading, refetch } = useApiQuery<Order[]>("/api/vendor/orders", {
    initialData: [],
    errorMessage: "Failed to load customer orders",
  });

  const filteredOrders = React.useMemo(() => {
    const orders = data ?? [];
    if (statusFilter === "all") return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [data, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Incoming Customer Orders
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Review delivery dates and addresses. Accept to schedule dough preparation, or reject if unavailable.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={refetch} disabled={loading} className="self-start sm:self-auto">
          <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
          Refresh Orders
        </Button>
      </div>

      <div className="overflow-x-auto pb-1 max-w-full">
        <PillTabs
          tabs={ORDER_TABS}
          value={statusFilter}
          onValueChange={(val) => setStatusFilter(val)}
          label="Filter orders by status"
          className="border border-border/60 bg-muted/50 p-1"
        />
      </div>

      {loading ? (
        <Loader text="Loading customer orders..." />
      ) : (
        <OrderTable orders={filteredOrders} onRefresh={refetch} isVendor={true} />
      )}
    </div>
  );
}
