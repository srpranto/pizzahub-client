"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";

export function CartTrigger() {
  const { itemCount, openCart } = useCart();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={openCart}
      className="relative rounded-full h-9 w-9 text-muted-foreground hover:text-foreground cursor-pointer"
      aria-label={`Open shopping cart (${itemCount} items)`}
    >
      <ShoppingBag className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-black text-primary-foreground shadow-xs animate-in zoom-in-50 duration-200">
          {itemCount}
        </span>
      )}
    </Button>
  );
}
