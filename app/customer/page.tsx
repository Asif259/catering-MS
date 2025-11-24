"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/auth-store";
import { localStorageService } from "@/services/localStorage";
import { FaEdit, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSave } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import toast from "react-hot-toast";

const CustomerPage = () => {
  const router = useRouter();
  const { isLoggedIn, checkAuth, logout } = useAuthStore();
  const [customer, setCustomer] = useState({
    id: "",
    name: "",
    email: "",
    address: "",
    phone: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    const validateAuth = async () => {
      try {
        const isAuthenticated = await checkAuth();
        if (!isAuthenticated) {
          logout();
          router.push("/auth/signin");
        }
      } catch (error) {
        logout();
        console.log("Failed to validate user", error);
        router.push("/auth/signin");
      }
    };

    const fetchCustomerDetails = async () => {
      try {
        const storedUser = localStorage.getItem("auth_user");
        if (!storedUser) {
          router.push("/auth/signin");
          return;
        }
        const user = JSON.parse(storedUser);
        const data = await localStorageService.getCustomer(user.email);
        setCustomer(data);
        setFormData({
          name: data.name,
          address: data.address || "",
          phone: data.phone || "",
        });
      } catch (err) {
        console.error("Failed to fetch customer data", err);
      }
    };

    validateAuth().then(r => r);
    fetchCustomerDetails().then(r => r);
  }, [checkAuth, logout, router]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData({
      name: customer.name,
      address: customer.address || "",
      phone: customer.phone || "",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveClick = async () => {
    try {
      const storedUser = localStorage.getItem("auth_user");
      if (!storedUser) {
        router.push("/auth/signin");
        return;
      }
      const user = JSON.parse(storedUser);
      const updatedCustomer = await localStorageService.updateCustomer(user.email, {
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
      });
      
      setCustomer(updatedCustomer);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update customer data", err);
      toast.error("Failed to update profile");
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-200px)] bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Page Header */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <FaUser className="text-primary text-3xl" />
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">My Profile</h1>
            </div>
            <p className="text-gray-600 ml-12">Manage your personal information</p>
          </div>

          <Card className="shadow-xl animate-fade-in animation-delay-200">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
              <CardTitle className="flex justify-between items-center">
                <span className="text-2xl">Profile Information</span>
                {!isEditing && (
                  <Button 
                    variant="ghost" 
                    className="hover:text-primary hover:bg-white/50 transition-all duration-300 transform hover:scale-105" 
                    size="sm" 
                    onClick={handleEditClick}
                  >
                    <FaEdit className="mr-2" />
                    Edit Profile
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Avatar Section */}
              <div className="flex items-center mb-8 pb-6 border-b">
                <Avatar className="h-20 w-20 mr-4 ring-4 ring-primary/20">
                  <AvatarImage src="https://i.pravatar.cc/150?u=a04258a2462d826712d" alt="Customer Avatar" />
                  <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-white text-2xl">
                    {customer.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{customer.name}</h2>
                  <p className="text-gray-600 flex items-center gap-2 mt-1">
                    <FaEnvelope className="text-primary" />
                    {customer.email}
                  </p>
                </div>
              </div>

              {/* Form Section */}
              <div className="space-y-6">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <FaUser className="text-primary" />
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="h-12 transition-all duration-300 focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <FaMapMarkerAlt className="text-primary" />
                        Address
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Enter your address"
                        className="h-12 transition-all duration-300 focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <FaPhone className="text-primary" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        className="h-12 transition-all duration-300 focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <Button 
                        variant="outline" 
                        onClick={handleCancelClick}
                        className="transition-all duration-300 hover:scale-105"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleSaveClick}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white transition-all duration-300 hover:scale-105"
                      >
                        <FaSave className="mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                        <FaMapMarkerAlt className="text-primary" />
                        Address
                      </Label>
                      <p className="text-gray-800 ml-6">{customer.address || "Not provided"}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                        <FaPhone className="text-primary" />
                        Phone Number
                      </Label>
                      <p className="text-gray-800 ml-6">{customer.phone || "Not provided"}</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CustomerPage;
