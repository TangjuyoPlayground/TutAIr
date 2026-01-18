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
        // Using v.any() for modules since AI generates varying structures
        modules: v.array(v.any()),
        progress: v.float64(),
        completedModules: v.array(v.string()),
        lang: v.string(),
    })
        .index("by_user", ["userId"])
        .index("by_user_and_title", ["userId", "title"]),
});

