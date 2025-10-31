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

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "email" | "otp" | "password";

const emailValidationSchema = Yup.object({
  email: Yup.string()
    .required("Email is required.")
    .email("Invalid email format."),
});

const otpValidationSchema = Yup.object({
  otp: Yup.string()
    .required("OTP is required.")
    .length(6, "OTP must be 6 digits."),
});

const passwordValidationSchema = Yup.object({
  password: Yup.string()
    .required("Password is required.")
    .min(8, "Password must be at least 8 characters long.")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
    }),
  confirmPassword: Yup.string()
    .required("Confirm password is required.")
    .oneOf([Yup.ref("password"), ""], "Passwords don't match."),
});

const PasswordResetModal = ({ isOpen, onClose }: PasswordResetModalProps) => {
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (values: { email: string }) => {
    setIsLoading(true);
    try {
      await api.post("/auth/send-otp", { email: values.email });
      setEmail(values.email);
      setCurrentStep("otp");
      toast.success("OTP sent to your email!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (values: { otp: string }) => {
    setIsLoading(true);
    try {
      await api.post("/auth/verify-otp", { email, otp: values.otp });
      setCurrentStep("password");
      toast.success("OTP verified successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (values: {
    password: string;
    confirmPassword: string;
  }) => {
    setIsLoading(true);
    try {
      await api.post("/auth/reset-password", {
        email,
        password: values.password,
      });
      toast.success("Password reset successfully!");
      onClose();
      // Reset modal state
      setCurrentStep("email");
      setEmail("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setCurrentStep("email");
    setEmail("");
  };

  if (!isOpen) return null;

  const renderStep = () => {
    switch (currentStep) {
      case "email":
        return (
          <Formik
            key="email-form"
            initialValues={{ email: "" }}
            validationSchema={emailValidationSchema}
            onSubmit={handleEmailSubmit}
            enableReinitialize={false}
          >
            {({ errors, touched }) => (
              <Form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Field
                    as={Input}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                  />
                  {errors.email && touched.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending OTP..." : "Send OTP"}
                </Button>
              </Form>
            )}
          </Formik>
        );

      case "otp":
        return (
          <Formik
            key="otp-form"
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
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setCurrentStep("email")}
                >
                  Back to Email
                </Button>
              </Form>
            )}
          </Formik>
        );

      case "password":
        return (
          <Formik
            key="password-form"
            initialValues={{ password: "", confirmPassword: "" }}
            validationSchema={passwordValidationSchema}
            onSubmit={handlePasswordSubmit}
            enableReinitialize={false}
          >
            {({ errors, touched }) => (
              <Form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Field
                    as={Input}
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter new password"
                  />
                  {errors.password && touched.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Field
                    as={Input}
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                  />
                  {errors.confirmPassword && touched.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setCurrentStep("otp")}
                >
                  Back to OTP
                </Button>
              </Form>
            )}
          </Formik>
        );
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "email":
        return "Reset Password";
      case "otp":
        return "Enter OTP";
      case "password":
        return "Set New Password";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case "email":
        return "Enter your email address to receive a verification code.";
      case "otp":
        return "Enter the 6-digit code sent to your email.";
      case "password":
        return "Create a new password for your account.";
    }
  };

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
          <CardTitle>{getStepTitle()}</CardTitle>
          <p className="text-sm text-gray-600">{getStepDescription()}</p>
        </CardHeader>
        <CardContent>{renderStep()}</CardContent>
      </Card>
    </div>
  );
};

export default PasswordResetModal; 