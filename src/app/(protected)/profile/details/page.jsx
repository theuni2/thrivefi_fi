"use client";

import React, { useEffect, useState } from "react";
import { User, Mail, Phone, MapPin, Gift, Copy, Check } from "lucide-react";
import Nav from "@/components/nav";

export default function ProfileDetailsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  /* New states for Password Reset */
  const [resetStep, setResetStep] = useState("idle"); // idle, sent, success
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetMsg, setResetMsg] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const copyRefCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSendOtp = async () => {
    setResetLoading(true);
    setResetMsg("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await res.json();
      if (res.ok) {
        setResetStep("sent");
        setResetMsg("Code sent to your email.");
      } else {
        setResetMsg(data.error || "Failed to send code.");
      }
    } catch (err) {
      setResetMsg("Network/Server error.");
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    setResetMsg("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, otp, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setResetStep("success");
        setResetMsg("Password changed successfully.");
        setTimeout(() => {
          setResetStep("idle");
          setNewPassword("");
          setOtp("");
          setResetMsg("");
        }, 3000);
      } else {
        setResetMsg(data.error || "Failed to reset password.");
      }
    } catch (err) {
      setResetMsg("Network/Server error.");
    } finally {
      setResetLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">User info not available.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Nav />
      <div className="w-full bg-red-100 h-[90vh]">
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 sm:px-10 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur text-white flex items-center justify-center text-3xl font-bold mb-4 shadow-lg ring-4 ring-white/10">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {user.name}
                </h1>
                <p className="text-blue-100 font-medium mt-1">{user.role}</p>
              </div>

              {/* Details */}
              <div className="p-6 sm:p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3 mb-2 text-slate-500 text-sm font-semibold uppercase tracking-wider">
                      <Mail className="w-4 h-4" /> Email Address
                    </div>
                    <div className="text-slate-900 font-medium break-all">
                      {user.email}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3 mb-2 text-slate-500 text-sm font-semibold uppercase tracking-wider">
                      <Phone className="w-4 h-4" /> Mobile Number
                    </div>
                    <div className="text-slate-900 font-medium">
                      {user.mobile || "N/A"}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 md:col-span-2">
                    <div className="flex items-center gap-3 mb-2 text-slate-500 text-sm font-semibold uppercase tracking-wider">
                      <MapPin className="w-4 h-4" /> Address
                    </div>
                    <div className="text-slate-900 font-medium">
                      {user.address || "N/A"}
                    </div>
                  </div>
                </div>

                {/* Change Password Section */}
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-indigo-600" /> Change Password
                  </h3>

                  {resetStep === "idle" && (
                    <div>
                      <p className="text-slate-600 text-sm mb-4">
                        Send a verification code to your email ({user.email}) to
                        change your password.
                      </p>
                      <button
                        onClick={handleSendOtp}
                        disabled={resetLoading}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                      >
                        {resetLoading ? "Sending..." : "Send Verification Code"}
                      </button>
                    </div>
                  )}

                  {resetStep === "sent" && (
                    <form
                      onSubmit={handleResetPassword}
                      className="space-y-4 max-w-sm"
                    >
                      <p className="text-slate-600 text-sm">
                        Enter the code sent to your email and your new password.
                      </p>
                      <div>
                        <input
                          type="text"
                          placeholder="Verification Code"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="password"
                          placeholder="New Password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                          required
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={resetLoading}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        >
                          {resetLoading ? "Verifying..." : "Change Password"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setResetStep("idle");
                            setResetMsg("");
                          }}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {resetStep === "success" && (
                    <div className="text-green-600 font-medium">
                      Password changed successfully!
                    </div>
                  )}

                  {resetMsg && resetStep !== "success" && (
                    <div className="mt-2 text-sm text-red-500 font-medium">
                      {resetMsg}
                    </div>
                  )}
                </div>

                {/* Referral Section */}
                <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Gift className="w-32 h-32 text-indigo-600" />
                  </div>

                  <h3 className="text-lg font-bold text-indigo-900 mb-2 flex items-center gap-2">
                    <Gift className="w-5 h-5" /> Refer & Earn
                  </h3>
                  <p className="text-indigo-700 text-sm mb-6 max-w-lg">
                    Share your unique referral code with friends. When they sign
                    up using your code, you'll both get rewards!
                  </p>

                  <div className="flex items-center gap-2 max-w-sm">
                    <div className="flex-1 bg-white border border-indigo-200 text-indigo-900 text-lg font-mono font-bold py-3 px-4 rounded-lg tracking-widest text-center shadow-sm select-all">
                      {user.referralCode || "Generating..."}
                    </div>
                    <button
                      onClick={copyRefCode}
                      className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm active:scale-95"
                      title="Copy Code"
                    >
                      {copied ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {user.referredBy && (
                  <div className="text-center text-sm text-slate-400">
                    You were referred by user with code:{" "}
                    <span className="font-mono text-slate-500">
                      {user.referredBy}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
