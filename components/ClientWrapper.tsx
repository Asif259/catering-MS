'use client';

import { Toaster } from "react-hot-toast";
import CartButton from "@/components/CartButton";

export default function ClientWrapper() {
  return (
    <>
      <CartButton />
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
} 