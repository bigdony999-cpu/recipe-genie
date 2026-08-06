"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";

/**
 * Best-effort sync of a new subscriber to Buttondown. Returns
 * { synced: false, reason: "missing-api-key" } when BUTTONDOWN_API_KEY is
 * not configured — the subscriber still lives in the Convex `subscribers`
 * table, so nothing is lost.
 */
export const syncSubscriber = action({
  args: { email: v.string() },
  handler: async (_ctx, { email }) => {
    const apiKey = process.env.BUTTONDOWN_API_KEY;
    if (!apiKey) {
      return { synced: false, reason: "missing-api-key" as const };
    }

    try {
      const response = await fetch(
        "https://api.buttondown.com/v1/subscribers",
        {
          method: "POST",
          headers: {
            Authorization: `Token ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email_address: email }),
        },
      );

      if (!response.ok) {
        return {
          synced: false,
          reason: `buttondown-http-${response.status}` as const,
        };
      }
      return { synced: true as const };
    } catch (error) {
      return {
        synced: false,
        reason: "network-error" as const,
        detail: error instanceof Error ? error.message : undefined,
      };
    }
  },
});
