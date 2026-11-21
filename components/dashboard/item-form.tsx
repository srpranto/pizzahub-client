"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pizza } from "lucide-react";
import { toast } from "sonner";
import { menuItemSchema, type MenuItemInput } from "@/lib/schemas";
import { apiFetch } from "@/lib/api";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileDrop } from "@/components/reui/file-drop";
import { CATEGORIES } from "@/lib/constants";
import type { MenuItem } from "@/types";

interface ItemFormProps {
  initialData?: MenuItem;
  onSuccess?: () => void;
}

export function ItemForm({ initialData, onSuccess }: ItemFormProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<MenuItemInput>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      itemName: initialData?.itemName ?? "",
      category: initialData?.category ?? "Classic Pizzas",
      description: initialData?.description ?? "",
      price: initialData?.price ?? 14.99,
      location: initialData?.location ?? "",
      images: initialData?.images ?? [],
    },
  });

  const onSubmit = async (values: MenuItemInput) => {
    try {
      setLoading(true);

      if (initialData?.id) {
        await apiFetch(`/api/vendor/menu/${initialData.id}`, {
          method: "PATCH",
          body: JSON.stringify(values),
        });
        toast.success("Menu item updated successfully!");
      } else {
        await apiFetch("/api/vendor/menu", {
          method: "POST",
          body: JSON.stringify(values),
        });
        toast.success("Menu item submitted for approval!");
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard/vendor/menu");
        router.refresh();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save menu item";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs w-full max-w-3xl">
      <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Pizza className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {initialData ? "Edit Menu Item" : "Create New Menu Item"}
            </h2>
            <p className="text-xs text-muted-foreground">
              New items are reviewed by administration before appearing on the public menu.
            </p>
          </div>
        </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="itemName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pizza / Item Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Truffle Mushroom & Ricotta"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={loading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price ($ USD)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="18.50"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kitchen Location / Neighborhood</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Brooklyn, New York"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description & Ingredients</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Detail your flour blend, sauce origin, cheeses, and stone oven bake technique..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pizza Photos (High Resolution)</FormLabel>
                <FormControl>
                  <FileDrop
                    value={field.value}
                    onChange={field.onChange}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </span>
              ) : initialData ? (
                "Save Changes"
              ) : (
                "Publish For Approval"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
