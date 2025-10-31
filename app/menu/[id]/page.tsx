"use client";
import { notFound } from "next/navigation";
import { fetchMenuItem } from "@/api/menu";
import MenuItemDetails from "../MenuItemDetails";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { MenuItem } from "@/types/types";
import Loader from "./../../../components/Loader";

export default function MenuItemPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    // Handle both Promise and direct object cases
    const getParams = async () => {
      if (params instanceof Promise) {
        const resolvedParams = await params;
        setId(resolvedParams.id);
      } else {
        setId(params.id);
      }
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      try {
        const fetchedMenuItem = await fetchMenuItem(id as string);
        if (!fetchedMenuItem) {
          notFound();
        } else {
          setMenuItem(fetchedMenuItem);
        }
      } catch (error) {
        console.error("Failed to fetch menu item:", error);
        notFound();
      }
    }
    fetchData();
  }, [id]);

  if (!menuItem) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <MenuItemDetails menuItem={menuItem} />
      <Footer />
    </>
  );
}
