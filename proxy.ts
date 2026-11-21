import { NextResponse, type NextRequest } from "next/server";

export default function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/payment") ||
    (pathname.startsWith("/menu/") && pathname !== "/menu");

  if (!isProtected) {
    return NextResponse.next();
  }

  const sessionCookie =
    request.cookies.get("better-auth.session_token") ??
    request.cookies.get("__Secure-better-auth.session_token") ??
    request.cookies.get("better-auth.session_data") ??
    request.cookies.get("__Secure-better-auth.session_data") ??
    request.cookies.get("better-auth_session_token") ??
    request.cookies.get("__Secure-better-auth_session_token");

  if (!sessionCookie?.value) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/profile",
    "/profile/:path*",
    "/payment",
    "/payment/:path*",
    "/menu/:id*",
  ],
};
