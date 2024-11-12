// src/app/middleware.js

import { NextResponse } from "next/server";

export async function middleware(request) {
  console.log("middleware executed");
  const token = request.cookies.get("next-auth.session-token"); // Get the session token from cookies

  const isAuthPage = request.nextUrl.pathname.startsWith("/auth");
  const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard");

  // If user is not authenticated and trying to access a protected page (e.g., dashboard)
  if (!token && isDashboardPage ) {
    return NextResponse.redirect(new URL("/auth/signIn", request.url));
  }

  // Prevent authenticated users from accessing the auth pages
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow the request to continue
  return NextResponse.next();
}

// This is where you specify which paths should use this middleware
export const config = {
  matcher: [
    "/dashboard/:path*", // Protect the dashboard and any nested paths
    "/profile/:path*", // Protect profile and any nested paths
    "/auth/signIn",
    // "/:path*", // Also protect the sign-in page if the user is not authenticated
  ],
};
