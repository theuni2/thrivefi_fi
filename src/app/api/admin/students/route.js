import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import User from "@/models/User";
import Enrollment from "@/models/Enrollment";
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

    const adminUser = await User.findById(decoded.id);
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    // 1. Fetch all students
    const users = await User.find({ role: "user" }).select("-password").lean();

    // 2. For each student, fetch their enrollment stats
    // Note: Doing this in a loop is N+1, but for a dashboard with pagination (which we should eventually add) it's okay.
    // For better performance with many users, we should use $lookup.

    // Improved approach: Parallelize or use aggregation
    const studentsWithStats = await Promise.all(
      users.map(async (user) => {
        const enrollments = await Enrollment.find({ user: user._id }).lean();

        const coursesEnrolled = enrollments.length;
        const coursesCompleted = enrollments.filter(
          (e) => e.progress === 100
        ).length;

        const totalProgress = enrollments.reduce(
          (acc, curr) => acc + (curr.progress || 0),
          0
        );
        const overallProgress =
          coursesEnrolled > 0 ? Math.round(totalProgress / coursesEnrolled) : 0;

        // Calculate average quiz score from enrollments
        // Each enrollment has quizScores array with {quizId, score, ...}
        const allQuizScores = enrollments.flatMap((e) => e.quizScores || []);
        const avgQuizScore =
          allQuizScores.length > 0
            ? Math.round(
                allQuizScores.reduce(
                  (sum, quiz) => sum + (quiz.score || 0),
                  0
                ) / allQuizScores.length
              )
            : 0;

        return {
          _id: user._id, // User ID
          name: user.name,
          email: user.email,
          createdAt: user.createdAt, // Joined Date
          coursesEnrolled,
          coursesCompleted,
          overallProgress,
          avgQuizScore,
          enrollments: enrollments.map((e) => ({
            courseSlug: e.courseSlug,
            progress: e.progress,
          })),
        };
      })
    );

    return NextResponse.json({
      success: true,
      students: studentsWithStats,
    });
  } catch (error) {
    console.error("Admin Students Fetch Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
