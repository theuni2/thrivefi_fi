"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/components/nav";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    mobile: "",
    referralCode: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate passwords match
    if (form.password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      router.push("/login");
    } catch (err) {
      setError("Server error");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Nav />
      <div className="flex justify-center items-center py-5">
        <div className="w-full max-w-md bg-white dark:bg-gray-100 p-8 rounded-xl shadow border dark:border-gray-800">
          <h2 className="text-2xl font-semibold mb-4 text-center text-gray-900 dark:text-gray-900">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 border rounded bg-white dark:bg-white border-gray-300 dark:border-gray-400 text-gray-900 dark:text-gray-900 placeholder-gray-500 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
            />

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

            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border rounded bg-white dark:bg-white border-gray-300 dark:border-gray-400 text-gray-900 dark:text-gray-900 placeholder-gray-500 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              name="address"
              type="text"
              placeholder="Address"
              required
              value={form.address}
              onChange={handleChange}
              className="w-full p-3 border rounded bg-white dark:bg-white border-gray-300 dark:border-gray-400 text-gray-900 dark:text-gray-900 placeholder-gray-500 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              name="mobile"
              type="text"
              placeholder="Mobile Number (Optional)"
              value={form.mobile}
              onChange={handleChange}
              className="w-full p-3 border rounded bg-white dark:bg-white border-gray-300 dark:border-gray-400 text-gray-900 dark:text-gray-900 placeholder-gray-500 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              name="referralCode"
              type="text"
              placeholder="Referral Code (Optional)"
              value={form.referralCode}
              onChange={handleChange}
              className="w-full p-3 border rounded bg-white dark:bg-white border-gray-300 dark:border-gray-400 text-gray-900 dark:text-gray-900 placeholder-gray-500 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              disabled={loading}
              className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 disabled:bg-blue-400"
            >
              {loading ? "Creating..." : "Register"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
