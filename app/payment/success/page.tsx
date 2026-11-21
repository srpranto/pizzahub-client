"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Sparkles, ArrowRight, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/common/loader";
import { apiFetch } from "@/lib/api";
import type { User } from "@/types";

export default function PaymentSuccessPage() {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await apiFetch<{ success: boolean; data: User }>("/api/users/me");
        if (res.success && res.data) {
          setUser(res.data);
          if (res.data.subscriptionPlan === "premium" || attempts >= 5) {
            setLoading(false);
            clearInterval(interval);
          }
        }
      } catch {
        if (attempts >= 5) {
          setLoading(false);
          clearInterval(interval);
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <Loader text="Verifying webhook confirmation from Stripe..." />
      </div>
    );
  }

  const isPremium = user?.subscriptionPlan === "premium";

  return (
    <div className="relative flex min-h-[70vh] items-center justify-center px-4 py-12 ambient-glow overflow-hidden">
      <div className="w-full max-w-lg rounded-3xl border border-border/80 bg-card/95 backdrop-blur-sm p-8 text-center shadow-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 mb-6">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-2">
          Payment Succeeded!
        </h1>

        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          {isPremium
            ? "Your subscription has been confirmed and upgraded to Premium Artisan Tier! You can now publish unlimited recipes."
            : "Your payment was processed. Your account status is updating shortly."}
        </p>

        {isPremium && (
          <div className="mb-8 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-left">
            <div className="flex items-center gap-2 font-bold text-foreground text-sm mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Premium Privileges Unlocked:</span>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-5">
              <li>Cap removed: Add unlimited stone-fired items</li>
              <li>Boosted to top row of Homepage Featured showcase</li>
              <li>Featured Kitchen gold badge on all your pizza cards</li>
            </ul>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/dashboard/vendor/add-item">
              <UtensilsCrossed className="mr-2 h-4 w-4" />
              Add 4th Menu Item
            </Link>
          </Button>
          <Button variant="outline" asChild size="lg" className="w-full sm:w-auto">
            <Link href="/dashboard/vendor">
              Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
