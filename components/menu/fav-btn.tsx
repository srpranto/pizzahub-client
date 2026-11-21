"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { User } from "@/types";

interface FavBtnProps {
  itemId: string;
  initialFavorite?: boolean;
  className?: string;
  size?: "sm" | "default";
}

export function FavBtn({
  itemId,
  initialFavorite = false,
  className,
  size = "default",
}: FavBtnProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isFavorite, setIsFavorite] = React.useState(initialFavorite);
  const [loading, setLoading] = React.useState(false);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast.error("Please sign in to save your favorite pizzas");
      router.push(`/sign-in?callbackUrl=/menu/${itemId}`);
      return;
    }

    const userRole = (session.user as unknown as User)?.role;
    if (userRole && userRole !== "customer" && userRole !== "vendor") {
      toast.error("Only customers and vendors can save favorite pizzas");
      return;
    }

    try {
      setLoading(true);
      const res = await apiFetch<{
        success: boolean;
        data?: { favoriteItemIds: string[] };
      }>(`/api/users/favorites/${itemId}`, {
        method: "PATCH",
      });

      if (res.success && res.data) {
        const nextState = res.data.favoriteItemIds.includes(itemId);
        setIsFavorite(nextState);
        toast.success(
          nextState ? "Added to your favorites!" : "Removed from favorites"
        );
      }
    } catch {
      toast.error("Failed to update favorites");
    } finally {
      setLoading(false);
    }
  };

  const iconSizes = {
    sm: "h-4 w-4",
    default: "h-5 w-5",
  };

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      disabled={loading}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      className={cn(
        "flex h-10 w-10 min-h-[40px] min-w-[40px] items-center justify-center rounded-full bg-background/85 backdrop-blur-md transition-all duration-200 hover:bg-background hover:scale-110 active:scale-90 shadow-sm cursor-pointer border border-border/40",
        className
      )}
    >
      <Heart
        className={cn(
          iconSizes[size],
          "transition-all duration-300",
          isFavorite
            ? "fill-primary text-primary scale-110"
            : "text-muted-foreground hover:text-foreground"
        )}
      />
    </button>
  );
}
