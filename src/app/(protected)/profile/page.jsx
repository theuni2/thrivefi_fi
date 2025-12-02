"use client";

import React, { useEffect, useState } from "react";
import {
  User,
  BookOpen,
  Award,
  Clock,
  TrendingUp,
  BadgeCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getAllCourses, getModuleData } from "@/lib/courseData";

function Profile() {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);

  const [courses, setCourses] = useState([]); // ALL courses (all enrolled)

  const student = {
    name: "Rajnish Tripathi",
    email: "rajnishtripathi2001@gmail.com",
    joinedDate: "January 2024",
  };

  // ---------------------------------------------
  // LOAD COURSE DATA FROM JSON
  // ---------------------------------------------
  useEffect(() => {
    async function load() {
      const allCourses = await getAllCourses();

      // Attach calculated progress to each course
      const updated = await Promise.all(
        allCourses.map(async (course) => {
          let totalLessons = 0;
          let completedLessons = 0;

          for (const mod of course.modules || []) {
            const moduleData = await getModuleData(course.slug, mod.moduleNumber);
            const chapters = moduleData.chapters || [];

            totalLessons += chapters.length;
            completedLessons += Math.floor(chapters.length / 2); // Placeholder for now
          }

          const progress =
            totalLessons === 0
              ? 0
              : Math.floor((completedLessons / totalLessons) * 100);

          return {
            ...course,
            progress,
            totalLessons,
            completedLessons,
            lastAccessed: "Recently",
          };
        })
      );

      setCourses(updated);
    }

    load();
  }, []);

  // ---------------------------------------------
  // EMAIL VERIFICATION CHECK
  // ---------------------------------------------
  useEffect(() => {
    const statusCheck = async () => {
      try {
        const res = await fetch("/api/auth/verify-email");
        const data = await res.json();
        setIsVerified(data.isVerified);
      } catch (error) {
        console.log("ERR: ", error);
      }
    };

    statusCheck();
  }, []);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout");
      router.push("/login");
    } catch (error) {
      console.error("Logout Error: ", error);
    }
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 flex-1">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {student.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl font-bold">{student.name}</h1>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                  <p className="text-gray-600">{student.email}</p>

                  {isVerified ? (
                    <BadgeCheck className="w-4 h-4 text-blue-600" />
                  ) : (
                    <button
                      className="px-2 py-1 border border-blue-600 rounded-lg text-blue-600 hover:bg-blue-600 hover:text-white flex items-center gap-1"
                      onClick={() => router.push("/verify-email")}
                    >
                      <User className="w-4 h-4" /> Verify Email
                    </button>
                  )}
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  Member since {student.joinedDate}
                </p>
              </div>
            </div>

            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              onClick={logout}
            >
              Log Out
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Total Courses"
            value={totalCourses}
            icon={<BookOpen className="w-10 h-10 text-blue-500" />}
          />
          <StatCard
            label="Completed"
            value={completedCourses}
            icon={<Award className="w-10 h-10 text-green-500" />}
          />
          <StatCard
            label="In Progress"
            value={totalCourses - completedCourses}
            icon={<Clock className="w-10 h-10 text-orange-500" />}
          />
          <StatCard
            label="Overall Progress"
            value={overallProgress + "%"}
            icon={<TrendingUp className="w-10 h-10 text-purple-500" />}
          />
        </div>

        {/* MY COURSES */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">My Courses</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                <div className="w-full h-32 bg-blue-500 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-white" />
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-lg">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    by {course.instructor}
                  </p>

                  {/* Progress bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span className="font-semibold">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600 mb-3">
                    <span>
                      {course.completedLessons}/{course.totalLessons} lessons
                    </span>
                    <span>Last: {course.lastAccessed}</span>
                  </div>

                  <button
                    onClick={() => router.push(`/courses/${course.slug}`)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
                  >
                    {course.progress === 100
                      ? "Review Course"
                      : "Continue Learning"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {courses.length === 0 && (
            <div className="text-center py-10">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No courses available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------
// Small Reusable Component
// ---------------------------------------------
function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        {icon}
      </div>
    </div>
  );
}

export default Profile;
