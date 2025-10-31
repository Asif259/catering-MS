"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useOrderStore } from "@/store/order-store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";
import toast from "react-hot-toast";
import Loader from "@/components/Loader";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { orders, updateOrderStatus } = useOrderStore();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const initializePage = async () => {
      if (!orderId) {
        toast.error("No order ID provided");
        router.push("/orders");
        return;
      }

      const currentOrder = orders.find(o => o.id === orderId);
      if (!currentOrder) {
        toast.error("Order not found");
        router.push("/orders");
        return;
      }

      if (currentOrder.status !== "pending" && currentOrder.status !== "processing") {
        toast.error("This order cannot be paid for");
        router.push("/orders");
        return;
      }

      setOrder(currentOrder);
      setLoading(false);
    };

    initializePage();
  }, [orderId, orders, router]);

  const handleSimulatePayment = async () => {
    try {
      // Simulate a brief delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update order status
      await updateOrderStatus(order.id, "paid");
      
      toast.success("Payment simulation completed successfully!");
      router.push("/orders");
    } catch (error: any) {
      toast.error(error.message || "Payment simulation failed");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Loader />
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">Order not found</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-200px)]">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-3 p-4 text-sm bg-blue-50 border border-blue-200 rounded-lg">
            <InfoIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
            <p>
              This is a frontend demo - the payment gateway is disabled. Click the button below to simulate a successful payment.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm mb-4">Order #{order.id}</p>
                  <div className="space-y-2">
                    {order.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>Item #{item.menuItemId} (x{item.quantity})</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2">
                      <p className="font-bold flex justify-between">
                        <span>Total:</span>
                        <span>${order.total.toFixed(2)}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleSimulatePayment}
                  className="w-full"
                >
                  Simulate Payment (${order.total.toFixed(2)})
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
} 