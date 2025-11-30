export async function getAllCourses() {
  const response = await fetch('/data/courses/courses.json');
  const data = await response.json();
  return data.courses;
}

export async function getCourseBySlug(slug) {
  const coursesResponse = await fetch('/data/courses/courses.json');
  const coursesData = await coursesResponse.json();
  const courseInfo = coursesData.courses.find(c => c.slug === slug);
  
  if (!courseInfo) return null;
  
  const courseResponse = await fetch(`/data/courses/${slug}/course.json`);
  const courseData = await courseResponse.json();
  
  return {
    ...courseInfo,
    ...courseData
  };
}

export async function getModuleData(courseSlug, moduleNumber) {
  const response = await fetch(`/data/courses/${courseSlug}/module-${moduleNumber}.json`);
  const data = await response.json();
  return data;
}

export async function getChapterData(courseSlug, moduleNumber, chapterNumber) {
  const moduleData = await getModuleData(courseSlug, moduleNumber);
  return moduleData.chapters.find(ch => ch.chapterNumber === chapterNumber);
}