import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
    }

    // For demo purposes, just return success
    // In a real app, you would update the password in the database
    console.log(`Password reset for ${email}: ${password}`);
    
    return NextResponse.json({ message: 'Password reset successfully.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json({ message: 'Failed to reset password.' }, { status: 500 });
  }
} 