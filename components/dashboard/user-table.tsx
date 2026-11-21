"use client";

import * as React from "react";
import { ShieldAlert, ShieldCheck, UserCheck, UserX } from "lucide-react";
import { toast } from "sonner";
import { DataTable, type Column } from "@/components/reui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/common/confirm-modal";
import { apiFetch } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import type { User } from "@/types";

interface UserTableProps {
  users: User[];
  onRefresh: () => void;
}

export function UserTable({ users, onRefresh }: UserTableProps) {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const [togglingUser, setTogglingUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleToggleBlock = async () => {
    if (!togglingUser) return;
    try {
      setLoading(true);
      const nextStatus = !togglingUser.isBlocked;
      await apiFetch(`/api/admin/users/${togglingUser.id}/block`, {
        method: "PATCH",
        body: JSON.stringify({ isBlocked: nextStatus }),
      });
      toast.success(
        `User ${nextStatus ? "blocked" : "unblocked"} successfully`
      );
      setTogglingUser(null);
      onRefresh();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to update block state";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const columns: Column<User>[] = [
    {
      header: "User",
      cell: (u: User) => {
        return (
          <div>
            <p className="font-bold text-foreground text-sm">{u.name}</p>
            <p className="text-xs text-muted-foreground">{u.email}</p>
            {u.businessName && (
              <p className="text-[11px] text-primary font-medium">
                {u.businessName}
              </p>
            )}
          </div>
        );
      },
    },
    {
      header: "Role",
      cell: (u: User) => {
        return (
          <Badge
            variant={
              u.role === "admin"
                ? "accent"
                : u.role === "vendor"
                ? "default"
                : "secondary"
            }
            className="capitalize text-xs"
          >
            {u.role}
          </Badge>
        );
      },
    },
    {
      header: "Plan",
      cell: (u: User) => {
        return (
          <span className="text-xs font-semibold capitalize">
            {u.subscriptionPlan}
          </span>
        );
      },
    },
    {
      header: "Account State",
      cell: (u: User) => {
        return u.isBlocked ? (
          <Badge variant="destructive" className="gap-1 text-xs">
            <ShieldAlert className="h-3 w-3" />
            Blocked
          </Badge>
        ) : (
          <Badge variant="success" className="gap-1 text-xs">
            <ShieldCheck className="h-3 w-3" />
            Active
          </Badge>
        );
      },
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (u: User) => {
        const isSelf = u.id === currentUserId;

        return (
          <div className="flex justify-end">
            <Button
              variant={u.isBlocked ? "outline" : "destructive"}
              size="sm"
              className="h-8 text-xs gap-1"
              disabled={isSelf}
              onClick={() => setTogglingUser(u)}
              title={isSelf ? "You cannot block yourself" : ""}
            >
              {u.isBlocked ? (
                <>
                  <UserCheck className="h-3.5 w-3.5" />
                  Unblock
                </>
              ) : (
                <>
                  <UserX className="h-3.5 w-3.5" />
                  Block
                </>
              )}
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <DataTable<User>
        columns={columns}
        data={users}
        searchFilter={(user, term) =>
          Boolean(
            user.name?.toLowerCase().includes(term) ||
              user.email?.toLowerCase().includes(term) ||
              user.businessName?.toLowerCase().includes(term) ||
              user.role?.toLowerCase().includes(term)
          )
        }
        searchPlaceholder="Search users by name, email, restaurant, or role..."
        emptyTitle="No Users Found"
        emptyDescription="There are no user accounts matching your search."
      />

      <ConfirmModal
        open={Boolean(togglingUser)}
        onOpenChange={(open) => {
          if (!open) setTogglingUser(null);
        }}
        title={togglingUser?.isBlocked ? "Unblock User?" : "Block User?"}
        description={
          togglingUser?.isBlocked
            ? `Restore platform access for ${togglingUser?.email}? They will be able to log in and interact with PizzaHub again.`
            : `Are you sure you want to suspend access for ${togglingUser?.email}? They will receive a 403 Forbidden error immediately.`
        }
        confirmText={togglingUser?.isBlocked ? "Unblock Account" : "Block Account"}
        variant={togglingUser?.isBlocked ? "default" : "destructive"}
        loading={loading}
        onConfirm={handleToggleBlock}
      />
    </>
  );
}
