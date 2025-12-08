// Fetch all courses
export async function getAllCourses() {
  try {
    const response = await fetch('/data/courses/courses.json');
    if (!response.ok) throw new Error("Failed to fetch courses");
    const data = await response.json();
    return data.courses;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Fetch a single course by slug, including all chapters
export async function getCourseBySlug(slug) {
  try {
    const coursesResponse = await fetch('/data/courses/courses.json');
    if (!coursesResponse.ok) return null;
    const coursesData = await coursesResponse.json();
    const courseInfo = coursesData.courses.find(c => c.slug === slug);

    if (!courseInfo) return null;

    // Fetch the full course data (which now contains chapter references)
    const courseResponse = await fetch(`/data/courses/${slug}/course.json`);
    if (!courseResponse.ok) return courseInfo; // Return basic info if full data fails
    
    const courseData = await courseResponse.json();

    return {
      ...courseInfo,
      ...courseData
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}
 
// Fetch a single chapter by chapterNumber
export async function getChapterData(courseSlug, chapterNumber) {
  try {
    const courseResponse = await fetch(`/data/courses/${courseSlug}/course.json`);
    if (!courseResponse.ok) return null;
    const courseData = await courseResponse.json();

    // Find the chapter with matching chapterNumber
    return courseData.chapters.find(ch => ch.chapterNumber === chapterNumber);
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Fetch chapter content JSON file if needed
export async function getChapterContent(chapter, courseSlug) {
  if (!chapter?.content) return null;
  
  try {
    const url = courseSlug 
      ? `/data/courses/${courseSlug}/${chapter.content}` 
      : `/data/courses/${chapter.content}`;
      
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Fetch module data by slug and module number
export async function getModuleData(courseSlug, moduleNumber) {
  try {
    const response = await fetch(`/data/courses/${courseSlug}/module-${moduleNumber}.json`);
    if (!response.ok) return null;
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
