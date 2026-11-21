export type UserRole = "customer" | "vendor" | "admin";
export type SubscriptionPlan = "free" | "premium";

export type MenuItemCategory =
  | "Classic Pizzas"
  | "Vegetarian Pizzas"
  | "Meat Lovers"
  | "Specialty / Gourmet Pizzas"
  | "Sides & Appetizers"
  | "Beverages & Desserts";

export type MenuItemStatus = "pending" | "approved" | "rejected" | "inactive";
export type OrderStatus = "pending" | "accepted" | "rejected" | "cancelled";

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: UserRole;
  isBlocked: boolean;
  businessName?: string | null;
  subscriptionPlan: SubscriptionPlan;
  subscriptionExpiresAt?: string | null;
  favoriteItemIds?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface MenuItem {
  id: string;
  vendorId: string;
  itemName: string;
  category: MenuItemCategory;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: MenuItemStatus;
  createdAt: string;
  vendorName?: string;
  vendorPlan?: SubscriptionPlan;
}

export interface Review {
  id: string;
  itemId: string;
  vendorId: string;
  customerId: string;
  customerName: string;
  customerImage?: string | null;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ItemReviewsSummary {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  at: string;
}

export interface Order {
  id: string;
  itemId: string;
  vendorId: string;
  customerId: string;
  deliveryDate: string;
  deliveryAddress: string;
  message?: string;
  quantity?: number;
  status: OrderStatus;
  statusHistory: OrderStatusHistoryItem[];
  createdAt: string;
  item?: MenuItem;
  customerName?: string;
  customerEmail?: string;
  vendorName?: string;
}

export interface CartItem {
  id: string;
  itemName: string;
  category: string;
  price: number;
  image: string;
  vendorId: string;
  vendorName?: string;
  location: string;
  quantity: number;
  specialInstructions?: string;
}

export interface Transaction {
  id: string;
  vendorId: string;
  plan: "premium";
  amount: number;
  currency: string;
  stripeSessionId: string;
  stripeSubscriptionId?: string | null;
  status: string;
  createdAt: string;
  vendorName?: string;
  vendorEmail?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface CustomerStats {
  totalOrders: number;
  pendingOrders: number;
  acceptedOrders: number;
  cancelledOrders: number;
  chartData: Array<{ name: string; count: number }>;
}

export interface VendorStats {
  totalItems: number;
  approvedItems: number;
  pendingItems: number;
  totalOrders: number;
  pendingOrders: number;
  acceptedOrders: number;
  subscriptionPlan: SubscriptionPlan;
  chartData: Array<{ name: string; count: number }>;
}

export interface AdminStats {
  totalUsers: number;
  totalVendors: number;
  totalCustomers: number;
  totalItems: number;
  pendingItems: number;
  approvedItems: number;
  totalOrders: number;
  totalTransactions: number;
  chartData: Array<{ name: string; count: number }>;
}


