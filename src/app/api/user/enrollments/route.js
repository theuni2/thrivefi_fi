import { NextResponse } from "next/server";
import Enrollment from "@/models/Enrollment";
import { connectDB } from "@/lib/database";
import { decodeToken } from "@/lib/auth";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = decodeToken(token);
    if (!decoded) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await connectDB();

    const enrollments = await Enrollment.find({ user: decoded.id }).sort({ lastAccessedAt: -1 });

    return NextResponse.json({ success: true, enrollments });

  } catch (error) {
    console.error("Fetch Enrollments Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
