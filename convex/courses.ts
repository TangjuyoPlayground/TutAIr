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
        // Using v.any() since AI generates varying module structures
        modules: v.array(v.any()),
        lang: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

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
        });

        return courseId;
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
