"use client";

import Image from "next/image";
import { useState } from "react";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineMail,
  AiOutlineLock,
} from "react-icons/ai";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import useAuthStore from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "@/components/Loader";
import PasswordResetModal from "@/components/PasswordResetModal";

const validationSchema = Yup.object({
  email: Yup.string()
    .required("Email is required.")
    .email("Invalid email format."),
  password: Yup.string()
    .required("Password is required.")
    .min(8, "Password must be at least 8 characters long.")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
    }),
});

const SignIn = () => {
  const validateCredentials = useAuthStore(
    (state) => state.validateCredentials
  );
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    const { email, password } = values;
    try {
      const isValid = await validateCredentials(email, password);
      if (isValid) {
        toast.success("Login successful!");
        router.push("/");
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error: any) {
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Left Section - Form */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-8">
          <div className="w-full max-w-md space-y-8">
            <Card className="w-full border-0 shadow-xl rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4 pt-8">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Welcome Back
                </CardTitle>
                <p className="text-gray-600 text-sm mt-2">
                  Sign in to your account to continue
                </p>
              </CardHeader>
              <CardContent className="pb-8 px-8">
                <Formik
                  initialValues={{ email: "", password: "" }}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ errors, touched }) => (
                    <Form className="space-y-6">
                      {/* Email Field */}
                      <div className="space-y-3">
                        <Label
                          htmlFor="email"
                          className="text-sm font-medium text-gray-700"
                        >
                          Email
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
                            placeholder="Enter your password"
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

                        <div className="text-right">
                          <button
                            type="button"
                            className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors duration-200"
                            onClick={() => setIsResetModalOpen(true)}
                          >
                            Forgot your password?
                          </button>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Signing In...
                          </div>
                        ) : (
                          "Sign In"
                        )}
                      </Button>

                      {/* Sign Up Link */}
                      <div className="text-center pt-4">
                        <p className="text-gray-600 text-sm">
                          Don&apos;t have an account?{" "}
                          <Link
                            href="/auth/signup"
                            className="font-semibold text-amber-600 hover:text-amber-700 underline transition-colors duration-200"
                          >
                            Create account
                          </Link>
                        </p>
                      </div>
                    </Form>
                  )}
                </Formik>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Section - Hero Image */}
        <div className="w-1/2 relative hidden lg:block">
          <Image
            src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            alt="Culinary Odyssey - Delicious Food"
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
                Your journey to exceptional catering management begins here.
                Streamline your operations and delight your clients.
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
      </div>

      <PasswordResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
      />
    </>
  );
};

export default SignIn;
