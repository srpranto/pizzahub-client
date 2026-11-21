"use client";

import * as React from "react";
import Link from "next/link";
import { RefreshCw, ShoppingBag } from "lucide-react";
import { OrderTable } from "@/components/dashboard/order-table";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/common/loader";
import { PillTabs } from "@/components/motion-brew/pill-tabs";
import { useApiQuery } from "@/lib/use-api-query";
import type { Order } from "@/types";

const CUSTOMER_ORDER_TABS = [
  { id: "all", label: "All Orders" },
  { id: "pending", label: "Pending" },
  { id: "accepted", label: "Preparing" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];

export default function CustomerOrdersPage() {
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const { data, loading, refetch } = useApiQuery<Order[]>("/api/orders/my", {
    initialData: [],
    errorMessage: "Failed to load orders",
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
            My Pizza Orders
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Track status progression, delivery schedules, or cancel pending requests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refetch} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button asChild size="sm">
            <Link href="/menu">
              <ShoppingBag className="h-4 w-4 mr-1.5" />
              Order More Pizza
            </Link>
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto pb-1 max-w-full">
        <PillTabs
          tabs={CUSTOMER_ORDER_TABS}
          value={statusFilter}
          onValueChange={(val) => setStatusFilter(val)}
          label="Filter orders by status"
          className="border border-border/60 bg-muted/50 p-1"
        />
      </div>

      {loading ? (
        <Loader text="Loading your orders..." />
      ) : (
        <OrderTable orders={filteredOrders} onRefresh={refetch} isVendor={false} />
      )}
    </div>
  );
}
