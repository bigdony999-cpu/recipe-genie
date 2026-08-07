import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Fixed-window rate limiter backed by the `rate_limits` table.
 *
 * Exposed as a mutation so BOTH mutations and actions can use it via
 * `ctx.runMutation(api.rateLimit.consumeRateLimit, ...)` (actions do not
 * have direct `ctx.db` access).
 *
 * Buckets are identified by a caller-supplied key (e.g. "subscribe",
 * "ai-chef"). The window is global — good enough to stop scripted spam of
 * public endpoints without ever annoying a real user, who rarely hits a
 * 20–30 per minute ceiling.
 *
 * Returns true when the call is allowed, false when it should be
 * rejected. Slight overcounting under true concurrency is acceptable for
 * abuse prevention.
 */
export const consumeRateLimit = mutation({
  args: {
    key: v.string(),
    max: v.number(),
    windowMs: v.number(),
  },
  handler: async (ctx, { key, max, windowMs }) => {
    const now = Date.now();
    const doc = await ctx.db
      .query("rate_limits")
      .withIndex("by_key", (q) => q.eq("key", key))
      .first();

    if (!doc || now - doc.windowStart >= windowMs) {
      // Fresh window.
      if (doc) await ctx.db.delete(doc._id);
      await ctx.db.insert("rate_limits", {
        key,
        windowStart: now,
        count: 1,
      });
      return true;
    }

    if (doc.count >= max) return false;

    await ctx.db.patch(doc._id, { count: doc.count + 1 });
    return true;
  },
});
