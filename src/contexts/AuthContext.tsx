
import React, { createContext, useContext, useState, useEffect } from "react";
import { login, register, logout, getCurrentUser } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "student";
  score?: number;
  rounds?: {[key: string]: number}; // Track scores for different rounds
  problemsSolved?: number; // Track number of problems solved
  lastSubmission?: string; // Timestamp of last submission
  submissions?: {
    problemId: number;
    timestamp: string;
    passed: boolean;
    score: number;
  }[]; // Track all submissions
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      const loggedInUser = await login(email, password);
      setUser(loggedInUser);
      toast.success("Login successful!");
      navigate(loggedInUser.role === "admin" ? "/admin" : "/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to login");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      const registeredUser = await register(name, email, password);
      setUser(registeredUser);
      toast.success("Registration successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to register");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    toast.info("Logged out");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
