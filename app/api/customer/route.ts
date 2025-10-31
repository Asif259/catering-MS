import { NextResponse } from 'next/server';
import { users } from '../auth/users';

// In a real app, this would be in a database
// Customers are created dynamically from registered users
const customers: Array<{
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  orders: any[];
}> = [];

// Helper to get or create customer from user
function getOrCreateCustomer(email: string, name: string) {
  let customer = customers.find(c => c.email === email);
  if (!customer) {
    customer = {
      id: customers.length + 1,
      name,
      email,
      phone: "",
      address: "",
      orders: []
    };
    customers.push(customer);
  }
  return customer;
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    // Get email from query parameter
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    // Find the user by email (check both verified and unverified for demo)
    let user = users.find(u => u.email === email && u.verified);
    
    // If not found in verified users, check all users (for demo purposes)
    if (!user) {
      user = users.find(u => u.email === email);
    }

    // If still not found, create a basic customer entry (for demo - user might be from client-side auth)
    if (!user) {
      // Extract name from email (or use a default)
      const nameFromEmail = email.split('@')[0];
      const customer = getOrCreateCustomer(email, nameFromEmail);
      return NextResponse.json(customer);
    }

    // Get or create customer for this user
    const customer = getOrCreateCustomer(email, user.name);

    return NextResponse.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json({ message: 'Error fetching customer data' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const data = await request.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const customer = customers.find(c => c.email === email);
    if (!customer) {
      return NextResponse.json({ message: 'Customer not found' }, { status: 404 });
    }

    // Update customer data
    if (data.name) customer.name = data.name;
    if (data.phone !== undefined) customer.phone = data.phone;
    if (data.address !== undefined) customer.address = data.address;

    return NextResponse.json(customer);
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json({ message: 'Error updating customer data' }, { status: 500 });
  }
} 