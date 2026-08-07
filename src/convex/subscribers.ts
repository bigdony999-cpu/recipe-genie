import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

/** Same strict-ish shape check as the client, enforced server-side. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;

/**
 * Newsletter signup. Dedupes by email and stores the subscriber in the
 * Convex `subscribers` table. The welcome email is fired from the client
 * via the resend action (see resend.ts) so a missing API key never blocks
 * the signup itself.
 *
 * Abuse guards: server-side email validation (client validation is
 * cosmetic) and a global fixed-window rate limit so a bot cannot flood the
 * table or burn Resend quota with fake signups.
 */
export const subscribe = mutation({
  args: {
    email: v.string(),
    source: v.optional(v.string()),
  },
  handler: async (ctx, { email, source }) => {
    const normalized = email.trim().toLowerCase();

    if (
      normalized.length === 0 ||
      normalized.length > MAX_EMAIL_LENGTH ||
      !EMAIL_RE.test(normalized)
    ) {
      return { status: "invalid-email" as const };
    }

    const allowed = await ctx.runMutation(api.rateLimit.consumeRateLimit, {
      key: "subscribe",
      max: 20,
      windowMs: 60_000,
    });
    if (!allowed) {
      return { status: "rate-limited" as const };
    }

    const existing = await ctx.db
      .query("subscribers")
      .withIndex("by_email", (q) => q.eq("email", normalized))
      .first();

    if (existing) {
      return { status: "already-subscribed" as const };
    }

    await ctx.db.insert("subscribers", {
      email: normalized,
      source: (source ?? "landing").slice(0, 40),
      createdAt: Date.now(),
    });

    return { status: "subscribed" as const };
  },
});

/** All subscriber emails — used by the weekly newsletter action. */
export const listSubscriberEmails = query({
  args: {},
  handler: async (ctx) => {
    const subs = await ctx.db.query("subscribers").collect();
    return subs.map((s) => s.email);
  },
});
