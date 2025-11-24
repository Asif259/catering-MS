import { localStorageService } from "@/services/localStorage";

// Fetch menu data
export const fetchMenuData = async () => {
  try {
    const menu = await localStorageService.getMenu();
    return menu;
  } catch (err: any) {
    throw new Error(err.message || "Failed to fetch menu data");
  }
};

// Search menu items
export const searchMenuItems = async (searchTerm: string) => {
  try {
    const menu = await localStorageService.searchMenu(searchTerm);
    return menu;

  } catch (err: any) {
    throw new Error(
      err.message || "Error searching menu items"
    );
  }
};

export default localStorageService; // Exporting service instead of axios instance if needed, or just remove default export

