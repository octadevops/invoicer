// app/dashboard/page.jsx

"use client";

import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen flex-col">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard!</h1>
      <button onClick={logout} className="bg-red-500 text-white rounded p-2">
        Logout
      </button>
    </div>
  );
}
