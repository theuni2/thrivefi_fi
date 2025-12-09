"use client";
import React, { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  Award,
  TrendingUp,
  Search,
  LayoutDashboard,
  LogOut,
  MoreVertical,
  Loader2,
  ChevronRight,
  User as UserIcon,
  Mail,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  // State for real data
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    averageProgress: 0,
    totalCourses: 0,
  });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminProfile, setAdminProfile] = useState(null);
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  useEffect(() => {
    async function validateAdmin() {
      try {
        const res = await fetch("/api/admin/validate");
        const data = await res.json();

        if (!res.ok || !data.success) {
          console.log("Admin validation failed, redirecting to profile");
          router.push("/profile");
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

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, studentsRes, profileRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/students"),
          fetch("/api/admin/profile"),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData.stats);
        }

        if (studentsRes.ok) {
          const studentsData = await studentsRes.json();
          setStudents(studentsData.students);
        }

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setAdminProfile(profileData.admin);
        }
      } catch (error) {
        console.error("Dashboard Data Error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout");
      router.push("/login");
    } catch (error) {
      console.error("Logout Error: ", error);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between py-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <LayoutDashboard className="w-6 h-6 text-indigo-600" />
                Instructor Dashboard
              </h1>
              <p className="text-slate-500 mt-1 text-sm">
                Monitor student performance and course engagement
              </p>
            </div>

            {/* Search Bar & Profile */}
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-center">
              <div className="relative w-full md:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                />
              </div>

              {/* Profile Icon with Popup */}
              <div className="relative">
                <button
                  onClick={() => setShowProfilePopup(!showProfilePopup)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition-all duration-200 whitespace-nowrap"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center border border-indigo-200">
                    {adminProfile?.name ? (
                      adminProfile.name.charAt(0).toUpperCase()
                    ) : (
                      <UserIcon className="w-4 h-4" />
                    )}
                  </div>
                  {/* <span className="hidden md:inline text-sm">
                    {adminProfile?.name || "Admin"}
                  </span> */}
                </button>

                {/* Profile Popup */}
                {showProfilePopup && (
                  <>
                    {/* Backdrop to close popup */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowProfilePopup(false)}
                    />

                    {/* Popup Content */}
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
                      {/* Header */}
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm text-white font-bold flex items-center justify-center text-2xl border-2 border-white/30">
                            {adminProfile?.name ? (
                              adminProfile.name.charAt(0).toUpperCase()
                            ) : (
                              <UserIcon className="w-8 h-8" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">
                              {adminProfile?.name || "Admin User"}
                            </h3>
                            <p className="text-indigo-100 text-sm">
                              Administrator
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Account Details */}
                      <div className="p-4 space-y-3">
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                          <Mail className="w-4 h-4 text-slate-500 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-500 font-medium">
                              Email
                            </p>
                            <p className="text-sm text-slate-900 font-medium truncate">
                              {adminProfile?.email || "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                          <ShieldCheck className="w-4 h-4 text-slate-500 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-xs text-slate-500 font-medium">
                              Status
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  adminProfile?.verified
                                    ? "bg-green-100 text-green-700 border border-green-200"
                                    : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                                }`}
                              >
                                {adminProfile?.verified
                                  ? "Verified"
                                  : "Unverified"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                          <Calendar className="w-4 h-4 text-slate-500 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-xs text-slate-500 font-medium">
                              Member Since
                            </p>
                            <p className="text-sm text-slate-900 font-medium">
                              {adminProfile?.createdAt
                                ? new Date(
                                    adminProfile.createdAt
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="p-4 border-t border-slate-100 space-y-2">
                        <button
                          onClick={() => {
                            setShowProfilePopup(false);
                            router.push("/dashboard/admin-profile");
                          }}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-medium transition-all duration-200 border border-indigo-200"
                        >
                          <UserIcon className="w-4 h-4" />
                          View Profile
                        </button>
                        <button
                          onClick={logout}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-medium transition-all duration-200 border border-red-200"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <StatCard
            label="Total Students"
            value={stats.totalStudents}
            icon={Users}
            trend="Registered Users"
            color="text-blue-600"
            bg="bg-blue-50"
          />
          <StatCard
            label="Active Learners"
            value={stats.activeStudents}
            icon={TrendingUp}
            trend="Enrolled in courses"
            color="text-emerald-600"
            bg="bg-emerald-50"
          />
          <StatCard
            label="Avg. Progress"
            value={`${stats.averageProgress}%`}
            icon={Award}
            trend="Overall completion"
            color="text-purple-600"
            bg="bg-purple-50"
          />
          <StatCard
            label="Total Courses"
            value={stats.totalCourses}
            icon={BookOpen}
            trend="Available content"
            color="text-orange-600"
            bg="bg-orange-50"
          />
        </div>

        {/* Students List Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-800">
              Student Directory
            </h2>
            <span className="text-xs font-semibold text-slate-500 bg-white px-2 py-1 rounded border border-slate-200 shadow-sm">
              {filteredStudents.length} Students
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-100">
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Course Progress</th>
                  <th className="px-6 py-4 text-center">Performance</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center text-slate-500"
                    >
                      <Users className="w-12 h-12 mx-auto mb-3 text-slate-200" />
                      <p>No students found matching your search.</p>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr
                      key={student._id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() =>
                        router.push(`/dashboard/student/${student._id}`)
                      }
                    >
                      {/* Student Name & Email */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center shrink-0 border border-indigo-200">
                            {student.name ? (
                              student.name.charAt(0).toUpperCase()
                            ) : (
                              <UserIcon className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {student.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {student.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Status / Joined Date */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-700">
                            Active
                          </span>
                          <span className="text-xs text-slate-400">
                            Joined{" "}
                            {new Date(student.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>

                      {/* Progress */}
                      <td className="px-6 py-4">
                        <div className="w-full max-w-[140px]">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium text-slate-600">
                              {student.overallProgress}%
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {student.coursesCompleted}/
                              {student.coursesEnrolled} Courses
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-indigo-500 h-1.5 rounded-full"
                              style={{ width: `${student.overallProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      {/* Performance / Quiz */}
                      <td className="px-6 py-4 text-center">
                        {/* Assuming Avg Quiz Score logic exists or defaults to 0 */}
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            student.avgQuizScore >= 80
                              ? "bg-green-50 text-green-700 border-green-200"
                              : student.avgQuizScore >= 60
                              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {student.avgQuizScore || 0}% Avg. Score
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-right">
                        <button className="text-slate-400 hover:text-indigo-600 transition-colors p-2 hover:bg-white rounded-full">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, trend, color, bg }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${bg} ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium">{label}</p>
        <h3 className="text-3xl font-bold text-slate-900 mt-1">{value}</h3>
        {trend && (
          <p className="text-xs text-slate-400 mt-2 font-medium">{trend}</p>
        )}
      </div>
    </div>
  );
}
