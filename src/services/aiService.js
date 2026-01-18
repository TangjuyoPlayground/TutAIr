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

    // Add metadata - Note: ID is now handled by Convex
    course.lang = lang

    return course
  } catch (error) {
    console.error('Error generating course:', error)
    throw new Error(ERROR_MESSAGES[lang] || ERROR_MESSAGES.en)
  }
}

