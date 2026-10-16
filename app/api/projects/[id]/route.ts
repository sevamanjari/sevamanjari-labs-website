import { NextRequest, NextResponse } from "next/server";
import { updateProject, deleteProject } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const tags = Array.isArray(body.tags)
      ? body.tags
      : typeof body.tags === "string"
      ? body.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
      : undefined;

    const updated = await updateProject(id, {
      ...body,
      ...(tags !== undefined ? { tags } : {}),
      ...(body.featured !== undefined ? { featured: Boolean(body.featured) } : {}),
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update project" },
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
    const deleted = await deleteProject(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete project" },
      { status: 500 }
    );
  }
}
