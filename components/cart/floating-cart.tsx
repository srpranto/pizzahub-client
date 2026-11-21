"use client";

import { ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart";

export function FloatingCart() {
  const { itemCount, subtotal, isOpen, openCart } = useCart();

  if (itemCount === 0 || isOpen) return null;

  return (
    <aside
      aria-label="Shopping Cart Summary"
      className="fixed bottom-6 right-6 z-40 animate-in fade-in slide-in-from-bottom-4 duration-300 ease-out"
    >
      <button
        type="button"
        onClick={openCart}
        className="group flex items-center gap-3 rounded-full bg-primary px-5 py-3 text-primary-foreground shadow-xl ring-2 ring-primary/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        aria-label={`View your pizza box with ${itemCount} items`}
      >
        <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-primary-foreground/20">
          <ShoppingBag className="h-4 w-4" />
          <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[9px] font-black text-background">
            {itemCount}
          </span>
        </div>

        <div className="flex flex-col text-left">
          <span className="text-xs font-extrabold tracking-tight">
            {itemCount} {itemCount === 1 ? "Pizza" : "Pizzas"} in Box
          </span>
          <span className="text-[10px] font-medium opacity-90 tabular-nums">
            ${subtotal.toFixed(2)} total
          </span>
        </div>

        <div className="ml-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary-foreground/15 transition-transform group-hover:translate-x-0.5">
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </button>
    </aside>
  );
}
