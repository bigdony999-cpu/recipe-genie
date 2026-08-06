"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";

/** Model used for answers; override via NVIDIA_MODEL env if you prefer. */
const DEFAULT_MODEL = "meta/llama-3.1-8b-instruct";

const SYSTEM_PROMPT = `You are Chef AI, a warm, friendly expert cooking and drinks assistant for the "What Should I Cook?" website.
Help users decide what to cook or drink with what they already have.

Rules:
- Always be encouraging, practical and concise (aim for 120–200 words unless asked for more).
- If the user lists ingredients, suggest 2–3 concrete dishes built around them, with a one-line description for each and any quick substitution if an ingredient is missing.
- Answer questions about food, cooking techniques, ingredients, nutrition, drinks, coffee/tea, pairing food with drinks, and fun food facts.
- When asked for a recipe, give a short ingredient list + steps that are simple enough for a home cook.
- If you can't help with something (e.g., medical advice), say so kindly and offer a food-related alternative.
- Format with short paragraphs or simple lines (start each recipe option on its own line). Avoid long markdown tables.`;

export const askChef = action({
  args: {
    messages: v.array(
      v.object({
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
      }),
    ),
    ingredients: v.optional(v.array(v.string())),
  },
  handler: async (_ctx, { messages, ingredients }) => {
    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      return {
        ok: false as const,
        reason: "missing-api-key",
        reply:
          "The AI chef isn't configured yet — add the NVIDIA_API_KEY to get cooking.",
      };
    }

    const model = process.env.NVIDIA_MODEL ?? DEFAULT_MODEL;

    let system = SYSTEM_PROMPT;
    if (ingredients && ingredients.length > 0) {
      system += `\n\nThe user currently has these ingredients available: ${ingredients.join(
        ", ",
      )}. Prioritize dishes that use them.`;
    }

    // Keep the last 12 turns so long conversations stay fast and cheap.
    const trimmed = messages.slice(-12);
    const payload = {
      model,
      messages: [
        { role: "system", content: system },
        ...trimmed.map((m) => ({ role: m.role, content: m.content })),
      ],
      max_tokens: 600,
      temperature: 0.7,
    };

    try {
      const response = await fetch(
        "https://integrate.api.nvidia.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const detail = await response.text().catch(() => "");
        return {
          ok: false as const,
          reason: `nvidia-http-${response.status}`,
          reply:
            "The AI chef hit a snag — give it another try in a few seconds.",
          detail,
        };
      }

      const data = (await response.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const reply = data.choices?.[0]?.message?.content?.trim();
      if (!reply) {
        return {
          ok: false as const,
          reason: "empty-reply",
          reply: "The AI chef came back empty-handed — try rephrasing that.",
        };
      }
      return { ok: true as const, reply };
    } catch (error) {
      return {
        ok: false as const,
        reason: "network-error",
        reply:
          "Couldn't reach the AI chef — check your connection and try again.",
        detail: error instanceof Error ? error.message : undefined,
      };
    }
  },
});
