import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  const isLocalDev =
    process.env.NODE_ENV !== "production" &&
    (request.nextUrl.hostname === "localhost" || request.nextUrl.hostname === "127.0.0.1");

  const isSecure = process.env.NODE_ENV === "production" && !isLocalDev;

  response.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
