"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  BookOpen, 
  Clock, 
  ArrowRight, 
  Sparkles,
  PlayCircle,
  GraduationCap
} from "lucide-react";
import { getAllCourses } from "@/lib/courseData";

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllCourses();
        setCourses(data);
      } catch (err) {
        console.error("Failed to load courses", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* Hero Section */}
      <div className="bg-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=2832&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-indigo-900/80 to-purple-900/80"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-800/50 border border-indigo-700 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="w-3 h-3" />
              World Class Education
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
              Master the Future of <span className="text-indigo-400">Finance & AI</span>
            </h1>
            <p className="text-lg text-indigo-200 mb-8 leading-relaxed">
              Explore our curated curriculum designed to bridge the gap between traditional banking and cutting-edge technology.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        
        {/* Course Grid */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div 
                key={course.id} 
                className="group flex flex-col bg-white rounded-2xl border border-slate-200 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden cursor-pointer h-full"
                onClick={() => router.push(`/courses/${course.slug}`)}
              >
                {/* Advanced Thumbnail Area */}
                <div className="h-56 bg-slate-200 relative overflow-hidden">
                  {course.thumbnail ? (
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-indigo-600 to-purple-700 flex flex-col items-center justify-center p-8 text-center">
                      <BookOpen className="w-16 h-16 text-white/40 mb-3" />
                      <span className="text-white/40 font-bold uppercase tracking-widest text-sm">Course Preview</span>
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 z-20">
                     <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-indigo-900 shadow-sm flex items-center gap-1.5 uppercase tracking-wide">
                        <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                        {course.tags?.[0] || "Advanced"}
                     </span>
                  </div>

                  {/* Level Badge */}
                  <div className="absolute top-4 right-4 z-20">
                    <span className={`
                        px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide shadow-sm backdrop-blur-md
                        ${course.level === 'Beginner' ? 'bg-emerald-500/90 text-white' : 
                          course.level === 'Intermediate' ? 'bg-amber-500/90 text-white' : 
                          'bg-rose-500/90 text-white'}
                    `}>
                        {course.level}
                    </span>
                  </div>
                  
                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-indigo-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10 backdrop-blur-[2px]">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <button className="bg-white text-indigo-900 px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 hover:bg-indigo-50 transition-colors">
                            <PlayCircle className="w-5 h-5" />
                            Start Learning Now
                        </button>
                    </div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-7 flex-1 flex flex-col items-start border-t border-slate-100">
                  
                  {/* Metadata Row */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-slate-500 w-full">
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md">
                        <Clock className="w-4 h-4 text-indigo-500" />
                        <span className="font-medium text-slate-700">{course.duration}</span>
                    </div>
                    {course.modules && (
                        <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md">
                            <BookOpen className="w-4 h-4 text-purple-500" />
                            <span className="font-medium text-slate-700">{course.modules.length} Modules</span>
                        </div>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-indigo-700 transition-colors">
                    {course.title}
                  </h3>
                  
                  <p className="text-slate-600 mb-6 leading-relaxed flex-1">
                    {course.subtitle || course.description}
                  </p>

                  <div className="w-full pt-5 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3">
                       <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-white border border-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-700 shadow-sm">
                          {course.instructor.split(' ')[0][0]}
                       </div>
                       <div className="flex flex-col">
                           <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Instructor</span>
                           <span className="text-sm font-bold text-slate-800">{course.instructor}</span>
                       </div>
                    </div>
                    
                    <span className="text-indigo-600 bg-indigo-50 p-2 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                        <ArrowRight className="w-5 h-5 transform -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No courses available yet</h3>
            <p className="text-slate-500">Check back soon for new content.</p>
          </div>
        )}
      </div>
    </div>
  );
}
