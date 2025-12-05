"use client";

import React, { useEffect, useState } from "react";
import {
  User,
  BookOpen,
  Award,
  Clock,
  TrendingUp,
  BadgeCheck,
  LogOut,
  Mail,
  Calendar,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getAllCourses, getModuleData } from "@/lib/courseData";

export default function Profile() {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);
  const [courses, setCourses] = useState([]); 

  const student = {
    name: "Vaibhav Singh",
    email: "singhvaibhav654@gmail.com",
    joinedDate: "December 2025",
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
        if (res.ok) {
            const data = await res.json();
            setIsVerified(data.isVerified);
        }
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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* Top Banner / Decoration */}
      <div className="h-64 bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-600 px-6 sm:px-12 relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-12">
        
        {/* PROFILE HEADER CARD */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-white flex items-center justify-center text-4xl font-bold shadow-lg ring-4 ring-white">
                {student.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                 <ShieldCheck className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-2 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 justify-center md:justify-start">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{student.name}</h1>
                {isVerified ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider border border-blue-100">
                    <BadgeCheck className="w-4 h-4" /> Verified
                  </span>
                ) : (
                  <button 
                    onClick={() => router.push("/verify-email")}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs font-semibold uppercase tracking-wider border border-yellow-100 hover:bg-yellow-100 transition-colors"
                  >
                    <User className="w-4 h-4" /> Verify Email
                  </button>
                )}
              </div>

              <div className="flex flex-col md:flex-row gap-4 text-slate-500 text-sm justify-center md:justify-start">
                <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {student.email}
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Joined {student.joinedDate}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="w-full md:w-auto flex justify-center md:justify-end">
                <button
                    onClick={logout}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-600 font-medium transition-all duration-200"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard 
            label="Enrolled Courses" 
            value={totalCourses} 
            icon={BookOpen} 
            color="text-blue-600"
            bg="bg-blue-50"
          />
          <StatCard 
            label="Courses Completed" 
            value={completedCourses} 
            icon={Award} 
            color="text-emerald-600"
            bg="bg-emerald-50"
          />
          <StatCard 
            label="In Progress" 
            value={totalCourses - completedCourses} 
            icon={Clock} 
            color="text-amber-600"
            bg="bg-amber-50"
          />
          <StatCard 
            label="Overall Progress" 
            value={`${overallProgress}%`} 
            icon={TrendingUp} 
            color="text-violet-600"
            bg="bg-violet-50"
          />
        </div>

        {/* COURSES SECTION */}
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-500" /> 
                    My Learning Path
                </h2>
                {courses.length > 0 && (
                    <span className="text-sm font-medium text-slate-500">
                        Showing {courses.length} courses
                    </span>
                )}
            </div>

            {courses.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-dashed border-slate-300 p-12 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                        <BookOpen className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 mb-1">No courses yet</h3>
                    <p className="text-slate-500 mb-6 max-w-sm mx-auto">Get started by browsing our catalog and enrolling in your first course.</p>
                    <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                        Browse Courses
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                    <div
                        key={course.id}
                        className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-100 hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
                    >
                        {/* Course Art */}
                        <div className="h-40 bg-gradient-to-br from-slate-200 to-slate-300 relative overflow-hidden">
                            {/* Placeholder for actual thumbnail if available, else decorative pattern */}
                            <div className="absolute inset-0 bg-indigo-900/10 flex items-center justify-center text-slate-400">
                                <BookOpen className="w-12 h-12 opacity-50" />
                            </div>
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-slate-700 shadow-sm">
                                {course.level || "Beginner"}
                            </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                            <div className="mb-4">
                                <h3 className="font-bold text-lg text-slate-900 mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                                    {course.title}
                                </h3>
                                <p className="text-sm text-slate-500">by {course.instructor}</p>
                            </div>

                            <div className="mt-auto space-y-4">
                                {/* Progress Stats */}
                                <div>
                                    <div className="flex justify-between text-xs font-medium text-slate-600 mb-2">
                                        <span>{course.progress}% Complete</span>
                                        <span>{course.completedLessons}/{course.totalLessons} Lessons</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
                                            style={{ width: `${course.progress}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => router.push(`/courses/${course.slug}`)}
                                    className="w-full py-2.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2 group-hover:shadow-md"
                                >
                                    {course.progress >= 100 ? "Review Course" : "Continue Learning"}
                                    <ChevronRight className="w-4 h-4 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------
// Helper Components
// ---------------------------------------------

function StatCard({ label, value, icon: Icon, color, bg }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
      <div className={`w-12 h-12 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium leading-none mb-1">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
