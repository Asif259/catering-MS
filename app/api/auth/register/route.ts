import { NextResponse } from "next/server";
import { users } from "../users";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    const existing = users.find((u) => u.email === email);
    if (existing) {
      return NextResponse.json(
        { message: "Email already exists." },
        { status: 400 }
      );
    }

    // Store user as verified (no OTP verification needed)
    users.push({ name, email, password, verified: true });

    return NextResponse.json({
      message: "Registration successful. You can now sign in.",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { message: "Failed to register." },
      { status: 500 }
    );
  }
}
