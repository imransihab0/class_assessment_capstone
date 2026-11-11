import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { User, UserRole } from "../types";

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  isLoggedIn: boolean;
  setCurrentUser: (user: User | null) => void;
  login: (email: string, password: string, expectedRole?: UserRole) => Promise<User>;
  logout: () => void;
  registerUser: (name: string, email: string, role: "student" | "client", password: string) => Promise<User>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const users = useQuery(api.users.listUsers, {}) as User[] | undefined;
  const registerMutation = useMutation(api.users.registerUser);
  const loginUser = useMutation(api.users.loginUser);

  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    return localStorage.getItem("diu_capstone_userId") || null;
  });

  // Only restore session if a valid userId was saved during actual login
  useEffect(() => {
    if (users && users.length > 0 && currentUserId) {
      const exists = users.some((u) => u._id === currentUserId);
      if (!exists) {
        setCurrentUserId(null);
        localStorage.removeItem("diu_capstone_userId");
      }
    }
  }, [users, currentUserId]);

  const currentUser = users?.find((u) => u._id === currentUserId) || null;

  const login = async (email: string, password: string, expectedRole?: UserRole): Promise<User> => {
    const user = (await loginUser({
      email,
      password,
      expectedRole,
    })) as User;

    setCurrentUserId(user._id);
    localStorage.setItem("diu_capstone_userId", user._id);
    return user;
  };

  const logout = () => {
    setCurrentUserId(null);
    localStorage.removeItem("diu_capstone_userId");
  };

  const registerUser = async (
    name: string,
    email: string,
    role: "student" | "client",
    password: string
  ): Promise<User> => {
    const user = (await registerMutation({
      name,
      email,
      role,
      password,
    })) as User;

    setCurrentUserId(user._id);
    localStorage.setItem("diu_capstone_userId", user._id);
    return user;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users: users || [],
        isLoggedIn: Boolean(currentUser),
        setCurrentUser: (user) => {
          if (user) {
            setCurrentUserId(user._id);
            localStorage.setItem("diu_capstone_userId", user._id);
          } else {
            logout();
          }
        },
        login,
        logout,
        registerUser,
        isLoading: !users,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
