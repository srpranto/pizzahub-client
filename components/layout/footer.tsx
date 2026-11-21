"use client";

import * as React from "react";
import Link from "next/link";
import {
  Pizza,
  Flame,
  Clock,
  ShieldCheck,
  Lock,
  Send,
  Loader2,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

function XLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YouTubeLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function GitHubLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export function Footer() {
  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setSubscribed(true);
        setEmail("");
        toast.success(data.message || "Welcome to the Artisanal Sourdough Club!");
      } else {
        toast.error(data.error || "Failed to subscribe. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer
      suppressHydrationWarning
      className="border-t border-border/80 bg-linear-to-b from-background via-muted/30 to-muted/60 text-foreground pt-16 pb-12 transition-colors"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Newsletter Club Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card p-8 sm:p-12 mb-16 shadow-lg shadow-black/5">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold tracking-wide uppercase">
                <Flame className="h-3.5 w-3.5 animate-pulse text-primary" />
                The Artisanal Sourdough Club
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Fresh From The Stone Oven
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
                Get first access to secret weekend pizza drops, seasonal heirloom sourdough releases, and neighborhood chef collaborations. No spam, only hot pies.
              </p>
            </div>

            <div className="lg:col-span-5">
              {subscribed ? (
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <div className="text-xs sm:text-sm font-medium">
                    You&apos;re in! Watch your inbox for secret oven drops and private tasting invites.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2.5">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email for oven drops..."
                      required
                      className="h-11 flex-1 rounded-xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-xs"
                      aria-label="Email address for newsletter"
                    />
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-11 px-6 rounded-xl font-bold gap-2 shrink-0 shadow-sm"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Joining...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>Join Club</span>
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-[11px] text-muted-foreground pl-1">
                    Free sourdough tasting perks. Unsubscribe anytime with 1-click.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Quality, Craft & Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xs">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-foreground">800°F Stone Ovens</div>
              <div className="text-[11px] text-muted-foreground">Authentic high-heat crust bake</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xs">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-foreground">48h Cold Ferment</div>
              <div className="text-[11px] text-muted-foreground">Slow bio-available sourdough</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xs">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-foreground">D.O.P. Certified</div>
              <div className="text-[11px] text-muted-foreground">San Marzano & Mozzarella</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xs">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-foreground">Stripe Encrypted</div>
              <div className="text-[11px] text-muted-foreground">PCI-DSS Level 1 payments</div>
            </div>
          </div>
        </div>

        {/* Live Status Pill & Operational Hub */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-border/60 bg-card/80 mb-14 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="font-semibold text-foreground">Live Kitchen Operations:</span>
            <span className="text-muted-foreground">17 Stone Ovens Baking Now across 6 neighborhood hubs</span>
          </div>
          <Link
            href="/menu"
            className="inline-flex items-center gap-1 font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            <span>Order Hot Sourdough Delivery</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* 5-Column Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 pb-14 border-b border-border/70">
          {/* Brand Col */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Pizza className="h-5 w-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight">
                Pizza<span className="text-primary">Hub</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed pr-2">
              The premier platform connecting vetted artisanal pizza kitchens with true sourdough enthusiasts. Baked at 800°F with local organic grains.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
                aria-label="Follow PizzaHub on X"
              >
                <XLogo className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
                aria-label="Follow PizzaHub on Instagram"
              >
                <InstagramLogo className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
                aria-label="Follow PizzaHub on YouTube"
              >
                <YouTubeLogo className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
                aria-label="PizzaHub Open Source"
              >
                <GitHubLogo className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Col 1: Artisanal Menu */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Artisanal Menu
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/menu" className="hover:text-primary transition-colors">
                  All Stone-Baked Pies
                </Link>
              </li>
              <li>
                <Link href="/menu?category=Classic+Pizzas" className="hover:text-primary transition-colors">
                  Classic Margherita & Marinara
                </Link>
              </li>
              <li>
                <Link href="/menu?category=Specialty+%2F+Gourmet+Pizzas" className="hover:text-primary transition-colors">
                  White Truffle & Burrata
                </Link>
              </li>
              <li>
                <Link href="/menu?category=Meat+Lovers" className="hover:text-primary transition-colors">
                  Diavola Spicy Soppressata
                </Link>
              </li>
              <li>
                <Link href="/menu?category=Vegetarian+Pizzas" className="hover:text-primary transition-colors">
                  Heirloom Garden & Vegan
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: For Kitchens */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              For Kitchens
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/sign-up?role=vendor" className="hover:text-primary transition-colors">
                  Partner with PizzaHub
                </Link>
              </li>
              <li>
                <Link href="/dashboard/vendor/plan" className="hover:text-primary transition-colors">
                  Vendor Premium Plan
                </Link>
              </li>
              <li>
                <Link href="/dashboard/vendor" className="hover:text-primary transition-colors">
                  Live Kitchen Console
                </Link>
              </li>
              <li>
                <Link href="/dashboard/vendor/orders" className="hover:text-primary transition-colors">
                  Order Dispatch Queue
                </Link>
              </li>
              <li>
                <Link href="/dashboard/vendor/menu" className="hover:text-primary transition-colors">
                  Artisanal Recipe Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Experience */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Customer Hub
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/dashboard/customer/orders" className="hover:text-primary transition-colors">
                  Track Live Orders
                </Link>
              </li>
              <li>
                <Link href="/dashboard/customer" className="hover:text-primary transition-colors">
                  Customer Dashboard
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-primary transition-colors">
                  Fast Neighborhood Delivery
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-primary transition-colors">
                  Catering & Group Boxes
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-primary transition-colors">
                  Pizza Lover Gift Cards
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Platform & Trust
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Sourdough Quality Standard
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Cold-Ferment Science
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Stripe Payment Security
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Allergen & Gluten Matrix
                </Link>
              </li>
              <li>
                <a href="mailto:support@pizzahub.local" className="hover:text-primary transition-colors">
                  Dispatch Support: 24/7
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Payment Badges Bar */}
        <div suppressHydrationWarning className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p suppressHydrationWarning className="text-center md:text-left">
            © {new Date().getFullYear()} PizzaHub Inc. All rights reserved. Handcrafted with passion & organic flour.
          </p>

          {/* Payment Trust Indicators */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-medium text-muted-foreground hidden sm:inline">
              Secured by:
            </span>
            <div className="flex items-center gap-2 text-foreground/80 font-bold text-[10px]">
              <span className="px-2 py-0.5 rounded border border-border bg-card/80 font-mono tracking-tight">
                STRIPE
              </span>
              <span className="px-2 py-0.5 rounded border border-border bg-card/80 font-sans tracking-tight">
                VISA
              </span>
              <span className="px-2 py-0.5 rounded border border-border bg-card/80 font-sans tracking-tight">
                MASTERCARD
              </span>
              <span className="px-2 py-0.5 rounded border border-border bg-card/80 font-sans tracking-tight">
                APPLE PAY
              </span>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <Link href="/" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="/" className="hover:text-foreground transition-colors">
              Cookie Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
