"use client";

import * as React from "react";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

interface UpgradeBtnProps {
  className?: string;
  size?: "default" | "sm" | "lg";
  variant?: "default" | "accent";
}

export function UpgradeBtn({
  className,
  size = "lg",
  variant = "accent",
}: UpgradeBtnProps) {
  const [loading, setLoading] = React.useState(false);

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      const res = await apiFetch<{
        success: boolean;
        data?: { url: string | null; sessionId: string };
      }>("/api/stripe/checkout", {
        method: "POST",
      });

      if (res.success && res.data?.url) {
        window.location.href = res.data.url;
      } else {
        toast.error("Failed to generate Stripe checkout session");
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to initiate upgrade";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleUpgrade}
      disabled={loading}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Connecting to Stripe...
        </span>
      ) : (
        <span className="flex items-center gap-2 font-bold">
          <Sparkles className="h-4 w-4" />
          Upgrade to Premium (<span className="tabular-nums">$29</span>/mo)
        </span>
      )}
    </Button>
  );
}
