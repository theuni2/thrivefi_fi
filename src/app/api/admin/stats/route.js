import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import User from "@/models/User";
import Enrollment from "@/models/Enrollment"; // Assuming you have this model
import { getAllCourses } from "@/lib/courseData";
import { verifyToken } from "@/lib/auth";

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
    // We can count distinct users in Enrollments collection
    const activeStudentIds = await Enrollment.distinct("user");
    const activeStudentCount = activeStudentIds.length;

    // 3. Average Progress
    // Aggregate over all enrollments
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

    // 4. Total Courses (from our static data or distinct courses in enrollments)
    // Assuming static course data is the source of truth for "Total Available Courses"
    const allCourses = await getAllCourses();
    const totalCourses = allCourses.length;

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
