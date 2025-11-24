import { localStorageService } from "@/services/localStorage";

export const fetchOrders = async () => {
  try {
    const orders = await localStorageService.getOrders();
    return orders; // The original code returned response.data.orders. 
    // If getOrders returns the array of orders, we are good.
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    throw new Error("Failed to fetch orders");
  }
};