"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  UtensilsCrossed,
  PlusCircle,
  ReceiptText,
  CreditCard,
  Users,
  ShieldCheck,
  History,
  UserCog,
} from "lucide-react";
import { LogoutBtn } from "@/components/common/logout-btn";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

interface SidebarProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
  };
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const role = (user.role as UserRole) || "customer";

  const customerLinks = [
    { label: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
    { label: "My Orders", href: "/dashboard/customer/orders", icon: ShoppingBag },
    { label: "Saved Favorites", href: "/dashboard/customer/favorites", icon: Heart },
    { label: "Profile Settings", href: "/profile", icon: UserCog },
  ];

  const vendorLinks = [
    { label: "Vendor Overview", href: "/dashboard/vendor", icon: LayoutDashboard },
    { label: "My Menu Items", href: "/dashboard/vendor/menu", icon: UtensilsCrossed },
    { label: "Add Menu Item", href: "/dashboard/vendor/add-item", icon: PlusCircle },
    { label: "Customer Orders", href: "/dashboard/vendor/orders", icon: ReceiptText },
    { label: "Plan & Billing", href: "/dashboard/vendor/plan", icon: CreditCard },
    { label: "Profile Settings", href: "/profile", icon: UserCog },
  ];

  const adminLinks = [
    { label: "Admin Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Menu Moderation", href: "/dashboard/admin/menu", icon: ShieldCheck },
    { label: "Transactions", href: "/dashboard/admin/payments", icon: History },
    { label: "Profile Settings", href: "/profile", icon: UserCog },
  ];

  let links = customerLinks;
  if (role === "vendor") links = vendorLinks;
  if (role === "admin") links = adminLinks;

  return (
    <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border bg-card/60 p-4 shrink-0 flex flex-col justify-between">
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-background p-3.5 shadow-xs">
          <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
            Active Workspace
          </p>
          <p className="font-bold text-foreground text-sm truncate mt-0.5">
            {user.name || user.email}
          </p>
          <span className="inline-block mt-1.5 rounded-sm bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
            {role} Portal
          </span>
        </div>

        <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-border mt-4 hidden md:block">
        <LogoutBtn variant="outline" className="w-full justify-start" />
      </div>
    </aside>
  );
}
