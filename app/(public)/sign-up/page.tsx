"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Pizza, User, Store, Check } from "lucide-react";
import { toast } from "sonner";
import { signUpSchema, type SignUpInput } from "@/lib/schemas";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { resolveAuthRedirect } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { GradientText } from "@/components/motion-brew/gradient-text";
import { AnnotationText } from "@/components/motion-brew/annotation-text";
import type { UserRole } from "@/types";

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const initialRole = searchParams.get("role") === "vendor" ? "vendor" : "customer";

  const { data: session, isPending } = authClient.useSession();

  React.useEffect(() => {
    if (!isPending && session?.user) {
      const role = ((session.user as { role?: UserRole })?.role) || "customer";
      const target = resolveAuthRedirect(callbackUrl, role);
      router.replace(target);
    }
  }, [session, isPending, callbackUrl, router]);

  const signInHref = React.useMemo(() => {
    const params = new URLSearchParams();
    if (callbackUrl) params.set("callbackUrl", callbackUrl);
    const qs = params.toString();
    return qs ? `/sign-in?${qs}` : "/sign-in";
  }, [callbackUrl]);

  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: initialRole,
      image: "",
    },
  });

  const selectedRole = useWatch({ control: form.control, name: "role" });

  const onSubmit = async (values: SignUpInput) => {
    try {
      setLoading(true);
      const res = await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
        image: values.image || undefined,
        role: values.role,
      });

      if (res.error) {
        toast.error(res.error.message || "Failed to create account");
        return;
      }

      toast.success("Account created successfully!");
      const target = resolveAuthRedirect(callbackUrl, values.role);
      router.push(target);
      router.refresh();
    } catch {
      toast.error("An unexpected error occurred during sign up");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setGoogleLoading(true);
      document.cookie = `pizzahub_oauth_role=${selectedRole}; path=/; max-age=600; SameSite=Lax`;
      const targetCallback = callbackUrl
        ? `/auth/oauth-callback?callbackUrl=${encodeURIComponent(callbackUrl)}`
        : "/auth/oauth-callback?callbackUrl=%2F";
      await authClient.signIn.social({
        provider: "google",
        callbackURL: targetCallback,
      });
    } catch {
      toast.error("Failed to initialize Google authentication");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 ambient-glow overflow-hidden">
      <div className="w-full max-w-lg">
        <Card className="w-full shadow-xl border-border/80 bg-card/95 backdrop-blur-sm rounded-3xl">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xs">
              <Pizza className="h-7 w-7" />
            </div>
            <GradientText
              as="h2"
              text="Create PizzaHub Account"
              colors={["#d9381e", "#e67e22", "#d9381e"]}
              className="text-2xl font-bold"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Join the community as a Pizza Connoisseur or{" "}
              <AnnotationText type="underline" color="rgba(217, 56, 30, 0.45)" strokeWidth={1.5}>
                Independent Kitchen
              </AnnotationText>
            </p>
          </CardHeader>
        <CardContent className="space-y-5">
          <Button
            type="button"
            variant="outline"
            className="w-full h-11 relative rounded-xl border-border/80 bg-background hover:bg-muted/60 transition-all active:scale-[0.99] font-medium text-sm shadow-2xs"
            onClick={handleGoogleSignUp}
            disabled={googleLoading || loading}
          >
            {googleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span className="flex items-center justify-center gap-2.5">
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign up with Google</span>
              </span>
            )}
          </Button>

          <div className="relative flex items-center justify-center my-1 py-1">
            <div className="grow border-t border-border/80" />
            <span className="mx-3.5 shrink-0 rounded-full border border-border/80 bg-card px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground shadow-2xs">
              Or register with email
            </span>
            <div className="grow border-t border-border/80" />
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Select Account Type</FormLabel>
                    <div className="grid grid-cols-2 gap-3.5 items-stretch">
                      <button
                        type="button"
                        onClick={() => field.onChange("customer")}
                        className={cn(
                          "group relative flex flex-col items-start p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer overflow-hidden",
                          selectedRole === "customer"
                            ? "border-primary/60 bg-linear-to-b from-primary/10 via-primary/5 to-transparent shadow-xs ring-1 ring-primary/30"
                            : "border-border/80 bg-muted/20 hover:bg-muted/40 hover:border-border text-muted-foreground"
                        )}
                      >
                        <div className="flex items-center justify-between w-full mb-3">
                          <div
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-200",
                              selectedRole === "customer"
                                ? "bg-primary text-primary-foreground shadow-xs"
                                : "bg-muted text-muted-foreground group-hover:text-foreground"
                            )}
                          >
                            <User className="h-5 w-5" />
                          </div>
                          <div
                            className={cn(
                              "flex h-5 w-5 items-center justify-center rounded-full border transition-all duration-200",
                              selectedRole === "customer"
                                ? "border-primary bg-primary text-primary-foreground scale-100"
                                : "border-border/80 bg-background/50 opacity-40 scale-90"
                            )}
                          >
                            {selectedRole === "customer" && <Check className="h-3 w-3 stroke-[3]" />}
                          </div>
                        </div>
                        <div className="space-y-0.5">
                          <p
                            className={cn(
                              "text-sm font-bold tracking-tight transition-colors",
                              selectedRole === "customer" ? "text-foreground" : "text-foreground/80"
                            )}
                          >
                            Customer
                          </p>
                          <p className="text-[11px] text-muted-foreground leading-tight">
                            Order handcrafted pizzas &amp; track deliveries
                          </p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => field.onChange("vendor")}
                        className={cn(
                          "group relative flex flex-col items-start p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer overflow-hidden",
                          selectedRole === "vendor"
                            ? "border-primary/60 bg-linear-to-b from-primary/10 via-primary/5 to-transparent shadow-xs ring-1 ring-primary/30"
                            : "border-border/80 bg-muted/20 hover:bg-muted/40 hover:border-border text-muted-foreground"
                        )}
                      >
                        <div className="flex items-center justify-between w-full mb-3">
                          <div
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-200",
                              selectedRole === "vendor"
                                ? "bg-primary text-primary-foreground shadow-xs"
                                : "bg-muted text-muted-foreground group-hover:text-foreground"
                            )}
                          >
                            <Store className="h-5 w-5" />
                          </div>
                          <div
                            className={cn(
                              "flex h-5 w-5 items-center justify-center rounded-full border transition-all duration-200",
                              selectedRole === "vendor"
                                ? "border-primary bg-primary text-primary-foreground scale-100"
                                : "border-border/80 bg-background/50 opacity-40 scale-90"
                            )}
                          >
                            {selectedRole === "vendor" && <Check className="h-3 w-3 stroke-[3]" />}
                          </div>
                        </div>
                        <div className="space-y-0.5">
                          <p
                            className={cn(
                              "text-sm font-bold tracking-tight transition-colors",
                              selectedRole === "vendor" ? "text-foreground" : "text-foreground/80"
                            )}
                          >
                            Vendor
                          </p>
                          <p className="text-[11px] text-muted-foreground leading-tight">
                            Manage kitchen menu &amp; fulfill orders
                          </p>
                        </div>
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name / Owner Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        autoComplete="name"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Min 6 chars, 1 uppercase, 1 lowercase"
                          autoComplete="new-password"
                          disabled={loading}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar Image URL (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://example.com/photo.jpg"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-11"
                disabled={loading || googleLoading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating Account...
                  </span>
                ) : (
                  `Sign Up as ${selectedRole === "vendor" ? "Vendor" : "Customer"}`
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center border-t py-4">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href={signInHref}
              className="font-semibold text-primary hover:underline"
            >
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
      </div>
    </div>
  );
}
