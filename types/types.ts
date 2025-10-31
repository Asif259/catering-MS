export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  image: string;
}

export interface CartItem {
  id: number;
  menuId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderItem {
  menuItemId: number;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: string | number;
  items: OrderItem[];
  status: "pending" | "processing" | "completed" | "cancelled";
  createdAt: string;
  total: number;
}
