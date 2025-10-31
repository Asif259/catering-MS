import { NextResponse } from 'next/server';
import { otpStore } from '../send-otp/route';
import { users } from '../users';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    if (!name || !email || !password) {
      return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }
    
    const existing = users.find((u) => u.email === email);
    if (existing) {
      return NextResponse.json({ message: 'Email already exists.' }, { status: 400 });
    }
    
    // Store user as unverified
    users.push({ name, email, password, verified: false });
    
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000;
    otpStore[email] = { otp, expires };
    
    // For demo purposes, log the OTP
    console.log(`Registration OTP for ${email}: ${otp}`);
    
    return NextResponse.json({ message: 'Registration successful. OTP sent to email.' });
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json({ message: 'Failed to register.' }, { status: 500 });
  }
} 