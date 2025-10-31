import { NextResponse } from 'next/server';
import { removeCartItem } from '@/lib/cart-storage';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { cartItemId } = body;

    // cartItemId should be the menuId based on the cart structure
    const success = removeCartItem(cartItemId);
    if (!success) {
      return new NextResponse('Item not found in cart', { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return new NextResponse('Error removing item from cart', { status: 500 });
  }
} 