import api from "@/api/api";

export const fetchCustomerData = async (email: string) => {
  try {
    const response = await api.get(`/customer?email=${encodeURIComponent(email)}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch customer data:", error);
    throw new Error("Failed to fetch customer data");
  }
};

export const updateCustomerData = async (email: string, data: any) => {
  try {
    const response = await api.patch(`/customer?email=${encodeURIComponent(email)}`, data);
    return response.data;
  } catch (error) {
    console.error("Failed to update customer data:", error);
    throw new Error("Failed to update customer data");
  }
}; 