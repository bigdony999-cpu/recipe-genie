"use node";

import { action } from "./_generated/server";
import { api } from "./_generated/api";

const FALLBACK_FROM = "What Should I Cook? <onboarding@resend.dev>";

/**
 * Resolve the live site URL so email links always point at the domain the
 * site is actually served from (including a future custom domain). Falls back
 * to VLY_SITE_URL if set, then to the current deployment address.
 */
function siteUrl(request?: { headers?: Headers }): string {
  const origin = request?.headers?.get("origin");
  if (origin && /^https?:\/\//.test(origin)) return origin;
  return (
    process.env.VLY_SITE_URL ?? "https://happy-rockets-follow.freebuff.dev"
  );
}

interface WeeklyPick {
  name: string;
  emoji: string;
  description: string;
  timeMinutes: number;
  difficulty: string;
  url: string;
}

/**
 * Curated "recipe of the week" rotation. The weekly email features one of
 * these (picked deterministically by ISO week number) plus two runner-ups.
 */
const WEEKLY_PICKS: WeeklyPick[] = [
  {
    name: "Creamy Mushroom Pasta",
    emoji: "🍄",
    description: "Golden mushrooms folded into a garlicky cream sauce over pasta.",
    timeMinutes: 25,
    difficulty: "Easy",
    url: "https://www.allrecipes.com/search?q=creamy+mushroom+pasta",
  },
  {
    name: "Shakshuka",
    emoji: "🍳",
    description: "Eggs poached in a smoky, paprika-spiked tomato sauce. Weekend brunch.",
    timeMinutes: 30,
    difficulty: "Medium",
    url: "https://www.allrecipes.com/search?q=shakshuka",
  },
  {
    name: "Teriyaki Chicken & Rice",
    emoji: "🍗",
    description: "Sticky-sweet teriyaki chicken over steaming rice. Takeout at home.",
    timeMinutes: 30,
    difficulty: "Easy",
    url: "https://www.allrecipes.com/search?q=teriyaki+chicken+and+rice",
  },
  {
    name: "Peanut Butter Noodles",
    emoji: "🍜",
    description: "Creamy peanut noodles with a sweet-spicy lime sauce. 15 minutes.",
    timeMinutes: 15,
    difficulty: "Easy",
    url: "https://www.allrecipes.com/search?q=peanut+butter+noodles",
  },
  {
    name: "Loaded Baked Potatoes",
    emoji: "🥔",
    description: "Crispy-skinned potatoes piled with cheese, bacon and sour cream.",
    timeMinutes: 60,
    difficulty: "Medium",
    url: "https://www.allrecipes.com/search?q=loaded+baked+potato",
  },
  {
    name: "Chicken Quesadillas",
    emoji: "🌯",
    description: "Crispy tortillas packed with chicken and gooey cheese.",
    timeMinutes: 20,
    difficulty: "Easy",
    url: "https://www.allrecipes.com/search?q=chicken+quesadilla",
  },
  {
    name: "Golden Lentil Soup",
    emoji: "🍲",
    description: "Hearty, budget-friendly, and surprisingly fancy. Freezes great.",
    timeMinutes: 40,
    difficulty: "Easy",
    url: "https://www.allrecipes.com/search?q=lentil+soup",
  },
  {
    name: "Banana Pancakes",
    emoji: "🥞",
    description: "Naturally sweet banana pancakes — no fancy equipment needed.",
    timeMinutes: 20,
    difficulty: "Easy",
    url: "https://www.allrecipes.com/search?q=banana+pancakes",
  },
];

/** ISO-8601 week number, so the featured recipe rotates weekly, not daily. */
function isoWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - dayNum + 3);
  const firstThursday = d.getTime();
  d.setUTCMonth(0, 1);
  if (d.getUTCDay() !== 4) {
    d.setUTCMonth(0, 1 + ((4 - d.getUTCDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - d.getTime()) / (7 * 24 * 3600 * 1000));
}

function pickCard(pick: WeeklyPick) {
  return `
    <div style="background:#fff8f0;border:1px solid #f0e4d6;border-radius:14px;padding:18px;margin-bottom:12px;">
      <p style="margin:0 0 4px;font-size:24px;">${pick.emoji}</p>
      <h3 style="margin:0 0 4px;font-size:17px;color:#1f1a17;">${pick.name}</h3>
      <p style="margin:0 0 8px;font-size:14px;line-height:1.6;color:#5c5249;">${pick.description}</p>
      <p style="margin:0 0 10px;font-size:13px;color:#9a9086;">${pick.timeMinutes} min · ${pick.difficulty}</p>
      <a href="${pick.url}" style="display:inline-block;background:#c2542a;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:9px 16px;border-radius:9999px;">Get the recipe →</a>
    </div>
  `;
}

/**
 * Sends the weekly "recipe of the week" email to every subscriber via Resend.
 * Returns a summary; never throws — a failure is reported in the result so
 * the cron run can be debugged from the Convex dashboard.
 */
export const sendWeeklyNewsletter = action({
  args: {},
  handler: async (ctx, request) => {
    const SITE_URL = siteUrl(request);
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return { sent: 0, skipped: true, reason: "missing-api-key" as const };
    }

    // Explicit annotation breaks TS's circular inference through the api object.
    const emails: string[] = await ctx.runQuery(
      api.subscribers.listSubscriberEmails,
    );
    if (emails.length === 0) {
      return { sent: 0, skipped: true, reason: "no-subscribers" as const };
    }

    const picks = WEEKLY_PICKS;
    const week = isoWeekNumber(new Date());
    const featured = picks[week % picks.length];
    const others = picks.filter((p) => p.name !== featured.name).slice(0, 2);

    const html = `
      <div style="font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1f1a17;background:#fdfbf8;border-radius:16px;">
        <p style="font-size:32px;margin:0;">🍳</p>
        <h1 style="font-size:22px;line-height:1.3;margin:16px 0 8px;color:#1f1a17;">This week's recipe: ${featured.name}</h1>
        <p style="font-size:15px;line-height:1.7;color:#5c5249;margin:0 0 20px;">
          One tasty idea to save you from the 7pm "what's for dinner?" spiral —
          cook it tonight, or bookmark it for the weekend.
        </p>
        ${pickCard(featured)}
        <h2 style="font-size:15px;color:#1f1a17;margin:18px 0 10px;">Also worth a try</h2>
        ${others.map(pickCard).join("")}
        <p style="font-size:14px;line-height:1.7;color:#5c5249;margin:18px 0 0;">
          Stuck deciding? <a href="${SITE_URL}/cook" style="color:#c2542a;font-weight:700;">Tell us what's in your kitchen</a> and we'll
          match you with recipes you can cook right now — no grocery run needed.
        </p>
        <hr style="border:none;border-top:1px solid #e9e2d9;margin:24px 0;" />
        <p style="font-size:12px;color:#9a9086;margin:0;">
          You received this because you subscribed on What Should I Cook?
          Unsubscribe anytime by replying "unsubscribe".
        </p>
      </div>
    `;

    const from = process.env.RESEND_FROM_EMAIL ?? FALLBACK_FROM;
    const subject = `This week's recipe: ${featured.name} ${featured.emoji}`;

    let sent = 0;
    // Resend's batch endpoint accepts up to 100 messages per request.
    for (let i = 0; i < emails.length; i += 50) {
      const chunk: {
        from: string;
        to: string[];
        subject: string;
        html: string;
      }[] = emails.slice(i, i + 50).map((email) => ({
        from,
        to: [email],
        subject,
        html,
      }));
      try {
        const response = await fetch("https://api.resend.com/emails/batch", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(chunk),
        });
        if (!response.ok) {
          return {
            sent,
            skipped: false,
            reason: `resend-http-${response.status}` as const,
            total: emails.length,
          };
        }
        sent += chunk.length;
      } catch (error) {
        return {
          sent,
          skipped: false,
          reason: "network-error" as const,
          detail: error instanceof Error ? error.message : undefined,
          total: emails.length,
        };
      }
    }

    return { sent, skipped: false, reason: "ok" as const, total: emails.length };
  },
});
