import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientWrapper from "@/components/ClientWrapper";

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Culinary Odyssey - Premium Catering Services & Food Delivery",
  description: "Experience exceptional catering services for all occasions. Fresh ingredients, diverse menu options including burgers, pizza, pasta, seafood, and more. Order online for fast delivery or book for your next event.",
  keywords: ["catering", "food delivery", "restaurant", "catering services", "event catering", "corporate catering", "wedding catering", "online food order", "fresh food", "premium catering"],
  authors: [{ name: "Culinary Odyssey" }],
  openGraph: {
    title: "Culinary Odyssey - Premium Catering Services",
    description: "Experience the finest catering services for all your special occasions",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Culinary Odyssey - Premium Catering Services",
    description: "Experience the finest catering services for all your special occasions",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
        <ClientWrapper />
      </body>
    </html>
  );
}
