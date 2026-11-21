"use client";

import Link from "next/link";
import { Users, UtensilsCrossed, ShoppingBag, CreditCard, ShieldCheck, RefreshCw, AlertCircle } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatsChart } from "@/components/dashboard/stats-chart";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/common/loader";
import { Card } from "@/components/ui/card";
import { GradientText } from "@/components/motion-brew/gradient-text";
import { AnnotationText } from "@/components/motion-brew/annotation-text";
import { useApiQuery } from "@/lib/use-api-query";
import type { AdminStats } from "@/types";

export default function AdminOverviewPage() {
  const { data: stats, loading, error, refetch: loadStats } = useApiQuery<AdminStats>(
    "/api/stats/admin",
    { errorMessage: "Failed to load platform stats" }
  );

  if (loading && !stats) {
    return <Loader text="Loading platform administration stats..." />;
  }

  if (error && !stats) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-border/80 rounded-3xl bg-card">
        <AlertCircle className="h-10 w-10 text-destructive mb-3" />
        <h2 className="text-xl font-bold text-foreground mb-1">Failed to Load Platform Metrics</h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-md">{error}</p>
        <Button onClick={loadStats} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Master Control</span>
          </div>
          <GradientText
            as="h1"
            text="Admin Platform Overview"
            colors={["#d9381e", "#e67e22", "#d9381e"]}
            className="text-2xl font-extrabold tracking-tight sm:text-3xl"
          />
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real-time platform metrics, user access,{" "}
            <AnnotationText type="underline" color="rgba(217, 56, 30, 0.45)" strokeWidth={1.5}>
              menu review queue
            </AnnotationText>
            , and revenue flow.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/admin/users">
              <Users className="h-4 w-4 mr-1.5" />
              Manage Users
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/dashboard/admin/menu">
              <UtensilsCrossed className="h-4 w-4 mr-1.5" />
              Review Items
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registered Users"
          value={stats?.totalUsers ?? 0}
          icon={<Users className="h-4 w-4" />}
          description={`${stats?.totalVendors ?? 0} Vendors • ${stats?.totalCustomers ?? 0} Customers`}
        />
        <StatCard
          title="Pending Menu Approvals"
          value={stats?.pendingItems ?? 0}
          icon={<UtensilsCrossed className="h-4 w-4" />}
          description={`${stats?.approvedItems ?? 0} approved pies live`}
        />
        <StatCard
          title="Customer Orders Placed"
          value={stats?.totalOrders ?? 0}
          icon={<ShoppingBag className="h-4 w-4" />}
          description="Total pizza orders platform-wide"
        />
        <StatCard
          title="Vendor Upgrade Transactions"
          value={stats?.totalTransactions ?? 0}
          icon={<CreditCard className="h-4 w-4" />}
          description="Stripe checkout subscriptions"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="h-full">
          <StatsChart
            title="Platform Distribution & Growth"
            description="Aggregated count across key entity collections"
            data={stats?.chartData ?? []}
            barColor="#d9381e"
          />
        </div>

        <Card className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between h-full">
          <div>
            <h3 className="text-base font-bold text-foreground mb-1">
              Admin Quick Actions
            </h3>
            <p className="text-xs text-muted-foreground mb-6">
              Critical administrative tasks and moderations.
            </p>

            <div className="space-y-3">
              <Link
                href="/dashboard/admin/menu"
                className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-background hover:bg-muted transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">Menu Moderation Queue</p>
                  <p className="text-xs text-muted-foreground">
                    {stats?.pendingItems ?? 0} items waiting for approval or rejection
                  </p>
                </div>
                <span className="text-xs font-bold text-primary">Review →</span>
              </Link>

              <Link
                href="/dashboard/admin/users"
                className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-background hover:bg-muted transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">Account Access Control</p>
                  <p className="text-xs text-muted-foreground">
                    Search and block compromised accounts
                  </p>
                </div>
                <span className="text-xs font-bold text-primary">Manage →</span>
              </Link>

              <Link
                href="/dashboard/admin/payments"
                className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-background hover:bg-muted transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">Transaction Audit Log</p>
                  <p className="text-xs text-muted-foreground">
                    Read-only records of all vendor Stripe subscriptions
                  </p>
                </div>
                <span className="text-xs font-bold text-primary">Audit →</span>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
