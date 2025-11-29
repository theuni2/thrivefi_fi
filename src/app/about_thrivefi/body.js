"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Nav from "../../components/nav";
import Footer from "../../components/thriveFi/footer";
import {
  FaChartLine,
  FaUsers,
  FaGlobe,
  FaCheckCircle,
  FaMicrophone,
  FaTrophy,
  FaHandshake,
} from "react-icons/fa";

export default function About() {
  const whatWeDo = [
    {
      icon: <FaChartLine className="text-indigo-600 text-3xl" />,
      text: "Organize finance-focused competitions that challenge students to think critically",
      img: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=800&q=80",
    },
    {
      icon: <FaGlobe className="text-purple-600 text-3xl" />,
      text: "Host global expert-led discussions to promote financial literacy",
      img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    },
    {
      icon: <FaUsers className="text-fuchsia-600 text-3xl" />,
      text: "Empower students with real-world consulting experiences and mentorship",
      img: "https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=800&q=80",
    },
    {
      icon: <FaCheckCircle className="text-indigo-600 text-3xl" />,
      text: "Deliver accessible, engaging financial education rooted in real-life application",
      img: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const ourVision = [
    {
      icon: <FaMicrophone className="text-purple-600 text-3xl" />,
      text: "Expand our global conference series to spark informed financial dialogue",
      img: "https://images.unsplash.com/photo-1523582407565-efee5cf4a353?auto=format&fit=crop&w=800&q=80",
    },
    {
      icon: <FaTrophy className="text-fuchsia-600 text-3xl" />,
      text: "Launch innovative competitions to inspire the next generation of financial leaders",
      img: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=800&q=80",
    },
    {
      icon: <FaGlobe className="text-indigo-600 text-3xl" />,
      text: "Build an inclusive community of finance learners and professionals worldwide",
      img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    },
    {
      icon: <FaHandshake className="text-purple-600 text-3xl" />,
      text: "Provide personalized consulting and mentorship to help students grow",
      img: "https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=800&q=80",
    },
  ];

  // Enhanced blob configuration for better visibility
  const blobs = [
    {
      top: "5%",
      left: "10%",
      size: 300,
      duration: 8,
      color: "from-indigo-400 to-purple-400",
    },
    {
      top: "15%",
      right: "5%",
      size: 250,
      duration: 10,
      color: "from-purple-400 to-fuchsia-400",
    },
    {
      top: "40%",
      left: "5%",
      size: 280,
      duration: 12,
      color: "from-fuchsia-400 to-indigo-400",
    },
    {
      top: "60%",
      right: "15%",
      size: 220,
      duration: 9,
      color: "from-indigo-400 to-purple-400",
    },
    {
      bottom: "20%",
      left: "20%",
      size: 240,
      duration: 11,
      color: "from-purple-400 to-fuchsia-400",
    },
    {
      bottom: "5%",
      right: "30%",
      size: 200,
      duration: 13,
      color: "from-fuchsia-400 to-indigo-400",
    },
    {
      top: "30%",
      left: "50%",
      size: 180,
      duration: 14,
      color: "from-indigo-400 to-purple-400",
    },
    {
      bottom: "40%",
      left: "70%",
      size: 160,
      duration: 15,
      color: "from-purple-400 to-fuchsia-400",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen relative overflow-hidden">
      <Nav />
      <h1 className="text-4xl md:text-5xl text-center font-extrabold bg-gradient-to-r from-indigo-700 via-purple-700 to-fuchsia-700 bg-clip-text text-transparent leading-snug font-[Oswald]">
        About ThriveFi
      </h1>
      {/* Enhanced Floating Blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {blobs.map((blob, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0.6, scale: 0.8 }}
            animate={{
              y: [0, 40, 0],
              x: [0, 20, 0],
              opacity: [0.4, 0.7, 0.4],
              scale: [0.8, 1.1, 0.8],
            }}
            transition={{
              duration: blob.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.5,
            }}
            className="absolute pointer-events-none"
            style={{
              top: blob.top,
              left: blob.left,
              right: blob.right,
              bottom: blob.bottom,
            }}
          >
            {/* Using gradient div instead of image for better visibility */}
            <div
              className={`rounded-full bg-gradient-to-br ${blob.color} blur-xl opacity-60`}
              style={{
                width: blob.size,
                height: blob.size,
              }}
            />
            {/* Adding a second layer for more depth */}
            <div
              className={`absolute top-1/4 left-1/4 rounded-full bg-gradient-to-br ${blob.color} blur-lg opacity-40`}
              style={{
                width: blob.size * 0.5,
                height: blob.size * 0.5,
              }}
            />
          </motion.div>
        ))}

        {/* Additional blob images if you have the blob.png file */}
        {blobs.slice(0, 4).map((blob, index) => (
          <motion.div
            key={`img-${index}`}
            initial={{ opacity: 0.3, scale: 0.9 }}
            animate={{
              y: [0, 30, 0],
              opacity: [0.3, 0.6, 0.3],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: blob.duration + 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 1.2,
            }}
            className="absolute pointer-events-none"
            style={{
              top: blob.top,
              left: blob.left,
              right: blob.right,
              bottom: blob.bottom,
            }}
          >
            <Image
              src="/blob.png"
              alt={`Blob ${index}`}
              width={blob.size * 0.8}
              height={blob.size * 0.8}
              className="opacity-50 blur-sm"
            />
          </motion.div>
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative flex flex-col md:flex-row items-center justify-between w-full bg-white/90 backdrop-blur-sm px-6 md:px-12 py-16 z-10">
        {/* Left Content */}
        <div className="flex flex-col justify-center w-full md:w-1/2 relative z-10 text-center md:text-left">
          {/* Heading */}

          {/* Intro */}
          <p className="mt-6 text-lg text-gray-700 leading-relaxed max-w-xl mx-auto md:mx-0">
            ThriveFi isn’t just another after-school program—it’s a movement.
            Founded by{" "}
            <span className="font-semibold text-gray-900">Anvay Arora</span>,
            ThriveFi shows that financial education can be fun and engaging, not
            just boring spreadsheets or confusing terms.
          </p>

          {/* Key Elements */}
          <div className="mt-8 space-y-6">
            <div className="bg-white/70 backdrop-blur-sm p-5 rounded-xl shadow-sm hover:shadow-md transition">
              <h3 className="font-semibold text-indigo-700">📢 Conference</h3>
              <p className="text-gray-600 text-base mt-1">
                Students share bold ideas and learn from experts who make
                finance feel like storytime.
              </p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm p-5 rounded-xl shadow-sm hover:shadow-md transition">
              <h3 className="font-semibold text-purple-700">🏆 Competition</h3>
              <p className="text-gray-600 text-base mt-1">
                Classrooms turn into boardrooms where creativity and strategy
                take the spotlight.
              </p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm p-5 rounded-xl shadow-sm hover:shadow-md transition">
              <h3 className="font-semibold text-fuchsia-700">🤝 Consulting</h3>
              <p className="text-gray-600 text-base mt-1">
                Students tackle real problems hands-on, gaining practical
                finance experience like mini Wall Street experts.
              </p>
            </div>
          </div>

          {/* Closing */}
          <p className="mt-10 text-lg text-gray-700 leading-relaxed max-w-xl mx-auto md:mx-0">
            The result? A new generation of financial thinkers who are bold,
            globally aware, and ready to change how the world views money. So,
            principals, teachers, and students—here’s your invitation.
            <span className="font-semibold text-gray-900">
              {" "}
              Sign-up and Show Up like the Wolf of Wallstreet.
            </span>
          </p>
        </div>

        {/* Right Content */}
        <div className="relative w-full md:w-1/2 mt-10 md:mt-0 md:pl-12 z-10">
          <Image
            src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=80"
            alt="Finance Learning"
            width={800}
            height={600}
            className="w-full h-auto object-cover rounded-2xl shadow-lg"
          />
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-16 px-6 md:px-12 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 bg-black font-[oswald] bg-clip-text text-transparent"
        >
          What We Do
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          {whatWeDo.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index, duration: 0.6 }}
              className="flex flex-col md:flex-row items-center bg-white/95 backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all"
            >
              <div className="md:w-1/3 h-40 relative">
                <Image
                  src={item.img}
                  alt="About Card"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex items-start gap-4 md:w-2/3">
                {item.icon}
                <p className="text-gray-700 text-base leading-relaxed">
                  {item.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Our Vision Section */}
      <section className="py-16 px-6 md:px-12 bg-gray-100/90 backdrop-blur-sm relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 bg-black font-[oswald] bg-clip-text text-transparent"
        >
          Our Vision
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          {ourVision.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index, duration: 0.6 }}
              className="flex flex-col md:flex-row items-center bg-white/95 backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all"
            >
              <div className="md:w-1/3 h-40 relative">
                <Image
                  src={item.img}
                  alt="Vision Card"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex items-start gap-4 md:w-2/3">
                {item.icon}
                <p className="text-gray-700 text-base leading-relaxed">
                  {item.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
