import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import {
  saveJobApplication,
  getAllJobApplications,
  updateJobApplicationStatus,
  deleteJobApplication,
} from "@/lib/db";
import { verifySessionToken } from "@/lib/auth";

export const runtime = "nodejs";

// GET all applications (Private / Officials only)
export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("sevamanjari_admin_session")?.value;
    const auth = sessionToken ? await verifySessionToken(sessionToken) : null;
    if (!auth) {
      return NextResponse.json(
        { success: false, message: "Unauthorized official access required." },
        { status: 401 }
      );
    }

    const applications = await getAllJobApplications();
    return NextResponse.json({ success: true, data: applications });
  } catch (err: any) {
    console.error("GET /api/applications error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to load job applications" },
      { status: 500 }
    );
  }
}

// POST candidate job application (Public)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const jobId = String(body.jobId || "").trim();
    const jobTitle = String(body.jobTitle || "").trim();
    const department = String(body.department || "Engineering").trim();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();
    const location = String(body.location || "").trim();
    const experience = String(body.experience || "").trim();
    const portfolioUrl = String(body.portfolioUrl || "").trim();
    const resumeUrl = String(body.resumeUrl || "").trim();
    const coverNote = String(body.coverNote || "").trim();

    if (!jobTitle || !name || !email || !phone || !coverNote) {
      return NextResponse.json(
        { success: false, message: "Full Name, Email, Phone, Job Title, and Cover Note are required." },
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

    // Save to Database (MongoDB Atlas)
    const savedApp = await saveJobApplication({
      jobId: jobId || "general",
      jobTitle,
      department,
      name,
      email,
      phone,
      location,
      experience,
      portfolioUrl,
      resumeUrl,
      coverNote,
    });

    // Send Email Notification to Company Officials
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || "smtpout.secureserver.net",
          port: Number(process.env.SMTP_PORT || 465),
          secure: true,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const attachments: Array<{ filename: string; path: string }> = [];
        if (resumeUrl && resumeUrl.startsWith("/uploads/resumes/")) {
          const localFilePath = path.join(process.cwd(), "public", resumeUrl);
          if (fs.existsSync(localFilePath)) {
            attachments.push({
              filename: path.basename(localFilePath),
              path: localFilePath,
            });
          }
        }

        const subjectLine = `New Job Application: ${jobTitle} - ${name}`;

        const emailText = `
New Job Application Received at SevaManjari Labs

=========================================
POSITION & CANDIDATE DETAILS
=========================================
Target Role: ${jobTitle} (${department})
Applicant Name: ${name}
Email Address: ${email}
Phone / WhatsApp: ${phone}
Current Location: ${location || "Not specified"}
Total Experience: ${experience || "Not specified"}

Resume / CV: ${attachments.length > 0 ? "Attached directly to this email (" + resumeUrl + ")" : (resumeUrl || "Not provided")}
Portfolio / GitHub / LinkedIn: ${portfolioUrl || "Not provided"}

=========================================
CANDIDATE COVER NOTE
=========================================
${coverNote}

=========================================
Application ID: ${savedApp.id}
Submitted at: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
Access and manage this application inside the private SevaManjari Labs Management Suite.
        `.trim();

        await transporter.sendMail({
          from: `"SevaManjari Talent Acquisition" <${process.env.SMTP_USER}>`,
          to: "info@sevamanjarilabs.in",
          replyTo: email,
          subject: subjectLine,
          text: emailText,
          attachments: attachments.length > 0 ? attachments : undefined,
        });
      } catch (mailError) {
        console.warn("SMTP job application email warning:", mailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Your application has been received successfully.",
      applicationId: savedApp.id,
    });
  } catch (err: any) {
    console.error("POST /api/applications error:", err);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred while submitting your application." },
      { status: 500 }
    );
  }
}

// PATCH update status (Private / Officials only)
export async function PATCH(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("sevamanjari_admin_session")?.value;
    const auth = sessionToken ? await verifySessionToken(sessionToken) : null;
    if (!auth) {
      return NextResponse.json(
        { success: false, message: "Unauthorized official access required." },
        { status: 401 }
      );
    }

    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, message: "ID and status are required." }, { status: 400 });
    }

    const success = await updateJobApplicationStatus(id, status);
    if (!success) {
      return NextResponse.json({ success: false, message: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `Application status updated to ${status}` });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// DELETE application (Private / Officials only)
export async function DELETE(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("sevamanjari_admin_session")?.value;
    const auth = sessionToken ? await verifySessionToken(sessionToken) : null;
    if (!auth) {
      return NextResponse.json(
        { success: false, message: "Unauthorized official access required." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, message: "Application ID is required." }, { status: 400 });
    }

    const success = await deleteJobApplication(id);
    if (!success) {
      return NextResponse.json({ success: false, message: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Application removed successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
