"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";

/** Fallback sender until a verified domain is configured via RESEND_FROM_EMAIL. */
const FALLBACK_FROM = "What Should I Cook? <onboarding@resend.dev>";

/**
 * Sends the newsletter welcome email via Resend. Returns a no-op
 * { sent: false, reason: "missing-api-key" } when RESEND_API_KEY is not
 * configured — the subscriber is still stored in the Convex `subscribers`
 * table, so nothing is lost.
 */
export const sendWelcomeEmail = action({
  args: { email: v.string() },
  handler: async (_ctx, { email }) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return { sent: false, reason: "missing-api-key" as const };
    }

    const from = process.env.RESEND_FROM_EMAIL ?? FALLBACK_FROM;

    const html = `
      <div style="font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1f1a17;background:#fdfbf8;border-radius:16px;">
        <p style="font-size:32px;margin:0;">🍳</p>
        <h1 style="font-size:22px;line-height:1.3;margin:16px 0 8px;color:#1f1a17;">Welcome to What Should I Cook?</h1>
        <p style="font-size:15px;line-height:1.7;color:#5c5249;margin:0 0 20px;">
          You're in! Once a week we'll send you simple recipes and fun food
          facts — everything you can cook from ingredients you already have.
          No spam, ever.
        </p>
        <p style="font-size:15px;line-height:1.7;color:#5c5249;margin:0;">
          Hungry now? Pick what's in your kitchen and we'll sort tonight's
          dinner in seconds.
        </p>
        <hr style="border:none;border-top:1px solid #e9e2d9;margin:24px 0;" />
        <p style="font-size:12px;color:#9a9086;margin:0;">
          You received this because you subscribed on What Should I Cook?
          Unsubscribe anytime by replying "unsubscribe".
        </p>
      </div>
    `;

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [email],
          subject: "Welcome to What Should I Cook? 🍳",
          html,
        }),
      });

      if (!response.ok) {
        const detail = await response.text().catch(() => "");
        return {
          sent: false,
          reason: `resend-http-${response.status}` as const,
          detail,
        };
      }
      return { sent: true as const };
    } catch (error) {
      return {
        sent: false,
        reason: "network-error" as const,
        detail: error instanceof Error ? error.message : undefined,
      };
    }
  },
});
