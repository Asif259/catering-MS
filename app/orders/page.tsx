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
import { FaShoppingBag, FaCheckCircle, FaClock } from "react-icons/fa";

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
      loadOrders();
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
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)] bg-gradient-to-br from-slate-50 to-slate-100">
          <Card className="w-full max-w-md mx-4 shadow-xl animate-fade-in">
            <CardContent className="pt-6">
              <p className="text-center mb-4 text-gray-700">
                Please log in to view your orders.
              </p>
              <Button
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white transform transition-all duration-300 hover:scale-105"
                onClick={() => router.push("/auth/signin")}
              >
                Sign In
              </Button>
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
      <main className="min-h-[calc(100vh-200px)] bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {/* Page Header */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <FaShoppingBag className="text-primary text-3xl" />
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Your Orders</h1>
            </div>
            <p className="text-gray-600 ml-12">Track and manage your catering orders</p>
          </div>

          {orders.length === 0 ? (
            <Card className="shadow-lg animate-fade-in animation-delay-200">
              <CardContent className="pt-12 pb-12 text-center">
                <FaShoppingBag className="text-gray-300 text-6xl mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-4">
                  You haven't placed any orders yet.
                </p>
                <Button
                  onClick={() => router.push("/home")}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white transform transition-all duration-300 hover:scale-105"
                >
                  Browse Menu
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order, index) => (
                <Card 
                  key={order.id} 
                  className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                          <FaShoppingBag className="text-primary" />
                          Order #{order.id}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          Placed on {format(new Date(order.createdAt), "PPpp")}
                        </p>
                      </div>
                      <Badge 
                        variant={order.status === "pending" ? "default" : "secondary"}
                        className={`flex items-center gap-1 px-3 py-1 ${
                          order.status === "completed" 
                            ? "bg-green-100 text-green-800 hover:bg-green-100" 
                            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                        }`}
                      >
                        {order.status === "completed" ? (
                          <FaCheckCircle className="w-3 h-3" />
                        ) : (
                          <FaClock className="w-3 h-3" />
                        )}
                        {order.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div key={index}>
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-gray-800">{item.menuItemId}</p>
                              <p className="text-sm text-gray-500">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                            <p className="font-semibold text-primary">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                          {index < order.items.length - 1 && (
                            <Separator className="my-4" />
                          )}
                        </div>
                      ))}
                      <div className="flex justify-between items-center pt-4 border-t-2 border-primary/20">
                        <p className="font-bold text-lg text-gray-800">Total</p>
                        <p className="font-bold text-xl text-primary">${order.total.toFixed(2)}</p>
                      </div>
                      {order.status === "pending" && (
                        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-4 border-t">
                          <Button
                            variant="outline"
                            onClick={() => handleCancelOrder(String(order.id))}
                            disabled={processingOrder === String(order.id)}
                            className="transition-all duration-300 hover:scale-105"
                          >
                            {processingOrder === String(order.id) ? "Cancelling..." : "Cancel Order"}
                          </Button>
                          <Button
                            onClick={() => handlePayNow(String(order.id))}
                            disabled={processingOrder === String(order.id)}
                            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white transition-all duration-300 hover:scale-105"
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
        </div>
      </main>
      <Footer />
    </>
  );
}