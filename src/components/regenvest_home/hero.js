"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function HeroReGenVest() {
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.06 } },
  };
  const item = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className="relative overflow-hidden bg-black">
      {/* Animated Floating Blobs */}
      <motion.div
        initial={{ x: -40, y: -40, opacity: 0.35 }}
        animate={{ x: [0, 30, -30, 0], y: [0, 20, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-20 -right-20 w-40 h-40 opacity-30 z-0"
      >
        <Image
          src="/blob.png"
          alt="decorative blob"
          width={200}
          height={200}
          className="w-full h-full"
        />
      </motion.div>

      <motion.div
        initial={{ x: 40, y: 0, opacity: 0.25 }}
        animate={{ x: [0, -40, 40, 0], y: [0, 25, -25, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-32 left-10 w-56 h-56 opacity-25 z-0"
      >
        <Image
          src="/blob.png"
          alt="decorative blob"
          width={250}
          height={250}
          className="w-full h-full"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0.2 }}
        animate={{ scale: [1, 1.15, 1], rotate: [0, 15, -15, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 right-[-50px] w-44 h-44 opacity-20 z-0"
      >
        <Image
          src="/blob.png"
          alt="decorative blob"
          width={220}
          height={220}
          className="w-full h-full"
        />
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16 md:py-24 relative z-10">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col-reverse md:flex-row items-center gap-10"
        >
          {/* LEFT: Text */}
          <motion.div
            variants={item}
            className="md:w-1/2 text-center md:text-left"
          >
            <motion.span
              variants={item}
              className="inline-block px-3 py-1 rounded-full bg-white/5 text-xs font-medium text-gray-200 mb-4"
            >
              India Edition
            </motion.span>

            <motion.h1
              variants={item}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-[oswald] leading-tight"
            >
              <span className="block bg-gradient-to-r from-indigo-700 via-purple-700 to-fuchsia-700 bg-clip-text text-transparent">
                ReGenVest Challenge
              </span>
              <span className="block text-gray-300 mt-2 text-lg md:text-xl font-medium">
                By The Olive School
              </span>
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-6 text-lg md:text-xl text-gray-300 max-w-xl mx-auto md:mx-0"
            >
              Students in <strong>Grades IX — XII</strong> are invited to
              participate. Showcase your financial thinking, propose solutions,
              and win mentorship and recognition from industry experts.
            </motion.p>

            <motion.div
              variants={item}
              className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow">
                Deadline: <b>Closed</b> (June 20, 2025)
              </span>

              <a
                href="#result"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center px-5 py-2 rounded-full text-sm bg-gradient-to-r from-indigo-700 via-purple-700 to-fuchsia-700 text-white font-semibold shadow hover:brightness-105 transition"
                aria-label="Register for ReGenVest"
              >
                View Results
              </a>
            </motion.div>
          </motion.div>

          {/* RIGHT: Image/Card */}
          <motion.div
            variants={item}
            className="md:w-1/2 flex justify-center md:justify-end"
          >
            <div className="relative w-64 h-64 md:w-96 md:h-96 rounded-2xl p-1 bg-white/5 border border-white/8 shadow-xl transform transition-all hover:scale-[1.03]"
            >
              <img
                src="/images/slogo.png"
                alt="ReGenVest logo"
                className="w-full h-full object-contain rounded-xl bg-black p-6"
              />
              <div className="absolute -bottom-4 left-4 px-3 py-1 rounded-full bg-black/60 text-xs text-gray-200 backdrop-blur">
                Essay Competition • India
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
