// src/app/client-layout.tsx
"use client";

import Navbar from "./components/navbar/page";
import SideBar from "./components/sidebar/page";
import Footer from "./components/footer/page";
import { useAuth } from "../context/AuthContext";
import AuthGuard from "./components/AuthGuard";

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  return (
    <AuthGuard>
      <div className="flex flex-col h-screen">
        {isAuthenticated && <Navbar />}
        <div className="flex flex-1 overflow-hidden">
          {isAuthenticated && <SideBar />}
          <main className="flex-1 p-4 overflow-y-auto">{children}</main>
        </div>
        {isAuthenticated && <Footer />}
      </div>
    </AuthGuard>
  );
}
