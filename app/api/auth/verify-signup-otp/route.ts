import { NextResponse } from 'next/server';
import { otpStore } from '../send-otp/route';
import { users } from '../register/route';

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();
    if (!email || !otp) {
      return NextResponse.json({ message: 'Email and OTP are required.' }, { status: 400 });
    }
    
    const record = otpStore[email];
    if (!record) {
      return NextResponse.json({ message: 'No OTP found for this email.' }, { status: 400 });
    }
    if (Date.now() > record.expires) {
      delete otpStore[email];
      return NextResponse.json({ message: 'OTP expired.' }, { status: 400 });
    }
    if (record.otp !== otp) {
      return NextResponse.json({ message: 'Invalid OTP.' }, { status: 400 });
    }
    
    // Mark user as verified
    const user = users.find((u) => u.email === email);
    if (user) user.verified = true;
    delete otpStore[email];
    
    return NextResponse.json({ message: 'Signup OTP verified. Account activated.' });
  } catch (error) {
    console.error('Error verifying signup OTP:', error);
    return NextResponse.json({ message: 'Failed to verify signup OTP.' }, { status: 500 });
  }
} 