"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  BookOpen,
  Award,
  CheckCircle,
  Clock,
  Loader2,
  Shield, // For role/admin indicator
} from "lucide-react";
import Nav from "@/components/nav";

export default function StudentDetailPage({ params }) {
  const router = useRouter();
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStudent() {
      try {
        const res = await fetch(`/api/admin/student/${id}`);
        if (!res.ok) throw new Error("Failed to fetch student details");
        const data = await res.json();
        setStudent(data.student);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchStudent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="text-red-500 mb-4 text-lg font-semibold">
          Error: {error || "Student not found"}
        </div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Nav />
      <div className="w-full">
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
          {/* Header / Nav */}
          {/* <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium text-sm"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Student Directory
              </button>
            </div>
          </div> */}

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
            {/* Profile Header Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <User className="w-40 h-40 text-indigo-600" />
              </div>

              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
                <div className="w-24 h-24 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-3xl font-bold border-4 border-white shadow-md">
                  {student.name ? (
                    student.name.charAt(0).toUpperCase()
                  ) : (
                    <User />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-slate-900">
                      {student.name}
                    </h1>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                        student.role === "admin"
                          ? "bg-purple-100 text-purple-700 border-purple-200"
                          : "bg-blue-50 text-blue-700 border-blue-100"
                      }`}
                    >
                      {student.role}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                        student.verified
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-yellow-100 text-yellow-700 border-yellow-200"
                      }`}
                    >
                      {student.verified ? "✓ Verified" : "Unverified"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 md:gap-8 text-slate-500 text-sm mt-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {student.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Joined {new Date(student.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      ID:{" "}
                      <span className="font-mono text-xs bg-slate-100 px-1 rounded">
                        {student._id}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex gap-6 border-l border-slate-100 pl-0 md:pl-8 mt-4 md:mt-0">
                  <div className="text-center">
                    <p className="text-slate-400 text-xs font-bold uppercase">
                      Enrolled
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {student.stats.coursesEnrolled}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-400 text-xs font-bold uppercase">
                      Completed
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {student.stats.coursesCompleted}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-400 text-xs font-bold uppercase">
                      Avg Progress
                    </p>
                    <p className="text-2xl font-bold text-indigo-600">
                      {student.stats.averageProgress}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-600" />
                Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Address */}
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 font-semibold uppercase mb-1">
                        Address
                      </p>
                      <p className="text-sm text-slate-900 font-medium">
                        {student.address || (
                          <span className="text-slate-400 italic">
                            Not provided
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mobile */}
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 font-semibold uppercase mb-1">
                        Mobile Number
                      </p>
                      <p className="text-sm text-slate-900 font-medium">
                        {student.mobile || (
                          <span className="text-slate-400 italic">
                            Not provided
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Referral Code */}
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 font-semibold uppercase mb-1">
                        Referral Code
                      </p>
                      <p className="text-sm text-slate-900 font-mono font-bold">
                        {student.referralCode || (
                          <span className="text-slate-400 italic font-sans font-normal">
                            Not generated
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Referred By */}
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 font-semibold uppercase mb-1">
                        Referred By
                      </p>
                      <p className="text-sm text-slate-900 font-mono font-bold">
                        {student.referredBy || (
                          <span className="text-slate-400 italic font-sans font-normal">
                            No referral
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Created At */}
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 font-semibold uppercase mb-1">
                        Account Created
                      </p>
                      <p className="text-sm text-slate-900 font-medium">
                        {new Date(student.createdAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Updated At */}
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-teal-100 text-teal-600">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 font-semibold uppercase mb-1">
                        Last Updated
                      </p>
                      <p className="text-sm text-slate-900 font-medium">
                        {new Date(student.updatedAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Courses Section */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                Enrolled Courses
              </h2>

              {student.courses && student.courses.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {student.courses.map((course, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg">
                            {course.courseTitle}
                          </h3>
                          <p className="text-sm text-slate-500 font-mono mt-1 text-xs">
                            Slug: {course.courseSlug}
                          </p>
                        </div>
                        {course.progress === 100 ? (
                          <div className="bg-green-100 text-green-700 p-2 rounded-full">
                            <CheckCircle className="w-5 h-5" />
                          </div>
                        ) : (
                          <div className="bg-indigo-50 text-indigo-600 p-2 rounded-full">
                            <Clock className="w-5 h-5" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1.5">
                            <span className="font-medium text-slate-700">
                              Progress
                            </span>
                            <span className="font-bold text-indigo-600">
                              {course.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                course.progress === 100
                                  ? "bg-green-500"
                                  : "bg-indigo-600"
                              }`}
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex justify-between text-sm text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4" />
                            {course.completedChapters?.length || 0} Chapters
                            Done
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {new Date(course.enrolledAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                  <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No courses enrolled yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
