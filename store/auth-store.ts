import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/api/api";

interface AuthState {
  isLoggedIn: boolean;
  user: { email: string; name: string } | null;
  checkAuth: () => Promise<boolean>;
  validateCredentials: (email: string, password: string) => boolean;
  register: (
    userData: { name: string; email: string },
    password: string
  ) => boolean;
  logout: () => void;
  setUser: (user: { email: string; name: string } | null) => void;
}

// In-memory user store (in a real app, this would be in a database)
const users: Array<{
  email: string;
  name: string;
  password: string;
  verified: boolean;
}> = [];

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,

      checkAuth: async () => {
        try {
          // Check if user is logged in from localStorage (set by validateCredentials)
          const storedUser = localStorage.getItem("auth_user");
          if (storedUser) {
            const user = JSON.parse(storedUser);
            set({ isLoggedIn: true, user });
            return true;
          }
          return false;
        } catch (error) {
          console.error("Error checking auth:", error);
          return false;
        }
      },

      validateCredentials: (email: string, password: string) => {
        // Check if user exists and password matches
        const user = users.find(
          (u) => u.email === email && u.password === password && u.verified
        );

        if (user) {
          const userData = { email: user.email, name: user.name };
          localStorage.setItem("auth_user", JSON.stringify(userData));
          set({ isLoggedIn: true, user: userData });
          return true;
        }
        return false;
      },

      register: (
        userData: { name: string; email: string },
        password: string
      ) => {
        // Check if email already exists
        if (users.find((u) => u.email === userData.email)) {
          return false;
        }

        // Add user (unverified - would need OTP verification in real app)
        // For demo, we'll mark as verified
        users.push({
          email: userData.email,
          name: userData.name,
          password,
          verified: true,
        });

        return true;
      },

      logout: () => {
        localStorage.removeItem("auth_user");
        set({ isLoggedIn: false, user: null });
      },

      setUser: (user: { email: string; name: string } | null) => {
        set({ user, isLoggedIn: !!user });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
      }),
    }
  )
);

export default useAuthStore;
