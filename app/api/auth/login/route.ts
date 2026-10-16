import { NextRequest, NextResponse } from "next/server";
import { authenticateOfficial, createSessionToken, COOKIE_NAME } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    const isAllowed = checkRateLimit(`login_${clientIp}`, 10, 10 * 60 * 1000);
    if (!isAllowed) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many login attempts. Please wait a few minutes before trying again.",
        },
        { status: 429 }
      );
    }
    let email = "";
    let password = "";

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await request.json().catch(() => ({}));
      email = String(body.email || "").trim();
      password = String(body.password || "").trim();
    } else {
      const formData = await request.formData().catch(() => null);
      if (formData) {
        email = String(formData.get("email") || "").trim();
        password = String(formData.get("password") || "").trim();
      }
    }

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    const official = await authenticateOfficial(email, password);

    if (!official) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const token = await createSessionToken(official);

    const response = NextResponse.json({
      success: true,
      message: "Authentication successful",
      official,
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login route error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
