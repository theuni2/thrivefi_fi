"use client";
import React, { useState, useEffect } from "react";
import { Mail, CheckCircle, Loader2 } from 'lucide-react';

function VerifyEmail() {
  const [code, setCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSendVerificationEmail = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      // console.log("Response of email send: ", data);
      setCode(data.verificationCode);
      setShowInput(true);
    } catch (error) {
      console.error("Error sending verification email:", error);
      setError("Failed to send verification email");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    setLoading(true);
    setError("");
    if (inputCode !== code) {
      setError("Invalid verification code");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      // console.log("Email verification response: ", data);
      if (!data.success) {
        setError("Invalid verification code");
      }
      setIsVerified(data.success);
      setSuccessMsg("Redirecting to profile...");

      setTimeout(() => {
        window.location.href = "/profile";
      }, 3000);

    } catch (error) {
      console.error("Error verifying email:", error);
      setError("Error verifying email");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const statusCheck = async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        setIsVerified(data.isVerified);
      } catch (error) {
        console.log("ERR: ", error);
      }
    };

    statusCheck();
  }, []);

  if (isVerified) {
    return (
      <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow-md border border-green-200">
        <div className="flex flex-col items-center text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
          <h2 className="text-2xl font-bold text-gray-800">Email Verified!</h2>
          <p className="text-gray-600">
            Your email has been successfully verified. You can now access all features.
          </p>
          {successMsg}
        </div>
      </div>
    );
  }

  if (showInput) {
    return (
      <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center text-center space-y-4">
          <Mail className="w-12 h-12 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-800">Check Your Email</h2>
          <p className="text-gray-600">
            We've sent a verification code to your email address. Please enter it below.
          </p>

          {error && (
            <div className="w-full p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="w-full space-y-3 mt-4">
            <input
              type="text"
              placeholder="Enter verification code"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-center text-lg tracking-widest"
              maxLength={6}
            />

            <button
              onClick={handleVerifyEmail}
              disabled={loading || inputCode.length === 0}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-md font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </button>

            <button
              onClick={handleSendVerificationEmail}
              disabled={loading}
              className="w-full text-blue-500 hover:text-blue-600 text-sm font-medium transition-colors disabled:text-gray-400"
            >
              Didn't receive code? Resend
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow-md">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <Mail className="w-8 h-8 text-blue-500" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800">Verify Your Email</h2>

        <p className="text-gray-600">
          To access all features and ensure account security, please verify your email address.
        </p>

        {error && (
          <div className="w-full p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleSendVerificationEmail}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Verification Email"
          )}
        </button>

        <p className="text-sm text-gray-500">
          We'll send a verification code to your registered email address
        </p>
      </div>
    </div>
  );
}

export default VerifyEmail;