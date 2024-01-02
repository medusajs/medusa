import { AdminAuthRes, User } from "@medusajs/medusa";
import { createContext } from "react";

type AuthContextValue = {
  login: (email: string, password: string) => Promise<AdminAuthRes>;
  logout: () => Promise<void>;
  user: Omit<User, "password_hash"> | null;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
