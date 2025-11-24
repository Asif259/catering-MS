import { MenuItem, CartItem, Order, OrderItem } from "@/types/types";

const STORAGE_KEYS = {
  MENU: "cms_menu",
  CART: "cms_cart",
  ORDERS: "cms_orders",
  CUSTOMER: "cms_customer",
};

const INITIAL_MENU: MenuItem[] = [
  // Burgers
  {
    id: 1,
    name: "Classic Burger",
    description: "Juicy beef patty with fresh lettuce, tomato, and cheese.",
    price: 12.99,
    category: "Burgers",
    available: true,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=699&q=80",
  },
  {
    id: 2,
    name: "BBQ Bacon Burger",
    description: "Smoky BBQ sauce, crispy bacon, cheddar cheese, and onion rings.",
    price: 15.99,
    category: "Burgers",
    available: true,
    image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 3,
    name: "Veggie Burger",
    description: "Plant-based patty with avocado, sprouts, and special sauce.",
    price: 11.99,
    category: "Burgers",
    available: true,
    image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  
  // Pizza
  {
    id: 4,
    name: "Margherita Pizza",
    description: "Classic pizza with tomato sauce, mozzarella, and basil.",
    price: 14.99,
    category: "Pizza",
    available: true,
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: 5,
    name: "Pepperoni Pizza",
    description: "Loaded with pepperoni, mozzarella, and Italian herbs.",
    price: 16.99,
    category: "Pizza",
    available: true,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 6,
    name: "Vegetarian Supreme",
    description: "Bell peppers, mushrooms, olives, onions, and fresh tomatoes.",
    price: 15.99,
    category: "Pizza",
    available: true,
    image: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  
  // Pasta
  {
    id: 7,
    name: "Spaghetti Carbonara",
    description: "Traditional Italian pasta with eggs, cheese, pancetta, and pepper.",
    price: 16.99,
    category: "Pasta",
    available: true,
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
  },
  {
    id: 8,
    name: "Penne Arrabbiata",
    description: "Spicy tomato sauce with garlic, red chili, and parsley.",
    price: 14.99,
    category: "Pasta",
    available: true,
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 9,
    name: "Fettuccine Alfredo",
    description: "Creamy parmesan sauce with butter and fresh herbs.",
    price: 15.99,
    category: "Pasta",
    available: true,
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  
  // Seafood
  {
    id: 10,
    name: "Grilled Salmon",
    description: "Fresh salmon fillet grilled to perfection with lemon butter sauce.",
    price: 22.99,
    category: "Seafood",
    available: true,
    image: "https://images.unsplash.com/photo-1485921325833-c519f76c4927?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80",
  },
  {
    id: 11,
    name: "Shrimp Scampi",
    description: "Succulent shrimp in garlic butter sauce with white wine.",
    price: 19.99,
    category: "Seafood",
    available: true,
    image: "https://images.unsplash.com/photo-1633504581786-316c8002b1b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 12,
    name: "Fish and Chips",
    description: "Crispy battered fish with golden fries and tartar sauce.",
    price: 17.99,
    category: "Seafood",
    available: true,
    image: "https://images.unsplash.com/photo-1579208575657-c595a05383b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  
  // Salads
  {
    id: 13,
    name: "Caesar Salad",
    description: "Crisp romaine lettuce, parmesan cheese, croutons, and Caesar dressing.",
    price: 9.99,
    category: "Salads",
    available: true,
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: 14,
    name: "Greek Salad",
    description: "Fresh tomatoes, cucumbers, olives, feta cheese, and olive oil.",
    price: 10.99,
    category: "Salads",
    available: true,
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 15,
    name: "Caprese Salad",
    description: "Fresh mozzarella, tomatoes, basil, and balsamic glaze.",
    price: 11.99,
    category: "Salads",
    available: true,
    image: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  
  // Desserts
  {
    id: 16,
    name: "Chocolate Cake",
    description: "Rich and moist chocolate cake with ganache frosting.",
    price: 7.99,
    category: "Desserts",
    available: true,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1089&q=80",
  },
  {
    id: 17,
    name: "Tiramisu",
    description: "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone.",
    price: 8.99,
    category: "Desserts",
    available: true,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 18,
    name: "Cheesecake",
    description: "Creamy New York style cheesecake with berry compote.",
    price: 8.99,
    category: "Desserts",
    available: true,
    image: "https://images.unsplash.com/photo-1533134486753-c833f0ed4866?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  
  // Appetizers
  {
    id: 19,
    name: "Chicken Wings",
    description: "Crispy wings tossed in your choice of buffalo, BBQ, or honey garlic sauce.",
    price: 12.99,
    category: "Appetizers",
    available: true,
    image: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 20,
    name: "Mozzarella Sticks",
    description: "Golden fried mozzarella with marinara dipping sauce.",
    price: 8.99,
    category: "Appetizers",
    available: true,
    image: "https://images.unsplash.com/photo-1531749668029-2db88e4276c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 21,
    name: "Bruschetta",
    description: "Toasted bread topped with fresh tomatoes, basil, and garlic.",
    price: 9.99,
    category: "Appetizers",
    available: true,
    image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  
  // Beverages
  {
    id: 22,
    name: "Fresh Lemonade",
    description: "Freshly squeezed lemonade with mint and ice.",
    price: 4.99,
    category: "Beverages",
    available: true,
    image: "https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 23,
    name: "Iced Coffee",
    description: "Cold brew coffee served over ice with your choice of milk.",
    price: 5.99,
    category: "Beverages",
    available: true,
    image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 24,
    name: "Smoothie Bowl",
    description: "Blended acai berries topped with granola, fruits, and honey.",
    price: 9.99,
    category: "Beverages",
    available: true,
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  
  // Additional Burgers
  {
    id: 25,
    name: "Mushroom Swiss Burger",
    description: "Beef patty topped with sautéed mushrooms and melted Swiss cheese.",
    price: 14.99,
    category: "Burgers",
    available: true,
    image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  
  // Additional Pizza
  {
    id: 26,
    name: "Hawaiian Pizza",
    description: "Ham, pineapple, mozzarella cheese on tomato sauce base.",
    price: 16.99,
    category: "Pizza",
    available: true,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 27,
    name: "Meat Lovers Pizza",
    description: "Pepperoni, sausage, bacon, and ham with extra cheese.",
    price: 18.99,
    category: "Pizza",
    available: true,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  
  // Additional Pasta
  {
    id: 28,
    name: "Lasagna",
    description: "Layers of pasta, meat sauce, ricotta, and mozzarella cheese.",
    price: 17.99,
    category: "Pasta",
    available: true,
    image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 29,
    name: "Pesto Pasta",
    description: "Fresh basil pesto with pine nuts, garlic, and parmesan.",
    price: 15.99,
    category: "Pasta",
    available: true,
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  
  // Additional Seafood
  {
    id: 30,
    name: "Lobster Tail",
    description: "Grilled lobster tail with garlic butter and lemon.",
    price: 29.99,
    category: "Seafood",
    available: true,
    image: "https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  
  // Additional Desserts
  {
    id: 31,
    name: "Crème Brûlée",
    description: "Classic French dessert with vanilla custard and caramelized sugar.",
    price: 9.99,
    category: "Desserts",
    available: true,
    image: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 32,
    name: "Apple Pie",
    description: "Homemade apple pie with cinnamon and flaky crust.",
    price: 7.99,
    category: "Desserts",
    available: true,
    image: "https://images.unsplash.com/photo-1535920527002-b35e96722eb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  
  // Additional Appetizers
  {
    id: 33,
    name: "Nachos Supreme",
    description: "Tortilla chips loaded with cheese, jalapeños, sour cream, and guacamole.",
    price: 11.99,
    category: "Appetizers",
    available: true,
    image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 34,
    name: "Spring Rolls",
    description: "Crispy vegetable spring rolls with sweet chili dipping sauce.",
    price: 8.99,
    category: "Appetizers",
    available: true,
    image: "https://images.unsplash.com/photo-1625398407796-82650a8c135f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  
  // Additional Beverages
  {
    id: 35,
    name: "Mango Lassi",
    description: "Refreshing Indian yogurt drink blended with sweet mango.",
    price: 5.99,
    category: "Beverages",
    available: true,
    image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 36,
    name: "Green Tea",
    description: "Premium organic green tea, hot or iced.",
    price: 3.99,
    category: "Beverages",
    available: true,
    image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  },
];

const INITIAL_CUSTOMER = {
  email: "user@example.com",
  name: "John Doe",
  phone: "123-456-7890",
  address: "123 Main St, City, Country",
};

class LocalStorageService {
  constructor() {
    if (typeof window !== "undefined") {
      this.init();
    }
  }

  private init() {
    if (!localStorage.getItem(STORAGE_KEYS.MENU)) {
      localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(INITIAL_MENU));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CART)) {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify({ items: [] }));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
    }
    // We can simulate a logged-in user or leave it empty until "login"
    if (!localStorage.getItem(STORAGE_KEYS.CUSTOMER)) {
        // For demo purposes, let's assume a user is logged in or we can set it on "login"
        // localStorage.setItem(STORAGE_KEYS.CUSTOMER, JSON.stringify(INITIAL_CUSTOMER));
    }
  }

  // --- Menu ---
  async getMenu(): Promise<MenuItem[]> {
    await this.simulateDelay();
    const menu = localStorage.getItem(STORAGE_KEYS.MENU);
    return menu ? JSON.parse(menu) : [];
  }

  async searchMenu(query: string): Promise<MenuItem[]> {
    await this.simulateDelay();
    const menu = await this.getMenu();
    if (!query) return menu;
    const lowerQuery = query.toLowerCase();
    return menu.filter((item) =>
      item.name.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery)
    );
  }

  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    await this.simulateDelay();
    const menu = await this.getMenu();
    return menu.find((item) => item.id === id);
  }

  // --- Cart ---
  async getCart(): Promise<{ items: CartItem[] }> {
    await this.simulateDelay();
    const cart = localStorage.getItem(STORAGE_KEYS.CART);
    return cart ? JSON.parse(cart) : { items: [] };
  }

  async addToCart(menuId: number, quantity: number): Promise<void> {
    await this.simulateDelay();
    const cart = await this.getCart();
    const menu = await this.getMenu();
    const menuItem = menu.find((item) => item.id === menuId);

    if (!menuItem) throw new Error("Menu item not found");

    const existingItemIndex = cart.items.findIndex((item) => item.menuId === menuId);

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        id: Date.now(), // simple ID generation
        menuId: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity,
        image: menuItem.image,
      });
    }

    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }

  async updateCartQuantity(menuId: number, quantity: number): Promise<void> {
    await this.simulateDelay();
    const cart = await this.getCart();
    const itemIndex = cart.items.findIndex((item) => item.menuId === menuId);

    if (itemIndex > -1) {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    }
  }

  async removeCartItem(cartItemId: number): Promise<void> {
    await this.simulateDelay();
    const cart = await this.getCart();
    cart.items = cart.items.filter((item) => item.id !== cartItemId);
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }

  async clearCart(): Promise<void> {
    await this.simulateDelay();
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify({ items: [] }));
  }

  // --- Orders ---
  async getOrders(): Promise<Order[]> {
    await this.simulateDelay();
    const orders = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return orders ? JSON.parse(orders) : [];
  }

  async createOrder(items: OrderItem[]): Promise<Order> {
    await this.simulateDelay();
    const orders = await this.getOrders();
    const total = items.reduce((sum, item) => sum + item.total, 0);
    
    const newOrder: Order = {
      id: Date.now(),
      items,
      status: "pending",
      createdAt: new Date().toISOString(),
      total,
    };

    orders.unshift(newOrder); // Add to beginning
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    
    // Clear cart after order
    await this.clearCart();
    
    return newOrder;
  }

  // --- Customer ---
  async getCustomer(email: string): Promise<any> {
    await this.simulateDelay();
    const customerData = localStorage.getItem(STORAGE_KEYS.CUSTOMER);
    if (customerData) {
        const customer = JSON.parse(customerData);
        if (customer.email === email) return customer;
    }
    // If no customer data or email doesn't match, return mock or null
    // For this migration, let's just return the stored customer if it exists, or the initial one if we want to auto-login
    return customerData ? JSON.parse(customerData) : INITIAL_CUSTOMER;
  }

  async updateCustomer(email: string, data: any): Promise<any> {
    await this.simulateDelay();
    const current = await this.getCustomer(email);
    const updated = { ...current, ...data, email }; // Ensure email matches
    localStorage.setItem(STORAGE_KEYS.CUSTOMER, JSON.stringify(updated));
    return updated;
  }

  // --- Auth ---
  async login(email: string): Promise<any> {
    await this.simulateDelay();
    // Simple mock login
    const customer = await this.getCustomer(email);
    return { user: customer, token: "mock-token" };
  }

  async signup(data: any): Promise<any> {
    await this.simulateDelay();
    // Mock signup - just save as customer
    await this.updateCustomer(data.email, data);
    return { user: data, token: "mock-token" };
  }

  async logout(): Promise<void> {
    await this.simulateDelay();
    // clear token if we were storing it
  }

  async requestOtp(email: string): Promise<void> {
    await this.simulateDelay();
    console.log(`OTP requested for ${email}`);
  }

  async verifyOtp(email: string, otp: string): Promise<void> {
    await this.simulateDelay();
    console.log(`OTP verified for ${email}: ${otp}`);
  }

  async resetPassword(email: string): Promise<void> {
    await this.simulateDelay();
    console.log(`Password reset for ${email}`);
  }

  async contactUs(data: any): Promise<void> {
    await this.simulateDelay();
    console.log("Contact form submitted:", data);
  }

  private simulateDelay(ms: number = 300): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const localStorageService = new LocalStorageService();

