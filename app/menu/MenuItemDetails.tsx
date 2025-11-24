"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import useAuthStore from "@/store/auth-store";
import { addToCart, order } from "@/api/cart";
import toast from "react-hot-toast";
import { MenuItem } from "@/types/types";
import { useCartStore } from "@/store/cart-store";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { useOrderStore } from "@/store/order-store";

export default function MenuItemDetails({ menuItem }: { menuItem: MenuItem }) {
  const router = useRouter();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 1),
  });
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isLoggedIn } = useAuthStore();
  const { checkAuth } = useAuthStore();
  const { initializeCart, addToCart: addItemToCart } = useCartStore();
  const { addOrder } = useOrderStore();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const setupCart = async () => {
      try {
        const authenticated = await checkAuth();
        if (authenticated) {
          await initializeCart();
        }
      } catch (err: any) {
        console.error("Failed to initialize cart", err);
      }
    };

    setupCart();
  }, [checkAuth, initializeCart]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      toast.error("Please login to add items to cart");
      router.push("/auth/signin");
      return;
    }

    if (quantity < 1) {
      toast.error("Please select a valid quantity");
      return;
    }

    if (!date?.from || !date?.to) {
      toast.error("Please select both start and end dates");
      return;
    }

    if (date.from > date.to) {
      toast.error("End date must be after start date");
      return;
    }

    if (!address.trim()) {
      toast.error("Please provide a valid address");
      return;
    }

    try {
      setIsAddingToCart(true);
      await addItemToCart(
        menuItem.id,
        quantity,
        {
          name: menuItem.name,
          price: menuItem.price,
          image: menuItem.image,
        }
      );
      toast.success("Item added to cart successfully");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to add item to cart"
      );
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!isLoggedIn) {
      toast.error("Please login to place an order");
      router.push("/auth/signin");
      return;
    }

    if (quantity < 1) {
      toast.error("Please select a valid quantity");
      return;
    }

    if (!date?.from || !date?.to) {
      toast.error("Please select both start and end dates");
      return;
    }

    if (date.from > date.to) {
      toast.error("End date must be after start date");
      return;
    }

    if (!address.trim()) {
      toast.error("Please provide a valid address");
      return;
    }

    try {
      setIsPlacingOrder(true);
      const orderItems = [{
        menuItemId: menuItem.id,
        quantity: quantity,
        price: menuItem.price
      }];

      const response = await order(orderItems);

      // Add order to store
      addOrder(response.data);

      toast.success("Order placed successfully!");
      router.push("/orders");
    } catch (error: any) {
      toast.error(error.message || "Failed to place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setQuantity(value);
    }
  };

  return (
    <div className="container mx-auto w-11/12 lg:w-9/12 p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <div className="border-t border-primary mb-6" />
        
        {/* Image and Details Side by Side Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-8">
          {/* Image Section - 1:1 Ratio */}
          <div className="relative aspect-square w-full max-w-lg mx-auto md:mx-0">
            <Image
              src={menuItem.image.startsWith("http") ? menuItem.image : `/images/${menuItem.image}`}
              alt={menuItem.name}
              fill
              className="object-cover rounded-lg"
            />
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-center space-y-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
              {menuItem.name}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              {menuItem.description}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
              <p className="text-xl sm:text-2xl font-semibold text-primary">
                ${menuItem.price}
              </p>
              <p className="text-sm sm:text-base text-muted-foreground">
                Category: <span className="font-medium">{menuItem.category}</span>
              </p>
            </div>
            <p
              className={cn(
                "font-semibold text-sm sm:text-base",
                menuItem.available ? "text-green-600" : "text-red-600"
              )}
            >
              {menuItem.available ? "Available" : "Not Available"}
            </p>
          </div>
        </div>

        {/* Order Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-2xl font-bold text-primary mb-4">
            Make an Order
          </h3>

          <div className="grid grid-cols-1 gap-4 mb-4">
            <div className="grid gap-2">
              <Label htmlFor="date" className="text-muted">
                Select Dates
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={isMobile ? 1 : 2}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="quantity" className="text-muted">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className="hover:outline-primary"
              />
            </div>

            <div>
              <Label htmlFor="address" className="text-muted">
                Address
              </Label>
              <Input
                id="address"
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="hover:outline-primary"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={isAddingToCart || !menuItem.available}
                className="w-full sm:w-auto hover:outline-primary"
              >
                {isAddingToCart ? "Adding to cart..." : "Add to cart"}
              </Button>
              <Button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || !menuItem.available}
                className="w-full sm:w-auto hover:outline-primary"
              >
                {isPlacingOrder ? "Placing Order..." : "Place Order"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
