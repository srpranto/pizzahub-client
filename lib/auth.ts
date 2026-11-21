import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { db } from "./db";

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    usePlural: true,
  }),
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "default_pizzahub_better_auth_secret_key_1234567890",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "mock_client_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock_client_secret",
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "customer",
        required: false,
        input: true,
      },
      businessName: {
        type: "string",
        required: false,
        input: true,
      },
      isBlocked: {
        type: "boolean",
        defaultValue: false,
        required: false,
        input: false,
      },
      subscriptionPlan: {
        type: "string",
        defaultValue: "free",
        required: false,
        input: false,
      },
      subscriptionExpiresAt: {
        type: "date",
        required: false,
        input: false,
      },
      favoriteItemIds: {
        type: "string[]",
        required: false,
        input: false,
      },
    },
  },
  plugins: [
    jwt(),
  ],
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Public registration can only create customer or vendor accounts
          const safeRole = user.role === "vendor" ? "vendor" : "customer";
          return {
            data: {
              ...user,
              role: safeRole,
            },
          };
        },
      },
    },
  },
});
