import type { MenuItemCategory, UserRole } from "@/types";

export const CATEGORIES: readonly MenuItemCategory[] = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
] as const;

export const ROLE_DASHBOARD_ROUTES: Record<UserRole, string> = {
  customer: "/dashboard/customer",
  vendor: "/dashboard/vendor",
  admin: "/dashboard/admin",
};
