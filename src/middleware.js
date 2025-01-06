// middleware.js

import { NextResponse } from "next/server";

export function middleware(request) {
  const isAuthenticated = request.cookies.get("isAuthenticated"); // Example of cookie-based auth

  if (!isAuthenticated && request.nextUrl.pathname.startsWith("/")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
