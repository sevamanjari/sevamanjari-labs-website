import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();
    const company = String(body.company || "").trim();
    const subject = String(body.subject || "").trim();
    const message = String(body.message || "").trim();

    // Basic validation
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { message: "Name, email, phone number and message are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Basic length protection
    if (
      name.length > 100 ||
      email.length > 254 ||
      phone.length > 30 ||
      company.length > 150 ||
      subject.length > 200 ||
      message.length > 5000
    ) {
      return NextResponse.json(
        { message: "One or more fields are too long." },
        { status: 400 }
      );
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error("SMTP credentials are not configured.");

      return NextResponse.json(
        { message: "Email service is temporarily unavailable." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtpout.secureserver.net",
      port: Number(process.env.SMTP_PORT || 465),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"SevaManjari Labs Website" <${process.env.SMTP_USER}>`,
      to: "info@sevamanjarilabs.in",
      replyTo: email,
      subject: `Website Enquiry: ${subject || "Contact Us"}`,
      text: `
New enquiry received from the SevaManjari Labs website.

Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}
Company: ${company || "Not provided"}
Subject: ${subject || "Not provided"}

Message:
${message}
      `.trim(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thank you. Your enquiry has been sent successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "We couldn't send your enquiry right now. Please try again later.",
      },
      { status: 500 }
    );
  }
}