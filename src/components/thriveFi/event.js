"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Event() {
  return (
    <section className="relative flex flex-col md:flex-row items-center justify-between w-full bg-white px-4 sm:px-6 md:px-12 py-12 md:py-20 overflow-hidden">
      {/* Background Blobs */}
      <motion.div
        initial={{ x: -50, y: 0, opacity: 0.3 }}
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-9 left-[-40px] w-64 sm:w-72 opacity-30"
      >
        <Image
          src="/blob.png"
          alt="Background Blob Left"
          width={300}
          height={300}
          className="object-contain"
        />
      </motion.div>
      <motion.div
        initial={{ x: -50, y: 0, opacity: 0.3 }}
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-9 left-1/2 w-64  sm:w-72 opacity-30"
      >
        <Image
          src="/blob.png"
          alt="Background Blob Left"
          width={300}
          height={300}
          className="object-contain "
        />
      </motion.div>

      <motion.div
        initial={{ x: 50, y: 0, opacity: 0.3 }}
        animate={{ y: [0, -25, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-60px] right-[-80px] w-72 sm:w-96 opacity-30 hidden md:block"
      >
        <Image
          src="/blob.png"
          alt="Background Blob Right"
          width={350}
          height={350}
          className="object-contain"
        />
      </motion.div>

      {/* Left Side - Vertically Centered */}
      <div className="flex flex-col justify-center md:items-start items-center  w-full md:w-1/2 relative z-10">
        {/* Card */}
        <div className="relative bg-[#e05fcf81] rounded-[24px] p-6 sm:p-8 md:p-10 shadow-md max-w-full md:max-w-lg  text-center md:text-left">
          <span className="uppercase text-xs sm:text-sm font-bold text-gray-800 tracking-wide">
            Our First Event
          </span>

          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold font-[oswald] text-gray-900 leading-snug">
            ReGenVest Essay{" "}
            <span className="relative text-[#ff5722]">
              <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-[url('/icons/wave.svg')] bg-repeat-x"></span>
            </span>
            <br /> Competition
          </h2>

          {/* Bull Icon */}
          <motion.div
            initial={{ x: -30, y: 20, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="absolute bottom-[-30px] right-[-40px] w-32 sm:w-40 md:w-56"
          >
            <Image
              src="/images/bull.png"
              alt="Bull Icon"
              width={220}
              height={220}
              className="object-contain"
            />
          </motion.div>
        </div>

        {/* Description */}
        {/* <p className="mt-10 text-base md:text-lg font-medium text-gray-700  text-center md:text-left leading-relaxed max-w-md">
         
Yes, you heard it right. India is about to host one of the most unique and thought-provoking essay competitions. We’re inviting senior school students to step up and showcase their thinking on the world’s toughest financial issues.

But don’t worry—it’s not your usual “write-an-essay, get-a-grade” situation. Instead, this competition focuses on impressive critical thinking, eye-catching problem-solving, and ideas that could actually change how the world invests, saves, and grows.

Students: Ready to move beyond the usual debates about pocket money? You can take on topics like climate finance, digital currencies, or sustainable investing. 
Principals: Here’s your chance to send your students onto a real international stage to showcase their talent and gain a global perspective. 
Parents: Get ready to see your kids discuss fiscal policy at the dinner table, complete with footnotes.

So, whether you’re from Delhi or Dubai, Mumbai or Manila, join the ReGenVest Challenge. Write. Compete. Inspire. And maybe, just maybe, become the next voice shaping the financial future.        
        </p> */}

        {/* Description */}
<div className="mt-10 text-base md:text-lg font-medium text-gray-700 leading-relaxed max-w-md space-y-4 text-center md:text-left">
  <p>
    Yes, you heard it right—India is about to host one of the most unique and
    thought-provoking essay competitions. Senior school students will have the
    chance to step up and share their ideas on the world’s toughest financial
    challenges.
  </p>

  <p>
    But this isn’t your usual “write an essay, get a grade” situation. The
    ReGenVest Challenge celebrates <span className="font-semibold text-purple-700">
    critical thinking</span>, <span className="font-semibold text-purple-700">
    problem-solving</span>, and <span className="font-semibold text-purple-700">
    bold ideas</span> that could reshape how the world invests, saves, and grows.
  </p>

  <ul className="list-disc pl-5 space-y-2">
    <li>
      <span className="font-bold text-purple-600">Students:</span> Move beyond
      pocket money debates—tackle topics like climate finance, digital currencies,
      or sustainable investing.
    </li>
    <li>
      <span className="font-bold text-purple-600">Principals:</span> Give your
      students a global stage to showcase their talent and gain fresh perspectives.
    </li>
    <li>
      <span className="font-bold text-purple-600">Parents:</span> Get ready to
      hear dinner table conversations about fiscal policy—footnotes included.
    </li>
  </ul>

  <p className="text-gray-900 font-semibold">
    From Delhi to Dubai, Mumbai to Manila—join the ReGenVest Challenge. Write.
    Compete. Inspire. And maybe, just maybe, become the next voice shaping the
    financial future.
  </p>
</div>


        {/* Button */}
  <a href='/regenvest'>
    <button className="mt-6 text-base md:text-lg font-semibold tracking-wide   text-black flex items-center hover:ml-1 transition-all">
      Know More <span className="ml-2">➝</span>
    </button>
  </a>
</div>
      {/* Right Side - Hero Image */}
      <div className="relative w-full md:w-1/2 mt-10 md:mt-0 md:pl-12 z-10">
        <Image
          src="/images/regenvestimg.jpeg"
          alt="Event Banner"
          width={800}
          height={600}
          className="w-full h-auto object-cover rounded-[24px]"
        />

        {/* Button Overlay */}
        <a href='/regenvest#result'>
        <button className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 bg-gradient-to-r from-indigo-700 via-purple-700 to-fuchsia-700 text-white font-semibold px-4 py-2 sm:px-5 sm:py-3 rounded-xl text-sm md:text-base flex items-center hover:mr-1 transition-all">
          View Result <span className="ml-2">➝</span>
        </button>
        </a>
      </div>
    </section>
  );
}
