import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// Get the current authenticated user
export const currentUser = query({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) return null;
        return await ctx.db.get(userId);
    },
});

// Update user settings (theme and language)
export const updateSettings = mutation({
    args: {
        theme: v.optional(v.string()),
        lang: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const updates: { theme?: string; lang?: string } = {};
        if (args.theme !== undefined) updates.theme = args.theme;
        if (args.lang !== undefined) updates.lang = args.lang;

        await ctx.db.patch(userId, updates);
        return await ctx.db.get(userId);
    },
});
