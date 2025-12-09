"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Shield,
  ShieldCheck,
  Key,
  UserPlus,
  Loader2,
  Eye,
  EyeOff,
  Save,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function AdminProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [adminProfile, setAdminProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("profile"); // profile, password, manage-admins

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordMessage, setPasswordMessage] = useState({
    type: "",
    text: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Add admin state
  const [addAdminForm, setAddAdminForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [addAdminMessage, setAddAdminMessage] = useState({
    type: "",
    text: "",
  });
  const [addAdminLoading, setAddAdminLoading] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/admin/profile");
        if (!res.ok) {
          router.push("/dashboard");
          return;
        }
        const data = await res.json();
        setAdminProfile(data.admin);
      } catch (error) {
        console.error("Profile fetch error:", error);
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [router]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: "", text: "" });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage({
        type: "error",
        text: "Password must be at least 6 characters",
      });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setPasswordMessage({
          type: "success",
          text: "Password changed successfully!",
        });
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setPasswordMessage({
          type: "error",
          text: data.error || "Failed to change password",
        });
      }
    } catch (error) {
      setPasswordMessage({
        type: "error",
        text: "Server error. Please try again.",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setAddAdminMessage({ type: "", text: "" });

    if (!addAdminForm.name || !addAdminForm.email || !addAdminForm.password) {
      setAddAdminMessage({ type: "error", text: "All fields are required" });
      return;
    }

    if (addAdminForm.password.length < 6) {
      setAddAdminMessage({
        type: "error",
        text: "Password must be at least 6 characters",
      });
      return;
    }

    setAddAdminLoading(true);
    try {
      const res = await fetch("/api/admin/add-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addAdminForm),
      });

      const data = await res.json();

      if (res.ok) {
        setAddAdminMessage({
          type: "success",
          text: "Admin added successfully!",
        });
        setAddAdminForm({ name: "", email: "", password: "" });
      } else {
        setAddAdminMessage({
          type: "error",
          text: data.error || "Failed to add admin",
        });
      }
    } catch (error) {
      setAddAdminMessage({
        type: "error",
        text: "Server error. Please try again.",
      });
    } finally {
      setAddAdminLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm text-white font-bold flex items-center justify-center text-4xl border-4 border-white/30">
              {adminProfile?.name ? (
                adminProfile.name.charAt(0).toUpperCase()
              ) : (
                <User className="w-12 h-12" />
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">
                {adminProfile?.name || "Admin"}
              </h1>
              <p className="text-indigo-100 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {adminProfile?.email}
              </p>
              <div className="flex items-center gap-3 mt-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-white/20 border border-white/30">
                  Administrator
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    adminProfile?.verified
                      ? "bg-green-500/20 border border-green-300/50"
                      : "bg-yellow-500/20 border border-yellow-300/50"
                  }`}
                >
                  {adminProfile?.verified ? "✓ Verified" : "Unverified"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === "profile"
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <User className="w-4 h-4" />
                Profile Details
              </div>
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === "password"
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Key className="w-4 h-4" />
                Change Password
              </div>
            </button>
            <button
              onClick={() => setActiveTab("manage-admins")}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === "manage-admins"
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <UserPlus className="w-4 h-4" />
                Manage Admins
              </div>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          {/* Profile Details Tab */}
          {activeTab === "profile" && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Account Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 font-semibold uppercase mb-1">
                        Full Name
                      </p>
                      <p className="text-sm text-slate-900 font-medium">
                        {adminProfile?.name || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 font-semibold uppercase mb-1">
                        Email Address
                      </p>
                      <p className="text-sm text-slate-900 font-medium">
                        {adminProfile?.email || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 font-semibold uppercase mb-1">
                        Role
                      </p>
                      <p className="text-sm text-slate-900 font-medium capitalize">
                        {adminProfile?.role || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 font-semibold uppercase mb-1">
                        Verification Status
                      </p>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          adminProfile?.verified
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                        }`}
                      >
                        {adminProfile?.verified ? "Verified" : "Unverified"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 font-semibold uppercase mb-1">
                        Account Created
                      </p>
                      <p className="text-sm text-slate-900 font-medium">
                        {adminProfile?.createdAt
                          ? new Date(adminProfile.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-teal-100 text-teal-600">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 font-semibold uppercase mb-1">
                        Last Updated
                      </p>
                      <p className="text-sm text-slate-900 font-medium">
                        {adminProfile?.updatedAt
                          ? new Date(adminProfile.updatedAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Change Password Tab */}
          {activeTab === "password" && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Change Password
              </h2>
              <p className="text-slate-500 mb-6">
                Update your password to keep your account secure
              </p>

              <form
                onSubmit={handlePasswordChange}
                className="max-w-md space-y-4"
              >
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          current: !showPasswords.current,
                        })
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPasswords.current ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          new: !showPasswords.new,
                        })
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPasswords.new ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          confirm: !showPasswords.confirm,
                        })
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Message */}
                {passwordMessage.text && (
                  <div
                    className={`flex items-center gap-2 p-3 rounded-lg ${
                      passwordMessage.type === "success"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {passwordMessage.type === "success" ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                    <span className="text-sm font-medium">
                      {passwordMessage.text}
                    </span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {passwordLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Update Password
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Manage Admins Tab */}
          {activeTab === "manage-admins" && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Add New Administrator
              </h2>
              <p className="text-slate-500 mb-6">
                Create a new admin account with full privileges
              </p>

              <form onSubmit={handleAddAdmin} className="max-w-md space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={addAdminForm.name}
                    onChange={(e) =>
                      setAddAdminForm({ ...addAdminForm, name: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter admin name"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={addAdminForm.email}
                    onChange={(e) =>
                      setAddAdminForm({
                        ...addAdminForm,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="admin@example.com"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={addAdminForm.password}
                    onChange={(e) =>
                      setAddAdminForm({
                        ...addAdminForm,
                        password: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Minimum 6 characters"
                    required
                  />
                </div>

                {/* Message */}
                {addAdminMessage.text && (
                  <div
                    className={`flex items-center gap-2 p-3 rounded-lg ${
                      addAdminMessage.type === "success"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {addAdminMessage.type === "success" ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                    <span className="text-sm font-medium">
                      {addAdminMessage.text}
                    </span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={addAdminLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addAdminLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Add Administrator
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
