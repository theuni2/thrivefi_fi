'use client';

import { useState } from 'react';

export default function FlashBanner() {
  const [showBanner, setShowBanner] = useState(true);

  const handleClose = () => {
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-4 z-50 animate-pulse shadow-xl rounded-xl flex items-center gap-4 max-w-md w-full justify-between">
      <div className="text-sm sm:text-base">
        <p>
        <strong>ReGenVest Challenge</strong> by The Olive School
        </p>
        <p>
         Deadline: <strong>June 20, 2025</strong>
        </p>
      </div>

      <div className="flex items-center gap-2">
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSdjsiBbhJyug5E96pEzcPRKb5ag06RsDxgu8kbemsRuw88vrA/viewform?usp=header"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="bg-white text-red-600 font-semibold py-2 px-4 rounded-lg text-sm hover:bg-gray-100 transition duration-200">
            Submit
          </button>
        </a>
        <button
          onClick={handleClose}
          className="text-white text-2xl font-bold hover:text-gray-300 leading-none"
          aria-label="Close banner"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
