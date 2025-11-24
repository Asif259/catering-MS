import { localStorageService } from "@/services/localStorage";
import { MenuItem } from "@/types/types";

export async function fetchMenuItem(id: string): Promise<MenuItem> {
  try {
    const item = await localStorageService.getMenuItem(parseInt(id));
    if (!item) throw new Error("Menu item not found");
    return item;
  } catch (error) {
    console.error("Failed to fetch menu item:", error);
    throw new Error("Failed to fetch menu item");
  }
}
