"use client";

import * as React from "react";
import type { MenuItem, CartItem } from "@/types";

const CART_STORAGE_KEY = "pizzahub_cart_v1";

let cartItems: CartItem[] = [];
let isCartInitialized = false;
let isDrawerOpen = false;

const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

function initCartIfNeeded() {
  if (isCartInitialized || typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        cartItems = parsed;
      }
    }
  } catch {
    cartItems = [];
  }
  isCartInitialized = true;
}

function saveCart(items: CartItem[]) {
  cartItems = items;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore quota errors
    }
  }
  notify();
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  if (typeof window !== "undefined") {
    initCartIfNeeded();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === CART_STORAGE_KEY) {
        try {
          cartItems = e.newValue ? JSON.parse(e.newValue) : [];
        } catch {
          cartItems = [];
        }
        notify();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => {
      listeners.delete(callback);
      window.removeEventListener("storage", handleStorage);
    };
  }
  return () => {
    listeners.delete(callback);
  };
}

const EMPTY_ITEMS: CartItem[] = [];

function getCartSnapshot(): CartItem[] {
  initCartIfNeeded();
  return cartItems;
}

function getServerSnapshot(): CartItem[] {
  return EMPTY_ITEMS;
}

function getDrawerSnapshot(): boolean {
  return isDrawerOpen;
}

function getDrawerServerSnapshot(): boolean {
  return false;
}

export function openCartDrawer(): void {
  isDrawerOpen = true;
  notify();
}

export function closeCartDrawer(): void {
  isDrawerOpen = false;
  notify();
}

export function toggleCartDrawer(): void {
  isDrawerOpen = !isDrawerOpen;
  notify();
}

export function useCart() {
  const items = React.useSyncExternalStore(
    subscribe,
    getCartSnapshot,
    getServerSnapshot
  );
  const isOpen = React.useSyncExternalStore(
    subscribe,
    getDrawerSnapshot,
    getDrawerServerSnapshot
  );

  const addItem = React.useCallback(
    (item: MenuItem, quantity = 1, specialInstructions?: string) => {
      initCartIfNeeded();
      const existingIndex = cartItems.findIndex((ci) => ci.id === item.id);
      const safeQty = Math.max(1, Math.min(quantity, 99));

      let updated: CartItem[];
      if (existingIndex > -1) {
        updated = cartItems.map((ci, idx) => {
          if (idx === existingIndex) {
            return {
              ...ci,
              quantity: Math.min(ci.quantity + safeQty, 99),
              specialInstructions:
                specialInstructions ?? ci.specialInstructions,
            };
          }
          return ci;
        });
      } else {
        const newItem: CartItem = {
          id: item.id,
          itemName: item.itemName,
          category: item.category,
          price: item.price,
          image:
            item.images?.[0] ||
            "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop",
          vendorId: item.vendorId,
          vendorName: item.vendorName,
          location: item.location,
          quantity: safeQty,
          specialInstructions: specialInstructions?.trim() || undefined,
        };
        updated = [...cartItems, newItem];
      }

      saveCart(updated);
    },
    []
  );

  const removeItem = React.useCallback((itemId: string) => {
    initCartIfNeeded();
    const updated = cartItems.filter((ci) => ci.id !== itemId);
    saveCart(updated);
  }, []);

  const updateQuantity = React.useCallback(
    (itemId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(itemId);
        return;
      }
      initCartIfNeeded();
      const updated = cartItems.map((ci) =>
        ci.id === itemId ? { ...ci, quantity: Math.min(quantity, 99) } : ci
      );
      saveCart(updated);
    },
    [removeItem]
  );

  const clearCart = React.useCallback(() => {
    saveCart([]);
  }, []);

  const itemCount = React.useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = React.useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  return {
    items,
    itemCount,
    subtotal,
    isOpen,
    setIsOpen: (open: boolean) =>
      open ? openCartDrawer() : closeCartDrawer(),
    openCart: openCartDrawer,
    closeCart: closeCartDrawer,
    toggleCart: toggleCartDrawer,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
}
