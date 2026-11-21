import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    .regex(/[a-z]/, "Password must contain at least 1 lowercase letter"),
  role: z.enum(["customer", "vendor"], {
    errorMap: () => ({ message: "Role must be Customer or Vendor" }),
  }),
  image: z.string().url("Invalid image URL").optional().or(z.literal("")),
});

export type SignUpInput = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type SignInInput = z.infer<typeof signInSchema>;

export const menuItemSchema = z.object({
  itemName: z.string().trim().min(2, "Item name must be at least 2 characters"),
  category: z.enum([
    "Classic Pizzas",
    "Vegetarian Pizzas",
    "Meat Lovers",
    "Specialty / Gourmet Pizzas",
    "Sides & Appetizers",
    "Beverages & Desserts",
  ], {
    errorMap: () => ({ message: "Please select a valid category" }),
  }),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be greater than zero"),
  location: z.string().trim().min(2, "Location is required"),
  images: z.array(z.string().url("Must be a valid image URL")).min(1, "At least one image is required"),
});

export type MenuItemInput = z.infer<typeof menuItemSchema>;

export const orderSchema = z.object({
  deliveryDate: z
    .string()
    .min(1, "Delivery date is required")
    .refine((val) => {
      const today = new Date().toISOString().split("T")[0];
      return val >= today;
    }, "Delivery date must be today or in the future"),
  deliveryAddress: z.string().trim().min(5, "Delivery address must be at least 5 characters"),
  message: z.string().trim().optional(),
});

export type OrderInput = z.infer<typeof orderSchema>;

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  image: z.string().url("Invalid image URL").optional().or(z.literal("")),
  businessName: z.string().trim().optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;
