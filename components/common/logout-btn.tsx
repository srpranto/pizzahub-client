"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { clearTokenCache } from "@/lib/token";
import { toast } from "sonner";

interface LogoutBtnProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showIcon?: boolean;
}

export function LogoutBtn({
  variant = "ghost",
  size = "default",
  className,
  showIcon = true,
}: LogoutBtnProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      clearTokenCache();
      await authClient.signOut();
      toast.success("Signed out successfully");
      router.push("/sign-in");
      router.refresh();
    } catch {
      toast.error("Failed to sign out");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleLogout}
      disabled={loading}
    >
      {showIcon && <LogOut className="mr-2 h-4 w-4" />}
      {loading ? "Signing out..." : "Sign Out"}
    </Button>
  );
}
