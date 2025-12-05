// Fetch all courses
export async function getAllCourses() {
  const response = await fetch('/data/courses/courses.json');
  const data = await response.json();
  return data.courses;
}

// Fetch a single course by slug, including all chapters
export async function getCourseBySlug(slug) {
  const coursesResponse = await fetch('/data/courses/courses.json');
  const coursesData = await coursesResponse.json();
  const courseInfo = coursesData.courses.find(c => c.slug === slug);

  if (!courseInfo) return null;

  // Fetch the full course data (which now contains chapter references)
  const courseResponse = await fetch(`/data/courses/${slug}/course.json`);
  const courseData = await courseResponse.json();

  return {
    ...courseInfo,
    ...courseData
  };
}
 
// Fetch a single chapter by chapterNumber
export async function getChapterData(courseSlug, chapterNumber) {
  // Fetch the course data (contains chapters array)
  const courseResponse = await fetch(`/data/courses/${courseSlug}/course.json`);
  const courseData = await courseResponse.json();

  // Find the chapter with matching chapterNumber
  return courseData.chapters.find(ch => ch.chapterNumber === chapterNumber);
}

// Fetch chapter content JSON file if needed
export async function getChapterContent(chapter, courseSlug) {
  if (!chapter?.content) return null;
  
  const url = courseSlug 
    ? `/data/courses/${courseSlug}/${chapter.content}` 
    : `/data/courses/${chapter.content}`;
    
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// Fetch module data by slug and module number
export async function getModuleData(courseSlug, moduleNumber) {
  const response = await fetch(`/data/courses/${courseSlug}/module-${moduleNumber}.json`);
  const data = await response.json();
  return data;
}
