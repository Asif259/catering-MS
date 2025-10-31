import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// In a real app, this would be in a database
let orders: any[] = [];

export async function GET() {
  try {
    return NextResponse.json({ 
      message: 'Orders are managed client-side'
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Error fetching orders' }), 
      { status: 500 }
    );
  }
} 