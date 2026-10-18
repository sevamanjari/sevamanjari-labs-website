import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "sevamanjari_admin_session";
const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "sevamanjari-super-secure-official-jwt-secret-key-2026"
);

function getPublicOrigin(request: NextRequest): string {
  // 1. Explicit configured domain
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL;
  if (appUrl) {
    return appUrl.replace(/\/$/, "");
  }

  // 2. Forwarded host from Nginx / reverse proxy
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
  if (forwardedHost && !forwardedHost.includes("localhost") && !forwardedHost.includes("127.0.0.1")) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  // 3. Host header
  const host = request.headers.get("host");
  if (host && !host.includes("localhost") && !host.includes("127.0.0.1")) {
    const proto =
      request.headers.get("x-forwarded-proto") ||
      (request.nextUrl.protocol ? request.nextUrl.protocol.replace(":", "") : "https");
    return `${proto}://${host}`;
  }

  // 4. In production when reverse proxy passes to internal port (e.g. localhost:3100)
  if (process.env.NODE_ENV === "production") {
    return "https://sevamanjarilabs.in";
  }

  // 5. Local development fallback
  const localUrl = request.nextUrl.clone();
  localUrl.protocol = "http:";
  return localUrl.origin;
}

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

  // Helper to safely build redirect URL preserving the public domain (never localhost in production)
  const createSafeRedirectUrl = (targetPath: string) => {
    const origin = getPublicOrigin(request);
    return new URL(targetPath, origin);
  };

  // 1. If accessing login page while already authenticated -> redirect to /dashboard
  const isLoginPage = pathname === "/login" || pathname === "/login/";
  if (isLoginPage) {
    if (isAuthenticated) {
      const dashboardUrl = createSafeRedirectUrl("/dashboard");
      dashboardUrl.search = "";
      return NextResponse.redirect(dashboardUrl);
    }
    return NextResponse.next();
  }

  // 2. Protect /dashboard and /admin routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      const loginUrl = createSafeRedirectUrl("/login");
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
    "/login/:path*",
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
