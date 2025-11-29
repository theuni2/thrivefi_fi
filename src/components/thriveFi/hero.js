"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20">
      <div className="container mx-auto flex px-5 md:flex-row flex-col items-center">
        
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="lg:flex-grow md:w-1/2 lg:pr-16 md:pr-10 flex flex-col md:items-start md:text-left mb-12 md:mb-0 items-center text-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="sm:text-4xl text-3xl mb-6 font-extrabold leading-tight bg-gradient-to-r from-indigo-700 via-purple-700 to-fuchsia-700 bg-clip-text text-transparent"
          >
            Empowering Students
            <br className="hidden lg:inline-block" />
            Through Financial Education
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="mb-8 leading-relaxed text-gray-700 max-w-lg"
          >
            At the core of ThriveFi are our guiding principles—the <strong>3 Cs</strong>:
            <span className="text-purple-600 font-bold "> Conference</span>, 
            <span className="text-purple-600 font-bold"> Competition</span>, and 
            <span className="text-purple-600 font-bold"> Consulting</span>.
            These pillars reflect our commitment to creating dynamic learning
            opportunities, encouraging informed dialogue, and providing mentorship
            to students as they navigate the world of finance.
          </motion.p>

          {/* <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <motion.a
              href="#get-involved"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex text-white bg-gray-900 border-0 py-3 px-8 focus:outline-none hover:bg-gray-800 rounded-xl text-lg shadow-lg"
            >
              Learn More
            </motion.a>
          </motion.div> */}
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6"
        >
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="object-cover object-center rounded-2xl shadow-lg"
            alt="students"
            src="/images/students.jpeg"
          />
        </motion.div>
      </div>
    </section>
  );
}
