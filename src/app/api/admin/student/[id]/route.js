import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import User from "@/models/User";
import Enrollment from "@/models/Enrollment";
import { getAllCourses } from "@/lib/courseData";
import { verifyToken } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

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

    // 1. Fetch User
    const user = await User.findById(id).select("-password").lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Fetch Enrollments
    const enrollments = await Enrollment.find({ user: id }).lean();

    // 3. Enrich Enrollments with Course Metadata (Title, etc.)
    // We need course titles from our static data since Enrollment only stores slugs
    const allCourses = await getAllCourses();

    const enrichedCourses = enrollments.map((enrollment) => {
      const courseInfo = allCourses.find(
        (c) => c.slug === enrollment.courseSlug
      );
      return {
        ...enrollment,
        courseTitle: courseInfo?.title || enrollment.courseSlug,
        totalChapters: courseInfo?.modules
          ? courseInfo.modules.reduce(
              (acc, m) => acc + (m.chapters ? m.chapters.length : 0),
              0
            )
          : 0, // Approx
        // We can get precise total chapters if we load each course detail, but this might be heavy.
        // Let's stick to basic info or what's available.
        // Actually, courseData has `totalChapters` sometimes? No, it's typically computed.
        // For simplicity, we just pass the raw enrollment data + title.
      };
    });

    const stats = {
      coursesEnrolled: enrollments.length,
      coursesCompleted: enrollments.filter((e) => e.progress === 100).length,
      averageProgress:
        enrollments.length > 0
          ? Math.round(
              enrollments.reduce((acc, curr) => acc + curr.progress, 0) /
                enrollments.length
            )
          : 0,
    };

    // Prepare comprehensive student details
    const studentDetails = {
      // Basic Information
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,

      // Verification & Status
      verified: user.verified,

      // Contact Information
      address: user.address || null,
      mobile: user.mobile || null,

      // Referral Information
      referralCode: user.referralCode || null,
      referredBy: user.referredBy || null,

      // Timestamps
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,

      // Course Statistics
      stats,

      // Enrolled Courses Details
      courses: enrichedCourses,
    };

    return NextResponse.json({
      success: true,
      student: studentDetails,
    });
  } catch (error) {
    console.error("Student Detail Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
