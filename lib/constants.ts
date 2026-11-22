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

/**
 * Resolves post-auth redirect target based on callbackUrl and user role.
 * - If callbackUrl is provided and is a valid internal route (starts with '/' and not '//'):
 *   - If callbackUrl is root ("/") or auth page, falls back to role dashboard / homepage.
 *   - If callbackUrl is "/dashboard", routes to the role dashboard.
 *   - Role-guards dashboard destinations (e.g. non-admin cannot be redirected to /dashboard/admin).
 *   - For non-customers who signed in directly without selecting a specific menu item (e.g. "/menu"), routes to their dashboard.
 *   - Otherwise returns the exact callbackUrl (e.g. "/menu/[id]").
 * - If no valid callbackUrl is provided:
 *   - Vendor / Admin are routed to their respective dashboards.
 *   - Customers are routed to the homepage ("/").
 */
export function resolveAuthRedirect(
  callbackUrl?: string | null,
  role?: UserRole
): string {
  const userRole: UserRole = role || "customer";
  const defaultRoute =
    userRole === "customer"
      ? "/"
      : (ROLE_DASHBOARD_ROUTES[userRole] || "/");

  if (!callbackUrl || typeof callbackUrl !== "string") {
    return defaultRoute;
  }

  const trimmed = callbackUrl.trim();

  // Strict check: must start with a single '/' and not '//', and no backslashes
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.includes("\\")) {
    return defaultRoute;
  }

  // Root '/' is treated as direct login -> role default
  if (trimmed === "/") {
    return defaultRoute;
  }

  // Extract path without query for route checking
  const cleanPath = trimmed.split("?")[0];

  // Prevent redirect loops back to auth pages
  if (cleanPath === "/sign-in" || cleanPath === "/sign-up") {
    return defaultRoute;
  }

  // Generic '/dashboard' goes to role dashboard
  if (cleanPath === "/dashboard") {
    return ROLE_DASHBOARD_ROUTES[userRole] || "/dashboard/customer";
  }

  // Role authorization guard for protected dashboards
  if (cleanPath.startsWith("/dashboard/admin") && userRole !== "admin") {
    return defaultRoute;
  }
  if (cleanPath.startsWith("/dashboard/vendor") && userRole !== "vendor") {
    return defaultRoute;
  }

  // For vendors and admins who didn't select a specific pizza item (e.g. general /menu),
  // route them to their dashboard instead of keeping them on customer browsing pages
  if (userRole !== "customer" && cleanPath === "/menu") {
    return ROLE_DASHBOARD_ROUTES[userRole] || "/";
  }

  return trimmed;
}
