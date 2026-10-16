import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import { OfficialModel } from "@/models/Official";
import { verifySessionToken, COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";

// List all company officials
export async function GET() {
  try {
    await connectToDatabase();
    const officials = await OfficialModel.find({}, { passwordHash: 0 })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: officials.map((o: any) => ({
        id: o._id?.toString(),
        email: o.email,
        name: o.name || "Company Official",
        role: o.role || "official",
        createdAt: o.createdAt ? new Date(o.createdAt).toISOString() : new Date().toISOString(),
      })),
    });
  } catch (error) {
    console.error("Failed to fetch officials:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch officials list" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden: Only administrators can add officials." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const email = body.email ? String(body.email).trim().toLowerCase() : "";
    const password = body.password ? String(body.password).trim() : "";
    const name = body.name ? String(body.name).trim() : "Company Official";
    const role = body.role === "admin" ? "admin" : "official";

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if email already registered
    const existing = await OfficialModel.findOne({ email }).lean();
    if (existing) {
      return NextResponse.json(
        { success: false, message: "An official with this email already exists." },
        { status: 409 }
      );
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newOfficial = await OfficialModel.create({
      email,
      passwordHash,
      name,
      role,
    });

    return NextResponse.json(
      {
        success: true,
        message: "New company official added successfully.",
        data: {
          id: newOfficial._id?.toString(),
          email: newOfficial.email,
          name: newOfficial.name,
          role: newOfficial.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating official:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create official account." },
      { status: 500 }
    );
  }
}

// Remove an official
export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden: Only administrators can remove officials." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const emailToDelete = searchParams.get("email")?.toLowerCase().trim();

    if (!emailToDelete) {
      return NextResponse.json(
        { success: false, message: "Email is required to remove official." },
        { status: 400 }
      );
    }

    // Prevent self-deletion
    if (session && session.email.toLowerCase() === emailToDelete) {
      return NextResponse.json(
        { success: false, message: "You cannot delete your own active official account." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const count = await OfficialModel.countDocuments();
    if (count <= 1) {
      return NextResponse.json(
        { success: false, message: "Cannot delete the sole official account." },
        { status: 400 }
      );
    }

    const res = await OfficialModel.deleteOne({ email: emailToDelete });

    if (res.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Official account not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Official ${emailToDelete} removed successfully.`,
    });
  } catch (error) {
    console.error("Error deleting official:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete official account." },
      { status: 500 }
    );
  }
}
