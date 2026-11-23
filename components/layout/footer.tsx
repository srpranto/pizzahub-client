"use client";

import * as React from "react";
import Link from "next/link";
import {
  Pizza,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";

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
  const { itemCount } = useCart();
  const hasItems = itemCount > 0;
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
      className="border-t border-[#e7dfd5] dark:border-[#1c1815] bg-[#f7f2ea] dark:bg-[#0a0806] text-[#1c1917] dark:text-white pt-12 pb-10 transition-colors duration-300"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Ambient Newsletter Card */}
        <div className="relative overflow-hidden rounded-2xl border border-orange-200/80 dark:border-amber-900/40 bg-white/95 dark:bg-[#120f0d] p-6 sm:p-8 lg:p-10 mb-12 shadow-sm dark:shadow-[0_0_50px_-15px_rgba(234,88,12,0.22)]">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-orange-500/10 dark:bg-orange-600/15 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-amber-500/10 dark:bg-amber-600/10 blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-2">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-[#1c1917] dark:text-white flex items-center gap-2.5">
                <span>Fresh From The Stone Oven</span>
                <span className="text-2xl sm:text-3xl" aria-hidden="true">🔥</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#78716c] dark:text-neutral-400 leading-relaxed max-w-xl">
                Get secret weekly specials and chef recipes straight to your inbox
              </p>
            </div>

            <div className="lg:col-span-5 w-full">
              {subscribed ? (
                <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <div className="text-xs sm:text-sm font-medium">
                    You&apos;re in! Watch your inbox for secret oven drops and private recipes.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="w-full">
                  <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full h-11 px-4 rounded-xl border border-[#e7dfd5] dark:border-neutral-800 bg-[#faf7f2] dark:bg-[#1a1614] text-sm text-[#1c1917] dark:text-white placeholder:text-[#a8a29e] dark:placeholder:text-neutral-500 focus:outline-hidden focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all shadow-xs"
                      aria-label="Email address for newsletter"
                    />
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-11 px-6 rounded-xl font-bold bg-[#ea580c] hover:bg-[#ea580c]/90 text-white cursor-pointer shadow-xs shrink-0"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Joining...</span>
                        </>
                      ) : (
                        <span>Join Club</span>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* 4-Column Navigation Grid matching target mockup */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-[#e7dfd5] dark:border-neutral-800/80">
          {/* Column 1: PizzaHub Brand */}
          <div className="col-span-2 lg:col-span-1 space-y-3.5">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/10 dark:bg-gradient-to-br dark:from-amber-500/20 dark:to-orange-500/20 border border-orange-500/30 dark:border-orange-500/40 text-orange-600 dark:text-orange-500 shadow-sm dark:shadow-[0_0_25px_rgba(234,88,12,0.35)] transition-transform group-hover:scale-105">
                <Pizza className="h-6 w-6 text-orange-600 dark:text-orange-500" />
              </div>
              <span className="text-2xl font-black tracking-tight text-[#1c1917] dark:text-white">
                Pizza<span className="text-orange-600 dark:text-orange-500">Hub</span>
              </span>
            </Link>
            <p className="text-xs text-[#78716c] dark:text-neutral-400 leading-relaxed max-w-[220px]">
              Artisanal stone-baked pizzas delivered hot
            </p>
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e7dfd5] dark:border-neutral-800 bg-white dark:bg-[#14110f] text-[#78716c] dark:text-neutral-400 hover:text-[#1c1917] dark:hover:text-white hover:border-orange-500/40 dark:hover:border-neutral-600 transition-colors cursor-pointer shadow-xs"
                aria-label="Follow PizzaHub on X"
              >
                <XLogo className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e7dfd5] dark:border-neutral-800 bg-white dark:bg-[#14110f] text-[#78716c] dark:text-neutral-400 hover:text-[#1c1917] dark:hover:text-white hover:border-orange-500/40 dark:hover:border-neutral-600 transition-colors cursor-pointer shadow-xs"
                aria-label="Follow PizzaHub on Instagram"
              >
                <InstagramLogo className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e7dfd5] dark:border-neutral-800 bg-white dark:bg-[#14110f] text-[#78716c] dark:text-neutral-400 hover:text-[#1c1917] dark:hover:text-white hover:border-orange-500/40 dark:hover:border-neutral-600 transition-colors cursor-pointer shadow-xs"
                aria-label="Follow PizzaHub on YouTube"
              >
                <YouTubeLogo className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://github.com/srpranto"
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e7dfd5] dark:border-neutral-800 bg-white dark:bg-[#14110f] text-[#78716c] dark:text-neutral-400 hover:text-[#1c1917] dark:hover:text-white hover:border-orange-500/40 dark:hover:border-neutral-600 transition-colors cursor-pointer shadow-xs"
                aria-label="PizzaHub on GitHub"
              >
                <GitHubLogo className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Explore Menu */}
          <div className="space-y-3.5">
            <h4 className="text-sm font-bold tracking-wide text-orange-600 dark:text-orange-400">
              Explore Menu
            </h4>
            <ul className="space-y-2.5 text-xs text-[#57534e] dark:text-neutral-400">
              <li>
                <Link href="/menu" className="hover:text-[#1c1917] dark:hover:text-white transition-colors">
                  All Pizzas
                </Link>
              </li>
              <li>
                <Link href="/menu?category=Classic+Pizzas" className="hover:text-[#1c1917] dark:hover:text-white transition-colors">
                  Classic Margherita
                </Link>
              </li>
              <li>
                <Link href="/menu?category=Specialty+%2F+Gourmet+Pizzas" className="hover:text-[#1c1917] dark:hover:text-white transition-colors">
                  Gourmet Truffle
                </Link>
              </li>
              <li>
                <Link href="/menu?category=Meat+Lovers" className="hover:text-[#1c1917] dark:hover:text-white transition-colors">
                  Sourdough Specials
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: For Kitchens */}
          <div className="space-y-3.5">
            <h4 className="text-sm font-bold tracking-wide text-orange-600 dark:text-orange-400">
              For Kitchens
            </h4>
            <ul className="space-y-2.5 text-xs text-[#57534e] dark:text-neutral-400">
              <li>
                <Link href="/sign-up?role=vendor" className="hover:text-[#1c1917] dark:hover:text-white transition-colors">
                  Partner with PizzaHub
                </Link>
              </li>
              <li>
                <Link href="/dashboard/vendor" className="hover:text-[#1c1917] dark:hover:text-white transition-colors">
                  Vendor Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/vendor/plan" className="hover:text-[#1c1917] dark:hover:text-white transition-colors">
                  Pricing & Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Customer Care */}
          <div className="space-y-3.5">
            <h4 className="text-sm font-bold tracking-wide text-orange-600 dark:text-orange-400">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs text-[#57534e] dark:text-neutral-400">
              <li>
                <Link href="/dashboard/customer/orders" className="hover:text-[#1c1917] dark:hover:text-white transition-colors">
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link href="/dashboard/customer" className="hover:text-[#1c1917] dark:hover:text-white transition-colors">
                  Support & FAQ
                </Link>
              </li>
              <li>
                <a href="mailto:support@pizzahub.local" className="hover:text-[#1c1917] dark:hover:text-white transition-colors">
                  Live Chat
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-Footer Bar: Right-aligned when cart is empty, centered when cart has items */}
        <div
          suppressHydrationWarning
          className={`mt-8 relative flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#78716c] dark:text-neutral-400 ${
            hasItems ? "pb-24 md:pb-4" : "pb-12 md:pb-4"
          }`}
        >
          {/* Left: Copyright */}
          <p suppressHydrationWarning className="text-center md:text-left text-xs order-2 md:order-1">
            © {new Date().getFullYear()} PizzaHub Inc. All rights reserved.
          </p>

          {/* Legal Links: Right-aligned by default, smoothly centered when cart is active */}
          <div
            className={`flex items-center gap-3 text-xs font-medium text-[#78716c] dark:text-neutral-400 order-1 md:order-2 transition-all duration-300 ease-out ${
              hasItems
                ? "md:absolute md:left-1/2 md:-translate-x-1/2"
                : "md:ml-auto"
            }`}
          >
            <Link href="/menu" className="hover:text-[#1c1917] dark:hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="text-[#a8a29e] dark:text-neutral-600 select-none" aria-hidden="true">·</span>
            <Link href="/menu" className="hover:text-[#1c1917] dark:hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>

          {/* Right: Reserved empty clearance space for sticky floating cart when active */}
          {hasItems && (
            <div className="hidden md:block w-36 order-3 pointer-events-none" aria-hidden="true" />
          )}
        </div>
      </div>
    </footer>
  );
}
