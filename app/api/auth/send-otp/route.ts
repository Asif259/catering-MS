import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { otpStore } from "../otp-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
    otpStore[email] = { otp, expires };

    // For demo purposes, log the OTP instead of sending email
    console.log(`OTP for ${email}: ${otp}`);

    // Uncomment the following code when you have SMTP credentials
    /*
    // Configure nodemailer
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`,
      html: `<p>Your OTP code is: <b>${otp}</b></p>`,
    });
    */

    return NextResponse.json({ message: "OTP sent successfully." });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json(
      { message: "Failed to send OTP." },
      { status: 500 }
    );
  }
}
