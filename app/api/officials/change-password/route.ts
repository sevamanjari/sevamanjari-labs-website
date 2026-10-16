import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import { OfficialModel } from "@/models/Official";
import { verifySessionToken, COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;

    if (!session || !session.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please log in again." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const currentPassword = String(body.currentPassword || "").trim();
    const newPassword = String(body.newPassword || "").trim();
    const confirmPassword = String(body.confirmPassword || "").trim();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Current password and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "New password and confirmation do not match." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const official = await OfficialModel.findOne({ email: session.email.toLowerCase() });

    if (!official || !official.passwordHash) {
      return NextResponse.json(
        { success: false, message: "Official account not found in database." },
        { status: 404 }
      );
    }

    // Verify current password
    const isCurrentValid = await bcrypt.compare(currentPassword, official.passwordHash);
    if (!isCurrentValid) {
      return NextResponse.json(
        { success: false, message: "Incorrect current password." },
        { status: 400 }
      );
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    official.passwordHash = newPasswordHash;
    await official.save();

    return NextResponse.json({
      success: true,
      message: "Password updated successfully! Use your new password on your next login.",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while updating the password." },
      { status: 500 }
    );
  }
}
