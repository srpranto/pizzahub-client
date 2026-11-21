"use client";

import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard, User as UserIcon, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { ROLE_DASHBOARD_ROUTES } from "@/lib/constants";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { UserRole } from "@/types";

interface NavUserProps {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  };
}

export function NavUser({ user }: NavUserProps) {
  const router = useRouter();
  const role = (user.role as UserRole) || "customer";
  const dashboardHref = ROLE_DASHBOARD_ROUTES[role] || "/dashboard";

  const initials =
    user.name && user.name.length > 0
      ? user.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "U";

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      toast.success("Signed out successfully");
      router.push("/sign-in");
      router.refresh();
    } catch {
      toast.error("Failed to sign out");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer">
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name ?? "User"}
            width={36}
            height={36}
            unoptimized
            className="h-9 w-9 rounded-full object-cover border-2 border-primary/30"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground text-sm shadow-xs">
            {initials}
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 rounded-2xl p-2 border-border/80 shadow-xl">
        <DropdownMenuLabel className="font-normal p-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-bold leading-none text-foreground">
              {user.name || "Artisan User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {user.email}
            </p>
            <span className="inline-block mt-1.5 w-max rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
              {role === "admin" ? "Master Admin" : role === "vendor" ? "Artisan Baker" : "Customer"}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={dashboardHref} className="cursor-pointer flex items-center">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer flex items-center">
            <UserIcon className="mr-2 h-4 w-4" />
            Profile Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
