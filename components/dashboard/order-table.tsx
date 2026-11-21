"use client";

import * as React from "react";
import Image from "next/image";
import { CheckCircle2, XCircle, Calendar, MapPin, Eye } from "lucide-react";
import { toast } from "sonner";
import { DataTable, type Column } from "@/components/reui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/common/confirm-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OrderTimeline } from "./order-timeline";
import { apiFetch } from "@/lib/api";
import type { Order } from "@/types";

interface OrderTableProps {
  orders: Order[];
  onRefresh: () => void;
  isVendor?: boolean;
}

export function OrderTable({
  orders,
  onRefresh,
  isVendor = false,
}: OrderTableProps) {
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [cancellingId, setCancellingId] = React.useState<string | null>(null);
  const [actionLoading, setActionLoading] = React.useState(false);

  const handleCancel = async () => {
    if (!cancellingId) return;
    try {
      setActionLoading(true);
      await apiFetch(`/api/orders/${cancellingId}/cancel`, {
        method: "PATCH",
      });
      toast.success("Order cancelled successfully");
      setCancellingId(null);
      onRefresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to cancel order";
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleVendorStatus = async (
    id: string,
    status: "accepted" | "rejected"
  ) => {
    try {
      setActionLoading(true);
      await apiFetch(`/api/vendor/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      toast.success(
        status === "accepted" ? "Order accepted!" : "Order rejected"
      );
      onRefresh();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to update order status";
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return <Badge variant="success">Accepted</Badge>;
      case "pending":
        return <Badge variant="warning">Pending Kitchen</Badge>;
      case "rejected":
        return <Badge variant="destructive">Declined</Badge>;
      case "cancelled":
        return <Badge variant="secondary">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const columns: Column<Order>[] = [
    {
      header: "Pizza Item",
      cell: (o: Order) => {
        const img =
          o.item?.images?.[0] ||
          "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400";
        return (
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-14 overflow-hidden rounded-lg bg-muted shrink-0 border border-border">
              <Image
                src={img}
                alt={o.item?.itemName ?? "Pizza"}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
            <div>
              <p className="font-bold text-foreground text-sm line-clamp-1">
                {o.item?.itemName ?? "Artisanal Pizza"}
              </p>
              <p className="text-xs text-muted-foreground">
                {isVendor
                  ? `Customer: ${o.customerName || "Customer"}`
                  : `Vendor: ${o.vendorName || "Kitchen"}`}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      header: "Delivery Date",
      cell: (o: Order) => {
        return (
          <div className="flex items-center gap-1.5 text-xs text-foreground">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <span className="font-medium">{o.deliveryDate}</span>
          </div>
        );
      },
    },
    {
      header: "Address",
      cell: (o: Order) => {
        return (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground max-w-[180px] truncate">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate">{o.deliveryAddress}</span>
          </div>
        );
      },
    },
    {
      header: "Status",
      cell: (o: Order) => {
        return getStatusBadge(o.status);
      },
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (o: Order) => {
        return (
          <div className="flex items-center justify-end gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
              onClick={() => setSelectedOrder(o)}
              title="View Timeline"
            >
              <Eye className="h-3.5 w-3.5 mr-1" />
              Timeline
            </Button>

            {!isVendor && o.status === "pending" && (
              <Button
                variant="destructive"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => setCancellingId(o.id)}
              >
                Cancel
              </Button>
            )}

            {isVendor && o.status === "pending" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10 border-emerald-600/30"
                  onClick={() => handleVendorStatus(o.id, "accepted")}
                  disabled={actionLoading}
                >
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                  Accept
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10 border-destructive/30"
                  onClick={() => handleVendorStatus(o.id, "rejected")}
                  disabled={actionLoading}
                >
                  <XCircle className="h-3.5 w-3.5 mr-1" />
                  Reject
                </Button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <DataTable<Order>
        columns={columns}
        data={orders}
        searchFilter={(order, term) =>
          Boolean(
            order.deliveryAddress?.toLowerCase().includes(term) ||
              order.item?.itemName?.toLowerCase().includes(term) ||
              order.customerName?.toLowerCase().includes(term) ||
              order.vendorName?.toLowerCase().includes(term) ||
              order.status?.toLowerCase().includes(term) ||
              order.deliveryDate?.toLowerCase().includes(term)
          )
        }
        searchPlaceholder={
          isVendor
            ? "Search orders by customer, pizza, address, date..."
            : "Search orders by pizza, kitchen, address, date..."
        }
        emptyTitle="No Orders Found"
        emptyDescription={
          isVendor
            ? "You currently have no customer orders."
            : "You have not placed any pizza orders yet."
        }
      />

      <ConfirmModal
        open={Boolean(cancellingId)}
        onOpenChange={(open) => {
          if (!open) setCancellingId(null);
        }}
        title="Cancel This Order?"
        description="Are you sure you want to cancel this pending pizza order? This action cannot be reversed."
        confirmText="Cancel Order"
        variant="destructive"
        loading={actionLoading}
        onConfirm={handleCancel}
      />

      <Dialog
        open={Boolean(selectedOrder)}
        onOpenChange={(open) => {
          if (!open) setSelectedOrder(null);
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Order Status Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && <OrderTimeline order={selectedOrder} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
