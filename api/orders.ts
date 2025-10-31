import api from "@/api/api";

export const fetchOrders = async () => {
  try {
    const response = await api.get("/orders");
    return response.data.orders;
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    throw new Error("Failed to fetch orders");
  }
}; 