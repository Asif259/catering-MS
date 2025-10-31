import { NextResponse } from 'next/server';
import { clearCartStorage } from '@/lib/cart-storage';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function DELETE() {
  try {
    clearCartStorage();
    return NextResponse.json({ 
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return new NextResponse('Error clearing cart', { status: 500 });
  }
} 