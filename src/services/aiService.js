import { GoogleGenerativeAI } from '@google/generative-ai'
import { getGenerationPrompt } from '../prompts/courseGeneration'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

const ERROR_MESSAGES = {
  fr: 'Erreur lors de la génération du cours. Veuillez réessayer.',
  en: 'Error generating course. Please try again.',
  es: 'Error al generar el curso. Por favor, inténtelo de nuevo.'
}

export async function generateCourse(subject, level = 'beginner', lang = 'en') {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' })

    const prompt = getGenerationPrompt(lang, subject, level)

    const result = await model.generateContent(prompt)
    const response = await result.response
    let text = response.text()

    // Clean up the response - remove markdown code blocks if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    const course = JSON.parse(text)

    // Add metadata
    course.id = generateId()
    course.createdAt = new Date().toISOString()
    course.progress = 0
    course.completedModules = []
    course.lang = lang // Store the course language

    return course
  } catch (error) {
    console.error('Error generating course:', error)
    throw new Error(ERROR_MESSAGES[lang] || ERROR_MESSAGES.en)
  }
}

function generateId() {
  return 'course-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

// Local storage helpers
export function saveCourse(course) {
  const courses = getCourses()
  const existingIndex = courses.findIndex(c => c.id === course.id)

  if (existingIndex >= 0) {
    courses[existingIndex] = course
  } else {
    courses.unshift(course)
  }

  localStorage.setItem('tutair-courses', JSON.stringify(courses))
  return course
}

export function getCourses() {
  try {
    return JSON.parse(localStorage.getItem('tutair-courses') || '[]')
  } catch {
    return []
  }
}

export function getCourse(id) {
  const courses = getCourses()
  return courses.find(c => c.id === id)
}

export function deleteCourse(id) {
  const courses = getCourses().filter(c => c.id !== id)
  localStorage.setItem('tutair-courses', JSON.stringify(courses))
}

export function updateCourseProgress(courseId, moduleId, completed) {
  const course = getCourse(courseId)
  if (!course) return null

  if (completed && !course.completedModules.includes(moduleId)) {
    course.completedModules.push(moduleId)
  } else if (!completed) {
    course.completedModules = course.completedModules.filter(id => id !== moduleId)
  }

  course.progress = Math.round((course.completedModules.length / course.modules.length) * 100)

  return saveCourse(course)
}
