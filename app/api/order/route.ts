import { NextResponse } from 'next/server';

// In a real app, this would be in a database
let orders: any[] = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new NextResponse(
        JSON.stringify({ message: 'Invalid order items' }), 
        { status: 400 }
      );
    }

    // Create a new order
    const order = {
      id: Date.now(),
      items: items.map(item => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity
      })),
      status: 'pending',
      createdAt: new Date().toISOString(),
      total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };

    // In a real app, save to database
    orders.push(order);

    return NextResponse.json({ 
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    console.error('Error placing order:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Error placing order' }), 
      { status: 500 }
    );
  }
} 