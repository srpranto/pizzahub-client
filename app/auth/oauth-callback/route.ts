import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ROLE_DASHBOARD_ROUTES } from "@/lib/constants";
import type { UserRole } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const pendingRole = cookieStore.get("pizzahub_oauth_role")?.value;
  const searchParams = request.nextUrl.searchParams;
  const callbackUrl = searchParams.get("callbackUrl");

  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({
      headers: reqHeaders,
    });

    if (!session?.user) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    let userRole = (session.user as { role?: string }).role || "customer";

    // Determine target role: prioritize pendingRole, resolve legacy "user" role
    let targetRole: UserRole | null = null;
    if (pendingRole === "vendor" || pendingRole === "customer") {
      targetRole = pendingRole;
    } else if (userRole === "user" || !userRole) {
      targetRole = "customer";
    }

    if (targetRole && userRole !== targetRole) {
      const usersCollection = db.collection("users");

      const userId = session.user.id;
      const filter = ObjectId.isValid(userId)
        ? { _id: new ObjectId(userId) }
        : { id: userId };

      await usersCollection.updateOne(filter, { $set: { role: targetRole } });
      userRole = targetRole;
    }

    let redirectTarget = "/dashboard";
    if (callbackUrl && callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")) {
      redirectTarget = callbackUrl;
    } else {
      redirectTarget =
        ROLE_DASHBOARD_ROUTES[userRole as UserRole] || "/dashboard/customer";
    }

    const response = NextResponse.redirect(new URL(redirectTarget, request.url));
    response.cookies.delete("pizzahub_oauth_role");
    return response;
  } catch (err) {
    console.error("OAuth callback error:", err);
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
}
