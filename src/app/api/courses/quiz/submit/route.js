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

    const { courseSlug, chapterId, quizId, score, totalQuestions, answers } =
      await req.json();

    if (!courseSlug || !chapterId || !quizId || score === undefined) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connectDB();

    // Find or create enrollment
    let enrollment = await Enrollment.findOne({
      user: decoded.id,
      courseSlug,
    });

    if (!enrollment) {
      // Create enrollment if it doesn't exist
      enrollment = new Enrollment({
        user: decoded.id,
        courseSlug,
        completedChapters: [],
        quizScores: [],
        progress: 0,
      });
    }

    // Check if quiz was already submitted
    const existingQuiz = enrollment.quizScores.find((q) => q.quizId === quizId);

    if (existingQuiz) {
      return NextResponse.json(
        { error: "Quiz already submitted. Retakes are not allowed." },
        { status: 400 }
      );
    }

    // Add quiz score
    enrollment.quizScores.push({
      quizId,
      chapterId,
      score,
      totalQuestions,
      completedAt: new Date(),
    });

    // Mark chapter as completed if passed (score >= passing score)
    // We'll assume passing score is 60% (you can pass this from frontend if needed)
    if (score >= 60 && !enrollment.completedChapters.includes(chapterId)) {
      enrollment.completedChapters.push(chapterId);
    }

    // Update last accessed
    enrollment.lastAccessedAt = new Date();

    // Calculate progress
    const filePath = path.join(
      process.cwd(),
      "public",
      "data",
      "courses",
      courseSlug,
      "course.json"
    );

    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const courseData = JSON.parse(fileContent);
      const totalChapters = courseData.chapters
        ? courseData.chapters.length
        : 0;

      if (totalChapters > 0) {
        const completedCount = enrollment.completedChapters.length;
        enrollment.progress = Math.min(
          100,
          Math.round((completedCount / totalChapters) * 100)
        );
      }
    }

    await enrollment.save();

    return NextResponse.json({
      success: true,
      score,
      progress: enrollment.progress,
      completedChapters: enrollment.completedChapters,
      quizScores: enrollment.quizScores,
    });
  } catch (error) {
    console.error("Quiz Submission Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
