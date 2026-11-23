"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Store, ArrowRight, LogOut, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface BecomeVendorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail?: string;
}

export function BecomeVendorModal({
  open,
  onOpenChange,
  userEmail,
}: BecomeVendorModalProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleSignOutAndRegister = async () => {
    try {
      setLoading(true);
      await authClient.signOut();
      toast.info("Signed out. Ready to register your restaurant kitchen!");
      onOpenChange(false);
      router.push("/sign-up?role=vendor");
      router.refresh();
    } catch {
      toast.error("Failed to sign out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-border/80 bg-card/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl">
        <DialogHeader className="space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-1">
            <Store className="h-7 w-7" />
          </div>
          <DialogTitle className="text-xl font-extrabold text-center text-foreground tracking-tight">
            Partner With PizzaHub
          </DialogTitle>
          <DialogDescription className="text-center text-xs sm:text-sm text-muted-foreground leading-relaxed">
            You are currently signed in as a Customer
            {userEmail ? (
              <span className="font-semibold text-foreground"> ({userEmail})</span>
            ) : (
              ""
            )}
            . PizzaHub maintains dedicated accounts for restaurant kitchens to protect order fulfillment and menu management.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-border/70 bg-muted/40 p-4 space-y-2 text-xs">
          <p className="font-bold text-foreground">What you get as an Artisan Vendor:</p>
          <ul className="space-y-1.5 text-muted-foreground">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>Publish and showcase your handcrafted pizzas &amp; sides</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>Manage incoming scheduled orders in a dedicated kitchen hub</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>Reach hungry pizza lovers in your local neighborhood</span>
            </li>
          </ul>
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row gap-2 pt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            Keep Browsing
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSignOutAndRegister}
            disabled={loading}
            className="w-full sm:w-auto font-bold gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
          >
            {loading ? (
              "Signing Out..."
            ) : (
              <>
                <LogOut className="h-3.5 w-3.5" />
                Sign Out &amp; Register Kitchen
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
