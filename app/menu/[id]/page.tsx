import { notFound } from "next/navigation";
import { fetchMenuItem } from "@/api/menu";
import MenuItemDetails from "../MenuItemDetails";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// This function generates static params for all menu items at build time
// We hardcode the IDs since localStorage is not available during build
export async function generateStaticParams() {
  // These IDs match the initial menu items in localStorage service
  return Array.from({ length: 36 }, (_, i) => ({ id: String(i + 1) }));
}

export default async function MenuItemPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  // Await params if it's a Promise
  const resolvedParams = params instanceof Promise ? await params : params;
  const { id } = resolvedParams;

  let menuItem;
  try {
    menuItem = await fetchMenuItem(id);
    if (!menuItem) {
      notFound();
    }
  } catch (error) {
    console.error("Failed to fetch menu item:", error);
    notFound();
  }

  return (
    <>
      <Navbar />
      <MenuItemDetails menuItem={menuItem} />
      <Footer />
    </>
  );
}
