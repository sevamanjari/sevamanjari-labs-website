import { NextRequest, NextResponse } from "next/server";
import { getAllEnquiries, updateEnquiryStatus, deleteEnquiry } from "@/lib/db";
import { verifySessionToken, COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized official access required." },
        { status: 401 }
      );
    }

    const enquiries = await getAllEnquiries();
    return NextResponse.json({ success: true, data: enquiries });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch enquiries" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized official access required." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: "ID and status are required" },
        { status: 400 }
      );
    }

    const success = await updateEnquiryStatus(id, status);
    if (!success) {
      return NextResponse.json(
        { success: false, message: "Enquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Status updated" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update status" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized official access required." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 }
      );
    }

    const deleted = await deleteEnquiry(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Enquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Enquiry deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete enquiry" },
      { status: 500 }
    );
  }
}
