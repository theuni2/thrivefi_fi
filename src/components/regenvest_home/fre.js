"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Fre() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: `01. Who can participate in the competition?`,
      answer: `Any student in grades IX through XII may participate.`,
    },
    {
      question: "Q2: Is there a participation fee?",
      answer: `No, there is no participation fee. The competition is free and open to all eligible students.`,
    },
    {
      question: `Q3: What are the language requirements and word limits for submissions?`,
      answer:
        "The essay must be written in English and must contain between 1,500 and 2,000 words to qualify.",
    },
    {
      question: "Q4: What is the last date for submission?",
      answer:
        "The final submission deadline is June 20, 2025. Participants are encouraged to submit their essays before the deadline to allow for any revisions if needed.",
    },
    {
      question: "05: When will the winners be announced?",
      answer: `Results will be published on www.thethrivefi.com as well as www.theoliveschool.com websites. A formal communication will also be sent to the school and registered email addresses by June 26, 2025.`,
    },
    {
      question: "06: What are the awards and recognition for winners?",
      answer: `First Prize: Certificate of Achievement + Essay Publication in a reputed finance media outlet.  
Second & Third Prize: Certificate of Achievement.  
All Participants: Certificate of Participation.`,
    },
    {
      question: "07: Can I co-author my essay with a friend?",
      answer: `No, each entry must be submitted under a single student's name.`,
    },
    {
      question: "08: Are there specific topics to choose from?",
      answer: `Yes. Each essay must address one of the given topics and present a well-structured, research-backed argument.`,
    },
    {
      question: "09: Are references or citations required in the essay?",
      answer: `Yes, any references to published print or digital media must be cited at the bottom of the essay. Participants may use either APA or Harvard referencing style.`,
    },
    {
      question: "10: Can I include my name or personal details in the essay?",
      answer: `No. Essays must not include any identifying details (name, school, etc.) to maintain impartiality.`,
    },
    {
      question: "11: What are the judging criteria?",
      answer: `Essays will be evaluated based on:  
Depth of Analysis (30%),  
Argumentation & Structure (25%),  
Use of Evidence & Research (20%),  
Originality & Creativity (15%),  
Writing Style & Clarity (10%).`,
    },
    {
      question:
        "12: Are there any originality and authenticity requirements for the essay?",
      answer: `Yes, essays must be original, unpublished, and not written using AI tools. All entries will be checked for plagiarism and AI use; violations will lead to disqualification. Copyrights are respected, but ThriveFi and The Olive School will not be responsible for any infringement.`,
    },
  ];

  return (
    <section className="relative bg-black text-white py-16 overflow-hidden">
      {/* Animated Blobs */}
      <motion.div
        initial={{ x: -30, y: -30, opacity: 0.3 }}
        animate={{ x: [0, 40, -40, 0], y: [0, 25, -25, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 -left-24 w-60 h-60 z-0 opacity-30"
      >
        <Image
          src="/blob.png"
          alt="decorative blob"
          width={240}
          height={240}
          className="w-full h-full"
        />
      </motion.div>

      <motion.div
        initial={{ x: 40, y: 0, opacity: 0.25 }}
        animate={{ x: [0, -30, 30, 0], y: [0, 20, -20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-120px] right-[-80px] w-72 h-72 z-0 opacity-25"
      >
        <Image
          src="/blob.png"
          alt="decorative blob"
          width={280}
          height={280}
          className="w-full h-full"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0.2 }}
        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 right-1/4 w-44 h-44 z-0 opacity-20"
      >
        <Image
          src="/blob.png"
          alt="decorative blob"
          width={200}
          height={200}
          className="w-full h-full"
        />
      </motion.div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10">
        <h1 className="text-3xl md:text-6xl font-[oswald] font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Frequently Asked Questions
        </h1>

        <div className="mt-12 space-y-4">
          {faqs.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="border border-gray-700 rounded-lg overflow-hidden shadow-md bg-gray-900/50 backdrop-blur-sm"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-6 text-left"
              >
                <span className="font-semibold text-lg md:text-xl">
                  {item.question}
                </span>
                <motion.svg
                  animate={{ rotate: activeIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </motion.svg>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <hr className="border-gray-700" />
                    <div className="p-6 text-base md:text-lg whitespace-pre-line text-gray-300">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
