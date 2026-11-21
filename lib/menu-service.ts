import { ObjectId } from "mongodb";
import { db } from "@/lib/db";
import { serverApiFetch } from "@/lib/server-api";
import type { MenuItem, MenuItemCategory, MenuItemStatus, SubscriptionPlan } from "@/types";

export interface MenuResponse {
  success: boolean;
  data: MenuItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function escapeRegex(text: string): string {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

function formatDocToMenuItem(doc: Record<string, unknown>): MenuItem {
  const id = doc._id instanceof ObjectId ? doc._id.toString() : String(doc._id ?? doc.id ?? "");
  const vendorId =
    doc.vendorId instanceof ObjectId
      ? doc.vendorId.toString()
      : String(doc.vendorId ?? "");

  return {
    id,
    vendorId,
    itemName: String(doc.itemName ?? ""),
    category: doc.category as MenuItemCategory,
    description: String(doc.description ?? ""),
    price: Number(doc.price ?? 0),
    location: String(doc.location ?? ""),
    images: Array.isArray(doc.images) ? (doc.images as string[]) : [],
    status: (doc.status as MenuItemStatus) ?? "approved",
    createdAt:
      doc.createdAt instanceof Date
        ? doc.createdAt.toISOString()
        : String(doc.createdAt ?? new Date().toISOString()),
    vendorName: (doc.vendorName as string) ?? undefined,
    vendorPlan: (doc.vendorPlan as SubscriptionPlan) ?? undefined,
  };
}

export async function getFeaturedMenuItems(limit = 8): Promise<MenuItem[]> {
  try {
    const data = await serverApiFetch<{
      success?: boolean;
      data?: MenuItem[];
    }>(`/api/menu/featured?limit=${limit}`, {
      next: { revalidate: 60 },
    });
    if (data?.data && data.data.length > 0) {
      return data.data;
    }
  } catch {
    // API server may be offline or starting up; proceed to resilient direct MongoDB fallback
  }

  try {
    const pizzaCategories = [
      "Classic Pizzas",
      "Vegetarian Pizzas",
      "Meat Lovers",
      "Specialty / Gourmet Pizzas",
    ];

    const docs = await db
      .collection("menuItems")
      .aggregate([
        {
          $match: {
            status: "approved",
            category: { $in: pizzaCategories },
          },
        },
        {
          $lookup: {
            from: "users",
            let: { vId: "$vendorId" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $or: [
                      { $eq: ["$_id", "$$vId"] },
                      { $eq: [{ $toString: "$_id" }, { $toString: "$$vId" }] },
                    ],
                  },
                },
              },
            ],
            as: "vendorData",
          },
        },
        {
          $addFields: {
            vendor: { $arrayElemAt: ["$vendorData", 0] },
          },
        },
        {
          $addFields: {
            isPremiumVendor: {
              $cond: [{ $eq: ["$vendor.subscriptionPlan", "premium"] }, 1, 0],
            },
            vendorName: {
              $ifNull: ["$vendor.businessName", "$vendor.name"],
            },
            vendorPlan: {
              $ifNull: ["$vendor.subscriptionPlan", "free"],
            },
          },
        },
        {
          $sort: {
            isPremiumVendor: -1,
            createdAt: -1,
          },
        },
        {
          $limit: limit,
        },
      ])
      .toArray();

    return docs.map((doc) => formatDocToMenuItem(doc as Record<string, unknown>));
  } catch (err) {
    console.error("Direct MongoDB fallback failed for featured menu items:", err);
    return [];
  }
}

export async function getPublicMenuItems(params: {
  search?: string;
  category?: string;
  location?: string;
  sort?: string;
  page?: string;
  limit?: string;
}): Promise<MenuResponse> {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.category && params.category !== "All") query.set("category", params.category);
  if (params.location) query.set("location", params.location);
  if (params.sort) query.set("sort", params.sort);
  query.set("page", params.page ?? "1");
  query.set("limit", params.limit ?? "24");

  try {
    const data = await serverApiFetch<MenuResponse>(`/api/menu?${query.toString()}`, {
      cache: "no-store",
    });
    if (data?.success && Array.isArray(data.data)) {
      return data;
    }
  } catch {
    // API server offline; proceed to direct MongoDB fallback
  }

  try {
    const search = params.search?.trim() ?? "";
    const category = params.category?.trim() ?? "";
    const location = params.location?.trim() ?? "";
    const sort = params.sort ?? "newest";
    const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
    const limit = Math.max(1, Math.min(50, parseInt(params.limit ?? "24", 10) || 24));
    const skip = (page - 1) * limit;

    const matchQuery: Record<string, unknown> = {
      status: "approved",
    };

    if (search) {
      const searchRegex = new RegExp(escapeRegex(search), "i");
      matchQuery.$or = [
        { itemName: searchRegex },
        { description: searchRegex },
        { location: searchRegex },
      ];
    }

    if (category && category !== "All") {
      matchQuery.category = category;
    }

    if (location && location !== "All") {
      matchQuery.location = new RegExp(escapeRegex(location), "i");
    }

    const sortOption: Record<string, 1 | -1> = {};
    if (sort === "price_asc") {
      sortOption.price = 1;
    } else if (sort === "price_desc") {
      sortOption.price = -1;
    } else {
      sortOption.createdAt = -1;
    }

    const total = await db.collection("menuItems").countDocuments(matchQuery);

    const docs = await db
      .collection("menuItems")
      .aggregate([
        { $match: matchQuery },
        {
          $lookup: {
            from: "users",
            let: { vId: "$vendorId" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $or: [
                      { $eq: ["$_id", "$$vId"] },
                      { $eq: [{ $toString: "$_id" }, { $toString: "$$vId" }] },
                    ],
                  },
                },
              },
            ],
            as: "vendorData",
          },
        },
        {
          $addFields: {
            vendor: { $arrayElemAt: ["$vendorData", 0] },
          },
        },
        {
          $addFields: {
            vendorName: {
              $ifNull: ["$vendor.businessName", "$vendor.name"],
            },
            vendorPlan: {
              $ifNull: ["$vendor.subscriptionPlan", "free"],
            },
          },
        },
        { $sort: sortOption },
        { $skip: skip },
        { $limit: limit },
      ])
      .toArray();

    return {
      success: true,
      data: docs.map((doc) => formatDocToMenuItem(doc as Record<string, unknown>)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  } catch (err) {
    console.error("Direct MongoDB fallback failed for public menu list:", err);
    return {
      success: false,
      data: [],
      total: 0,
      page: 1,
      limit: 24,
      totalPages: 1,
    };
  }
}

export async function getMenuItemById(id: string): Promise<MenuItem | null> {
  try {
    const json = await serverApiFetch<{ success?: boolean; data?: MenuItem }>(
      `/api/menu/${id}`,
      { cache: "no-store" }
    );
    if (json?.data) {
      return json.data;
    }
  } catch {
    // API server offline; proceed to direct MongoDB fallback
  }

  if (!id || !ObjectId.isValid(id)) {
    return null;
  }

  try {
    const objectId = new ObjectId(id);
    const docs = await db
      .collection("menuItems")
      .aggregate([
        { $match: { _id: objectId } },
        {
          $lookup: {
            from: "users",
            let: { vId: "$vendorId" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $or: [
                      { $eq: ["$_id", "$$vId"] },
                      { $eq: [{ $toString: "$_id" }, { $toString: "$$vId" }] },
                    ],
                  },
                },
              },
            ],
            as: "vendorData",
          },
        },
        {
          $addFields: {
            vendor: { $arrayElemAt: ["$vendorData", 0] },
          },
        },
        {
          $addFields: {
            vendorName: {
              $ifNull: ["$vendor.businessName", "$vendor.name"],
            },
            vendorPlan: {
              $ifNull: ["$vendor.subscriptionPlan", "free"],
            },
          },
        },
        { $limit: 1 },
      ])
      .toArray();

    if (!docs.length) {
      return null;
    }

    const item = docs[0];
    if (item.status !== "approved") {
      return null;
    }

    return formatDocToMenuItem(item as Record<string, unknown>);
  } catch (err) {
    console.error("Direct MongoDB fallback failed for menu item by ID:", err);
    return null;
  }
}
