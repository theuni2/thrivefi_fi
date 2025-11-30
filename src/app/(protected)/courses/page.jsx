"use client";
import React, { useEffect, useState } from "react";
import {
  getAllCourses,
  getCourseBySlug,
  getModuleData,
  getChapterData,
} from "../../../lib/courseData"; // adjust path as needed

function Loading() {
  return <div className="p-6 text-gray-500">Loading…</div>;
}

function ErrorBox({ message }) {
  return <div className="p-3 bg-red-100 text-red-800 rounded">{message}</div>;
}

function CourseCard({ course, onOpen }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition p-4 flex flex-col">
      {course.thumbnail && (
        <img
          src={course.thumbnail}
          alt={course.title}
          className="h-40 w-full object-cover rounded-md mb-3"
        />
      )}
      <h3 className="text-lg font-semibold">{course.title}</h3>
      <p className="text-sm text-gray-600">{course.subtitle}</p>
      <div className="mt-2 text-xs text-gray-500">By {course.instructor}</div>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-xs text-gray-600">
          {course.level} • {course.duration}
        </div>
        <button
          onClick={() => onOpen(course.slug)}
          className="text-sm px-3 py-1 bg-blue-600 text-white rounded"
        >
          Open
        </button>
      </div>

      {course.tags?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {course.tags.map((t) => (
            <span key={t} className="text-xs bg-gray-100 px-2 py-1 rounded">
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CoursesPage() {
  const [courses, setCourses] = useState(null);
  const [error, setError] = useState(null);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modulesLoaded, setModulesLoaded] = useState({}); // { moduleNumber: moduleData }
  const [loadingCourse, setLoadingCourse] = useState(false);
  const [loadingModule, setLoadingModule] = useState(null); // moduleNumber being loaded

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await getAllCourses();
        if (!mounted) return;
        setCourses(data);
      } catch (err) {
        console.error(err);
        if (!mounted) return;
        setError("Failed to load courses.");
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  // when a course is selected, fetch course details (modules list)
  useEffect(() => {
    if (!selectedSlug) {
      setSelectedCourse(null);
      setModulesLoaded({});
      return;
    }

    let mounted = true;
    async function loadCourse() {
      setLoadingCourse(true);
      try {
        const c = await getCourseBySlug(selectedSlug);
        if (!mounted) return;
        setSelectedCourse(c);
      } catch (err) {
        console.error(err);
        if (!mounted) return;
        setError("Failed to load course details.");
      } finally {
        if (mounted) setLoadingCourse(false);
      }
    }
    loadCourse();
    return () => (mounted = false);
  }, [selectedSlug]);

  async function handleOpenModule(moduleNumber) {
    if (!selectedCourse) return;
    // already loaded?
    if (modulesLoaded[moduleNumber]) {
      // toggle off if already loaded? Here we just keep it.
      setModulesLoaded((prev) => ({
        ...prev,
        [moduleNumber]: prev[moduleNumber],
      }));
      return;
    }

    try {
      setLoadingModule(moduleNumber);
      const data = await getModuleData(selectedCourse.slug, moduleNumber);
      setModulesLoaded((prev) => ({ ...prev, [moduleNumber]: data }));
    } catch (err) {
      console.error(err);
      setError(`Failed to load module ${moduleNumber}`);
    } finally {
      setLoadingModule(null);
    }
  }

  async function handleShowChapterContent(moduleNumber, chapterNumber) {
    if (!selectedCourse) return;
    try {
      // getChapterData uses getModuleData under the hood, but if module is already loaded we can read directly
      const moduleData =
        modulesLoaded[moduleNumber] ??
        (await getModuleData(selectedCourse.slug, moduleNumber));
      const chapter = moduleData.chapters.find(
        (ch) => ch.chapterNumber === chapterNumber
      );
      // In this demo we will just alert the chapter title and type. Replace this with a modal or route in real app.
      if (chapter) {
        // show details
        alert(
          `Chapter: ${chapter.title}\nType: ${chapter.type}\nDuration: ${
            chapter.duration ?? "—"
          }`
        );
      } else {
        alert("Chapter not found");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load chapter.");
    }
  }

  if (error) {
    return <ErrorBox message={error} />;
  }

  if (!courses) return <Loading />;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Courses</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onOpen={(slug) => setSelectedSlug(slug)}
          />
        ))}
      </div>

      {/* Right / bottom panel: selected course */}
      <div className="mt-8">
        {selectedSlug ? (
          <div className="border rounded-lg p-4 shadow-sm">
            {loadingCourse || !selectedCourse ? (
              <Loading />
            ) : (
              <>
                <div className="flex items-start gap-4">
                  {selectedCourse.thumbnail && (
                    <img
                      src={selectedCourse.thumbnail}
                      alt={selectedCourse.title}
                      className="w-40 h-28 object-cover rounded"
                    />
                  )}
                  <div>
                    <h2 className="text-xl font-semibold">
                      {selectedCourse.title}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {selectedCourse.subtitle}
                    </p>
                    <div className="mt-1 text-xs text-gray-500">
                      Modules: {selectedCourse.modules?.length ?? "—"}
                    </div>
                  </div>
                </div>

                <hr className="my-4" />

                <div>
                  <h3 className="font-medium mb-2">Modules</h3>

                  {selectedCourse.modules?.length === 0 && (
                    <div className="text-sm text-gray-500">
                      No modules available.
                    </div>
                  )}

                  <div className="space-y-3">
                    {selectedCourse.modules?.map((mod) => {
                      const loadedModule = modulesLoaded[mod.moduleNumber];
                      const isLoading = loadingModule === mod.moduleNumber;
                      return (
                        <div
                          key={mod.moduleId}
                          className="border rounded p-3 flex flex-col md:flex-row md:items-center md:justify-between"
                        >
                          <div>
                            <div className="font-semibold">
                              Module {mod.moduleNumber}: {mod.title}
                            </div>
                            <div className="text-xs text-gray-600">
                              {mod.description}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Chapters:{" "}
                              {mod.totalChapters ??
                                loadedModule?.chapters?.length ??
                                "—"}
                            </div>
                          </div>

                          <div className="mt-3 md:mt-0 flex gap-2 items-center">
                            <button
                              onClick={() => handleOpenModule(mod.moduleNumber)}
                              className="px-3 py-1 border rounded text-sm"
                            >
                              {loadedModule
                                ? "Show Chapters"
                                : isLoading
                                ? "Loading…"
                                : "Load Module"}
                            </button>
                            {loadedModule && (
                              <div className="bg-gray-50 p-3 rounded w-full md:w-auto">
                                <ul className="space-y-1">
                                  {loadedModule.chapters.map((ch) => (
                                    <li
                                      key={ch.chapterId}
                                      className="flex items-center justify-between gap-4"
                                    >
                                      <div>
                                        <div className="text-sm font-medium">
                                          {ch.chapterNumber}. {ch.title}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {ch.type} • {ch.duration}
                                        </div>
                                      </div>
                                      <div className="ml-4">
                                        <button
                                          onClick={() =>
                                            handleShowChapterContent(
                                              mod.moduleNumber,
                                              ch.chapterNumber
                                            )
                                          }
                                          className="px-2 py-1 text-sm border rounded"
                                        >
                                          Open
                                        </button>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            Click a course "Open" button to view its modules.
          </div>
        )}
      </div>
    </div>
  );
}
