"use client";

import { useParams } from "next/navigation";
import { getCourseBySlug, getChapterContent } from "@/lib/courseData";
import { useEffect, useState } from "react";
import {
  BookOpen,
  CheckCircle,
  PlayCircle,
  ChevronRight,
  Menu,
  Loader2,
  Info,
  Lightbulb,
  AlertCircle,
} from "lucide-react";
import QuizChapter from "@/components/QuizChapter";

// --- Block Renderers ---

const HeadingBlock = ({ content }) => (
  <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">{content}</h3>
);

const TextBlock = ({ content }) => (
  <p className="text-gray-600 leading-relaxed mb-4">{content}</p>
);

const BulletListBlock = ({ items }) => (
  <ul className="space-y-3 mb-6">
    {items.map((item, idx) => (
      <li
        key={idx}
        className="flex gap-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm"
      >
        <div className="mt-1 min-w-4 w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
          <div className="w-2 h-2 rounded-full bg-blue-600"></div>
        </div>
        <div>
          <span className="font-semibold text-gray-800 block mb-1">
            {item.title}
          </span>
          <span className="text-gray-600 text-sm">{item.content}</span>
        </div>
      </li>
    ))}
  </ul>
);

const CalloutBlock = ({ style, title, content }) => {
  const styles = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    success: "bg-green-50 border-green-200 text-green-800",
    danger: "bg-red-50 border-red-200 text-red-800",
  };

  const icons = {
    info: <Info className="w-5 h-5 text-blue-600" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-600" />,
    success: <CheckCircle className="w-5 h-5 text-green-600" />,
    danger: <AlertCircle className="w-5 h-5 text-red-600" />,
  };

  return (
    <div
      className={`p-4 rounded-xl border flex gap-3 mb-6 ${
        styles[style] || styles.info
      }`}
    >
      <div className="shrink-0 mt-0.5">{icons[style] || icons.info}</div>
      <div>
        {title && <h4 className="font-bold mb-1">{title}</h4>}
        <p className="text-sm opacity-90">{content}</p>
      </div>
    </div>
  );
};

const ExampleBlock = ({ content }) => (
  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 p-5 rounded-xl mb-6 relative overflow-hidden">
    <div className="absolute top-0 right-0 p-3 opacity-10">
      <Lightbulb className="w-24 h-24" />
    </div>
    <div className="relative z-10 flex gap-3">
      <div className="shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
        Ex
      </div>
      <div>
        <h4 className="font-bold text-purple-900 mb-1">Example</h4>
        <p className="text-purple-800 text-sm leading-relaxed">{content}</p>
      </div>
    </div>
  </div>
);

const BlockRenderer = ({ block }) => {
  switch (block.type) {
    case "heading":
      return <HeadingBlock {...block} />;
    case "text":
      return <TextBlock {...block} />;
    case "bullet-list":
      return <BulletListBlock {...block} />;
    case "callout":
      return <CalloutBlock {...block} />;
    case "example":
      return <ExampleBlock {...block} />;
    default:
      return null;
  }
};

const Section = ({ section }) => (
  <div className="mb-12 border-b border-gray-100 pb-8 last:border-0 last:pb-0">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">{section.title}</h2>

    <div className="prose prose-blue max-w-none">
      {section.blocks.map((block, idx) => (
        <BlockRenderer key={idx} block={block} />
      ))}
    </div>
  </div>
);

// --- Main Page Component ---

export default function Course() {
  const { slug } = useParams();

  // ... inside Course component
  const [course, setCourse] = useState(null);
  const [loadingCourse, setLoadingCourse] = useState(true);

  const [activeChapter, setActiveChapter] = useState(null);
  const [chapterContent, setChapterContent] = useState(null);
  const [loadingChapter, setLoadingChapter] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [enrollment, setEnrollment] = useState(null);

  // 1. Fetch Course Info AND Enrollment
  useEffect(() => {
    async function fetchCourseData() {
      try {
        setLoadingCourse(true);
        const [courseData, enrollRes] = await Promise.all([
          getCourseBySlug(slug),
          fetch("/api/user/enrollments"),
        ]);

        setCourse(courseData);

        if (enrollRes.ok) {
          const data = await enrollRes.json();
          const enroll = data.enrollments?.find((e) => e.courseSlug === slug);
          setEnrollment(enroll);
        }

        // Auto-select first chapter if none selected
        if (
          courseData &&
          courseData.chapters &&
          courseData.chapters.length > 0
        ) {
          setActiveChapter(courseData.chapters[0]);
        }
      } catch (error) {
        console.error("Failed to fetch course", error);
      } finally {
        setLoadingCourse(false);
      }
    }

    if (slug) fetchCourseData();
  }, [slug]);

  // 2. Fetch Chapter Content when activeChapter changes
  useEffect(() => {
    async function loadContent() {
      if (!activeChapter) return;

      try {
        setLoadingChapter(true);
        const content = await getChapterContent(activeChapter, slug);
        setChapterContent(content);
        // Scroll to top of content
        document.getElementById("main-content")?.scrollTo(0, 0);
      } catch (error) {
        console.error("Failed to load chapter content", error);
      } finally {
        setLoadingChapter(false);
      }
    }

    loadContent();
  }, [activeChapter, slug]);

  const handleMarkComplete = async () => {
    if (!activeChapter) return;

    const newChapterId = activeChapter.chapterId;

    // Optimistic local update
    const currentCompleted = enrollment?.completedChapters || [];
    // Avoid duplicates in local state
    if (currentCompleted.includes(newChapterId)) return;

    const newCompletedList = [...currentCompleted, newChapterId];
    // Optimistically calculate progress (approximate)
    const approxProgress =
      course.chapters.length > 0
        ? Math.round((newCompletedList.length / course.chapters.length) * 100)
        : 0;

    const previousEnrollment = enrollment;
    setEnrollment((prev) => ({
      ...prev,
      completedChapters: newCompletedList,
      progress: approxProgress,
      // If prev was null (not enrolled), we are simulating enrollment
      courseSlug: slug,
    }));

    try {
      const res = await fetch("/api/courses/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseSlug: slug,
          chapterId: newChapterId,
        }),
      });

      if (!res.ok) {
        const data = await res.json();

        // If error is "Enrollment not found", try to enroll then retry progress
        if (res.status === 404 && data.error === "Enrollment not found") {
          const enrollRes = await fetch("/api/courses/enroll", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ courseSlug: slug }),
          });

          if (enrollRes.ok) {
            // Retry progress update
            const retryRes = await fetch("/api/courses/progress", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                courseSlug: slug,
                chapterId: newChapterId,
              }),
            });

            if (retryRes.ok) {
              const retryData = await retryRes.json();
              setEnrollment({
                courseSlug: slug,
                completedChapters: retryData.completedChapters,
                progress: retryData.progress,
                lastAccessedAt: new Date(),
              });
              return; // Success
            }
          }
        }

        // If we reach here, it failed either initially or after retry
        console.error("Failed to update progress", data?.error);
        setEnrollment(previousEnrollment); // Revert
      } else {
        // Success - update with real data from server
        const data = await res.json();
        setEnrollment({
          courseSlug: slug,
          completedChapters: data.completedChapters,
          progress: data.progress,
          lastAccessedAt: new Date(),
        });
      }
    } catch (err) {
      console.error("Progress update failed", err);
      setEnrollment(previousEnrollment); // Revert
    }
  };

  const isChapterCompleted = (chapterId) => {
    return enrollment?.completedChapters?.includes(chapterId);
  };

  const goToNextChapter = () => {
    if (!course || !activeChapter) return;
    const currentIndex = course.chapters.findIndex(
      (c) => c.chapterId === activeChapter.chapterId
    );
    if (currentIndex >= 0 && currentIndex < course.chapters.length - 1) {
      setActiveChapter(course.chapters[currentIndex + 1]);
    }
  };

  const handleQuizComplete = (data) => {
    // Update enrollment with quiz completion data
    setEnrollment((prev) => ({
      ...prev,
      completedChapters: data.completedChapters,
      progress: data.progress,
      lastAccessedAt: new Date(),
    }));
  };

  if (loadingCourse) {
    // ... (keep existing loading)
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!course) {
    // ... (keep existing error)
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 p-4">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900">Course Not Found</h2>
        <p className="text-gray-600 mt-2">
          The course you are looking for does not exist or could not be loaded.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans">
      {/* Mobile Menu Toggle */}
      <button
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar - Chapter List */}
      <aside
        className={`
        fixed lg:static inset-0 z-40 bg-gray-50 border-r border-gray-200 w-full lg:w-80 flex flex-col transition-transform duration-300
        ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
      `}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200 bg-white">
          <h1 className="font-bold text-lg text-gray-900 leading-tight">
            {course.title}
          </h1>
          <p className="text-sm text-gray-500 mt-1">{course.subtitle}</p>
          <div className="flex items-center gap-2 mt-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>{course.chapters?.length || 0} Chapters</span>
          </div>
          {/* Progress Bar (Optional) */}
          {enrollment && (
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-blue-700">
                  {enrollment.progress}% Completed
                </span>
              </div>
              <div className="w-full bg-blue-100 rounded-full h-1.5">
                <div
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${enrollment.progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Chapters List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {course.chapters?.map((chapter) => {
            const isActive = activeChapter?.chapterId === chapter.chapterId;
            const isCompleted = isChapterCompleted(chapter.chapterId);

            return (
              <button
                key={chapter.chapterId}
                onClick={() => {
                  setActiveChapter(chapter);
                  setMobileMenuOpen(false);
                }}
                className={`
                  w-full text-left p-3 rounded-lg flex items-start gap-3 transition-all duration-200 group
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "hover:bg-gray-100 text-gray-700"
                  }
                `}
              >
                <div
                  className={`
                  shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5
                  ${
                    isCompleted
                      ? "bg-green-500 text-white"
                      : isActive
                      ? "bg-white/20 text-white"
                      : "bg-gray-200 text-gray-500 group-hover:bg-white"
                  }
                `}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    chapter.chapterNumber
                  )}
                </div>
                <div>
                  <h3
                    className={`text-sm font-semibold leading-snug ${
                      isActive ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {chapter.title}
                  </h3>
                  <p
                    className={`text-xs mt-1 line-clamp-1 ${
                      isActive ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {chapter.description}
                  </p>
                </div>
                {isActive && (
                  <ChevronRight className="w-4 h-4 ml-auto self-center opacity-80" />
                )}
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main Content Area */}
      <main
        id="main-content"
        className="flex-1 overflow-y-auto bg-white relative scroll-smooth"
      >
        {loadingChapter ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
            <p className="text-sm font-medium">Loading content...</p>
          </div>
        ) : chapterContent ? (
          // Check if this is a quiz chapter
          chapterContent.type === "matching" ||
          chapterContent.type === "multiple-choice" ? (
            <QuizChapter
              quizData={chapterContent}
              courseSlug={slug}
              onQuizComplete={handleQuizComplete}
              isCompleted={isChapterCompleted(activeChapter?.chapterId)}
              onContinue={goToNextChapter}
            />
          ) : (
            <div className="max-w-4xl mx-auto px-6 py-12 lg:px-12">
              {/* Chapter Header */}
              <div className="mb-12">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm tracking-wide uppercase mb-4">
                  <span className="bg-blue-50 px-3 py-1 rounded-full">
                    Chapter {chapterContent.chapterNumber}
                  </span>
                  <span>•</span>
                  <span>{chapterContent.duration}</span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                  {chapterContent.title}
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {chapterContent.description}
                </p>
              </div>

              {/* Sections */}
              <div className="space-y-12">
                {chapterContent.sections?.map((section) => (
                  <Section key={section.sectionId} section={section} />
                ))}
              </div>

              {/* Navigation / Next Chapter Helper */}
              <div className="mt-16 pt-8 border-t border-gray-100 flex justify-end">
                {isChapterCompleted(activeChapter.chapterId) ? (
                  // If completed, check if it's the last chapter
                  activeChapter.chapterNumber === course.chapters.length ? (
                    // Only show Course Completed if ALL chapters are done
                    (enrollment?.completedChapters?.length || 0) ===
                    course.chapters.length ? (
                      <div className="px-8 py-3 rounded-xl font-bold flex items-center gap-2 bg-green-100 text-green-700 cursor-default">
                        <CheckCircle className="w-5 h-5" /> Course Completed
                      </div>
                    ) : (
                      <div className="px-8 py-3 rounded-xl font-bold flex items-center gap-2 bg-yellow-100 text-yellow-700 cursor-default">
                        <Info className="w-5 h-5" /> Finish all chapters
                      </div>
                    )
                  ) : (
                    <button
                      onClick={goToNextChapter}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-indigo-200"
                    >
                      Next Chapter <ChevronRight className="w-5 h-5" />
                    </button>
                  )
                ) : (
                  <button
                    onClick={handleMarkComplete}
                    className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-gray-200"
                  >
                    <CheckCircle className="w-5 h-5" /> Mark as Completed
                  </button>
                )}
              </div>

              {course.quiz &&
                activeChapter.chapterNumber === course.chapters.length &&
                isChapterCompleted(activeChapter.chapterId) && (
                  <div className="mt-16 p-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl text-white text-center shadow-xl">
                    <h3 className="text-2xl font-bold mb-3">
                      Ready to test your knowledge?
                    </h3>
                    <p className="text-indigo-100 mb-6">
                      Complete the chapter quiz to earn your badge.
                    </p>
                    <button className="bg-white text-indigo-600 px-6 py-3 rounded-full font-bold hover:bg-indigo-50 transition-colors">
                      Start Quiz
                    </button>
                  </div>
                )}
            </div>
          )
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <PlayCircle className="w-16 h-16 mb-4 opacity-50" />
            <p>Select a chapter to begin</p>
          </div>
        )}
      </main>
    </div>
  );
}
