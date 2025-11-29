"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const PodcastCard = ({ name, title, description, videoSrc, tags }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="sm:w-1/2 mb-10 px-4 relative z-10">
      <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white border border-gray-200 relative z-10">
        {/* Video */}
        <div className="relative" style={{ paddingTop: "56.25%" }}>
          <iframe
            src={videoSrc}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
            className="absolute top-0 left-0 w-full h-full rounded-t-2xl"
            title={`Podcast with ${name}`}
          />
        </div>

        {/* Content */}
        <div className="p-6 text-left">
          <h2 className="text-2xl font-extrabold leading-tight bg-gradient-to-r text-black bg-clip-text font-[oswald]">
            {name}
          </h2>
          {/* <h2 className="text-2xl font-extrabold leading-tight bg-gradient-to-r from-indigo-700 via-purple-700 to-fuchsia-700 bg-clip-text text-transparent">
            {name}
          </h2> */}
          <p className="text-sm mt-1 font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
            {title}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap mt-3 mb-4">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-gradient-to-r from-indigo-100 via-purple-100 to-fuchsia-100 text-indigo-700 text-xs font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded-full shadow-sm"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className="text-gray-700 text-base leading-relaxed">
            {expanded ? description : `${description.substring(0, 180)}...`}
          </p>

          {/* Toggle Button */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-4 font-semibold bg-gradient-to-r from-indigo-700 via-purple-700 to-fuchsia-700 bg-clip-text text-transparent hover:opacity-80 transition"
          >
            {expanded ? "Show Less" : "Read More"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Podcast() {
  return (
    <section className="relative bg-gray-50 py-20 overflow-hidden">
      {/* Floating Blobs */}
      <motion.div
        className="absolute top-10 left-10 w-72 h-72 opacity-40"
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image src="/blob.png" alt="blob" fill className="object-contain" />
      </motion.div>

      <motion.div
        className="absolute top-10 right-10 w-96 h-96 opacity-40"
        animate={{ y: [0, -40, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image src="/blob.png" alt="blob" fill className="object-contain" />
      </motion.div>

      <div className="container px-5 mx-auto relative z-10">
        {/* Section Heading */}
        <h1 className="text-center font-[oswald] text-4xl md:text-5xl font-extrabold mb-16 bg-gradient-to-r from-indigo-700 via-purple-700 to-fuchsia-700 bg-clip-text text-transparent">
          {/* <h1 className="text-center f text-4xl md:text-5xl font-extrabold mb-16 bg-gradient-to-r from-indigo-700 via-purple-700 to-fuchsia-700 bg-clip-text text-transparent"> */}
          🎙 Inspiring Conversations That Matter
        </h1>

        {/* Podcast Cards */}
        <div className="flex flex-wrap -mx-4 -mb-10 text-center relative z-10">
          <PodcastCard
            name="NYU Stern Finance Expert at American Century | Himanish Shah on Smarter Wealth Strategies"
            title="Finance Made Simple and Strategic"
            tags={["Finance", "Investing", "Career", "Budgeting"]}
            videoSrc="https://player.vimeo.com/video/1085573700?h=da789de976&badge=0&autopause=0&player_id=0&app_id=58479"
            description={`Himanish Shah is a finance professional at American Century Investments with a background from the prestigious NYU Stern School of Business. With deep experience in global investment strategies, he knows exactly how to make money work smarter.

From budgeting and investing to inflation and career building, Himanish brings clarity to complex topics—without the jargon. His mission? To make finance less intimidating and far more empowering.

Get ready for real talk, practical insights, and a fresh perspective on money that sticks.`}
          />

          <PodcastCard
            name="Founder of Wellfund | Roshni Jain on Funding Women-Led Startups & Driving Change"
            title="Championing Women, Capital, and Change"
            tags={["Entrepreneurship", "Women in Business", "Funding"]}
            videoSrc="https://player.vimeo.com/video/1085573640?h=a42bfeea63&title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479"
            description={`Roshni Jain is the founder of Wellfund, a platform redefining access to capital for women-led startups. She’s not just building a company—she’s building a movement toward inclusive entrepreneurship.

With over 100 female entrepreneurs empowered, 10+ workshops led, and strategic partnerships across India, Roshni is turning bold ideas into lasting impact. From marketing insights to funding strategies, she brings a rare blend of purpose and practical know-how.

Get ready to hear from a true trailblazer on a mission to make opportunity accessible for all.`}
          />
        </div>
      </div>
    </section>
  );
}
