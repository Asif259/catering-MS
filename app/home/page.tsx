"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

import useAuthStore from "@/store/auth-store";
import debounce from "lodash.debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MenuCards from "@/components/MenuCards";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { fetchMenuData, searchMenuItems } from "@/api/home";
import toast from "react-hot-toast";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import Loader from "@/components/Loader";

export default function Home() {
  const { logout, checkAuth } = useAuthStore();

  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);

  const carouselImages = [
    {
      src: "/images/bg1.png",
      alt: "Image 1",
      title: "Welcome to Culinary Odyssey",
      description:
        "Experience the finest catering services for all your special occasions",
      ctaText: "Explore Menu",
    },
    {
      src: "/images/bg2.jpg",
      alt: "Image 2",
      title: "Premium Catering Solutions",
      description:
        "From intimate gatherings to grand celebrations, we've got you covered",
      ctaText: "Book Now",
    },
    {
      src: "/images/bg3.jpg",
      alt: "Image 3",
      title: "Delicious Moments Await",
      description:
        "Creating memorable experiences through exceptional food and service",
      ctaText: "Get Started",
    },
  ];

  useEffect(() => {
    const initializeAuth = async () => {
      const authenticated = await checkAuth();
      if (!authenticated) {
        logout();
      }
    };

    initializeAuth();
  }, [checkAuth, logout]);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const data = await fetchMenuData();
        setMenuData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMenu();
  }, []);

  const handleSearch = useCallback(
    debounce(async (searchTerm: string) => {
      if (searchTerm.length >= 1) {
        try {
          const data = await searchMenuItems(searchTerm);
          setSearchResults(data);
        } catch (err: any) {
          toast.error(err.message);
        }
      } else {
        setSearchResults([]);
      }
    }, 300),
    []
  );

  const scrollToMealPlans = () => {
    const mealPlansSection = document.getElementById("meal-plans");
    if (mealPlansSection) {
      mealPlansSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="container mx-auto w-11/12 lg:w-9/12 my-4 sm:my-6 lg:my-8">
          <Carousel className="w-full">
            <CarouselContent>
              {carouselImages.map((item, index) => (
                <CarouselItem key={index}>
                  <div className="p-1 relative">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      width={800}
                      height={800}
                      className="w-full h-[250px] sm:h-[350px] lg:h-[400px] object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-lg flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
                      <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-4 px-2">
                        {item.title}
                      </h2>
                      <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-white/90 mb-4 sm:mb-6 lg:mb-8 max-w-2xl px-2">
                        {item.description}
                      </p>
                      <Button
                        size="lg"
                        className="bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg"
                        onClick={scrollToMealPlans}
                      >
                        {item.ctaText}
                      </Button>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>
        <section
          id="meal-plans"
          className="container mx-auto w-11/12 lg:w-9/12 p-4 sm:p-5 lg:p-6 bg-white rounded-lg shadow-lg mt-6 sm:mt-8 lg:mt-10 scroll-mt-20"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4 mb-2">
            <h2 className="text-primary text-xl sm:text-2xl lg:text-3xl font-bold">
              Our meal plans
            </h2>
            <div className="w-full md:w-auto">
              <form
                className="flex w-full max-w-sm items-center space-x-2"
                onSubmit={(e) => e.preventDefault()}
              >
                <Input
                  type="search"
                  placeholder="Search meal plans"
                  onChange={(e) => handleSearch(e.target.value)}
                  className="text-sm sm:text-base"
                />
              </form>
            </div>
          </div>
          <div className="mt-2 border-t border-primary" />
          {loading ? (
            <div>
              <Loader />
            </div>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : (
            <MenuCards
              cards={searchResults.length > 0 ? searchResults : menuData}
            />
          )}
        </section>
        <section className="py-16 mt-40 relative">
          <Image
            src="/images/foodBG.png"
            alt="Food Background"
            fill
            className="object-cover"
            quality={100}
            priority
          />
          <div className="absolute inset-0 bg-white/80" />
          <div className="container mx-auto text-center relative z-10">
            <h2 className="text-3xl font-bold mb-8">
              <span className="text-primary">DOWNLOAD</span>
              <span className="ml-2 text-neutral-600">THE APP</span>
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                variant="secondary"
                className="inline-flex items-center px-6 py-3"
                asChild
              >
                <a href="#">
                  <FaGooglePlay className="mr-2" />
                  Get it on Android
                </a>
              </Button>
              <Button
                variant="secondary"
                className="inline-flex items-center px-6 py-3"
                asChild
              >
                <a href="#">
                  <FaApple className="mr-2" />
                  Get it on iOS
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
