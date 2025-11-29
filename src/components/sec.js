"use client";
import { motion, useInView } from "framer-motion";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const data = [
  { x: 1, y: 10 },
  { x: 2, y: 40 },
  { x: 3, y: 25 },
  { x: 4, y: 90 },
  { x: 5, y: 30 },
  { x: 6, y: 60 },
  { x: 7, y: 50 },
];

// Counter animation function
function Counter({ from = 0, to = 200, duration = 2000 }) {
  const [value, setValue] = useState(from);

  useEffect(() => {
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setValue(Math.floor(progress * (to - from) + from));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [from, to, duration]);

  return <>{value.toLocaleString()}</>;
}

export default function Sec1() {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3 });
  const [animate, setAnimate] = useState(false);
  const [triggerCount, setTriggerCount] = useState(false);
  const [chartKey, setChartKey] = useState(0);

  useEffect(() => {
    if (isInView) {
      setAnimate(false);
      setTriggerCount(false);

      setTimeout(() => {
        setAnimate(true);
        setTriggerCount(true);
        setChartKey((prev) => prev + 1);
      }, 100);
    }
  }, [isInView]);

  return (
    <section
      ref={ref}
      className="relative flex flex-col md:flex-row items-center justify-between bg-gray-50 min-h-[70vh] px-6 sm:px-10 py-12 sm:py-16 overflow-hidden"
    >
      {/* 🔹 Floating Animated Blobs (with PNGs) */}
      <motion.div
        initial={{ x: -50, y: -50, opacity: 0.3 }}
        animate={{ x: [0, 30, -30, 0], y: [0, 20, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-10 w-24 h-24 z-0"
      >
        <Image
          src="/blob.png"
          alt="blob"
          width={200}
          height={200}
          className="w-full h-full"
        />
      </motion.div>

      <motion.div
        initial={{ x: 30, y: 50, opacity: 0.4 }}
        animate={{ x: [0, -40, 40, 0], y: [0, -30, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-10 w-32 h-32 z-0"
      >
        <Image
          src="/blob.png"
          alt="blob"
          width={250}
          height={250}
          className="w-full h-full"
        />
      </motion.div>

      <motion.div
        initial={{ x: 0, y: 0, opacity: 0.2 }}
        animate={{ x: [0, 20, -20, 0], y: [0, -15, 15, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 z-0"
      >
        <Image
          src="/blob.png"
          alt="blob"
          width={220}
          height={220}
          className="w-full h-full"
        />
      </motion.div>

      {/* Left Content */}
      <motion.div
        className="max-w-xl relative z-10 text-center md:text-left"
        initial={{ opacity: 0, x: -50 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-gray-900 font-[Oswald] mb-6">
          Empowering Students <br /> Through Financial Education
        </h1>

        <p className="text-gray-600 text-sm sm:text-base lg:text-lg font-medium mb-4">
          At the heart of{" "}
          <span className="font-bold text-purple-600">ThriveFi</span> are the
          <span className="font-bold text-purple-600"> 3 Cs</span>: Conference,
          Competition, and Consulting. Think of them as the Avengers of
          financial education—different powers united for one mission.
        </p>

        <ul className="text-gray-700 text-sm sm:text-base lg:text-lg font-medium list-disc pl-5 space-y-2 mb-6">
          <li>
            <span className="font-bold text-purple-600">Conference:</span> Where
            ideas clash, insights emerge, and students sound smarter than most
            adults at family dinners.
          </li>
          <li>
            <span className="font-bold text-purple-600">Competition:</span>{" "}
            Teams channel their inner Shark Tank energy—without the TV drama—to
            solve real-world financial problems.
          </li>
          <li>
            <span className="font-bold text-purple-600">Consulting:</span>{" "}
            Students step up as advisors—because why should adults have all the
            fun?
          </li>
        </ul>

        <p className="text-gray-600 text-sm sm:text-base lg:text-lg font-medium mb-4">
          But wait—this isn’t just another school event. This is{" "}
          <span className="font-bold">international</span>. Your students won’t
          only compete with classmates, but with bright minds from across
          countries, cultures, and time zones.
        </p>

        <p className="text-gray-900 font-semibold text-base sm:text-lg lg:text-xl">
          Principals, gather your brightest students. Rally your squads. Whether
          you’re from Dubai, Delhi, Singapore, or São Paulo—this is your chance
          to think globally, compete boldly, and consult like a pro.
        </p>

        <p className="mt-4 text-purple-700 font-bold text-base sm:text-lg">
          Sign up. Show up. And maybe go down in ThriveFi history as the person
          who conquered the world of finance!
        </p>
      </motion.div>

      {/* Right Content */}
      <motion.div
        className="relative bg-white rounded-2xl shadow-md p-6 sm:p-8 mt-10 md:mt-0 z-10 w-full max-w-sm sm:max-w-md"
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
      >
        {/* Users Badge */}
        <div className="absolute -top-5 -left-5 sm:-top-6 sm:-left-6 bg-gradient-to-r from-indigo-700 via-purple-700 to-fuchsia-700 text-white rounded-full px-4 sm:px-6 py-2 sm:py-4 font-bold text-sm sm:text-lg shadow-lg">
          Users <br />
          {triggerCount && <Counter to={200} />}
        </div>

        {/* Chart */}
        <div className="w-full h-[180px] sm:h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart key={chartKey} data={data}>
              <Line
                type="monotone"
                dataKey="y"
                stroke="#000"
                strokeWidth={3}
                dot={{ r: 4, fill: "purple" }}
                isAnimationActive={animate}
                animationDuration={2000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </section>
  );
}
