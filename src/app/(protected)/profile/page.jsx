"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAllCourses,
  getModuleData,
  getCourseBySlug,
} from "@/lib/courseData";
import ProfileHeader from "@/components/profile/ProfileHeader";
import StatsGrid from "@/components/profile/StatsGrid";
import CourseList from "@/components/profile/CourseList";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function validateAdmin() {
      try {
        const res = await fetch("/api/admin/validate");
        const data = await res.json();

        if (res.ok || data.success) {
          router.push("/dashboard");
          return;
        }
        return;
      } catch (error) {
        console.error("Role Validation Error:", error);
        router.push("/login");
      }
    }
    validateAdmin();
  }, [router]);

  // ---------------------------------------------
  // FETCH USER DATA
  // ---------------------------------------------
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          // If unauthorized or error, maybe redirect to login?
          // For now, just logging it.
          console.error("Failed to fetch user");
          // router.push("/login");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  // ---------------------------------------------
  // FETCH ENROLLMENTS
  // ---------------------------------------------
  useEffect(() => {
    async function loadEnrollments() {
      try {
        const [enrollRes, allCourses] = await Promise.all([
          fetch("/api/user/enrollments"),
          getAllCourses(),
        ]);

        if (enrollRes.ok) {
          const data = await enrollRes.json();
          const enrollments = data.enrollments || [];

          // Fetch full details for each enrolled course to get chapter count
          const enrolledCoursesData = await Promise.all(
            enrollments.map(async (enroll) => {
              // We try to get full data, including chapters
              // We can use getCourseBySlug imported from lib, but detailed course info requires a separate fetch internally
              // Importing getCourseBySlug and calling it:
              const fullCourse = await getCourseBySlug(enroll.courseSlug);
              if (!fullCourse) return null;

              return {
                ...fullCourse,
                progress: enroll.progress,
                totalLessons: fullCourse.chapters?.length || 0,
                completedLessons: enroll.completedChapters.length,
                lastAccessed: new Date(
                  enroll.lastAccessedAt
                ).toLocaleDateString(),
                enrolledAt: enroll.enrolledAt,
              };
            })
          );

          setCourses(enrolledCoursesData.filter(Boolean));
        }
      } catch (error) {
        console.error("Failed to load enrollments", error);
      }
    }

    if (user) {
      loadEnrollments();
    }
  }, [user]);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout");
      router.push("/login");
    } catch (error) {
      console.error("Logout Error: ", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Or a placeholder/redirect
  }

  // Format date
  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  const studentData = {
    name: user.name,
    email: user.email,
    joinedDate: joinedDate,
  };

  // Stats
  const totalCourses = courses.length;
  const completedCourses = courses.filter((c) => c.progress === 100).length;
  const overallProgress =
    totalCourses === 0
      ? 0
      : Math.floor(
          courses.reduce((acc, c) => acc + c.progress, 0) / totalCourses
        );

  const stats = {
    totalCourses,
    completedCourses,
    inProgress: totalCourses - completedCourses,
    overallProgress,
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Top Banner / Decoration */}
      <div className="h-64 bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-600 px-6 sm:px-12 relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-12">
        {/* PROFILE HEADER CARD */}
        <ProfileHeader
          student={studentData}
          isVerified={user.verified}
          onVerifyClick={() => router.push("/verify-email")}
          onLogout={logout}
          onViewDetails={() => router.push("/profile/details")}
        />

        {/* STATS GRID */}
        <StatsGrid stats={stats} />

        {/* COURSES SECTION */}
        <CourseList courses={courses} />
      </div>
    </div>
  );
}
