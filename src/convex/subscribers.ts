import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Newsletter signup. Dedupes by email and stores the subscriber in the
 * Convex `subscribers` table. The optional Buttondown sync is fired from
 * the client (see buttondown.ts) so a slow or missing API key never blocks
 * the signup itself.
 */
export const subscribe = mutation({
  args: {
    email: v.string(),
    source: v.optional(v.string()),
  },
  handler: async (ctx, { email, source }) => {
    const normalized = email.trim().toLowerCase();

    const existing = await ctx.db
      .query("subscribers")
      .withIndex("by_email", (q) => q.eq("email", normalized))
      .first();

    if (existing) {
      return { status: "already-subscribed" as const };
    }

    await ctx.db.insert("subscribers", {
      email: normalized,
      source: source ?? "landing",
      createdAt: Date.now(),
    });

    return { status: "subscribed" as const };
  },
});
