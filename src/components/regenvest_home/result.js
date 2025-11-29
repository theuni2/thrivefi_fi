"use client";

import React from "react";

export default function ResultsAndWinners() {
  return (
    <section className="w-full py-10 bg-gray-50" id="result">
      <div className="max-w-5xl mx-auto px-4">
        {/* Results Button */}
        <div className="flex justify-center mb-8">
          <a
            href="#"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center px-6 py-3 rounded-full text-lg bg-gradient-to-r from-indigo-700 via-purple-700 to-fuchsia-700 text-white font-semibold shadow hover:brightness-105 transition"
            aria-label="View Results"
          >
          {/* <a
            href="#"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center px-6 py-3 rounded-full text-lg bg-gradient-to-r from-indigo-700 via-purple-700 to-fuchsia-700 text-white font-semibold shadow hover:brightness-105 transition"
            aria-label="View Results"
          > */}
            Results Announced
          </a>
        </div>

        {/* Winners Section */}
        <h2 className="text-3xl font-bold text-center font-[oswald] text-gray-800 mb-10">
          ReGenVest 2025 — Winners
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {/* First Prize */}
          <div className="bg-white p-6 rounded-2xl shadow text-center border-t-4 border-yellow-400">
            <h3 className="text-xl font-bold text-yellow-600">First Prize</h3>
            <p className="mt-2 text-lg font-semibold text-black">Hriday Dhawan</p>
            <p className="text-sm text-gray-500">Delhi Public School, Bangalore East</p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
              ESG Investing: A Genuine Path to Sustainability or Just Greenwashing?
            </div>
          </div>

          {/* Second Prize */}
          <div className="bg-white p-6 rounded-2xl shadow text-center border-t-4 border-purple-500">
            <h3 className="text-xl font-bold text-purple-600">Second Prize</h3>
            <p className="mt-2 text-lg font-semibold text-black">Nimish Vaid</p>
            <p className="text-sm text-gray-500">DPS Greater Faridabad</p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
              The Future of Green Bonds: A Catalyst for Sustainable Development?
            </div>
          </div>

          {/* Third Prize */}
          <div className="bg-white p-6 rounded-2xl shadow text-center border-t-4 border-green-500">
            <h3 className="text-xl font-bold text-green-600">Third Prize</h3>
            <p className="mt-2 text-lg font-semibold text-black">Bhuvika Rishi</p>
            <p className="text-sm text-gray-500">The HDFC School</p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
              The Future of Green Bonds: A Catalyst for Sustainable Development?
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

