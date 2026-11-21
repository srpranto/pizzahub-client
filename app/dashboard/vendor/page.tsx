"use client";

import Link from "next/link";
import {
  UtensilsCrossed,
  PlusCircle,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatsChart } from "@/components/dashboard/stats-chart";
import { Loader } from "@/components/common/loader";
import { AnnotationText } from "@/components/motion-brew/annotation-text";
import { GradientText } from "@/components/motion-brew/gradient-text";
import { useApiQuery } from "@/lib/use-api-query";
import { clearTokenCache } from "@/lib/token";
import type { VendorStats } from "@/types";

export default function VendorOverviewPage() {
  const { data: stats, loading, error, refetch: loadStats } = useApiQuery<VendorStats>(
    "/api/stats/vendor",
    { errorMessage: "Failed to load kitchen stats" }
  );

  if (loading && !stats) {
    return <Loader text="Loading your kitchen overview..." />;
  }

  if (error && !stats) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-border/80 rounded-3xl bg-card">
        <AlertCircle className="h-10 w-10 text-destructive mb-3" />
        <h2 className="text-xl font-bold text-foreground mb-1">Failed to Load Kitchen Dashboard</h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-md">{error}</p>
        <Button
          onClick={() => {
            clearTokenCache();
            loadStats();
          }}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Retry Connection
        </Button>
      </div>
    );
  }

  const isPremium = stats?.subscriptionPlan === "premium";
  const activeItems = stats?.approvedItems ?? 0;
  const pendingOrders = stats?.pendingOrders ?? 0;
  const acceptedOrders = stats?.acceptedOrders ?? 0;
  const totalItems = stats?.totalItems ?? 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
            <UtensilsCrossed className="h-3.5 w-3.5" />
            <span>Kitchen Operations</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Vendor Kitchen Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Track your artisanal menu recipes, customer orders, and{" "}
            <AnnotationText type="underline" color="rgba(217, 56, 30, 0.45)" strokeWidth={1.5}>
              subscription plan status
            </AnnotationText>
            .
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button asChild size="sm">
            <Link href="/dashboard/vendor/add-item">
              <PlusCircle className="h-4 w-4 mr-1.5" />
              New Pizza Item
            </Link>
          </Button>
          {!isPremium && (
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/vendor/plan">
                <Sparkles className="h-4 w-4 mr-1.5 text-accent" />
                Upgrade Plan
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        <StatCard
          title="Total Menu Items"
          value={totalItems}
          icon={<UtensilsCrossed className="h-4 w-4" />}
          description="Pizzas created in catalog"
        />
        <StatCard
          title="Active Menu Items"
          value={activeItems}
          icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
          description={isPremium ? "Unlimited allowance active" : `${activeItems} of 3 free limit used`}
        />
        <StatCard
          title="Pending Customer Orders"
          value={pendingOrders}
          icon={<Clock className="h-4 w-4 text-amber-500" />}
          description="Requires accept or reject action"
        />
        <StatCard
          title="Accepted & Preparing"
          value={acceptedOrders}
          icon={<ShoppingBag className="h-4 w-4 text-primary" />}
          description="In oven scheduling / baking"
        />
      </div>

      {/* Subscription Tier Banner */}
      {isPremium ? (
        <Card className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="success" className="font-bold text-xs gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Artisan Premium Active
                </Badge>
                <span className="text-xs text-muted-foreground">Unlimited Catalog Listings</span>
              </div>
              <h2 className="text-lg font-bold text-foreground">
                Your kitchen enjoys top-row priority on PizzaHub
              </h2>
              <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
                You have unrestricted menu publishing and high-visibility placement in the Featured Artisanal showcase with the gold Verified Kitchen badge.
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="shrink-0 font-semibold">
              <Link href="/dashboard/vendor/plan">
                View Plan Benefits
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="rounded-2xl border border-primary/30 bg-primary/5 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="font-bold text-xs">
                  Free Starter Plan ({activeItems}/3 Active Pies)
                </Badge>
                {activeItems >= 3 && (
                  <Badge variant="warning" className="text-xs font-semibold">
                    Limit Reached
                  </Badge>
                )}
              </div>
              <GradientText
                as="h2"
                text="Want to publish more than 3 active menu items?"
                colors={["#d9381e", "#e67e22", "#d9381e"]}
                className="text-lg font-bold"
              />
              <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
                Free kitchens are capped at 3 active items. Upgrade to Artisan Premium to enjoy unlimited catalog listings and top-row placement!
              </p>
            </div>
            <Button asChild className="shrink-0 font-bold">
              <Link href="/dashboard/vendor/plan">
                Upgrade to Premium ($29/mo)
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </Button>
          </div>
        </Card>
      )}

      {/* Analytics Chart & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="h-full">
          <StatsChart
            title="Kitchen Operations Breakdown"
            description="Active pizzas, pending reviews, and customer orders"
            data={stats?.chartData ?? []}
            barColor="#d9381e"
          />
        </div>

        <Card className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between h-full">
          <div>
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-base font-bold text-foreground">
                Kitchen Quick Actions
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Common daily operations for your pizzeria
              </p>
            </CardHeader>
            <CardContent className="p-0 space-y-3">
              <Link
                href="/dashboard/vendor/orders"
                className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-background hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <ShoppingBag className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Customer Orders</p>
                    <p className="text-xs text-muted-foreground">
                      {pendingOrders} pending order{pendingOrders === 1 ? "" : "s"} awaiting response
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-primary">Review →</span>
              </Link>

              <Link
                href="/dashboard/vendor/menu"
                className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-background hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <UtensilsCrossed className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Manage Menu Items</p>
                    <p className="text-xs text-muted-foreground">
                      {totalItems} total recipe{totalItems === 1 ? "" : "s"} • {activeItems} live
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-primary">Manage →</span>
              </Link>

              <Link
                href="/dashboard/vendor/add-item"
                className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-background hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                    <PlusCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Add New Pizza</p>
                    <p className="text-xs text-muted-foreground">
                      Upload photo and submit recipe for approval
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-primary">Add →</span>
              </Link>
            </CardContent>
          </div>

          <div className="pt-4 border-t border-border mt-6 flex items-center justify-between text-xs text-muted-foreground">
            <span>Kitchen status: <strong>Online &amp; Taking Orders</strong></span>
            <Link href="/menu" className="font-semibold text-primary hover:underline">
              Preview public menu →
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
