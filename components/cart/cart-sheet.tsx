"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  X,
  Trash2,
  Pizza,
  ShoppingBag,
  Calendar as CalendarIcon,
  MapPin,
  FileText,
  Loader2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RollingStepper } from "@/components/motion-brew/rolling-stepper";
import { DatePicker } from "@/components/reui/date-picker";

export function CartSheet() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const {
    items,
    itemCount,
    subtotal,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const [deliveryDate, setDeliveryDate] = React.useState<string>(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [deliveryAddress, setDeliveryAddress] = React.useState<string>("");
  const [generalMessage, setGeneralMessage] = React.useState<string>("");
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeCart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeCart]);

  // Lock body scroll when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const user = session?.user as { role?: string; name?: string; email?: string } | undefined;
  const isCustomer = user?.role === "customer";
  const isVendorOrAdmin = user && (user.role === "vendor" || user.role === "admin");
  const todayStr = new Date().toISOString().split("T")[0];

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      closeCart();
      router.push(`/sign-in?callbackUrl=/menu`);
      return;
    }

    if (!isCustomer) {
      toast.error("Only customer accounts can place orders.");
      return;
    }

    if (!deliveryDate || deliveryDate < todayStr) {
      toast.error("Please select today or a future delivery date.");
      return;
    }

    if (!deliveryAddress.trim() || deliveryAddress.trim().length < 5) {
      toast.error("Please enter a valid delivery address (minimum 5 characters).");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        items: items.map((i) => ({
          itemId: i.id,
          quantity: i.quantity,
          message: i.specialInstructions || generalMessage.trim() || undefined,
        })),
        deliveryDate,
        deliveryAddress: deliveryAddress.trim(),
        message: generalMessage.trim() || undefined,
      };

      await apiFetch("/api/orders", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      toast.success(
        `🎉 Order confirmed for ${itemCount} pizza(s)! Scheduled for ${deliveryDate}.`
      );
      clearCart();
      closeCart();
      router.push("/dashboard/customer/orders");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to place order";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-card border-l border-border shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-250 ease-out">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/90 backdrop-blur-xs">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
              <Pizza className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-foreground tracking-tight">
                  Your Pizza Box
                </h2>
                {itemCount > 0 && (
                  <Badge variant="accent" className="text-[10px] px-2 py-0.5">
                    {itemCount} {itemCount === 1 ? "pie" : "pies"}
                  </Badge>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground">
                Handcrafted stone-oven pies ready for scheduling
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={closeCart}
            className="rounded-full h-8 w-8 text-muted-foreground hover:text-foreground"
            aria-label="Close pizza box"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-muted/60 text-muted-foreground">
                <ShoppingBag className="h-8 w-8 text-primary/70" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-foreground text-base">Your Pizza Box is Empty</h3>
                <p className="text-xs text-muted-foreground max-w-xs">
                  Discover master-crafted wood-fired pizzas from our artisan ovens and add them to your box.
                </p>
              </div>
              <Button
                asChild
                size="sm"
                className="mt-2 rounded-full cursor-pointer"
              >
                <Link href="/menu" onClick={closeCart}>
                  Browse Artisanal Menu
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {items.map((cartItem) => (
                <div
                  key={cartItem.id}
                  className="rounded-xl border border-border/80 bg-background/70 p-3 shadow-xs flex gap-3 transition-colors hover:border-border"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={cartItem.image}
                      alt={cartItem.itemName}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-foreground truncate">
                          {cartItem.itemName}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeItem(cartItem.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1 cursor-pointer"
                          aria-label={`Remove ${cartItem.itemName}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-muted-foreground truncate">
                          {cartItem.location}
                        </span>
                        <span className="text-muted-foreground/30">•</span>
                        <span className="text-[10px] font-semibold text-primary">
                          ${cartItem.price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1.5 border-t border-border/50 mt-1">
                      <RollingStepper
                        value={cartItem.quantity}
                        min={1}
                        max={99}
                        onValueChange={(newVal) => updateQuantity(cartItem.id, newVal)}
                        label={`Quantity for ${cartItem.itemName}`}
                        className="scale-90 origin-left"
                      />

                      <span className="text-xs font-black text-foreground tabular-nums">
                        ${(cartItem.price * cartItem.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Checkout Footer */}
        {items.length > 0 && (
          <div className="border-t border-border bg-card/95 backdrop-blur-xs p-4 sm:p-5 space-y-3">
            {/* Price Breakdown */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({itemCount} {itemCount === 1 ? "pie" : "pies"})</span>
                <span className="font-semibold text-foreground tabular-nums">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Artisanal Hearth Delivery</span>
                <span className="font-semibold text-emerald-600">FREE</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-foreground pt-1.5 border-t border-border">
                <span>Order Total</span>
                <span className="text-primary tabular-nums">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Delivery Inputs */}
            <form onSubmit={handleCheckout} className="space-y-2.5">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3 text-primary" />
                  Scheduled Delivery Date
                </label>
                <DatePicker
                  value={deliveryDate}
                  min={todayStr}
                  onChange={(val) => setDeliveryDate(val)}
                  disabled={isSubmitting}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-primary" />
                  Delivery Address
                </label>
                <Input
                  type="text"
                  placeholder="Street address, building, apartment..."
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  required
                  minLength={5}
                  className="h-9 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <FileText className="h-3 w-3 text-primary" />
                  Kitchen Instructions (Optional)
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Extra crispy crust, buzzer code..."
                  value={generalMessage}
                  onChange={(e) => setGeneralMessage(e.target.value)}
                  className="h-9 text-xs rounded-xl"
                />
              </div>

              {/* Role Alerts */}
              {isVendorOrAdmin && (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-2.5 text-xs text-amber-500 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>
                    You are signed in as a <strong>{user?.role}</strong>. Only customer accounts can place orders.
                  </span>
                </div>
              )}

              {/* Submit CTA */}
              {!user ? (
                <Button
                  type="button"
                  onClick={() => {
                    closeCart();
                    router.push("/sign-in?callbackUrl=/menu");
                  }}
                  className="w-full h-11 rounded-xl font-bold"
                >
                  Sign In to Place Order
                </Button>
              ) : isVendorOrAdmin ? (
                <Button disabled className="w-full h-11 rounded-xl font-bold opacity-50">
                  Customer Account Required
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting || items.length === 0}
                  className="w-full h-11 rounded-xl font-bold shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Firing Up the Ovens...
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Place Order • ${subtotal.toFixed(2)}
                    </>
                  )}
                </Button>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
