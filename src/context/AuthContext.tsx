"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import SessionAlert from "../app/components/SessionAlert";

interface User {
  user_id: string;
  username: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  logout: () => void;
  login: (data: { token: string; user: User }) => void;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Add new interface for session timeout modal
interface SessionTimeoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SessionTimeoutModal: React.FC<SessionTimeoutModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div>
      <SessionAlert onClose={onClose} />
    </div>
  );
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [showTimeoutModal, setShowTimeoutModal] = useState<boolean>(false);

  const SESSION_TIMEOUT = 120 * 60 * 1000; // 1 hour in milliseconds

  useEffect(() => {
    // Retrieve token and user data from localStorage
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        // console.log("User loaded from localStorage:", parsedUser);
      } catch (error) {
        console.error("Failed to parse user data", error);
        setIsAuthenticated(false);
        setUser(null);
      }
    }

    startActivityTracking();

    // Start session timeout timer
    const interval = setInterval(() => checkSessionTimeout(), 1000);
    return () => clearInterval(interval);
  }, []);

  const startActivityTracking = () => {
    // Update last activity time on user interaction
    const updateActivity = () => setLastActivity(Date.now());

    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("keydown", updateActivity);
    window.addEventListener("click", updateActivity);

    return () => {
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("keydown", updateActivity);
      window.removeEventListener("click", updateActivity);
    };
  };

  const checkSessionTimeout = () => {
    if (Date.now() - lastActivity > SESSION_TIMEOUT && !showTimeoutModal) {
      logout();
      setShowTimeoutModal(true);
    }
  };

  const login = (data: { token: string; user: User }) => {
    const { token, user } = data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    setUser(user);
    setIsAuthenticated(true);
    setLastActivity(Date.now());
    // console.log("User logged in:", user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    router.push("/login");
  };

  const handleTimeoutModalClose = () => {
    setShowTimeoutModal(false);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, logout, login, user }}
    >
      {children}
      <SessionTimeoutModal
        isOpen={showTimeoutModal}
        onClose={handleTimeoutModalClose}
      />
    </AuthContext.Provider>
  );
};
