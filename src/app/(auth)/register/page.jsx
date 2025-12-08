"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    address: "", 
    mobile: "", 
    referralCode: "" 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

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
    <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-4 text-center">Create Account</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          type="text"
          placeholder="Full Name"
          required
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        <input
          name="address"
          type="text"
          placeholder="Address"
          required
          value={form.address}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        <input
          name="mobile"
          type="text"
          placeholder="Mobile Number (Optional)"
          value={form.mobile}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        <input
          name="referralCode"
          type="text"
          placeholder="Referral Code (Optional)"
          value={form.referralCode}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
        >
          {loading ? "Creating..." : "Register"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600">Login</a>
      </p>
    </div>
  );
}
