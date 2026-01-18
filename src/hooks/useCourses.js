import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'

export function useCourses() {
    const courses = useQuery(api.courses.getCourses) ?? []
    const createCourseMutation = useMutation(api.courses.createCourse)
    const updateProgressMutation = useMutation(api.courses.updateProgress)
    const deleteCourseMutation = useMutation(api.courses.deleteCourse)

    const createCourse = async (courseData) => {
        return await createCourseMutation(courseData)
    }

    const updateProgress = async (courseId, moduleId, completed) => {
        return await updateProgressMutation({ courseId, moduleId, completed })
    }

    const deleteCourse = async (id) => {
        return await deleteCourseMutation({ id })
    }

    return {
        courses,
        isLoading: courses === undefined,
        createCourse,
        updateProgress,
        deleteCourse,
    }
}

export function useCourse(id) {
    const course = useQuery(api.courses.getCourse, id ? { id } : 'skip')
    const updateProgressMutation = useMutation(api.courses.updateProgress)

    const updateProgress = async (moduleId, completed) => {
        if (!id) return null
        return await updateProgressMutation({ courseId: id, moduleId, completed })
    }

    return {
        course,
        isLoading: course === undefined,
        updateProgress,
    }
}
