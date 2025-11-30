"use client";
import React, { useState, useEffect } from "react";
import {
  User,
  BookOpen,
  Award,
  Clock,
  TrendingUp,
  BadgeCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";

function Profile() {
  // Mock data - will be replaced with API data later
  const student = {
    name: "Rajnish Tripathi",
    email: "rajnishtripathi2001@gmail.com",
    joinedDate: "January 2024",
    totalCourses: 5,
    completedCourses: 2,
    overallProgress: 65,
  };

  const enrolledCourses = [
    {
      id: 1,
      title: "Introduction to Web Development",
      instructor: "John Doe",
      progress: 85,
      color: "bg-blue-500",
      totalLessons: 24,
      completedLessons: 20,
      lastAccessed: "2 days ago",
    },
    {
      id: 2,
      title: "Advanced JavaScript Concepts",
      instructor: "Jane Smith",
      progress: 60,
      color: "bg-purple-500",
      totalLessons: 18,
      completedLessons: 11,
      lastAccessed: "1 week ago",
    },
    {
      id: 3,
      title: "React & Next.js Masterclass",
      instructor: "Mike Johnson",
      progress: 45,
      color: "bg-green-500",
      totalLessons: 30,
      completedLessons: 14,
      lastAccessed: "3 days ago",
    },
    {
      id: 4,
      title: "Database Design & SQL",
      instructor: "Sarah Williams",
      progress: 30,
      color: "bg-orange-500",
      totalLessons: 22,
      completedLessons: 7,
      lastAccessed: "5 days ago",
    },
    {
      id: 5,
      title: "UI/UX Design Fundamentals",
      instructor: "Emily Davis",
      progress: 100,
      color: "bg-pink-500",
      totalLessons: 16,
      completedLessons: 16,
      lastAccessed: "2 weeks ago",
    },
  ];

  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const statusCheck = async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

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
      await fetch("/api/auth/logout", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
      router.push("/login");
    } catch (error) {
      console.error("Logout Error: ", error)
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 flex-1">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                {student.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  {student.name}
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                  <p className="text-gray-600 text-sm sm:text-base">
                    {student.email}
                  </p>
                  {isVerified ? (
                    <BadgeCheck className="w-4 h-4 text-blue-600" />
                  ) : (
                    <button
                      className="px-2 py-1 rounded-lg inline-flex items-center justify-center gap-1.5 text-sm text-blue-600 cursor-pointer border border-blue-600 hover:text-white hover:bg-blue-600 font-medium transition-colors"
                      onClick={() => router.push("/verify-email")}
                    >
                      <User className="w-4 h-4" />
                      Verify Email
                    </button>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Member since {student.joinedDate}
                </p>
              </div>
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors w-full sm:w-auto" onClick={logout}>
              Log Out
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Courses</p>
                <p className="text-3xl font-bold text-gray-800">
                  {student.totalCourses}
                </p>
              </div>
              <BookOpen className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-3xl font-bold text-gray-800">
                  {student.completedCourses}
                </p>
              </div>
              <Award className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">In Progress</p>
                <p className="text-3xl font-bold text-gray-800">
                  {student.totalCourses - student.completedCourses}
                </p>
              </div>
              <Clock className="w-10 h-10 text-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Overall Progress</p>
                <p className="text-3xl font-bold text-gray-800">
                  {student.overallProgress}%
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Enrolled Courses Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            My Enrolled Courses
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <div
                key={course.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div
                  className={`w-full h-32 ${course.color} flex items-center justify-center`}
                >
                  <BookOpen className="w-16 h-16 text-white" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    by {course.instructor}
                  </p>

                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span className="font-semibold">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
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

                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition-colors">
                    {course.progress === 100
                      ? "Review Course"
                      : "Continue Learning"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {enrolledCourses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No courses enrolled yet</p>
              <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors">
                Browse Courses
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
