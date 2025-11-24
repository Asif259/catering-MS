"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
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
import { FaApple, FaGooglePlay, FaUtensils, FaClock, FaStar, FaCheckCircle } from "react-icons/fa";
import Loader from "@/components/Loader";
import { MenuItem } from "@/types/types";

const categories = [
  "All",
  "Burgers",
  "Pizza",
  "Pasta",
  "Seafood",
  "Salads",
  "Desserts",
  "Appetizers",
  "Beverages",
];

export default function Home() {
  const { logout, checkAuth } = useAuthStore();
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<MenuItem[]>([]);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const carouselImages = [
    {
      src: "/images/bg1.png",
      alt: "Welcome to Culinary Odyssey",
      title: "Welcome to Culinary Odyssey",
      description:
        "Experience the finest catering services for all your special occasions",
      ctaText: "Explore Menu",
    },
    {
      src: "/images/bg2.jpg",
      alt: "Premium Catering Solutions",
      title: "Premium Catering Solutions",
      description:
        "From intimate gatherings to grand celebrations, we've got you covered",
      ctaText: "Book Now",
    },
    {
      src: "/images/bg3.jpg",
      alt: "Delicious Moments Await",
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

  const filteredMenu = useMemo(() => {
    let items = searchResults.length > 0 ? searchResults : menuData;
    
    if (selectedCategory !== "All") {
      items = items.filter((item) => item.category === selectedCategory);
    }
    
    return items;
  }, [menuData, searchResults, selectedCategory]);

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
        {/* Hero Carousel */}
        <section className="container mx-auto w-11/12 lg:w-9/12 my-4 sm:my-6 lg:my-8 animate-fade-in">
          <Carousel className="w-full">
            <CarouselContent>
              {carouselImages.map((item, index) => (
                <CarouselItem key={index}>
                  <div className="p-1 relative group">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      width={800}
                      height={800}
                      className="w-full h-[250px] sm:h-[350px] lg:h-[400px] object-cover rounded-lg transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-lg flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 transition-all duration-300 group-hover:bg-black/50">
                      <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-4 px-2 animate-slide-up">
                        {item.title}
                      </h2>
                      <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-white/90 mb-4 sm:mb-6 lg:mb-8 max-w-2xl px-2 animate-slide-up animation-delay-200">
                        {item.description}
                      </p>
                      <Button
                        size="lg"
                        className="bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg transform transition-all duration-300 hover:scale-110 hover:shadow-xl animate-slide-up animation-delay-400"
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


        {/* Menu Section with Category Filter */}
        <section
          id="meal-plans"
          className="container mx-auto w-11/12 lg:w-9/12 p-4 sm:p-5 lg:p-6 bg-white rounded-lg shadow-lg mt-6 sm:mt-8 lg:mt-10 scroll-mt-20 animate-fade-in animation-delay-400"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4 mb-4">
            <h2 className="text-primary text-xl sm:text-2xl lg:text-3xl font-bold">
              Our Menu
            </h2>
            <div className="w-full md:w-auto">
              <form
                className="flex w-full max-w-sm items-center space-x-2"
                onSubmit={(e) => e.preventDefault()}
              >
                <Input
                  type="search"
                  placeholder="Search menu items..."
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    handleSearch(e.target.value);
                  }}
                  value={searchTerm}
                  className="text-sm sm:text-base transition-all duration-300 focus:ring-2 focus:ring-primary"
                />
              </form>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-6 overflow-x-auto">
            <div className="flex gap-2 pb-2 min-w-max">
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === category
                      ? "bg-primary text-white shadow-lg"
                      : "hover:bg-primary/10"
                  }`}
                >
                  {category}
                </Button>
              ))}
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
            <div className="animate-fade-in">
              <MenuCards cards={filteredMenu} />
              {filteredMenu.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    No items found. Try a different search or category.
                  </p>
                </div>
              )}
            </div>
          )}
        </section>

        
        {/* Features Section */}
        <section className="container mx-auto w-11/12 lg:w-9/12 py-12 animate-fade-in animation-delay-200">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-primary">
            Why Choose Culinary Odyssey?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <FaUtensils className="w-12 h-12 text-primary" />,
                title: "Fresh Ingredients",
                description: "We use only the freshest, locally-sourced ingredients for all our dishes",
              },
              {
                icon: <FaClock className="w-12 h-12 text-primary" />,
                title: "Fast Delivery",
                description: "Quick and reliable delivery service to ensure your food arrives hot and fresh",
              },
              {
                icon: <FaStar className="w-12 h-12 text-primary" />,
                title: "Top Rated",
                description: "Consistently rated 5 stars by our satisfied customers across the region",
              },
              {
                icon: <FaCheckCircle className="w-12 h-12 text-primary" />,
                title: "Quality Assured",
                description: "Every dish is prepared with care and meets our high quality standards",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-center mb-4 transform transition-transform duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-center mb-2 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="container mx-auto w-11/12 lg:w-9/12 py-16 animate-fade-in animation-delay-600">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-primary">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Johnson",
                role: "Event Planner",
                comment: "Culinary Odyssey made our corporate event a huge success! The food was exceptional and the service was impeccable.",
                rating: 5,
              },
              {
                name: "Michael Chen",
                role: "Wedding Client",
                comment: "Our wedding catering was perfect! Every guest complimented the food. Highly recommend for special occasions.",
                rating: 5,
              },
              {
                name: "Emily Rodriguez",
                role: "Regular Customer",
                comment: "I order from them weekly. The quality is always consistent and the variety keeps things interesting!",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 w-5 h-5" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.comment}"</p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-800">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* App Download Section */}
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
            <h2 className="text-3xl font-bold mb-8 animate-fade-in">
              <span className="text-primary">DOWNLOAD</span>
              <span className="ml-2 text-neutral-600">THE APP</span>
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in animation-delay-200">
              <Button
                variant="secondary"
                className="inline-flex items-center px-6 py-3 transform transition-all duration-300 hover:scale-110 hover:shadow-xl"
                asChild
              >
                <a href="#">
                  <FaGooglePlay className="mr-2" />
                  Get it on Android
                </a>
              </Button>
              <Button
                variant="secondary"
                className="inline-flex items-center px-6 py-3 transform transition-all duration-300 hover:scale-110 hover:shadow-xl"
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
