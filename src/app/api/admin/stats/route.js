import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import User from "@/models/User";
import Enrollment from "@/models/Enrollment";
import { verifyToken } from "@/lib/auth";
import fs from "fs";
import path from "path";

export async function GET(req) {
  try {
    await connectDB();

    // Auth Check
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    // Optional: Verify admin role from DB to be safe
    const adminUser = await User.findById(decoded.id);
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    // 1. Total Students
    const studentCount = await User.countDocuments({ role: "user" });

    // 2. Active Students (Users who have at least one enrollment)
    const activeStudentIds = await Enrollment.distinct("user");
    const activeStudentCount = activeStudentIds.length;

    // 3. Average Progress
    const progressAgg = await Enrollment.aggregate([
      {
        $group: {
          _id: null,
          avgProgress: { $avg: "$progress" },
        },
      },
    ]);
    const averageProgress =
      progressAgg.length > 0 ? Math.round(progressAgg[0].avgProgress) : 0;

    // 4. Total Courses - Read from courses.json file
    let totalCourses = 0;
    try {
      const coursesFilePath = path.join(
        process.cwd(),
        "public",
        "data",
        "courses",
        "courses.json"
      );
      const coursesData = fs.readFileSync(coursesFilePath, "utf8");
      const coursesJson = JSON.parse(coursesData);
      totalCourses = coursesJson.courses?.length || 0;
    } catch (error) {
      console.error("Error reading courses.json:", error);
      totalCourses = 0;
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalStudents: studentCount,
        activeStudents: activeStudentCount,
        averageProgress,
        totalCourses,
      },
    });
  } catch (error) {
    console.error("Stats Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
