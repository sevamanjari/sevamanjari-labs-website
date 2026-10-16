import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "sevamanjari_admin_session";
const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "sevamanjari-super-secure-official-jwt-secret-key-2026"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  let isAuthenticated = false;

  if (token) {
    try {
      await jwtVerify(token, SECRET_KEY);
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  // 1. If accessing login page while already authenticated -> redirect to /dashboard
  if (pathname === "/login") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // 2. Protect /dashboard and /admin routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 3. Protect officials API, customer enquiries, and mutating admin API routes
  const isOfficialsApi = pathname.startsWith("/api/officials");
  const isEnquiriesApi = pathname.startsWith("/api/enquiries");
  const isApplicationsAdminApi =
    pathname.startsWith("/api/applications") && ["GET", "PATCH", "DELETE"].includes(request.method);
  const isProtectedAdminApi =
    (pathname.startsWith("/api/jobs") ||
      pathname.startsWith("/api/projects") ||
      pathname.startsWith("/api/settings")) &&
    ["POST", "PUT", "DELETE", "PATCH"].includes(request.method);

  if (
    (isOfficialsApi || isEnquiriesApi || isApplicationsAdminApi || isProtectedAdminApi) &&
    !isAuthenticated
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized: Company official access required.",
      },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/api/jobs",
    "/api/jobs/:path*",
    "/api/projects",
    "/api/projects/:path*",
    "/api/enquiries",
    "/api/enquiries/:path*",
    "/api/settings",
    "/api/settings/:path*",
    "/api/officials",
    "/api/officials/:path*",
    "/api/applications",
    "/api/applications/:path*",
  ],
};
