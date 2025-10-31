import { NextResponse } from "next/server";
import { otpStore } from "../otp-store";

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();
    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP are required." },
        { status: 400 }
      );
    }

    const record = otpStore[email];
    if (!record) {
      return NextResponse.json(
        { message: "No OTP found for this email." },
        { status: 400 }
      );
    }
    if (Date.now() > record.expires) {
      delete otpStore[email];
      return NextResponse.json({ message: "OTP expired." }, { status: 400 });
    }
    if (record.otp !== otp) {
      return NextResponse.json({ message: "Invalid OTP." }, { status: 400 });
    }

    // OTP is valid
    delete otpStore[email]; // Invalidate OTP after use
    return NextResponse.json({ message: "OTP verified successfully." });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { message: "Failed to verify OTP." },
      { status: 500 }
    );
  }
}
