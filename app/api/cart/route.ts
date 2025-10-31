import { NextResponse } from 'next/server';
import { getCartItemsForAPI } from '@/lib/cart-storage';

export async function GET() {
  // Return the cart items in the format expected by the frontend
  return NextResponse.json({ 
    cart: {
      items: getCartItemsForAPI()
    }
  });
} 