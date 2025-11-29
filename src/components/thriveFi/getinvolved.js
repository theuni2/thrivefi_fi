"use client";

import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Building2, Megaphone } from "lucide-react";

export default function Getinvolve() {
  const items = [
    {
      title: "For Students",
      desc: "Participate in our events to strengthen your financial knowledge and skills.",
      Icon: GraduationCap,
    },
    {
      title: "For Schools & Communities",
      desc: "Partner with us to bring impactful financial education to students.",
      Icon: Building2,
    },
    {
      title: "For Sponsors & Speakers",
      desc: "Support our mission and inspire the next generation of financial leaders.",
      Icon: Megaphone,
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section
      id="get-involved"
      className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20"
    >
      {/* Decorative Blobs */}
      <motion.img
        src="/blob.png"
        alt="Blob Top Left"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute -top-24 -left-24 w-72 pointer-events-none select-none"
      />

      <motion.img
        src="/blob.png"
        alt="Blob Bottom Right"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute bottom-16 right-12 w-80 pointer-events-none select-none"
      />

      <motion.img
        src="/blob.png"
        alt="Blob Middle Right"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute top-1/3 right-1/4 w-60 pointer-events-none select-none"
      />

      <div className="container mx-auto px-5 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/70 px-4 py-1 text-sm font-medium text-indigo-700">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            Get Involved
          </div>
          <h1 className="mt-5 text-4xl sm:text-5xl font-[oswald] font-extrabold leading-tight text-gray-900">
            Be part of the movement
          </h1>
          <p className="mt-5 text-gray-700 text-lg leading-relaxed">
            Join us in empowering individuals with essential financial
            knowledge and skills. Whether you're a student, school, community,
            or sponsor — there's a place for you in our mission.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
        >
          {items.map(({ title, desc, Icon }, idx) => (
            <motion.div key={idx} variants={item}>
              {/* Gradient Border Wrapper */}
              <div className="group relative rounded-3xl p-[1px] bg-gradient-to-br from-indigo-400 via-purple-400 to-fuchsia-400 transition-transform duration-300 will-change-transform">
                {/* Card Body */}
                <div className="rounded-3xl h-full w-full bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:bg-white">
                  {/* Shine Effect */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background:
                        "radial-gradient(120px 60px at 20% 0%, rgba(255,255,255,0.8), transparent 60%), radial-gradient(160px 80px at 80% 0%, rgba(255,255,255,0.6), transparent 60%)",
                    }}
                  />

                  <div className="relative flex flex-col items-center text-center px-6 py-10">
                    <div className="mb-5 inline-flex items-center justify-center rounded-2xl p-4 bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md group-hover:translate-y-[-2px] transition-transform">
                      <Icon className="h-8 w-8" />
                    </div>

                    <h3 className="text-xl font-[oswald] font-bold text-gray-900">
                      {title}
                    </h3>
                    <p className="mt-3 text-gray-600 leading-relaxed">{desc}</p>
                  </div>
                </div>

                {/* Hover Glow */}
                <div
                  className="pointer-events-none absolute -inset-1 rounded-3xl opacity-0 blur-2xl transition duration-300 group-hover:opacity-70"
                  style={{
                    background:
                      "conic-gradient(from 180deg at 50% 50%, rgba(99,102,241,0.35), rgba(168,85,247,0.35), rgba(236,72,153,0.35), rgba(99,102,241,0.35))",
                  }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
