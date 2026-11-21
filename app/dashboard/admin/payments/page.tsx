"use client";

import * as React from "react";
import { RefreshCw, CheckCircle2 } from "lucide-react";
import { DataTable, type Column } from "@/components/reui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/common/loader";
import { PillTabs } from "@/components/motion-brew/pill-tabs";
import { AnnotationText } from "@/components/motion-brew/annotation-text";
import { useApiQuery } from "@/lib/use-api-query";
import type { Transaction } from "@/types";

const PLAN_TABS = [
  { id: "all", label: "All Transactions" },
  { id: "premium", label: "Artisan Premium ($29)" },
];

export default function AdminPaymentsPage() {
  const [planFilter, setPlanFilter] = React.useState<string>("all");
  const { data, loading, refetch } = useApiQuery<Transaction[]>(
    "/api/admin/transactions",
    {
      initialData: [],
      errorMessage: "Failed to load transactions ledger",
    }
  );

  const columns: Column<Transaction>[] = [
    {
      header: "Date",
      cell: (tx: Transaction) => {
        return (
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {new Date(tx.createdAt).toLocaleDateString([], {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        );
      },
    },
    {
      header: "Vendor Kitchen",
      cell: (tx: Transaction) => {
        return (
          <div>
            <p className="font-bold text-foreground text-sm">
              {tx.vendorName || "Artisan Kitchen"}
            </p>
            <p className="text-xs text-muted-foreground">{tx.vendorEmail}</p>
          </div>
        );
      },
    },
    {
      header: "Plan",
      cell: (tx: Transaction) => {
        return (
          <Badge variant="accent" className="capitalize text-xs font-semibold">
            {tx.plan}
          </Badge>
        );
      },
    },
    {
      header: "Amount",
      cell: (tx: Transaction) => {
        return (
          <span className="font-extrabold text-foreground text-sm">
            ${tx.amount.toFixed(2)}{" "}
            <span className="text-[10px] text-muted-foreground uppercase">
              {tx.currency}
            </span>
          </span>
        );
      },
    },
    {
      header: "Stripe Session",
      cell: (tx: Transaction) => {
        return (
          <span className="text-xs font-mono text-muted-foreground truncate max-w-[140px] block">
            {tx.stripeSessionId}
          </span>
        );
      },
    },
    {
      header: "Status",
      className: "text-right",
      cell: () => {
        return (
          <div className="flex justify-end">
            <Badge variant="success" className="gap-1 text-xs">
              <CheckCircle2 className="h-3 w-3" />
              Succeeded
            </Badge>
          </div>
        );
      },
    },
  ];

  const filteredTransactions = React.useMemo(() => {
    const list = data ?? [];
    if (planFilter === "all") return list;
    return list.filter((t) => t.plan === planFilter);
  }, [data, planFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Stripe Subscription Transactions
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Read-only ledger of verified vendor subscription payments processed via{" "}
            <AnnotationText type="underline" color="rgba(217, 56, 30, 0.45)" strokeWidth={1.5}>
              Stripe webhooks
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
          tabs={PLAN_TABS}
          value={planFilter}
          onValueChange={(val) => setPlanFilter(val)}
          label="Filter transactions by plan"
          className="border border-border/60 bg-muted/50 p-1"
        />
      </div>

      {loading ? (
        <Loader text="Loading transactions ledger..." />
      ) : (
        <DataTable<Transaction>
          columns={columns}
          data={filteredTransactions}
          searchFilter={(tx, term) =>
            Boolean(
              tx.vendorEmail?.toLowerCase().includes(term) ||
                tx.vendorName?.toLowerCase().includes(term) ||
                tx.stripeSessionId?.toLowerCase().includes(term) ||
                tx.plan?.toLowerCase().includes(term)
            )
          }
          searchPlaceholder="Search transactions by email, kitchen, session ID..."
          emptyTitle="No Transactions Found"
          emptyDescription="No vendor upgrade transactions recorded yet."
        />
      )}
    </div>
  );
}
