import { cache } from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { ROLE_DASHBOARD_ROUTES } from "@/lib/constants";
import type { User, UserRole } from "@/types";

export interface AppSession {
  user: User;
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    token: string;
    createdAt: Date;
    updatedAt: Date;
    ipAddress?: string | null;
    userAgent?: string | null;
  };
}

export const getServerSession = cache(async function getServerSession(): Promise<AppSession | null> {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({
      headers: reqHeaders,
    });

    if (!session?.user) {
      return null;
    }

    return session as unknown as AppSession;
  } catch {
    return null;
  }
});

export async function requireAuthRole(
  allowedRoles?: UserRole[],
  callbackUrl: string = "/dashboard"
): Promise<User> {
  const session = await getServerSession();

  if (!session?.user) {
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  if (session.user.isBlocked) {
    redirect("/sign-in?error=blocked");
  }

  const userRole: UserRole =
    session.user.role === "vendor" || session.user.role === "admin"
      ? session.user.role
      : "customer";

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    redirect(ROLE_DASHBOARD_ROUTES[userRole] || "/dashboard/customer");
  }

  return session.user;
}

export const getServerToken = cache(async function getServerToken(): Promise<string | null> {
  try {
    const reqHeaders = await headers();
    const result = await auth.api.getToken({ headers: reqHeaders });
    return result?.token ?? null;
  } catch {
    return null;
  }
});

