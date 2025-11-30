import { NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

export function middleware(req) {
  const protectedPaths = ["/dashboard", "/profile", "/course"];

  const path = req.nextUrl.pathname;

  // console.log("Middleware hit:", path);

  const isProtected = protectedPaths.some((p) => path.startsWith(p));

  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get("token")?.value;

  // console.log("Token:", token);

  if (!token) {
    console.log("redirecting back to LOGIN")
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    verifyToken(token);
    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard", "/profile", "/course/:path*", "/protected/:path*"],
};
