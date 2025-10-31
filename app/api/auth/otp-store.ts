// In-memory store for OTPs (for demo; use a DB in production)
export const otpStore: { [email: string]: { otp: string; expires: number } } =
  {};
