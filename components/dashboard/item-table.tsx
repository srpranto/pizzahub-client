"use client";

import * as React from "react";
import Image from "next/image";
import { Edit, Trash2, Power, CheckCircle2, XCircle } from "lucide-react";
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
import { ItemForm } from "./item-form";
import { apiFetch } from "@/lib/api";
import type { MenuItem } from "@/types";

interface ItemTableProps {
  items: MenuItem[];
  onRefresh: () => void;
  isAdmin?: boolean;
}

export function ItemTable({ items, onRefresh, isAdmin = false }: ItemTableProps) {
  const [editingItem, setEditingItem] = React.useState<MenuItem | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [actionLoading, setActionLoading] = React.useState(false);

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      setActionLoading(true);
      const endpoint = isAdmin
        ? `/api/admin/menu/${deletingId}`
        : `/api/vendor/menu/${deletingId}`;

      await apiFetch(endpoint, { method: "DELETE" });
      toast.success("Menu item removed successfully");
      setDeletingId(null);
      onRefresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete item";
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (item: MenuItem) => {
    try {
      setActionLoading(true);
      const nextStatus = item.status === "inactive" ? "approved" : "inactive";

      await apiFetch(`/api/vendor/menu/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });

      toast.success(
        nextStatus === "inactive"
          ? "Item deactivated from menu"
          : "Item reactivated on menu"
      );
      onRefresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to toggle status";
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAdminStatusChange = async (
    id: string,
    status: "approved" | "rejected" | "inactive"
  ) => {
    try {
      setActionLoading(true);
      await apiFetch(`/api/admin/menu/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      toast.success(`Item status updated to ${status}`);
      onRefresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update status";
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="success">Approved</Badge>;
      case "pending":
        return <Badge variant="warning">Pending Review</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const columns: Column<MenuItem>[] = [
    {
      header: "Pizza",
      cell: (item: MenuItem) => {
        const img = item.images?.[0] || "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400";
        return (
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-14 overflow-hidden rounded-lg bg-muted shrink-0 border border-border">
              <Image src={img} alt={item.itemName} fill className="object-cover" sizes="56px" />
            </div>
            <div>
              <p className="font-bold text-foreground text-sm line-clamp-1">{item.itemName}</p>
              <p className="text-xs text-muted-foreground">{item.location}</p>
            </div>
          </div>
        );
      },
    },
    {
      header: "Category",
      cell: (item: MenuItem) => {
        return <span className="text-xs font-medium">{item.category}</span>;
      },
    },
    {
      header: "Price",
      cell: (item: MenuItem) => {
        return <span className="font-bold text-sm text-primary tabular-nums">${item.price.toFixed(2)}</span>;
      },
    },
    {
      header: "Status",
      cell: (item: MenuItem) => {
        return getStatusBadge(item.status);
      },
    },
  ];

  if (isAdmin) {
    columns.push({
      header: "Vendor",
      cell: (item: MenuItem) => {
        return (
          <span className="text-xs text-muted-foreground">
            {item.vendorName || "Unknown"}
          </span>
        );
      },
    });

    columns.push({
      header: "Moderation",
      className: "text-right",
      cell: (item: MenuItem) => {
        return (
          <div className="flex items-center justify-end gap-1.5">
            {item.status !== "approved" && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10"
                onClick={() => handleAdminStatusChange(item.id, "approved")}
                title="Approve Item"
              >
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            )}
            {item.status !== "rejected" && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                onClick={() => handleAdminStatusChange(item.id, "rejected")}
                title="Reject Item"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={() => setDeletingId(item.id)}
              title="Delete Item"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    });
  } else {
    columns.push({
      header: "Actions",
      className: "text-right",
      cell: (item: MenuItem) => {
        return (
          <div className="flex items-center justify-end gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-muted"
              onClick={() => setEditingItem(item)}
              title="Edit Item"
            >
              <Edit className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-muted"
              onClick={() => handleToggleStatus(item)}
              title={item.status === "inactive" ? "Reactivate Item" : "Deactivate Item"}
            >
              <Power className={`h-4 w-4 ${item.status === "inactive" ? "text-amber-500" : "text-emerald-600"}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={() => setDeletingId(item.id)}
              title="Delete Item"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    });
  }

  return (
    <>
      <DataTable<MenuItem>
        columns={columns}
        data={items}
        searchFilter={(item, term) =>
          Boolean(
            item.itemName?.toLowerCase().includes(term) ||
              item.category?.toLowerCase().includes(term) ||
              item.location?.toLowerCase().includes(term) ||
              item.status?.toLowerCase().includes(term) ||
              item.vendorName?.toLowerCase().includes(term)
          )
        }
        searchPlaceholder="Search pizzas by name, category, kitchen, or city..."
        emptyTitle="No Menu Items Found"
        emptyDescription={isAdmin ? "No items matching criteria." : "You have not published any pizzas yet."}
      />

      <ConfirmModal
        open={Boolean(deletingId)}
        onOpenChange={(open) => {
          if (!open) setDeletingId(null);
        }}
        title="Delete Menu Item?"
        description="Are you sure you want to permanently delete this pizza? This action cannot be undone."
        confirmText="Delete Pizza"
        variant="destructive"
        loading={actionLoading}
        onConfirm={handleDelete}
      />

      <Dialog
        open={Boolean(editingItem)}
        onOpenChange={(open) => {
          if (!open) setEditingItem(null);
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <ItemForm
              initialData={editingItem}
              onSuccess={() => {
                setEditingItem(null);
                onRefresh();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
