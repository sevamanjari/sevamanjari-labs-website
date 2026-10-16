import { NextRequest, NextResponse } from "next/server";
import { updateJob, deleteJob } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const requirements = Array.isArray(body.requirements)
      ? body.requirements
      : typeof body.requirements === "string"
      ? body.requirements.split("\n").map((r: string) => r.trim()).filter(Boolean)
      : undefined;

    const updated = await updateJob(id, {
      ...body,
      ...(requirements !== undefined ? { requirements } : {}),
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Job not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update job" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteJob(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Job not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete job" },
      { status: 500 }
    );
  }
}
