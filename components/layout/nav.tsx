"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Pizza, Menu as MenuIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeBtn } from "@/components/common/theme-btn";
import { NavUser } from "./nav-user";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { CartTrigger } from "@/components/cart/cart-trigger";
import type { UserRole } from "@/types";

export function Nav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const user = session?.user;
  const role = ((user as { role?: string })?.role as UserRole) || "customer";

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Browse Menu", href: "/menu" },
  ];

  if (session && role === "customer") {
    navLinks.push({ label: "My Orders", href: "/dashboard/customer/orders" });
  } else if (session && role === "vendor") {
    navLinks.push({ label: "Vendor Hub", href: "/dashboard/vendor" });
  } else if (session && role === "admin") {
    navLinks.push({ label: "Admin Panel", href: "/dashboard/admin" });
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-md">
      <div className="mx-auto relative flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center z-10">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform group-hover:scale-105 shadow-sm">
              <Pizza className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-foreground">
                Pizza<span className="text-primary">Hub</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Artisanal Pies
              </span>
            </div>
          </Link>
        </div>

        {/* Mathematically Centered Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2 bg-muted/50 backdrop-blur-sm p-1 rounded-full border border-border/70 shadow-xs">
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/80"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-2.5 z-10">
          <ThemeBtn />
          <CartTrigger />
          {user ? (
            <NavUser user={user} />
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild size="sm">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeBtn />
          <CartTrigger />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-b border-border bg-background/98 backdrop-blur-xl px-4 py-6 md:hidden space-y-4 animate-in slide-in-from-top-2 duration-200 shadow-xl">
          <nav className="flex flex-col space-y-1.5 text-center">
            {navLinks.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center justify-center min-h-[48px] rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
                    active
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="pt-3 border-t border-border">
            {user ? (
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground text-xs shadow-xs">
                    {(user.name ?? "U").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <NavUser user={user} />
              </div>
            ) : (
              <div className="flex flex-col gap-2.5 pt-2">
                <Button variant="outline" asChild className="w-full min-h-[48px] rounded-xl font-medium">
                  <Link href="/sign-in" onClick={() => setMobileOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button asChild className="w-full min-h-[48px] rounded-xl font-bold shadow-md shadow-primary/20">
                  <Link href="/sign-up" onClick={() => setMobileOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
