"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShoppingBag, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { orderSchema, type OrderInput } from "@/lib/schemas";
import { apiFetch } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DatePicker } from "@/components/reui/date-picker";
import { HoldToConfirm } from "@/components/motion-brew/hold-to-confirm";
import type { MenuItem } from "@/types";

interface OrderFormProps {
  item: MenuItem;
}

export function OrderForm({ item }: OrderFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { addItem } = useCart();
  const [loading, setLoading] = React.useState(false);

  const today = new Date().toISOString().split("T")[0];

  const form = useForm<OrderInput>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      deliveryDate: today,
      deliveryAddress: "",
      message: "",
    },
  });

  const user = session?.user;
  const isOwner = Boolean(user && user.id === item.vendorId);

  const onSubmit = async (values: OrderInput) => {
    if (!session) {
      toast.error("Please sign in to place an order");
      router.push(`/sign-in?callbackUrl=${encodeURIComponent(`/menu/${item.id}`)}`);
      return;
    }

    if (isOwner) {
      toast.error("Vendors cannot place orders for their own items");
      return;
    }

    try {
      setLoading(true);
      const res = await apiFetch<{
        success: boolean;
        message?: string;
        error?: string;
        data?: { id: string };
      }>("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          itemId: item.id,
          deliveryDate: values.deliveryDate,
          deliveryAddress: values.deliveryAddress,
          message: values.message,
        }),
      });

      if (res.success) {
        toast.success("Order placed successfully! The vendor will review it.");
        router.push("/dashboard/customer/orders");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to place order";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-md before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-linear-to-r before:from-primary before:via-accent before:to-primary">
      <div className="flex items-center gap-2 border-b border-border pb-4 mb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ShoppingBag className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Order This Pizza</h3>
          <p className="text-xs text-muted-foreground">
            Direct oven scheduling • Pay on delivery or direct invoicing
          </p>
        </div>
      </div>

      {Boolean(session) && isOwner && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-700 dark:text-amber-300">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <p>
            You are the vendor for this pizza. Vendors cannot place orders for their own items.
          </p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="deliveryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Scheduled Delivery Date</FormLabel>
                <FormControl>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    disabled={loading || Boolean(isOwner)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deliveryAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Delivery Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Street, Building, Apartment, City"
                    disabled={loading || Boolean(isOwner)}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Instructions (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Extra crispy crust, doorbell code #1234"
                    disabled={loading || Boolean(isOwner)}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-2">
            <div className="flex items-center justify-between text-sm py-2 mb-2 border-t border-border">
              <span className="text-muted-foreground">Order Total:</span>
              <span className="text-xl font-extrabold text-foreground tabular-nums">
                ${item.price.toFixed(2)}
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="lg"
                disabled={loading || Boolean(isOwner)}
                onClick={() => {
                  const values = form.getValues();
                  addItem(item, 1, values.message);
                  toast.success(`🍕 Added "${item.itemName}" to your pizza box!`);
                }}
                className="w-full h-11 text-sm font-bold border-primary/40 hover:bg-primary/10 hover:text-primary active:scale-[0.98]"
              >
                <ShoppingBag className="mr-2 h-4 w-4 text-primary" />
                Add to Pizza Box (Cart)
              </Button>

              <HoldToConfirm
                icon={<ShoppingBag className="h-4 w-4" />}
                confirmedLabel="Order Placed!"
                duration={1100}
                beforeStart={() => {
                  if (!session) {
                    toast.error("Please sign in to place an order");
                    router.push(`/sign-in?callbackUrl=${encodeURIComponent(`/menu/${item.id}`)}`);
                    return false;
                  }
                  if (isOwner) {
                    toast.error("Vendors cannot place orders for their own items");
                    return false;
                  }
                  const values = form.getValues();
                  if (!values.deliveryAddress || values.deliveryAddress.trim().length < 5) {
                    form.setError("deliveryAddress", {
                      type: "manual",
                      message: "Please enter a valid delivery address (min 5 characters)",
                    });
                    toast.error("Please enter a delivery address before ordering");
                    return false;
                  }
                  return true;
                }}
                onConfirm={() => {
                  form.handleSubmit(onSubmit)();
                }}
                disabled={loading || Boolean(isOwner)}
                className="w-full h-12 text-sm font-bold bg-primary text-primary-foreground rounded-xl shadow-md hover:bg-primary/90 transition-all cursor-pointer"
                fillClassName="bg-emerald-600"
              >
                Hold to Place Order • ${item.price.toFixed(2)}
              </HoldToConfirm>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
