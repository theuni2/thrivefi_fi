import { NextResponse } from "next/server";
import { decodeToken } from "@/lib/auth";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "No token provided",
          success: false,
        },
        { status: 401 }
      );
    }

    const decoded = decodeToken(token);

    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json(
        {
          error: "Forbidden",
          message: "Admin access required",
          success: false,
          role: decoded.role,
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Admin access granted", role: decoded.role },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin validation error:", error);
    return NextResponse.json(
      { error: "Server error", success: false },
      { status: 500 }
    );
  }
}
