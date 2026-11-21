"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, User, Store } from "lucide-react";
import { toast } from "sonner";
import { profileSchema, type ProfileInput } from "@/lib/schemas";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { User as UserType } from "@/types";

interface ProfileFormProps {
  user: UserType;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name ?? "",
      image: user.image ?? "",
      businessName: user.businessName ?? "",
    },
  });

  const isVendor = user.role === "vendor";

  const onSubmit = async (values: ProfileInput) => {
    try {
      setLoading(true);
      await apiFetch("/api/users/me", {
        method: "PATCH",
        body: JSON.stringify(values),
      });

      toast.success("Profile updated successfully!");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update profile";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const roleBadgeLabel =
    user.role === "admin"
      ? "Master Administrator"
      : user.role === "vendor"
      ? "Artisanal Baker"
      : "Pizza Connoisseur";

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm flex flex-col sm:flex-row items-center gap-5">
        <div className="relative size-20 shrink-0 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center overflow-hidden text-2xl font-black text-primary">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.image} alt={user.name ?? "User"} className="size-full object-cover" />
          ) : (
            (user.name?.slice(0, 2) || "PH").toUpperCase()
          )}
        </div>
        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-bold text-foreground">{user.name || "Anonymous Chef"}</h2>
            <Badge variant="accent" className="font-semibold text-xs">
              {roleBadgeLabel}
            </Badge>
            {isVendor && user.subscriptionPlan === "premium" && (
              <Badge variant="success" className="font-semibold text-xs">
                Verified Kitchen
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{user.email}</p>
          {isVendor && user.businessName && (
            <p className="text-xs font-medium text-foreground">
              Kitchen: <span className="font-bold text-primary">{user.businessName}</span>
            </p>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {isVendor ? <Store className="h-5 w-5" /> : <User className="h-5 w-5" />}
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Profile Settings</h2>
            <p className="text-xs text-muted-foreground">
              Update your personal profile information and kitchen details.
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name / Owner Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                Account Email
              </label>
              <Input value={user.email} disabled className="opacity-70 bg-muted" />
              <p className="text-[11px] text-muted-foreground">
                Email address cannot be modified once registered.
              </p>
            </div>

            {isVendor && (
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pizzeria / Business Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Di Fara Brick Oven Pizzeria"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar Image URL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com/avatar.jpg"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-2">
              <Button type="submit" className="w-full h-11 font-bold" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving Profile...
                  </span>
                ) : (
                  "Save Profile Changes"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
