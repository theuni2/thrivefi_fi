"use client";
import { motion } from "framer-motion";

export default function Marquee() {
  const items = [
    "🚀 School",
    "💡  Smart",
    "🎨 Finance",
    "👨‍🔬 Student",
    "🔒 Secure",
    "🌍 Global",
  ];

  return (
    <div className="relative w-full overflow-hidden bg-[#0f0f10] border-y border-[#1f1f21]">
      <motion.div
        className="flex gap-16 py-4 whitespace-nowrap"
        animate={{ x: ["0%", "-100%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 20,
        }}
      >
        {[...items, ...items].map((text, i) => (
          <span
            key={i}
            className="text-[#e0e0e0] text-lg font-medium tracking-wide"
          >
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
