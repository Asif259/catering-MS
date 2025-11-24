import { localStorageService } from "@/services/localStorage";

export const fetchCustomerData = async (email: string) => {
  try {
    const customer = await localStorageService.getCustomer(email);
    return customer;
  } catch (error) {
    console.error("Failed to fetch customer data:", error);
    throw new Error("Failed to fetch customer data");
  }
};

export const updateCustomerData = async (email: string, data: any) => {
  try {
    const customer = await localStorageService.updateCustomer(email, data);
    return customer;
  } catch (error) {
    console.error("Failed to update customer data:", error);
    throw new Error("Failed to update customer data");
  }
};