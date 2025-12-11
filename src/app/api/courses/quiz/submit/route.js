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

    const {
      courseSlug,
      chapterId,
      quizId,
      score,
      totalQuestions,
      answers,
      saveOnly,
    } = await req.json();

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
    const existingQuizIndex = enrollment.quizScores.findIndex(
      (q) => q.quizId === quizId
    );

    if (existingQuizIndex !== -1) {
      // Quiz exists. check if chapter is marked complete
      const isChapterCompleted =
        enrollment.completedChapters.includes(chapterId);

      // If chapter is already completed, we generally don't allow changes unless it's a "saveOnly" request that might be redundant but harmless?
      // Actually per requirements, "once submit there should be no option to edit".
      // But "Submit" (saveOnly) happens BEFORE "Mark as Completed".
      // So if isChapterCompleted is true, we block.
      if (isChapterCompleted) {
        return NextResponse.json(
          { error: "Chapter already completed. Retakes are not allowed." },
          { status: 400 }
        );
      }

      // Update existing quiz entry (e.g. they saved once, now saving again or completing)
      // Update the chapterId reference in quizScore to match current request (fix for id mismatch issues)
      enrollment.quizScores[existingQuizIndex].chapterId = chapterId;

      if (answers) {
        enrollment.quizScores[existingQuizIndex].answers = answers;
      }

      if (score !== undefined) {
        enrollment.quizScores[existingQuizIndex].score = score;
      }

      // Mark chapter as completed ONLY if NOT saveOnly
      if (!saveOnly && score >= 60) {
        enrollment.completedChapters.push(chapterId);
      }
    } else {
      // New Submission
      enrollment.quizScores.push({
        quizId,
        chapterId,
        score,
        totalQuestions,
        answers, // Save answers
        completedAt: new Date(),
      });

      // Mark chapter as completed ONLY if NOT saveOnly
      if (
        !saveOnly &&
        score >= 60 &&
        !enrollment.completedChapters.includes(chapterId)
      ) {
        enrollment.completedChapters.push(chapterId);
      }
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
