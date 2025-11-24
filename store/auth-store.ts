import { create } from "zustand";
import { persist } from "zustand/middleware";
import { localStorageService } from "@/services/localStorage";

interface AuthState {
  isLoggedIn: boolean;
  user: { email: string; name: string } | null;
  checkAuth: () => Promise<boolean>;
  validateCredentials: (email: string, password: string) => Promise<boolean>;
  register: (
    userData: { name: string; email: string },
    password: string
  ) => Promise<boolean>;
  logout: () => void;
  setUser: (user: { email: string; name: string } | null) => void;
}

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

      validateCredentials: async (email: string, password: string) => {
        try {
          const response = await localStorageService.login(email);
          if (response && response.user) {
             const userData = { email: response.user.email, name: response.user.name };
             localStorage.setItem("auth_user", JSON.stringify(userData));
             set({ isLoggedIn: true, user: userData });
             return true;
          }
          return false;
        } catch (error) {
          console.error("Login failed:", error);
          return false;
        }
      },

      register: async (
        userData: { name: string; email: string },
        password: string
      ) => {
        try {
          await localStorageService.signup({ ...userData, password });
          return true;
        } catch (error) {
          console.error("Registration failed:", error);
          return false;
        }
      },

      logout: () => {
        localStorageService.logout();
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

