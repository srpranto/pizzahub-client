"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Sparkles, ShoppingBag, Check } from "lucide-react";
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
  const [isAdded, setIsAdded] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const imageUrl =
    item.images && item.images.length > 0
      ? item.images[0]
      : "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop";

  const isPremiumVendor = item.vendorPlan === "premium";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(item, 1);
    setIsAdded(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsAdded(false);
    }, 1200);
    toast.success(`🍕 Added "${item.itemName}" to your pizza box!`);
  };

  return (
    <div
      className="group flex flex-col justify-between overflow-hidden rounded-xl sm:rounded-2xl border border-border/80 bg-card shadow-xs transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/50 hover:shadow-primary/5 ring-1 ring-black/5 dark:ring-white/10 w-full min-w-0 max-w-full h-full"
    >
      <div className="flex flex-col flex-1">
        {/* Clean Food Image - Zero Text Overlays */}
        <div className="relative aspect-16/10 sm:aspect-4/3 w-full overflow-hidden bg-muted shrink-0">
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
            <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-40" />
          </Link>

          {/* Floating Favorite Heart Button */}
          <div className="absolute right-2.5 top-2.5 z-10">
            <FavBtn itemId={item.id} initialFavorite={initialFavorite} size="sm" />
          </div>
        </div>

        {/* Structured Card Content */}
        <div className="p-3.5 sm:p-5 flex flex-col flex-1 justify-between gap-2.5 sm:gap-3.5">
          <div>
            {/* Category, Featured & Location Header */}
            <div className="flex items-center justify-between gap-2 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                <Badge variant="secondary" className="font-bold text-[10px] sm:text-xs px-2 py-0.5 rounded-md border border-border/50 shrink-0">
                  {item.category}
                </Badge>
                {isPremiumVendor && (
                  <Badge variant="accent" className="gap-1 font-bold text-[10px] sm:text-xs px-1.5 py-0.5 rounded-md shadow-2xs shrink-0">
                    <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                    Featured
                  </Badge>
                )}
              </div>
              {item.location && (
                <span className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground shrink-0 font-medium">
                  <MapPin className="h-3 w-3 text-primary shrink-0" />
                  <span className="truncate max-w-[90px] sm:max-w-[140px]">{item.location}</span>
                </span>
              )}
            </div>

            {/* Title */}
            <Link href={`/menu/${item.id}`} className="block group/title mt-1.5">
              <h3 className="line-clamp-1 text-sm sm:text-lg font-bold text-foreground group-hover/title:text-primary transition-colors [text-wrap:balance]">
                {item.itemName}
              </h3>
            </Link>

            {/* Description */}
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground leading-relaxed [text-wrap:pretty]">
              {item.description}
            </p>

            {/* Vendor Attribution */}
            {item.vendorName && (
              <p className="mt-2 text-[11px] sm:text-xs text-muted-foreground font-medium truncate">
                By <span className="font-semibold text-foreground">{item.vendorName}</span>
              </p>
            )}
          </div>

          {/* Card Footer: Price & Actions */}
          <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2 sm:gap-3 mt-auto">
            <div className="flex flex-col shrink-0">
              <span className="text-[9px] sm:text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Price</span>
              <span className="text-base sm:text-xl font-black text-foreground tabular-nums">
                ${item.price.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <Button
                type="button"
                onClick={handleAddToCart}
                className={`h-9 sm:h-11 px-3 sm:px-4 text-xs sm:text-sm font-bold group/btn active:scale-95 transition-all duration-200 cursor-pointer ${
                  isAdded
                    ? "bg-emerald-600 hover:bg-emerald-600 text-white shadow-emerald-500/20"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
                aria-label={isAdded ? `Added ${item.itemName} to box` : `Add ${item.itemName} to box`}
              >
                {isAdded ? (
                  <>
                    <Check className="mr-1 sm:mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 animate-in zoom-in-75 duration-200 stroke-[3]" />
                    <span>Added! ✓</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="mr-1 sm:mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 transition-transform group-hover/btn:scale-110" />
                    <span>Add to Box</span>
                  </>
                )}
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-9 sm:h-11 px-2.5 sm:px-3.5 text-xs font-semibold shrink-0 cursor-pointer active:scale-95 transition-all"
                aria-label={`View details for ${item.itemName}`}
              >
                <Link href={`/menu/${item.id}`}>
                  Details
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
