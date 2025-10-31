"use client";

import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

interface SignupOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

const otpValidationSchema = Yup.object({
  otp: Yup.string()
    .required("OTP is required.")
    .length(6, "OTP must be 6 digits."),
});

const SignupOtpModal = ({ isOpen, onClose, email }: SignupOtpModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleOtpSubmit = async (values: { otp: string }) => {
    setIsLoading(true);
    try {
      await api.post("/auth/verify-signup-otp", { email, otp: values.otp });
      toast.success("Account verified successfully! Please sign in.");
      onClose();
      router.push("/auth/signin");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      await api.post("/auth/send-otp", { email });
      toast.success("OTP resent successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="relative">
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
          <CardTitle>Verify Your Email</CardTitle>
          <p className="text-sm text-gray-600">
            Enter the 6-digit code sent to your email to complete registration.
          </p>
        </CardHeader>
        <CardContent>
          <Formik
            key="signup-otp-form"
            initialValues={{ otp: "" }}
            validationSchema={otpValidationSchema}
            onSubmit={handleOtpSubmit}
            enableReinitialize={false}
          >
            {({ errors, touched }) => (
              <Form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Field
                    as={Input}
                    id="otp"
                    name="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                  />
                  {errors.otp && touched.otp && (
                    <p className="text-sm text-red-500">{errors.otp}</p>
                  )}
                  <p className="text-sm text-gray-600">
                    We've sent a 6-digit code to {email}
                  </p>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify & Complete Registration"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Resend OTP"}
                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupOtpModal; 