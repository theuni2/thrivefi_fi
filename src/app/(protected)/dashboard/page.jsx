"use client";
import React, { useState } from 'react';
import { Users, BookOpen, Award, TrendingUp, Search, ChevronDown, ChevronUp } from 'lucide-react';

function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedStudent, setExpandedStudent] = useState(null);

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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage and monitor student progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Students</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalStudents}</p>
              </div>
              <Users className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Students</p>
                <p className="text-3xl font-bold text-gray-800">{stats.activeStudents}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Avg Progress</p>
                <p className="text-3xl font-bold text-gray-800">{stats.averageProgress}%</p>
              </div>
              <Award className="w-10 h-10 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Courses</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalCourses}</p>
              </div>
              <BookOpen className="w-10 h-10 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Students Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-wrap justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Registered Students</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Students List */}
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <div key={student.id} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Student Header */}
                <div
                  className="bg-gray-50 p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => toggleStudent(student.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">{student.name}</h3>
                        <p className="text-sm text-gray-600">{student.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Progress</p>
                        <p className="font-bold text-gray-800">{student.overallProgress}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Courses</p>
                        <p className="font-bold text-gray-800">{student.coursesEnrolled}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Completed</p>
                        <p className="font-bold text-gray-800">{student.coursesCompleted}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Avg Quiz Score</p>
                        <p className="font-bold text-gray-800">{calculateAverageQuizScore(student.courses)}%</p>
                      </div>
                      {expandedStudent === student.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Student Details (Expandable) */}
                {expandedStudent === student.id && (
                  <div className="p-6 bg-white space-y-6">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-600 font-medium">Enrolled Date</p>
                        <p className="text-lg font-bold text-blue-800">{new Date(student.enrolledDate).toLocaleDateString()}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-green-600 font-medium">Overall Progress</p>
                        <p className="text-lg font-bold text-green-800">{student.overallProgress}%</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm text-purple-600 font-medium">Courses Completed</p>
                        <p className="text-lg font-bold text-purple-800">{student.coursesCompleted}/{student.coursesEnrolled}</p>
                      </div>
                    </div>

                    {/* Course Details */}
                    {student.courses.map((course, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-bold text-lg text-gray-800">{course.courseName}</h4>
                            <p className="text-sm text-gray-600">
                              Chapters: {course.completedChapters}/{course.totalChapters} completed
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Progress</p>
                            <p className="text-2xl font-bold text-blue-600">{course.progress}%</p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-blue-500 h-3 rounded-full transition-all"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Quiz Scores */}
                        {course.quizScores.length > 0 && (
                          <div>
                            <h5 className="font-semibold text-gray-800 mb-2">Quiz Scores</h5>
                            <div className="space-y-2">
                              {course.quizScores.map((quiz, qIndex) => (
                                <div key={qIndex} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                                  <span className="text-gray-700">{quiz.quiz}</span>
                                  <span className={`font-bold ${quiz.score >= 90 ? 'text-green-600' : quiz.score >= 70 ? 'text-blue-600' : 'text-orange-600'}`}>
                                    {quiz.score}/{quiz.maxScore} ({((quiz.score / quiz.maxScore) * 100).toFixed(0)}%)
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No students found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;