// src/app/LayoutWrapper.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import ClientRootLayout from "./client-layout";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const unauthenticatedRoutes = ["/login"];

  // Check if the current route is unauthenticated
  const isUnauthenticatedRoute = unauthenticatedRoutes.includes(path);

  useEffect(() => {
    if (!isAuthenticated && !isUnauthenticatedRoute) {
      router.push("/login");
    }
  }, [isAuthenticated, isUnauthenticatedRoute, router]);

  return (
    <>
      {isUnauthenticatedRoute ? (
        <>{children}</> // Render only login page if unauthenticated
      ) : (
        <ClientRootLayout>{children}</ClientRootLayout> // Render layout if authenticated
      )}
    </>
  );
}
