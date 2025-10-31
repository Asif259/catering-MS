import { NextResponse } from 'next/server';
import { updateCartItemQuantity } from '@/lib/cart-storage';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { menuId, quantity } = body;

    const success = updateCartItemQuantity(menuId, quantity);
    if (!success) {
      return new NextResponse('Item not found in cart', { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Cart updated successfully'
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    return new NextResponse('Error updating cart', { status: 500 });
  }
}