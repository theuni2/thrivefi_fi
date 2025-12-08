"use client";

import React from "react";
import { Sparkles, BookOpen, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CourseList({ courses }) {
  const router = useRouter();

  return (
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
                <button onClick={() => router.push("/courses")}  className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
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
  );
}
