import { NextResponse } from 'next/server';
import { MenuItem } from '@/types/types';
import { addToCartStorage, getCartItemsForAPI } from '@/lib/cart-storage';

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Breakfast Buffet",
    description: "Start your day with our delicious breakfast buffet featuring fresh pastries, eggs, fruits, and more.",
    price: 25.99,
    category: "Buffet",
    available: true,
    image: "breakfastBuffet.jpeg"
  },
  {
    id: 2,
    name: "High Tea Package",
    description: "Elegant high tea service with assorted sandwiches, scones, and premium teas.",
    price: 35.99,
    category: "Packages",
    available: true,
    image: "HighTea.jpg"
  },
  {
    id: 3,
    name: "Family Dinner Package",
    description: "Perfect for family gatherings, includes main course, sides, and dessert.",
    price: 89.99,
    category: "Packages",
    available: true,
    image: "familyDinner.jpeg"
  },
  {
    id: 4,
    name: "Corporate Lunch Box",
    description: "Individual packed lunches perfect for business meetings and events.",
    price: 15.99,
    category: "Corporate",
    available: true,
    image: "corporateLunchBox.jpeg"
  },
  {
    id: 5,
    name: "Wedding Buffet",
    description: "Comprehensive wedding catering package with customizable menu options.",
    price: 75.99,
    category: "Events",
    available: true,
    image: "weedingBuffet.jpg"
  },
  {
    id: 6,
    name: "Appetizer Platter",
    description: "Selection of gourmet appetizers perfect for cocktail parties.",
    price: 45.99,
    category: "Platters",
    available: true,
    image: "appetizerPlatter.jpeg"
  },
  {
    id: 7,
    name: "Kids Party Package",
    description: "Fun and tasty menu options designed for children's parties.",
    price: 18.99,
    category: "Packages",
    available: true,
    image: "kidsPartyPackage.webp"
  },
  {
    id: 8,
    name: "BBQ Package",
    description: "Complete BBQ setup with grilled meats and sides.",
    price: 55.99,
    category: "Packages",
    available: true,
    image: "BBQpackage.jpeg"
  },
  {
    id: 9,
    name: "Vegetarian Platter",
    description: "Assorted vegetarian dishes perfect for any occasion.",
    price: 42.99,
    category: "Platters",
    available: true,
    image: "vageterianPlatter.jpg"
  },
  {
    id: 10,
    name: "Traditional Thali",
    description: "Complete Indian thali with variety of dishes.",
    price: 32.99,
    category: "Special",
    available: true,
    image: "tradionalThali.png"
  },
  {
    id: 11,
    name: "Premium Beverage Package",
    description: "Selection of premium beverages for events.",
    price: 28.99,
    category: "Beverages",
    available: true,
    image: "PremiumBaverage.jpg"
  },
  {
    id: 12,
    name: "Student Meal Package",
    description: "Affordable meal packages for student events.",
    price: 12.99,
    category: "Packages",
    available: true,
    image: "studentmeal.jpeg"
  }
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { menuId, quantity } = body;

    // Find the menu item
    const menuItem = menuItems.find(item => item.id === menuId);
    if (!menuItem) {
      return new NextResponse(
        JSON.stringify({ message: 'Menu item not found' }), 
        { status: 404 }
      );
    }

    // Add item to cart storage
    addToCartStorage(menuItem, quantity);

    // Return success response with the updated cart
    return NextResponse.json({ 
      message: 'Item added to cart successfully',
      cart: {
        items: getCartItemsForAPI()
      }
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Error adding to cart' }), 
      { status: 500 }
    );
  }
} 