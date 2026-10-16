import { NextRequest, NextResponse } from "next/server";
import { getAllJobs, createJob } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const jobs = await getAllJobs();
    return NextResponse.json({ success: true, data: jobs });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.title || !body.department) {
      return NextResponse.json(
        { success: false, message: "Title and department are required." },
        { status: 400 }
      );
    }

    const newJob = await createJob({
      title: body.title,
      department: body.department,
      location: body.location || "Remote",
      type: body.type || "Full-time",
      experience: body.experience || "Not specified",
      status: body.status || "active",
      description: body.description || "",
      requirements: Array.isArray(body.requirements)
        ? body.requirements
        : typeof body.requirements === "string"
        ? body.requirements.split("\n").map((r: string) => r.trim()).filter(Boolean)
        : [],
    });

    return NextResponse.json({ success: true, data: newJob }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to create job vacancy" },
      { status: 500 }
    );
  }
}
