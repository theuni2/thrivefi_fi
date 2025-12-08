import React from "react";
import { BookOpen, Award, Clock, TrendingUp } from "lucide-react";

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

export default function StatsGrid({ stats }) {
    const { totalCourses, completedCourses, inProgress, overallProgress } = stats;

    return (
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
            value={inProgress} 
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
    );
}
