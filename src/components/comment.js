'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function CommentSection() {
  const [comments, setComments] = useState([]);
  const [formData, setFormData] = useState({ name: '', comment: '' });
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://comment-be.onrender.com/api/comments');
      setComments(res.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.comment) return;

    setSubmitting(true);
    try {
      await axios.post('https://comment-be.onrender.com/api/comments', formData);
      setFormData({ name: '', comment: '' });
      fetchComments();
    } catch (err) {
      console.error('Error posting comment:', err);
    }
    setSubmitting(false);
  };

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Animated blob.png background */}
      <motion.div
        initial={{ x: -30, y: -30, opacity: 0.3 }}
        animate={{ x: [0, 30, -30, 0], y: [0, 20, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -top-24 -left-16 w-52 h-52 z-0"
        aria-hidden="true"
      >
        <Image src="/blob.png" alt="decorative blob" width={208} height={208} className="w-full h-full" />
      </motion.div>

      <motion.div
        initial={{ x: 20, y: 0, opacity: 0.22 }}
        animate={{ x: [0, -40, 40, 0], y: [0, 25, -25, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute bottom-[-100px] right-[-60px] w-80 h-80 z-0"
        aria-hidden="true"
      >
        <Image src="/blob.png" alt="decorative blob" width={320} height={320} className="w-full h-full" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0.18 }}
        animate={{ scale: [1, 1.12, 1], rotate: [0, 12, -12, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute top-1/3 right-1/4 w-40 h-40 z-0"
        aria-hidden="true"
      >
        <Image src="/blob.png" alt="decorative blob" width={160} height={160} className="w-full h-full" />
      </motion.div>

      {/* Main comment box */}
      <div className="relative z-10 bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8 max-w-3xl mx-auto mt-0 border border-gray-200">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
          💬 Join the Conversation
        </h2>

        {/* Comment Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full px-4 py-3 border text-black rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <textarea
            placeholder="Your Comment"
            className="w-full px-4 py-3 border rounded-xl text-black border-gray-300 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          />
          <button
            type="submit"
            disabled={submitting}
            className={`bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center shadow-md ${
              submitting ? 'opacity-70 cursor-not-allowed' : 'hover:from-indigo-700 hover:to-purple-700'
            }`}
          >
            {submitting && (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            )}
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>

        {/* Loader / List */}
        {loading ? (
          <div className="flex justify-center mt-8">
            <svg
              className="animate-spin h-8 w-8 text-indigo-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            <AnimatePresence>
              {comments.slice(0, visibleCount).map((c) => (
                <motion.div
                  key={c._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-gray-50 p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
                >
                  <p className="font-semibold text-gray-800">{c.name}</p>
                  <p className="text-gray-600 mt-1">{c.comment}</p>
                  {c.createdAt && (
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(c.createdAt).toLocaleString()}
                    </p>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {visibleCount < comments.length && (
              <button
                onClick={() => setVisibleCount((prev) => prev + 5)}
                className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-2 rounded-lg text-white font-medium shadow hover:from-indigo-600 hover:to-purple-600 transition"
              >
                Load More
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
