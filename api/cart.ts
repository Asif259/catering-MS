import { localStorageService } from "@/services/localStorage";

// add to cart
export const addToCart = async (menuId: number, quantity: number) => {
  try {
    await localStorageService.addToCart(menuId, quantity);
    return { success: true }; 
  } catch (error) {
    console.error("Failed to add item to cart:", error);
    throw new Error("Failed to add item to cart");
  }
};

// fetch cart items
export const fetchCartItems = async () => {
  try {
    const cart = await localStorageService.getCart();
    return cart.items || [];
  } catch (error) {
    console.error("Failed to fetch cart:", error);
    return [];
  }
};

// update cart items
export const updateCartQuantity = async (menuId: number, quantity: number) => {
  try {
    await localStorageService.updateCartQuantity(menuId, quantity);
  } catch (error) {
    console.error("Failed to update quantity:", error);
    throw new Error("Failed to update cart");
  }
};

// remove cart items
export const removeCartItem = async (cartItemId: number) => {
  try {
    await localStorageService.removeCartItem(cartItemId);
  } catch (error) {
    console.error("Failed to remove item:", error);
    throw new Error("Failed to remove item from cart");
  }
};

// clear cart
export const clearCart = async () => {
  try {
    await localStorageService.clearCart();
  } catch (error) {
    console.error("Failed to clear cart:", error);
    throw new Error("Failed to clear cart");
  }
};

// place order
export const order = async (
  orderItems: { menuItemId: number; quantity: number; price: number }[]
) => {
  try {
    // Map the input to the expected OrderItem type if needed, or just pass it if compatible
    // OrderItem in types.ts: { menuItemId, quantity, price, total }
    // The input has menuItemId, quantity, price. We need to calculate total.
    const items = orderItems.map(item => ({
      ...item,
      total: item.price * item.quantity
    }));
    
    const response = await localStorageService.createOrder(items);
    return { data: response }; // Return in a structure that might be expected by the caller
  } catch (error: any) {
    throw new Error(error.message || "Failed to place order");
  }
};

