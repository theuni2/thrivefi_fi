"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Downhero() {
  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-100 via-white to-gray-200 py-16">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute -top-20 -left-32 w-80 h-80 rounded-full bg-purple-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-32 w-96 h-96 rounded-full bg-indigo-200/30 blur-3xl" />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="container mx-auto px-6 flex flex-col items-center text-center"
      >
        <motion.h2
          variants={item}
          className="text-3xl md:text-4xl font-extrabold leading-tight bg-black font-[oswald] bg-clip-text text-transparent max-w-4xl"
        >
        {/* <motion.h2
          variants={item}
          className="text-3xl md:text-4xl font-extrabold leading-tight bg-gradient-to-r from-indigo-700 via-purple-700 to-fuchsia-700 bg-clip-text text-transparent max-w-4xl"
        > */}
          Empowering Future Financial Leaders — through expert insights, student voices, and impactful partnerships like the ReGenVest Challenge.
        </motion.h2>

        <motion.p
          variants={item}
          className="mt-6 max-w-3xl text-gray-700 leading-relaxed text-lg"
        >
          The ReGenVest Finance Challenge 2025 is a unique opportunity for students to engage with the world of finance and sustainability. By participating in this competition, students will not only enhance their knowledge and skills but also contribute to the global conversation on sustainable finance. We encourage all students to take part in this exciting event and showcase their talents.
        </motion.p>
      </motion.div>
    </section>
  );
}
