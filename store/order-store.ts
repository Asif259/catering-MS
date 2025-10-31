import { create } from "zustand";
import { Order } from "@/types/types";
import { fetchOrders } from "@/api/orders";

interface OrderState {
  orders: Order[];
  loadOrders: () => void;
  addOrder: (order: Order) => void;
  cancelOrder: (orderId: string) => Promise<void>;
  updateOrderStatus: (
    orderId: string,
    status: Order["status"]
  ) => Promise<void>;
}

// Initialize orders from localStorage on store creation
const getInitialOrders = (): Order[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("orders");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load orders from localStorage:", e);
  }
  return [];
};

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: getInitialOrders(),

  loadOrders: async () => {
    try {
      const fetchedOrders = await fetchOrders();
      if (fetchedOrders && fetchedOrders.length > 0) {
        set({ orders: fetchedOrders });
        try {
          localStorage.setItem("orders", JSON.stringify(fetchedOrders));
        } catch (e) {
          console.error("Failed to store orders:", e);
        }
      } else {
        // If API returns empty, keep localStorage orders if they exist
        const stored = getInitialOrders();
        if (stored.length > 0) {
          set({ orders: stored });
        }
      }
    } catch (error) {
      console.error("Failed to load orders from API:", error);
      // Try to load from localStorage as fallback
      const stored = getInitialOrders();
      if (stored.length > 0) {
        set({ orders: stored });
      }
    }
  },

  addOrder: (order: Order) => {
    set((state) => {
      const newOrders = [...state.orders, order];
      // Store in localStorage as backup
      try {
        localStorage.setItem("orders", JSON.stringify(newOrders));
      } catch (e) {
        console.error("Failed to store orders:", e);
      }
      return { orders: newOrders };
    });
  },

  cancelOrder: async (orderId: string) => {
    // In a real app, this would call an API
    set((state) => {
      const updatedOrders = state.orders.map((order) =>
        order.id.toString() === orderId
          ? { ...order, status: "cancelled" as const }
          : order
      );
      try {
        localStorage.setItem("orders", JSON.stringify(updatedOrders));
      } catch (e) {
        console.error("Failed to store orders:", e);
      }
      return { orders: updatedOrders };
    });
  },

  updateOrderStatus: async (orderId: string, status: Order["status"]) => {
    // In a real app, this would call an API
    set((state) => {
      const updatedOrders = state.orders.map((order) =>
        order.id.toString() === orderId ? { ...order, status } : order
      );
      try {
        localStorage.setItem("orders", JSON.stringify(updatedOrders));
      } catch (e) {
        console.error("Failed to store orders:", e);
      }
      return { orders: updatedOrders };
    });
  },
}));
