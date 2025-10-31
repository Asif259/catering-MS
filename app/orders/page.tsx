"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/auth-store";
import { useOrderStore } from "@/store/order-store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import Loader from "@/components/Loader";
import { format } from "date-fns";

export default function OrdersPage() {
  const router = useRouter();
  const { isLoggedIn, checkAuth } = useAuthStore();
  const { orders, loadOrders, cancelOrder, updateOrderStatus } = useOrderStore();
  const [loading, setLoading] = useState(true);
  const [processingOrder, setProcessingOrder] = useState<string | null>(null);

  useEffect(() => {
    const initializePage = async () => {
      setLoading(true);
      try {
        const isAuth = await checkAuth();
        if (!isAuth) {
          router.push("/auth/signin");
          return;
        }

        loadOrders();
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    initializePage();
  }, [checkAuth, router, loadOrders]);

  const handleCancelOrder = async (orderId: string) => {
    try {
      setProcessingOrder(orderId);
      await cancelOrder(orderId);
      toast.success("Order cancelled successfully");
      loadOrders(); // Reload orders after cancellation
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel order");
    } finally {
      setProcessingOrder(null);
    }
  };

  const handlePayNow = async (orderId: string) => {
    try {
      setProcessingOrder(orderId);
      await updateOrderStatus(orderId, "completed");
      toast.success("Order payment completed successfully!");
      loadOrders();
    } catch (error: any) {
      toast.error(error.message || "Failed to process payment");
    } finally {
      setProcessingOrder(null);
    }
  };

  if (!isLoggedIn && !loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="pt-6">
              <p className="text-center mb-4">
                Please log in to view your orders.
              </p>
              <button
                className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90"
                onClick={() => router.push("/auth/signin")}
              >
                Sign In
              </button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <Loader />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-200px)]">
        <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
        {orders.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">
                You haven't placed any orders yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Order #{order.id}</CardTitle>
                    <Badge variant={order.status === "pending" ? "default" : "secondary"}>
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    Placed on {format(new Date(order.createdAt), "PPpp")}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{item.menuItemId}</p>
                            <p className="text-sm text-gray-500">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        {index < order.items.length - 1 && (
                          <Separator className="my-4" />
                        )}
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-4 border-t">
                      <p className="font-bold">Total</p>
                      <p className="font-bold">${order.total.toFixed(2)}</p>
                    </div>
                    {order.status === "pending" && (
                      <div className="flex justify-end gap-4 mt-4">
                        <Button
                          variant="outline"
                          onClick={() => handleCancelOrder(String(order.id))}
                          disabled={processingOrder === String(order.id)}
                        >
                          {processingOrder === String(order.id) ? "Cancelling..." : "Cancel Order"}
                        </Button>
                        <Button
                          onClick={() => handlePayNow(String(order.id))}
                          disabled={processingOrder === String(order.id)}
                        >
                          {processingOrder === String(order.id) ? "Processing..." : "Pay Now"}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}