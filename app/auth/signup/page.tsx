"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineEyeInvisible, AiOutlineEye, AiOutlineMail, AiOutlineLock, AiOutlineUser } from "react-icons/ai";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "@/components/Loader";
import useAuthStore from "@/store/auth-store";

const validationSchema = Yup.object({
  name: Yup.string()
    .required("Name is required.")
    .min(4, "Name length must be at least 4 characters."),
  email: Yup.string()
    .required("Email is required.")
    .email("Invalid email format.")
    .max(50, "Email must be no more than 50 characters."),
  password: Yup.string()
    .required("Password is required.")
    .min(8, "Password must be at least 8 characters long.")
    .max(50, "Password must be no more than 50 characters.")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
    }),
  confirmPassword: Yup.string()
    .required("Confirm password is required.")
    .oneOf([Yup.ref("password"), ""], "Passwords don't match."),
});

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const register = useAuthStore((state) => state.register);

  const handleSignIn = () => {
    router.push("/auth/signin");
  };

  const handleSignUp = async (values: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...userData } = values;
      const success = await register(
        { name: userData.name, email: userData.email },
        userData.password
      );

      if (success) {
        toast.success("Registration successful! Please sign in.");
        router.push("/auth/signin");
      } else {
        toast.error("Email already exists. Please use a different email.");
      }
    } catch (error: any) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          {/* Left Section - Hero Image */}
          <div className="w-1/2 relative hidden lg:block">
            <Image
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Culinary Odyssey - Fine Dining"
              className="object-cover"
              fill
              priority
            />
            {/* Enhanced Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/40 to-orange-900/30 flex flex-col justify-center items-center px-16">
              <div className="text-center max-w-lg">
                <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
                  CULINARY ODYSSEY
                </h1>
                <p className="text-white/90 text-lg mb-8 leading-relaxed">
                  Join thousands of catering professionals managing their
                  business efficiently. Start your culinary journey today.
                </p>

                {/* Feature Points */}
                <div className="grid grid-cols-2 gap-4 text-white/80 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-300 rounded-full"></div>
                    Event Management
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-300 rounded-full"></div>
                    Menu Planning
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-300 rounded-full"></div>
                    Client Portal
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-300 rounded-full"></div>
                    Real-time Analytics
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Form */}
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-8">
            <div className="w-full max-w-md space-y-8">
              {/* Header for mobile */}
              <div className="text-center lg:hidden">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">CO</span>
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  CULINARY ODYSSEY
                </h1>
                <p className="text-gray-600 mt-2">
                  A Catering Management System
                </p>
              </div>

              <Card className="w-full border-0 shadow-xl rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-4 pt-8">
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    Create Account
                  </CardTitle>
                  <p className="text-gray-600 text-sm mt-2">
                    Join us to start your culinary journey
                  </p>
                </CardHeader>
                <CardContent className="pb-8 px-8">
                  <Formik
                    initialValues={{
                      name: "",
                      email: "",
                      password: "",
                      confirmPassword: "",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSignUp}
                  >
                    {({ errors, touched }) => (
                      <Form className="space-y-5">
                        {/* Name Field */}
                        <div className="space-y-3">
                          <Label
                            htmlFor="name"
                            className="text-sm font-medium text-gray-700"
                          >
                            Full Name
                          </Label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <AiOutlineUser className="h-5 w-5 text-gray-400" />
                            </div>
                            <Field
                              as={Input}
                              id="name"
                              name="name"
                              type="text"
                              placeholder="Enter your full name"
                              className="pl-10 h-12 rounded-xl border-gray-300 focus:border-amber-500 focus:ring-amber-500 transition-all duration-200"
                            />
                          </div>
                          {errors.name && touched.name && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                              <span>•</span>
                              {errors.name}
                            </p>
                          )}
                        </div>

                        {/* Email Field */}
                        <div className="space-y-3">
                          <Label
                            htmlFor="email"
                            className="text-sm font-medium text-gray-700"
                          >
                            Email Address
                          </Label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <AiOutlineMail className="h-5 w-5 text-gray-400" />
                            </div>
                            <Field
                              as={Input}
                              id="email"
                              name="email"
                              type="email"
                              placeholder="Enter your email"
                              className="pl-10 h-12 rounded-xl border-gray-300 focus:border-amber-500 focus:ring-amber-500 transition-all duration-200"
                            />
                          </div>
                          {errors.email && touched.email && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                              <span>•</span>
                              {errors.email}
                            </p>
                          )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-3">
                          <Label
                            htmlFor="password"
                            className="text-sm font-medium text-gray-700"
                          >
                            Password
                          </Label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <AiOutlineLock className="h-5 w-5 text-gray-400" />
                            </div>
                            <Field
                              as={Input}
                              id="password"
                              name="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a password"
                              className="pl-10 pr-12 h-12 rounded-xl border-gray-300 focus:border-amber-500 focus:ring-amber-500 transition-all duration-200"
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <AiOutlineEyeInvisible className="w-5 h-5 text-gray-500" />
                              ) : (
                                <AiOutlineEye className="w-5 h-5 text-gray-500" />
                              )}
                            </button>
                          </div>
                          {errors.password && touched.password && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                              <span>•</span>
                              {errors.password}
                            </p>
                          )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-3">
                          <Label
                            htmlFor="confirmPassword"
                            className="text-sm font-medium text-gray-700"
                          >
                            Confirm Password
                          </Label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <AiOutlineLock className="h-5 w-5 text-gray-400" />
                            </div>
                            <Field
                              as={Input}
                              id="confirmPassword"
                              name="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm your password"
                              className="pl-10 pr-12 h-12 rounded-xl border-gray-300 focus:border-amber-500 focus:ring-amber-500 transition-all duration-200"
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                            >
                              {showConfirmPassword ? (
                                <AiOutlineEyeInvisible className="w-5 h-5 text-gray-500" />
                              ) : (
                                <AiOutlineEye className="w-5 h-5 text-gray-500" />
                              )}
                            </button>
                          </div>
                          {errors.confirmPassword &&
                            touched.confirmPassword && (
                              <p className="text-sm text-red-500 flex items-center gap-1">
                                <span>•</span>
                                {errors.confirmPassword}
                              </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                          type="submit"
                          className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 mt-6"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Creating Account...
                            </div>
                          ) : (
                            "Create Account"
                          )}
                        </Button>

                        {/* Sign In Link */}
                        <div className="text-center pt-4">
                          <p className="text-gray-600 text-sm">
                            Already have an account?{" "}
                            <button
                              type="button"
                              onClick={handleSignIn}
                              className="font-semibold text-amber-600 hover:text-amber-700 underline transition-colors duration-200"
                            >
                              Sign in here
                            </button>
                          </p>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SignUp;
