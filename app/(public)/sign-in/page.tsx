"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Pizza, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { signInSchema, type SignInInput } from "@/lib/schemas";
import { authClient } from "@/lib/auth-client";
import { clearTokenCache } from "@/lib/token";
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
import { GradientText } from "@/components/motion-brew/gradient-text";
import { AnnotationText } from "@/components/motion-brew/annotation-text";
import { ShimmerText } from "@/components/motion-brew/shimmer-text";
import type { User, UserRole } from "@/types";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const roleParam = searchParams.get("role");

  const { data: session, isPending } = authClient.useSession();

  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const [isRedirecting, setIsRedirecting] = React.useState(false);

  React.useEffect(() => {
    if (!isPending && session?.user) {
      const role = ((session.user as unknown as User)?.role as UserRole) || "customer";
      const target = resolveAuthRedirect(callbackUrl, role);
      setIsRedirecting(true);
      router.replace(target);
    }
  }, [session, isPending, callbackUrl, router]);

  const signUpHref = React.useMemo(() => {
    const params = new URLSearchParams();
    if (callbackUrl) params.set("callbackUrl", callbackUrl);
    if (roleParam) params.set("role", roleParam);
    const qs = params.toString();
    return qs ? `/sign-up?${qs}` : "/sign-up";
  }, [callbackUrl, roleParam]);

  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignInInput) => {
    try {
      setLoading(true);
      const res = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });

      if (res.error) {
        toast.error(res.error.message || "Failed to sign in. Please verify your credentials.");
        setLoading(false);
        return;
      }

      clearTokenCache();
      toast.success("Welcome back!");

      const role = ((res.data?.user as unknown as User)?.role as UserRole) || "customer";
      const target = resolveAuthRedirect(callbackUrl, role);
      setIsRedirecting(true);
      React.startTransition(() => {
        router.push(target);
        router.refresh();
      });
    } catch {
      toast.error("An unexpected error occurred during sign in");
      setLoading(false);
      setIsRedirecting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setIsRedirecting(true);
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
      setIsRedirecting(false);
    }
  };

  const isTargetingPizza = Boolean(callbackUrl && callbackUrl.startsWith("/menu/"));

  return (
    <div className="relative flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 ambient-glow overflow-hidden">
      <div className="w-full max-w-md">
        <Card className="relative overflow-hidden w-full shadow-xl border-border/80 bg-card/95 backdrop-blur-sm rounded-3xl">
          {/* Artisanal Loading & Verification Overlay */}
          {isRedirecting && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-card/95 backdrop-blur-md p-6 text-center animate-in fade-in duration-300">
              <div className="relative mb-5 flex h-20 w-20 items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-75" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-orange-500 to-amber-600 text-white shadow-lg shadow-primary/25">
                  <Pizza className="h-8 w-8 animate-spin [animation-duration:3s]" />
                </div>
              </div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                Signing You In...
              </h3>
              <p className="mt-2 text-xs text-muted-foreground max-w-xs leading-relaxed">
                {isTargetingPizza
                  ? "Taking you straight back to your chosen pizza..."
                  : "Preparing your table & heading to PizzaHub..."}
              </p>
              <div className="mt-6 w-48 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary/50 via-primary to-orange-500 rounded-full animate-pulse w-full" />
              </div>
            </div>
          )}

          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xs">
              <Pizza className="h-7 w-7" />
            </div>
            <GradientText
              as="h2"
              text="Sign In to PizzaHub"
              colors={["#d9381e", "#e67e22", "#d9381e"]}
              className="text-2xl font-bold"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Handcrafted sourdough &amp; authentic{" "}
              <AnnotationText type="underline" color="rgba(217, 56, 30, 0.45)" strokeWidth={1.5}>
                stone-fired pies
              </AnnotationText>
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {searchParams.get("error") === "blocked" && (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs font-semibold text-destructive flex items-center gap-2.5 animate-in fade-in duration-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <ShimmerText
                  text="Your account has been suspended by administration. Please contact support."
                  className="text-xs font-semibold text-destructive"
                />
              </div>
            )}
          <Button
            type="button"
            variant="outline"
            className="w-full h-11 relative rounded-xl border-border/80 bg-background hover:bg-muted/60 transition-all active:scale-[0.99] font-medium text-sm shadow-2xs"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading || isRedirecting}
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
                <span>Continue with Google</span>
              </span>
            )}
          </Button>

          <div className="relative flex items-center justify-center my-1 py-1">
            <div className="grow border-t border-border/80" />
            <span className="mx-3.5 shrink-0 rounded-full border border-border/80 bg-card px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground shadow-2xs">
              Or email
            </span>
            <div className="grow border-t border-border/80" />
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        disabled={loading || isRedirecting}
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
                          placeholder="••••••••"
                          autoComplete="current-password"
                          disabled={loading || isRedirecting}
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

              <Button
                type="submit"
                className="w-full h-11"
                disabled={loading || googleLoading || isRedirecting}
              >
                {loading || isRedirecting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isRedirecting ? "Redirecting..." : "Verifying Credentials..."}
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center border-t py-4">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href={signUpHref}
              className="font-semibold text-primary hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
      </div>
    </div>
  );
}
