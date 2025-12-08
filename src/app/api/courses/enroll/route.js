import { NextResponse } from "next/server";
import Enrollment from "@/models/Enrollment"; // Make sure to create this model
import { connectDB } from "@/lib/database";
import { decodeToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = decodeToken(token);
    if (!decoded) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { courseSlug } = await req.json();
    if (!courseSlug) {
        return NextResponse.json({ error: "Course Slug required" }, { status: 400 });
    }

    await connectDB();

    // Check existing
    const existing = await Enrollment.findOne({ user: decoded.id, courseSlug });
    if (existing) {
        return NextResponse.json({ success: true, message: "Already enrolled" });
    }

    await Enrollment.create({
        user: decoded.id,
        courseSlug,
        progress: 0,
        completedChapters: []
    });

    return NextResponse.json({ success: true, message: "Enrolled successfully" });

  } catch (error) {
    console.error("Enrollment Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
