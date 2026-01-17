import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
    ...authTables,

    // Custom users table extending auth users with additional fields
    users: defineTable({
        // Fields from Convex Auth
        name: v.optional(v.string()),
        email: v.optional(v.string()),
        emailVerificationTime: v.optional(v.float64()),
        image: v.optional(v.string()),
        isAnonymous: v.optional(v.boolean()),
        // Custom fields
        theme: v.optional(v.string()),
        lang: v.optional(v.string()),
    }).index("email", ["email"]),

    // Courses table
    courses: defineTable({
        userId: v.id("users"),
        title: v.string(),
        description: v.string(),
        level: v.string(), // 'beginner' | 'intermediate' | 'advanced'
        estimatedTime: v.optional(v.string()),
        modules: v.array(
            v.object({
                id: v.string(),
                type: v.string(), // 'explanation' | 'exercise' | 'quiz' | 'fillblank' | 'dragdrop'
                title: v.string(),
                content: v.optional(v.string()),
                // Quiz specific
                question: v.optional(v.string()),
                options: v.optional(v.array(v.string())),
                correctAnswer: v.optional(v.union(v.string(), v.float64())),
                explanation: v.optional(v.string()),
                // Exercise specific
                instructions: v.optional(v.string()),
                hints: v.optional(v.array(v.string())),
                solution: v.optional(v.string()),
                // Fill blank specific
                sentence: v.optional(v.string()),
                blanks: v.optional(v.array(v.string())),
                // Drag and drop specific
                items: v.optional(v.array(v.string())),
                correctOrder: v.optional(v.array(v.string())),
            })
        ),
        progress: v.float64(),
        completedModules: v.array(v.string()),
        lang: v.string(),
    })
        .index("by_user", ["userId"])
        .index("by_user_and_title", ["userId", "title"]),
});
