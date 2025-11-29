"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 text-gray-600 body-font">
      <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
        
        {/* Logo & Brand Name */}
        <a className="flex title-font font-medium items-center md:justify-start justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-10 h-10 text-white p-2 bg-gradient-to-r from-indigo-700 via-purple-700 to-fuchsia-700 rounded-full shadow-md"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <span className="ml-3 text-xl font-bold bg-gradient-to-r from-indigo-700 via-purple-700 to-fuchsia-700 bg-clip-text text-transparent">
            Title Name
          </span>
        </a>

        {/* Copyright */}
        <p className="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l sm:border-gray-300 sm:py-2 sm:mt-0 mt-4">
          © 2025 Title Name —
          <a
            href="https://twitter.com/knyttneve"
            className="ml-1 hover:underline bg-gradient-to-r from-indigo-700 via-purple-700 to-fuchsia-700 bg-clip-text text-transparent"
            rel="noopener noreferrer"
            target="_blank"
          >
            @yourhandle
          </a>
        </p>

        {/* Social Icons */}
        <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start space-x-4">
          {[
            { icon: "facebook", href: "#" },
            { icon: "twitter", href: "#" },
            { icon: "instagram", href: "#" },
            { icon: "linkedin", href: "#" },
          ].map((social, idx) => (
            <a
              key={idx}
              href={social.href}
              className="text-gray-500 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-indigo-700 via-purple-700 to-fuchsia-700 transition-colors duration-300"
            >
              {/* Replace with proper SVGs or Lucide icons */}
              <svg
                fill="currentColor"
                className="w-5 h-5"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" />
              </svg>
            </a>
          ))}
        </span>
      </div>
    </footer>
  );
}
