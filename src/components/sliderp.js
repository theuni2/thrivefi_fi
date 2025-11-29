"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import Image from "next/image";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function ThreeCsSlider() {
  return (
    <div className="relative min-h-screen bg-white flex items-center justify-center px-4 my-4 overflow-hidden">
      {/* Floating Blobs */}
      <motion.div
        initial={{ x: -50, y: -50, opacity: 0.4 }}
        animate={{ x: [0, 30, -30, 0], y: [0, 20, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-1/3 w-24 h-24 opacity-30 z-0"
      >
        <Image src="/blob.png" alt="blob" width={400} height={200} className="w-full h-full" />
      </motion.div>

      <motion.div
        initial={{ x: 50, y: 0, opacity: 0.4 }}
        animate={{ x: [0, -40, 40, 0], y: [0, 30, -30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-10 w-20 h-20 opacity-20 z-0"
      >
        <Image src="/blob.png" alt="blob" width={180} height={180} className="w-full h-full" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0.3 }}
        animate={{ scale: [1, 1.2, 1], rotate: [0, 20, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-[-40px] w-28 h-28 opacity-25 z-0"
      >
        <Image src="/blob.png" alt="blob" width={160} height={160} className="w-full h-full" />
      </motion.div>

      {/* Swiper */}
      <Swiper
        modules={[Pagination, Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        pagination={{ clickable: true }}
        navigation
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        className="w-full max-w-6xl relative z-10"
      >
        {/* Slide 1 */}
        <SwiperSlide>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full bg-[#78cc84] rounded-2xl border border-gray-200 shadow-xl p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            {/* Text */}
            <div className="flex-1 max-w-lg text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-4 text-white">
                For <span className="text-orange-500">Students</span>
              </h2>
              <p className="text-white/90 leading-relaxed text-sm sm:text-base">
                Participate in our events to learn and grow your financial knowledge.
                Gain practical insights and skills that will help you make smarter financial decisions.
              </p>
            </div>

            {/* Video */}
            <div className="flex-1 w-full max-w-md aspect-video rounded-2xl overflow-hidden">
              <video
                src="/images/vid2.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </SwiperSlide>

        {/* Slide 2 */}
        <SwiperSlide>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full bg-[#75b3ce] rounded-2xl border border-gray-200 shadow-xl p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            {/* Text */}
            <div className="flex-1 max-w-lg text-center md:text-left">
              <span className="text-xs sm:text-sm uppercase tracking-widest text-gray-100 font-semibold">
                Partnership
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                For Schools & Communities
              </h2>
              <p className="text-gray-800 leading-relaxed text-sm sm:text-base">
                Partner with us to bring financial education programs to your students.
                Together, we can create meaningful opportunities for lifelong learning.
              </p>
            </div>

            {/* Video */}
            <div className="flex-1 w-full max-w-md aspect-video rounded-2xl overflow-hidden">
              <video
                src="/images/vid1.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </SwiperSlide>

        {/* Slide 3 */}
        <SwiperSlide>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full bg-white/90 rounded-2xl border border-gray-200 shadow-xl p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            {/* Text */}
            <div className="flex-1 max-w-lg text-center md:text-left">
              <span className="text-xs sm:text-sm uppercase tracking-widest text-blue-500 font-semibold">
                Support
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                For Sponsors & Speakers
              </h2>
              <p className="text-gray-800 leading-relaxed text-sm sm:text-base">
                Support and contribute to our mission of promoting financial literacy.
                Share your expertise, inspire others, and help us create a lasting impact.
              </p>
            </div>

            {/* Video */}
            <div className="flex-1 w-full max-w-md aspect-video rounded-2xl overflow-hidden">
              <video
                src="/images/vid3.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
