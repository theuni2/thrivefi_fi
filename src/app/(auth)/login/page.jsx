"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* New logic for Forgot Password */
  const [view, setView] = useState("login"); // login, forgot
  const [resetStep, setResetStep] = useState("idle"); // idle, sent, success
  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid credentials");
        setLoading(false);
        return;
      }

      setLoading(false);
      router.push(
        data.redirectUrl || (data.role === "admin" ? "/dashboard" : "/profile")
      );
    } catch (err) {
      setError("Server error");
      setLoading(false);
    }
  };

  /* Forgot Password Handlers */
  const handleSendOtp = async () => {
    if (!resetEmail) {
      setError("Please enter your email");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setResetStep("sent");
      } else {
        setError(data.error || "Failed to send code.");
      }
    } catch (err) {
      setError("Network/Server error.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, otp, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setResetStep("success");
      } else {
        setError(data.error || "Failed to reset password.");
      }
    } catch (err) {
      setError("Network/Server error.");
    } finally {
      setLoading(false);
    }
  };

  const renderLogin = () => (
    <div className="w-full max-w-md bg-white dark:bg-gray-100 p-8 rounded-xl shadow border dark:border-gray-400">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-900 dark:text-gray-900">
        Login
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 border rounded bg-white dark:bg-white border-gray-300 dark:border-gray-400 text-gray-900 dark:text-gray-900 placeholder-gray-500 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 border rounded bg-white dark:bg-white border-gray-300 dark:border-gray-400 text-gray-900 dark:text-gray-900 placeholder-gray-500 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <button
          type="button"
          onClick={() => setView("forgot")}
          className="text-sm text-blue-600 hover:underline block text-right"
        >
          Forgot Password?
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 disabled:bg-blue-400"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-600">
        Don’t have an account?{" "}
        <a href="/register" className="text-blue-600 hover:underline">
          Register
        </a>
      </p>
    </div>
  );

  const renderForgot = () => (
    <div className="w-full max-w-md bg-white dark:bg-gray-100 p-8 rounded-xl shadow border dark:border-gray-800">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-900 dark:text-gray-900">
        Reset Password
      </h2>

      {resetStep === "idle" && (
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            className="w-full p-3 border rounded bg-white dark:bg-white border-gray-300 dark:border-gray-400 text-gray-900 dark:text-gray-900 placeholder-gray-500 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white p-3 rounded hover:bg-blue-700 disabled:bg-blue-400"
            >
              {loading ? "Sending..." : "Send Code"}
            </button>
            <button
              onClick={() => {
                setView("login");
                setError("");
              }}
              className="bg-gray-200 text-gray-700 p-3 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {resetStep === "sent" && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <input
            type="text"
            placeholder="Verification Code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-3 border rounded bg-white dark:bg-white border-gray-300 dark:border-gray-400 text-gray-900 dark:text-gray-900 placeholder-gray-500 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 border rounded bg-white dark:bg-white border-gray-300 dark:border-gray-400 text-gray-900 dark:text-gray-900 placeholder-gray-500 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white p-3 rounded hover:bg-blue-700 disabled:bg-blue-400"
            >
              {loading ? "Reseting..." : "Reset Password"}
            </button>
            <button
              type="button"
              onClick={() => {
                setView("login");
                setError("");
              }}
              className="bg-gray-200 text-gray-700 p-3 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {resetStep === "success" && (
        <div className="text-center space-y-4">
          <p className="text-green-600 font-medium">
            Password Reset Successfully!
          </p>
          <button
            onClick={() => {
              setView("login");
              setResetStep("idle");
              setError("");
              setResetEmail("");
              setOtp("");
              setNewPassword("");
            }}
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
          >
            Back to Login
          </button>
        </div>
      )}
    </div>
  );

  return view === "login" ? renderLogin() : renderForgot();
}
