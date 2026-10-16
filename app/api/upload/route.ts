import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";

const ALLOWED_EXTENSIONS = new Set([".pdf", ".doc", ".docx"]);
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    const isAllowed = checkRateLimit(`upload_${clientIp}`, 10, 10 * 60 * 1000);
    if (!isAllowed) {
      return NextResponse.json(
        { success: false, message: "Too many upload attempts. Please wait a few minutes." },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file was uploaded." },
        { status: 400 }
      );
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: "File size exceeds the 10MB limit." },
        { status: 400 }
      );
    }

    // Validate file extension
    const originalName = file.name || "resume.pdf";
    const ext = path.extname(originalName).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { success: false, message: "Only PDF, DOC, or DOCX documents are allowed." },
        { status: 400 }
      );
    }

    // Target upload folder strictly confined within our project directory
    const uploadDir = path.join(process.cwd(), "public", "uploads", "resumes");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Sanitize filename to avoid collisions or path traversal
    const baseName = path
      .basename(originalName, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 30);
    const uniqueFileName = `resume_${Date.now()}_${baseName || "doc"}${ext}`;
    const destinationPath = path.join(uploadDir, uniqueFileName);

    // Write file to disk within workspace directory
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.promises.writeFile(destinationPath, buffer);

    const publicUrl = `/uploads/resumes/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: originalName,
      fileSize: file.size,
    });
  } catch (error: any) {
    console.error("Resume file upload error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while uploading the file." },
      { status: 500 }
    );
  }
}
