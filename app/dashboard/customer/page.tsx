"use client";

import Link from "next/link";
import { ShoppingBag, Clock, CheckCircle2, Heart, ArrowRight, RefreshCw, AlertCircle } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatsChart } from "@/components/dashboard/stats-chart";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/common/loader";
import { AnnotationText } from "@/components/motion-brew/annotation-text";
import { Card } from "@/components/ui/card";
import { useApiQuery } from "@/lib/use-api-query";
import type { CustomerStats } from "@/types";

export default function CustomerOverviewPage() {
  const { data: stats, loading, error, refetch: loadStats } = useApiQuery<CustomerStats>(
    "/api/stats/customer",
    { errorMessage: "Failed to load customer stats" }
  );

  if (loading && !stats) {
    return <Loader text="Loading your customer overview..." />;
  }

  if (error && !stats) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-border/80 rounded-3xl bg-card">
        <AlertCircle className="h-10 w-10 text-destructive mb-3" />
        <h2 className="text-xl font-bold text-foreground mb-1">Failed to Load Dashboard</h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-md">{error}</p>
        <Button onClick={loadStats} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Customer Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Track your{" "}
            <AnnotationText type="underline" color="rgba(217, 56, 30, 0.45)" strokeWidth={1.5}>
              artisanal pizza orders
            </AnnotationText>
            , upcoming deliveries, and saved recipes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild size="sm">
            <Link href="/menu">
              <ShoppingBag className="h-4 w-4 mr-1.5" />
              Order Pizza
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/customer/favorites">
              <Heart className="h-4 w-4 mr-1.5 text-primary" />
              Favorites
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Pizzas Ordered"
          value={stats?.totalOrders ?? 0}
          icon={<ShoppingBag className="h-4 w-4" />}
          description="Lifetime orders placed"
        />
        <StatCard
          title="Pending Kitchen Confirmation"
          value={stats?.pendingOrders ?? 0}
          icon={<Clock className="h-4 w-4" />}
          description="Awaiting vendor response"
        />
        <StatCard
          title="Accepted & Scheduled"
          value={stats?.acceptedOrders ?? 0}
          icon={<CheckCircle2 className="h-4 w-4" />}
          description="Ready for stone bake"
        />
        <StatCard
          title="Cancelled Orders"
          value={stats?.cancelledOrders ?? 0}
          icon={<Clock className="h-4 w-4" />}
          description="Cancelled requests"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="h-full">
          <StatsChart
            title="My Order History Breakdown"
            description="Distribution of orders by status"
            data={stats?.chartData ?? []}
            barColor="#d9381e"
          />
        </div>

        <Card className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between h-full">
          <div>
            <h3 className="text-base font-bold text-foreground mb-1">
              Hungry for Tonight?
            </h3>
            <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
              Explore freshly approved recipes from master independent pizzaiolos in your community.
            </p>

            <div className="rounded-2xl border border-border bg-background p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-foreground">Browse Stone-Fired Pies</p>
                <p className="text-xs text-muted-foreground">Select date &amp; direct kitchen note</p>
              </div>
              <Button asChild size="sm">
                <Link href="/menu">
                  Browse
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="pt-6 border-t border-border mt-6">
            <Link
              href="/dashboard/customer/orders"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              View detailed order timelines and history →
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
