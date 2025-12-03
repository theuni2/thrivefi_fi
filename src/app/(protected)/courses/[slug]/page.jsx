"use client";

import { useParams } from "next/navigation";
import { getCourseBySlug, getChapterData } from "@/lib/courseData";
import { useEffect, useState } from "react";

export default function Course() {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);

  // GET course by slug
  useEffect(() => {
    async function fetchCourse() {
      const course = await getCourseBySlug(slug);
      // console.log(course);
      setCourse(course);
    }
    fetchCourse();

    async function fetchChapters() {
      const chapters = await getChapterData(slug, 1); // Example: fetch chapter 1
      console.log(chapters)
      setChapters(chapters);
    }

    fetchChapters();
  }, [slug]);

  return (
    <div>
      Course: {slug}
      {/* <pre>{JSON.stringify(course, null, 2)}</pre> */}
      <pre>{JSON.stringify(chapters, null, 2)}</pre>
    </div>
  );
}
