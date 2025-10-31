import { create } from "zustand";
import { CartItem } from "@/types/types";
import { fetchCartItems, addToCart as addToCartAPI } from "@/api/cart";

interface CartState {
  items: CartItem[];
  selectedItems: Set<number>;
  setItems: (items: CartItem[]) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  toggleItemSelection: (itemId: number) => void;
  toggleAllSelection: (checked: boolean) => void;
  initializeCart: () => Promise<void>;
  addToCart: (
    menuId: number,
    quantity: number,
    menuItem: { name: string; price: number; image: string }
  ) => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  selectedItems: new Set<number>(),

  setItems: (items: CartItem[]) => {
    set({ items });
  },

  updateQuantity: (itemId: number, quantity: number) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      ),
    }));
  },

  toggleItemSelection: (itemId: number) => {
    set((state) => {
      const newSelected = new Set(state.selectedItems);
      if (newSelected.has(itemId)) {
        newSelected.delete(itemId);
      } else {
        newSelected.add(itemId);
      }
      return { selectedItems: newSelected };
    });
  },

  toggleAllSelection: (checked: boolean) => {
    set((state) => {
      if (checked) {
        const allIds = new Set(state.items.map((item) => item.id));
        return { selectedItems: allIds };
      } else {
        return { selectedItems: new Set<number>() };
      }
    });
  },

  initializeCart: async () => {
    try {
      const cartItems = await fetchCartItems();
      // Transform API response to CartItem format
      // Only update if we have items from API, otherwise preserve existing items
      if (cartItems && cartItems.length > 0) {
        const items: CartItem[] = cartItems.map((item: any, index: number) => ({
          id: item.id || index + 1,
          menuId: item.menuId || item.menuItem?.id || 0,
          name: item.name || item.menuItem?.name || "",
          price: item.price || item.menuItem?.price || 0,
          quantity: item.quantity || 1,
          image: item.image || item.menuItem?.image || "",
        }));
        set({ items });
      }
      // If API returns empty but we have local items, keep them
      // This handles the case where cart is managed client-side
    } catch (error) {
      console.error("Failed to initialize cart:", error);
      // Don't clear items on error - preserve existing cart state
      // set({ items: [] });
    }
  },

  addToCart: async (
    menuId: number,
    quantity: number,
    menuItem: { name: string; price: number; image: string }
  ) => {
    try {
      const response = await addToCartAPI(menuId, quantity);
      
      // If API returns updated cart, use it to sync state
      if (response?.data?.cart?.items && response.data.cart.items.length > 0) {
        const items: CartItem[] = response.data.cart.items.map((item: any, index: number) => ({
          id: item.id || index + 1,
          menuId: item.menuId || menuId,
          name: item.name || menuItem.name,
          price: item.price || menuItem.price,
          quantity: item.quantity || quantity,
          image: item.image || menuItem.image,
        }));
        set({ items });
      } else {
        // Fallback: Update local state if API doesn't return cart
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.menuId === menuId
          );

          if (existingItemIndex !== -1) {
            // Item exists, update quantity
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: updatedItems[existingItemIndex].quantity + quantity,
            };
            return { items: updatedItems };
          } else {
            // New item, add to cart
            const newItem: CartItem = {
              id: Date.now(), // Temporary ID
              menuId,
              name: menuItem.name,
              price: menuItem.price,
              quantity,
              image: menuItem.image,
            };
            return { items: [...state.items, newItem] };
          }
        });
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
      throw error;
    }
  },
}));
