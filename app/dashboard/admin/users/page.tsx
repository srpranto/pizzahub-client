"use client";

import * as React from "react";
import { RefreshCw } from "lucide-react";
import { UserTable } from "@/components/dashboard/user-table";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/common/loader";
import { PillTabs } from "@/components/motion-brew/pill-tabs";
import { AnnotationText } from "@/components/motion-brew/annotation-text";
import { useApiQuery } from "@/lib/use-api-query";
import type { User } from "@/types";

const ROLE_TABS = [
  { id: "all", label: "All Accounts" },
  { id: "customer", label: "Customers" },
  { id: "vendor", label: "Vendors" },
  { id: "admin", label: "Admins" },
];

export default function AdminUsersPage() {
  const [roleFilter, setRoleFilter] = React.useState<string>("all");
  const query = roleFilter !== "all" ? `?role=${roleFilter}` : "";
  const { data, loading, refetch } = useApiQuery<User[]>(`/api/admin/users${query}`, {
    initialData: [],
    errorMessage: "Failed to load users",
  });
  const users = data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            User Accounts &amp; Security
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Search registered users, filter by account type, and enforce{" "}
            <AnnotationText type="underline" color="rgba(217, 56, 30, 0.45)" strokeWidth={1.5}>
              account suspension blocks
            </AnnotationText>
            .
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={refetch} disabled={loading} className="self-start sm:self-auto">
          <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="overflow-x-auto pb-1 max-w-full">
        <PillTabs
          tabs={ROLE_TABS}
          value={roleFilter}
          onValueChange={(val) => setRoleFilter(val)}
          label="Filter users by role"
          className="border border-border/60 bg-muted/50 p-1"
        />
      </div>

      {loading ? (
        <Loader text="Loading user accounts..." />
      ) : (
        <UserTable users={users} onRefresh={refetch} />
      )}
    </div>
  );
}
