"use client";
import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  Award, 
  TrendingUp, 
  Search, 
  ChevronDown, 
  ChevronUp,
  LayoutDashboard,
  GraduationCap,
  Clock,
  MoreHorizontal,
  FileText,
  LogOut
} from 'lucide-react';
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedStudent, setExpandedStudent] = useState(null);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout");
      router.push("/login");
    } catch (error) {
      console.error("Logout Error: ", error);
    }
  };

  // Mock data - will be replaced with API data later
  const stats = {
    totalStudents: 48,
    activeStudents: 35,
    averageProgress: 62,
    totalCourses: 12
  };

  const students = [
    {
      id: 1,
      name: "Rajnish Tripathi",
      email: "rajnishtripathi2001@gmail.com",
      enrolledDate: "2024-01-15",
      overallProgress: 75,
      coursesEnrolled: 5,
      coursesCompleted: 2,
      courses: [
        {
          courseName: "Introduction to Web Development",
          completedChapters: 20,
          totalChapters: 24,
          quizScores: [
            { quiz: "HTML Basics", score: 95, maxScore: 100 },
            { quiz: "CSS Fundamentals", score: 88, maxScore: 100 },
            { quiz: "JavaScript Intro", score: 92, maxScore: 100 }
          ],
          progress: 85
        },
        {
          courseName: "Advanced JavaScript",
          completedChapters: 11,
          totalChapters: 18,
          quizScores: [
            { quiz: "ES6 Features", score: 78, maxScore: 100 },
            { quiz: "Async Programming", score: 85, maxScore: 100 }
          ],
          progress: 60
        }
      ]
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      enrolledDate: "2024-02-10",
      overallProgress: 45,
      coursesEnrolled: 3,
      coursesCompleted: 0,
      courses: [
        {
          courseName: "React Fundamentals",
          completedChapters: 8,
          totalChapters: 20,
          quizScores: [
            { quiz: "Components Basics", score: 82, maxScore: 100 }
          ],
          progress: 40
        },
        {
          courseName: "Database Design",
          completedChapters: 10,
          totalChapters: 22,
          quizScores: [
            { quiz: "SQL Basics", score: 90, maxScore: 100 },
            { quiz: "Normalization", score: 75, maxScore: 100 }
          ],
          progress: 45
        }
      ]
    },
    {
      id: 3,
      name: "Michael Chen",
      email: "m.chen@example.com",
      enrolledDate: "2024-01-20",
      overallProgress: 90,
      coursesEnrolled: 4,
      coursesCompleted: 3,
      courses: [
        {
          courseName: "Python Programming",
          completedChapters: 25,
          totalChapters: 25,
          quizScores: [
            { quiz: "Python Basics", score: 100, maxScore: 100 },
            { quiz: "OOP Concepts", score: 95, maxScore: 100 },
            { quiz: "Advanced Topics", score: 98, maxScore: 100 }
          ],
          progress: 100
        },
        {
          courseName: "Data Structures",
          completedChapters: 18,
          totalChapters: 20,
          quizScores: [
            { quiz: "Arrays & Lists", score: 92, maxScore: 100 },
            { quiz: "Trees & Graphs", score: 88, maxScore: 100 }
          ],
          progress: 90
        }
      ]
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.d@example.com",
      enrolledDate: "2024-03-05",
      overallProgress: 30,
      coursesEnrolled: 2,
      coursesCompleted: 0,
      courses: [
        {
          courseName: "UI/UX Design",
          completedChapters: 5,
          totalChapters: 16,
          quizScores: [
            { quiz: "Design Principles", score: 85, maxScore: 100 }
          ],
          progress: 31
        }
      ]
    }
  ];

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStudent = (studentId) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId);
  };

  const calculateAverageQuizScore = (courses) => {
    let totalScore = 0;
    let totalQuizzes = 0;
    
    courses.forEach(course => {
      course.quizScores.forEach(quiz => {
        totalScore += (quiz.score / quiz.maxScore) * 100;
        totalQuizzes++;
      });
    });
    
    return totalQuizzes > 0 ? (totalScore / totalQuizzes).toFixed(1) : 0;
  };

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
                    <p className="text-slate-500 mt-1 text-sm">Monitor student performance and course engagement</p>
                </div>
                
                {/* Search Bar & Logout */}
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
                    
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-600 font-medium transition-all duration-200 whitespace-nowrap"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden md:inline">Sign Out</span>
                    </button>
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
                trend="+12% from last month"
                color="text-blue-600"
                bg="bg-blue-50"
            />
            <StatCard 
                label="Active Learners" 
                value={stats.activeStudents} 
                icon={TrendingUp} 
                trend="72% engagement rate"
                color="text-emerald-600"
                bg="bg-emerald-50"
            />
            <StatCard 
                label="Avg. Progress" 
                value={`${stats.averageProgress}%`} 
                icon={Award} 
                trend="Consistent growth"
                color="text-purple-600"
                bg="bg-purple-50"
            />
            <StatCard 
                label="Total Courses" 
                value={stats.totalCourses} 
                icon={BookOpen} 
                trend="Across 5 categories"
                color="text-orange-600"
                bg="bg-orange-50"
            />
        </div>

        {/* Students Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-800">Student Directory</h2>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {filteredStudents.length} Records found
                </div>
            </div>

            <div className="divide-y divide-slate-100">
                {filteredStudents.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p>No students matching your search.</p>
                    </div>
                ) : (
                    filteredStudents.map((student) => (
                        <div key={student.id} className="group bg-white transition-colors hover:bg-slate-50">
                            {/* Main Row */}
                            <div 
                                onClick={() => toggleStudent(student.id)}
                                className="p-5 cursor-pointer grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
                            >
                                {/* User Info */}
                                <div className="md:col-span-4 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">
                                        {student.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                            {student.name}
                                        </h3>
                                        <p className="text-xs text-slate-500">{student.email}</p>
                                    </div>
                                </div>

                                {/* Stats Columns */}
                                <div className="md:col-span-2 hidden md:block">
                                    <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Progress</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 bg-slate-200 rounded-full h-1.5">
                                            <div className="bg-indigo-500 h-1.5 rounded-full" style={{width: `${student.overallProgress}%`}}></div>
                                        </div>
                                        <span className="text-sm font-bold text-slate-700">{student.overallProgress}%</span>
                                    </div>
                                </div>

                                <div className="md:col-span-2 hidden md:block text-center md:text-left">
                                    <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Courses</p>
                                    <p className="text-sm font-medium text-slate-700">
                                        <span className="text-slate-900 font-bold">{student.coursesCompleted}</span>
                                        <span className="text-slate-400 mx-1">/</span>
                                        {student.coursesEnrolled} Completed
                                    </p>
                                </div>

                                <div className="md:col-span-3 hidden md:block">
                                    <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Performance</p>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                            Avg. Quiz: {calculateAverageQuizScore(student.courses)}%
                                        </span>
                                    </div>
                                </div>

                                <div className="md:col-span-1 flex justify-end">
                                    <div className={`p-1.5 rounded-full transition-colors ${expandedStudent === student.id ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                                        {expandedStudent === student.id ? <ChevronUp className="w-5 h-5"/> : <ChevronDown className="w-5 h-5" />}
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Details Panel */}
                            {expandedStudent === student.id && (
                                <div className="border-t border-slate-100 bg-slate-50/50 p-6 md:pl-20 animate-in slide-in-from-top-2 duration-200">
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
                                            <div className="bg-blue-50 p-2 rounded-md text-blue-600"><Clock className="w-5 h-5"/></div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase font-bold">Enrolled On</p>
                                                <p className="font-semibold text-slate-900">{new Date(student.enrolledDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
                                            <div className="bg-purple-50 p-2 rounded-md text-purple-600"><GraduationCap className="w-5 h-5"/></div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase font-bold">Courses Taken</p>
                                                <p className="font-semibold text-slate-900">{student.coursesEnrolled} Courses</p>
                                            </div>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
                                            <div className="bg-emerald-50 p-2 rounded-md text-emerald-600"><Award className="w-5 h-5"/></div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase font-bold">Completion Rate</p>
                                                <p className="font-semibold text-slate-900">
                                                    {Math.round((student.coursesCompleted / (student.coursesEnrolled || 1)) * 100)}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                                        <BookOpen className="w-4 h-4 text-slate-400" />
                                        Course Details
                                    </h4>

                                    <div className="space-y-4">
                                        {student.courses.map((course, idx) => (
                                            <div key={idx} className="bg-white border focus-within:ring-1 focus-within:ring-indigo-500 border-slate-200 rounded-lg p-5 shadow-sm">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                                    <div>
                                                        <h5 className="font-bold text-slate-900 text-lg">{course.courseName}</h5>
                                                        <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                                                            <span className="flex items-center gap-1">
                                                                <FileText className="w-3.5 h-3.5" />
                                                                {course.completedChapters} / {course.totalChapters} Chapters
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 min-w-[200px]">
                                                        <div className="flex-1 text-right">
                                                            <span className="text-lg font-bold text-indigo-600">{course.progress}%</span>
                                                        </div>
                                                        <div className="w-24 bg-slate-100 rounded-full h-2">
                                                            <div className="bg-indigo-600 h-2 rounded-full" style={{width: `${course.progress}%`}}></div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Qui Scores Mini-Table */}
                                                {course.quizScores.length > 0 && (
                                                    <div className="mt-4 bg-slate-50 rounded-md border border-slate-100 p-3">
                                                        <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Recent Quiz Performance</p>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                                            {course.quizScores.map((quiz, qIndex) => (
                                                                <div key={qIndex} className="flex justify-between items-center bg-white p-2 rounded border border-slate-100 text-sm">
                                                                    <span className="text-slate-700 truncate mr-2" title={quiz.quiz}>{quiz.quiz}</span>
                                                                    <ScoreBadge score={quiz.score} max={quiz.maxScore} />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
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
                {/* Optional trend indicator could go here */}
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium">{label}</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">{value}</h3>
                {trend && <p className="text-xs text-slate-400 mt-2 font-medium">{trend}</p>}
            </div>
        </div>
    );
}

function ScoreBadge({ score, max }) {
    const percentage = (score / max) * 100;
    let colorClass = "bg-red-50 text-red-700 border-red-100";
    if (percentage >= 90) colorClass = "bg-green-50 text-green-700 border-green-100";
    else if (percentage >= 70) colorClass = "bg-blue-50 text-blue-700 border-blue-100";
    else if (percentage >= 50) colorClass = "bg-orange-50 text-orange-700 border-orange-100";

    return (
        <span className={`px-2 py-0.5 rounded text-xs font-bold border ${colorClass}`}>
            {score}/{max}
        </span>
    );
}