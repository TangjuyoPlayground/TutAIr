import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// Get all courses for the current user
export const getCourses = query({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) return [];

        const courses = await ctx.db
            .query("courses")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .order("desc")
            .collect();

        return courses;
    },
});

// Get all public courses for the marketplace
export const getPublicCourses = query({
    args: {
        tags: v.optional(v.array(v.string())),
        search: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        let courses = await ctx.db
            .query("courses")
            .withIndex("by_public", (q) => q.eq("isPublic", true))
            .order("desc")
            .collect();

        // Filter by tags if provided
        if (args.tags && args.tags.length > 0) {
            courses = courses.filter((course) =>
                args.tags!.some((tag) => course.tags?.includes(tag))
            );
        }

        // Filter by search if provided
        if (args.search && args.search.trim()) {
            const searchLower = args.search.toLowerCase();
            courses = courses.filter(
                (course) =>
                    course.title.toLowerCase().includes(searchLower) ||
                    course.description.toLowerCase().includes(searchLower)
            );
        }

        return courses;
    },
});

// Get popular tags from public courses
export const getPopularTags = query({
    args: {},
    handler: async (ctx) => {
        const courses = await ctx.db
            .query("courses")
            .withIndex("by_public", (q) => q.eq("isPublic", true))
            .collect();

        const tagCounts: Record<string, number> = {};
        for (const course of courses) {
            if (course.tags) {
                for (const tag of course.tags) {
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                }
            }
        }

        // Sort by count and return top tags
        return Object.entries(tagCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 20)
            .map(([tag, count]) => ({ tag, count }));
    },
});

// Get a single course by ID
export const getCourse = query({
    args: { id: v.id("courses") },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) return null;

        const course = await ctx.db.get(args.id);
        if (!course || course.userId !== userId) return null;

        return course;
    },
});

// Create a new course
export const createCourse = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        level: v.string(),
        estimatedTime: v.optional(v.string()),
        modules: v.array(v.any()),
        lang: v.string(),
        tags: v.optional(v.array(v.string())),
        isPublic: v.optional(v.boolean()),
        authorName: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        // Get user name for author attribution
        const user = await ctx.db.get(userId);
        const authorName = args.authorName || user?.name || "Anonymous";

        const courseId = await ctx.db.insert("courses", {
            userId,
            title: args.title,
            description: args.description,
            level: args.level,
            estimatedTime: args.estimatedTime,
            modules: args.modules,
            progress: 0,
            completedModules: [],
            lang: args.lang,
            tags: args.tags || [],
            isPublic: args.isPublic || false,
            authorName,
        });

        return courseId;
    },
});

// Clone a course from the marketplace
export const cloneCourse = mutation({
    args: { courseId: v.id("courses") },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const originalCourse = await ctx.db.get(args.courseId);
        if (!originalCourse || !originalCourse.isPublic) {
            throw new Error("Course not found or not public");
        }

        // Create a copy for the user
        const newCourseId = await ctx.db.insert("courses", {
            userId,
            title: originalCourse.title,
            description: originalCourse.description,
            level: originalCourse.level,
            estimatedTime: originalCourse.estimatedTime,
            modules: originalCourse.modules,
            progress: 0,
            completedModules: [],
            lang: originalCourse.lang,
            tags: originalCourse.tags,
            isPublic: false, // Cloned courses are private by default
            authorName: originalCourse.authorName,
            originalCourseId: args.courseId,
        });

        return newCourseId;
    },
});

// Update course progress
export const updateProgress = mutation({
    args: {
        courseId: v.id("courses"),
        moduleId: v.string(),
        completed: v.boolean(),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const course = await ctx.db.get(args.courseId);
        if (!course || course.userId !== userId) {
            throw new Error("Course not found");
        }

        let completedModules = [...course.completedModules];

        if (args.completed && !completedModules.includes(args.moduleId)) {
            completedModules.push(args.moduleId);
        } else if (!args.completed) {
            completedModules = completedModules.filter((id) => id !== args.moduleId);
        }

        const progress = Math.round(
            (completedModules.length / course.modules.length) * 100
        );

        await ctx.db.patch(args.courseId, {
            completedModules,
            progress,
        });

        return await ctx.db.get(args.courseId);
    },
});

// Delete a course
export const deleteCourse = mutation({
    args: { id: v.id("courses") },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const course = await ctx.db.get(args.id);
        if (!course || course.userId !== userId) {
            throw new Error("Course not found");
        }

        await ctx.db.delete(args.id);
        return true;
    },
});

