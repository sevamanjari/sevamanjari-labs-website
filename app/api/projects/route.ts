import { NextRequest, NextResponse } from "next/server";
import { getAllProjects, createProject } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const projects = await getAllProjects();
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.title) {
      return NextResponse.json(
        { success: false, message: "Project title is required." },
        { status: 400 }
      );
    }

    const newProject = await createProject({
      title: body.title,
      category: body.category || "General",
      client: body.client || "Internal",
      status: body.status || "In Development",
      summary: body.summary || "",
      tags: Array.isArray(body.tags)
        ? body.tags
        : typeof body.tags === "string"
        ? body.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
        : [],
      link: body.link || "",
      featured: Boolean(body.featured),
    });

    return NextResponse.json({ success: true, data: newProject }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to create project" },
      { status: 500 }
    );
  }
}
