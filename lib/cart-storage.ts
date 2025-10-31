import { MenuItem } from '@/types/types';

// Shared cart storage for API routes
// In a real app, this would be in a database
let cart: { items: Array<{ menuItem: MenuItem; quantity: number }> } = {
  items: []
};

export function getCart() {
  return cart;
}

export function addToCartStorage(menuItem: MenuItem, quantity: number) {
  const existingItemIndex = cart.items.findIndex(
    item => item.menuItem.id === menuItem.id
  );

  if (existingItemIndex !== -1) {
    // Update quantity if item exists
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item to cart
    cart.items.push({
      menuItem,
      quantity
    });
  }
}

export function updateCartItemQuantity(menuId: number, quantity: number) {
  const itemIndex = cart.items.findIndex(item => item.menuItem.id === menuId);
  if (itemIndex === -1) {
    return false;
  }

  if (quantity <= 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = quantity;
  }
  return true;
}

export function removeCartItem(menuId: number) {
  const itemIndex = cart.items.findIndex(item => item.menuItem.id === menuId);
  if (itemIndex !== -1) {
    cart.items.splice(itemIndex, 1);
    return true;
  }
  return false;
}

export function clearCartStorage() {
  cart.items = [];
}

export function getCartItemsForAPI() {
  return cart.items.map((item, index) => ({
    id: index + 1,
    menuId: item.menuItem.id,
    name: item.menuItem.name,
    price: item.menuItem.price,
    quantity: item.quantity,
    image: item.menuItem.image
  }));
}

