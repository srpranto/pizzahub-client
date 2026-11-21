"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Sparkles, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FavBtn } from "./fav-btn";
import { useCart } from "@/lib/cart";
import type { MenuItem } from "@/types";

interface MenuCardProps {
  item: MenuItem;
  initialFavorite?: boolean;
}

export function MenuCard({ item, initialFavorite = false }: MenuCardProps) {
  const { addItem } = useCart();

  const imageUrl =
    item.images && item.images.length > 0
      ? item.images[0]
      : "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop";

  const isPremiumVendor = item.vendorPlan === "premium";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(item, 1);
    toast.success(`🍕 Added "${item.itemName}" to your pizza box!`);
  };

  return (
    <div
      className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ring-1 ring-black/5 dark:ring-white/10 w-full min-w-0 max-w-full h-full"
    >
      <div className="flex flex-col flex-1">
        <div className="relative aspect-4/3 w-full overflow-hidden bg-muted shrink-0">
          <Link
            href={`/menu/${item.id}`}
            className="absolute inset-0 z-0 cursor-pointer"
            aria-label={`View ${item.itemName} details`}
          >
            <Image
              src={imageUrl}
              alt={item.itemName}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60" />
          </Link>

          <div className="absolute left-3 top-3 right-14 flex flex-wrap gap-1.5 items-start pointer-events-none z-10">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-xs font-bold text-[11px] px-2 py-0.5 border border-border/40 shadow-xs pointer-events-auto">
              {item.category}
            </Badge>
            {isPremiumVendor && (
              <Badge variant="accent" className="gap-1 font-bold text-[11px] px-2 py-0.5 shadow-xs pointer-events-auto">
                <Sparkles className="h-3 w-3 shrink-0" />
                Featured Kitchen
              </Badge>
            )}
          </div>

          <div className="absolute right-3 top-3 z-10">
            <FavBtn itemId={item.id} initialFavorite={initialFavorite} size="sm" />
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white pointer-events-none z-10">
            <span className="text-xl font-extrabold tracking-tight drop-shadow-sm tabular-nums">
              ${item.price.toFixed(2)}
            </span>
            {item.location && (
              <span className="flex items-center gap-1 text-xs font-medium drop-shadow-sm text-white/90">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate max-w-[175px]">{item.location}</span>
              </span>
            )}
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1 justify-between">
          <div>
            <Link href={`/menu/${item.id}`} className="block group/title">
              <h3 className="line-clamp-1 text-lg font-bold text-foreground group-hover/title:text-primary transition-colors [text-wrap:balance] min-h-[1.75rem]">
                {item.itemName}
              </h3>
            </Link>
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground leading-relaxed min-h-[2.5rem] [text-wrap:pretty]">
              {item.description}
            </p>
          </div>

          <div className="mt-3 min-h-[1.25rem]">
            {item.vendorName && (
              <p className="text-xs font-medium text-muted-foreground">
                By <span className="font-semibold text-foreground">{item.vendorName}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-5 pt-0 flex items-center gap-2 mt-auto">
        <Button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 h-11 group/btn active:scale-[0.98] font-bold"
        >
          <ShoppingBag className="mr-1.5 h-4 w-4 transition-transform group-hover/btn:scale-110" />
          Add to Box
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-11 px-3.5 text-xs font-semibold"
          aria-label={`View details for ${item.itemName}`}
        >
          <Link href={`/menu/${item.id}`}>
            Details
          </Link>
        </Button>
      </div>
    </div>
  );
}
