import React from "react";
import { User, ShieldCheck, BadgeCheck, Mail, Calendar, LogOut } from "lucide-react";

export default function ProfileHeader({ student, isVerified, onVerifyClick, onLogout, onViewDetails }) {
  return (
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
                onClick={onVerifyClick}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs font-semibold uppercase tracking-wider border border-yellow-100 hover:bg-yellow-100 transition-colors"
                title="Verify your email address"
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
        {/* Actions */}
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3 justify-center md:justify-end">
            <button
                onClick={onViewDetails}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all duration-200 shadow-sm hover:shadow"
            >
                <User className="w-4 h-4" />
                View Details
            </button>
            <button
                onClick={onLogout}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-600 font-medium transition-all duration-200"
            >
                <LogOut className="w-4 h-4" />
                Sign Out
            </button>
        </div>
      </div>
    </div>
  );
}
