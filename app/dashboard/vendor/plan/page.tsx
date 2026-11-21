"use client";

import * as React from "react";
import { Check, X, Sparkles, ShieldCheck, Flame, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { UpgradeBtn } from "@/components/dashboard/upgrade-btn";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/common/loader";
import { GradientText } from "@/components/motion-brew/gradient-text";
import { AnnotationText } from "@/components/motion-brew/annotation-text";
import { apiFetch } from "@/lib/api";
import type { User } from "@/types";

export default function VendorPlanPage() {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadUser = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiFetch<{ success: boolean; data: User }>("/api/users/me");
      if (res.success && res.data) {
        setUser(res.data);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load subscription status";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadUser();
  }, [loadUser]);

  if (loading && !user) {
    return <Loader text="Loading your subscription status..." />;
  }

  if (error && !user) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-border/80 rounded-3xl bg-card max-w-xl">
        <AlertCircle className="h-10 w-10 text-destructive mb-3" />
        <h2 className="text-xl font-bold text-foreground mb-1">Failed to Load Subscription</h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-md">{error}</p>
        <Button onClick={loadUser} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  const isPremium = user?.subscriptionPlan === "premium";

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Vendor Tiers</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Subscription &amp; Growth Plans
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Select the right tier for your artisanal kitchen. Upgrade anytime to unlock{" "}
          <AnnotationText type="underline" color="rgba(217, 56, 30, 0.45)" strokeWidth={1.5}>
            unlimited menu expansion
          </AnnotationText>
          .
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
            Current Active Plan
          </span>
          <div className="flex items-center gap-3 mt-1">
            <h2 className="text-xl font-black text-foreground">
              {isPremium ? "Premium Artisan Tier" : "Free Starter Tier"}
            </h2>
            {isPremium ? (
              <Badge variant="accent" className="font-bold">Active Premium</Badge>
            ) : (
              <Badge variant="secondary">Free</Badge>
            )}
          </div>
          {isPremium && user?.subscriptionExpiresAt && (
            <p className="text-xs text-muted-foreground mt-1">
              Renews / expires on:{" "}
              <strong className="text-foreground">
                {new Date(user.subscriptionExpiresAt).toLocaleDateString()}
              </strong>
            </p>
          )}
        </div>

        {!isPremium && <UpgradeBtn />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <Card className="border-border shadow-xs h-full flex flex-col justify-between rounded-2xl bg-card">
          <div>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold">Free Starter</CardTitle>
                <Badge variant="outline">Included</Badge>
              </div>
              <div className="mt-4">
                <span className="text-4xl font-extrabold text-foreground">$0</span>
                <span className="text-xs text-muted-foreground"> / month</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Ideal for new independent pizzaiolos testing local demand.
              </p>
            </CardHeader>
            <CardContent className="space-y-3 pt-4 border-t border-border text-sm">
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Max 3 active menu items</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Standard public menu placement</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Customer order management dashboard</span>
              </div>
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <X className="h-4 w-4 text-muted-foreground/60 shrink-0" />
                <span>Homepage priority placement</span>
              </div>
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <X className="h-4 w-4 text-muted-foreground/60 shrink-0" />
                <span>Verified Kitchen badge</span>
              </div>
            </CardContent>
          </div>
          <CardFooter className="pt-4 border-t border-border text-xs text-muted-foreground">
            Current baseline tier
          </CardFooter>
        </Card>

        <Card className="border-primary/50 bg-primary/5 shadow-md relative overflow-hidden h-full flex flex-col justify-between rounded-2xl">
          <div>
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] uppercase font-bold tracking-wider py-1 px-3 rounded-bl-lg">
              Recommended
            </div>
            <CardHeader>
              <div className="flex justify-between items-center">
                <GradientText
                  as="h3"
                  text="Artisan Premium"
                  colors={["#d9381e", "#e67e22", "#d9381e"]}
                  className="text-xl font-bold"
                />
                <Badge variant="accent" className="gap-1">
                  <Flame className="h-3 w-3" />
                  Featured
                </Badge>
              </div>
              <div className="mt-4">
                <span className="text-4xl font-extrabold text-foreground">$29</span>
                <span className="text-xs text-muted-foreground"> / month</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                For established kitchens seeking maximum visibility and unlimited listings.
              </p>
            </CardHeader>
            <CardContent className="space-y-3 pt-4 border-t border-border text-sm">
              <div className="flex items-center gap-2.5 font-medium">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span><strong>Unlimited</strong> active menu items</span>
              </div>
              <div className="flex items-center gap-2.5 font-medium">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span><strong>Top-row priority</strong> in Featured section</span>
              </div>
              <div className="flex items-center gap-2.5 font-medium">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>Special <strong>Featured Kitchen</strong> badge on cards</span>
              </div>
              <div className="flex items-center gap-2.5 font-medium">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>Detailed customer analytics and chart reports</span>
              </div>
              <div className="flex items-center gap-2.5 font-medium">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span>Priority moderation queue</span>
              </div>
            </CardContent>
          </div>
          <CardFooter className="pt-4 border-t border-border">
            {isPremium ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
                <ShieldCheck className="h-4 w-4" />
                You are enjoying full Premium benefits
              </div>
            ) : (
              <UpgradeBtn className="w-full" />
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
