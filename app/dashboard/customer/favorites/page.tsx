"use client";

import * as React from "react";
import Link from "next/link";
import { Heart, UtensilsCrossed } from "lucide-react";
import { MenuCard } from "@/components/menu/menu-card";
import { Loader } from "@/components/common/loader";
import { EmptyBox } from "@/components/common/empty-box";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import type { MenuItem } from "@/types";

export default function CustomerFavoritesPage() {
  const [items, setItems] = React.useState<MenuItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadFavorites() {
      try {
        setLoading(true);
        const meRes = await apiFetch<{
          success: boolean;
          data: { favoriteItemIds: string[] };
        }>("/api/users/me");

        const favoriteIds = meRes.data?.favoriteItemIds ?? [];
        if (favoriteIds.length === 0) {
          setItems([]);
          return;
        }

        const menuRes = await apiFetch<{
          success: boolean;
          data: MenuItem[];
        }>("/api/menu?limit=50");

        if (menuRes.success && menuRes.data) {
          const matched = menuRes.data.filter((item) =>
            favoriteIds.includes(item.id)
          );
          setItems(matched);
        }
      } catch (err: unknown) {
        setItems([]);
        toast.error(err instanceof Error ? err.message : "Failed to load favorites");
      } finally {
        setLoading(false);
      }
    }

    loadFavorites();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
          <Heart className="h-3.5 w-3.5 fill-current" />
          <span>Wishlist</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Saved Favorite Pizzas
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Quickly access and reorder your favorite artisanal pizzas.
        </p>
      </div>

      {loading ? (
        <Loader text="Loading your favorites..." />
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <MenuCard key={item.id} item={item} initialFavorite={true} />
          ))}
        </div>
      ) : (
        <EmptyBox
          title="No Favorites Saved Yet"
          description="Click the heart icon on any pizza in our browse menu to save it to your personal wishlist."
          icon={<Heart className="h-8 w-8 text-primary" />}
          action={
            <Button asChild>
              <Link href="/menu">
                <UtensilsCrossed className="mr-2 h-4 w-4" />
                Browse Pizzas
              </Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
