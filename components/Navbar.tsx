"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useAuthStore from "@/store/auth-store";
import api from "@/api/api";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Menu, X } from "lucide-react";
import logo from "@/public/images/CulinaryOdyssey.jpg";

const Navbar = () => {
  const { logout, isLoggedIn, checkAuth } = useAuthStore();
  const router = useRouter();
  const [customer, setCustomer] = useState<{
    name: string;
    image?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignIn = () => {
    router.push("/auth/signin");
  };

  const handleLogout = async () => {
    try {
      await api.get("/auth/logout");
      logout();
    } catch {
      console.log("Failed to logout");
    } finally {
      router.push("/auth/signin");
    }
  };

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const isAuthenticated = await checkAuth();
        if (isAuthenticated) {
          // Get user email from auth store
          const storedUser = localStorage.getItem("auth_user");
          if (storedUser) {
            const user = JSON.parse(storedUser);
            const response = await api.get(
              `/customer?email=${encodeURIComponent(user.email)}`
            );
            setCustomer(response.data);
          }
        } else {
          setCustomer(null);
        }
      } catch (err: any) {
        console.error("Failed to fetch customer data:", err);
        // Fallback to auth store user data if API fails
        try {
          const storedUser = localStorage.getItem("auth_user");
          if (storedUser) {
            const user = JSON.parse(storedUser);
            setCustomer({ name: user.name });
          }
        } catch (e) {
          // Ignore
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerData();
  }, [checkAuth]);

  // Don't render authentication-dependent content until we've checked auth status
  if (isLoading) {
    return (
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto w-11/12 lg:w-9/12 px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link href="/home" className="flex items-center space-x-2 min-w-0">
              <Image
                alt="Culinary Odyssey logo"
                className="rounded-full flex-shrink-0"
                src="/images/CulinaryOdyssey.jpg"
                width={40}
                height={40}
              />
              <span className="text-base sm:text-lg md:text-xl font-semibold truncate">
                <span className="text-primary text-xl sm:text-2xl md:text-3xl">
                  Culinary Odyssey
                </span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="gap-2 lg:gap-3">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/home"
                      className="font-bold text-sm lg:text-base text-muted-foreground transition-colors hover:text-primary"
                    >
                      Home
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/contact"
                      className="font-bold text-sm lg:text-base text-muted-foreground transition-colors hover:text-primary"
                    >
                      Contact Us
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/orders"
                      className="font-bold text-sm lg:text-base text-muted-foreground transition-colors hover:text-primary"
                    >
                      Orders
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t pt-4">
              <nav className="flex flex-col space-y-3">
                <Link
                  href="/home"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-bold text-base text-muted-foreground transition-colors hover:text-primary py-2"
                >
                  Home
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-bold text-base text-muted-foreground transition-colors hover:text-primary py-2"
                >
                  Contact Us
                </Link>
                <Link
                  href="/orders"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-bold text-base text-muted-foreground transition-colors hover:text-primary py-2"
                >
                  Orders
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto w-11/12 lg:w-9/12 px-2 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <Link
            href="/home"
            className="flex items-center space-x-2 min-w-0 flex-shrink-0"
          >
            <Image
              alt="Culinary Odyssey logo"
              className="rounded-full flex-shrink-0"
              src={logo || "/images/CulinaryOdyssey.jpg"}
              width={40}
              height={40}
            />
            <span className="text-base sm:text-lg md:text-xl font-semibold truncate">
              <span className="text-primary text-xl sm:text-2xl md:text-3xl">
                Culinary Odyssey
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="gap-2 lg:gap-3">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/home"
                    className="font-bold text-sm lg:text-base text-muted-foreground transition-colors hover:text-primary"
                  >
                    Home
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/contact"
                    className="font-bold text-sm lg:text-base text-muted-foreground transition-colors hover:text-primary"
                  >
                    Contact Us
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/orders"
                    className="font-bold text-sm lg:text-base text-muted-foreground transition-colors hover:text-primary"
                  >
                    Orders
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              {isLoggedIn ? (
                <>
                  <NavigationMenuItem>
                    <Link
                      href="/customer"
                      className="flex items-center space-x-2"
                    >
                      <Avatar className="h-8 w-8 lg:h-10 lg:w-10">
                        <AvatarImage
                          src={
                            customer?.image ||
                            "https://i.pravatar.cc/150?u=a04258a2462d826712d"
                          }
                          alt="Customer Avatar"
                        />
                        <AvatarFallback className="text-xs lg:text-sm">
                          {customer?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs lg:text-sm font-medium text-primary hidden lg:inline">
                        {customer?.name}
                      </span>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Button
                      onClick={handleLogout}
                      size="sm"
                      className="text-xs lg:text-sm"
                    >
                      Logout
                    </Button>
                  </NavigationMenuItem>
                </>
              ) : (
                <NavigationMenuItem>
                  <Button
                    onClick={handleSignIn}
                    size="sm"
                    className="text-xs lg:text-sm"
                  >
                    Sign in
                  </Button>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4">
            <nav className="flex flex-col space-y-3">
              <Link
                href="/home"
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-bold text-base text-muted-foreground transition-colors hover:text-primary py-2"
              >
                Home
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-bold text-base text-muted-foreground transition-colors hover:text-primary py-2"
              >
                Contact Us
              </Link>
              <Link
                href="/orders"
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-bold text-base text-muted-foreground transition-colors hover:text-primary py-2"
              >
                Orders
              </Link>
              {isLoggedIn ? (
                <>
                  <Link
                    href="/customer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-2 py-2"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={
                          customer?.image ||
                          "https://i.pravatar.cc/150?u=a04258a2462d826712d"
                        }
                        alt="Customer Avatar"
                      />
                      <AvatarFallback className="text-xs">
                        {customer?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-primary">
                      {customer?.name || "Profile"}
                    </span>
                  </Link>
                  <Button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleSignIn();
                  }}
                  className="w-full"
                >
                  Sign in
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
