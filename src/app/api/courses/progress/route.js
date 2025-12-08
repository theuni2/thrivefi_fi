import { NextResponse } from "next/server";
import Enrollment from "@/models/Enrollment";
import { connectDB } from "@/lib/database";
import { decodeToken } from "@/lib/auth";
import fs from "fs";
import path from "path";

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

    const { courseSlug, chapterId } = await req.json();
    if (!courseSlug || !chapterId) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connectDB();

    const enrollment = await Enrollment.findOne({ user: decoded.id, courseSlug });
    if (!enrollment) {
        return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }

    // Add chapter if not exists
    if (!enrollment.completedChapters.includes(chapterId)) {
        enrollment.completedChapters.push(chapterId);
    }

    // Update last accessed
    enrollment.lastAccessedAt = new Date();

    // Calculate progress
    // Read course JSON to get total chapters
    const filePath = path.join(process.cwd(), 'public', 'data', 'courses', courseSlug, 'course.json');
    
    if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const courseData = JSON.parse(fileContent);
        const totalChapters = courseData.chapters ? courseData.chapters.length : 0;
        
        if (totalChapters > 0) {
            const completedCount = enrollment.completedChapters.length;
            enrollment.progress = Math.min(100, Math.round((completedCount / totalChapters) * 100));
        }
    }

    await enrollment.save();

    return NextResponse.json({ 
        success: true, 
        progress: enrollment.progress,
        completedChapters: enrollment.completedChapters 
    });

  } catch (error) {
    console.error("Progress Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
