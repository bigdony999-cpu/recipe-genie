import { api } from "@/convex/_generated/api";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAction } from "convex/react";
import { ChefHat, Copy, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type ChatMessage = { role: "user" | "assistant"; content: string };

/** Quick-start questions users can tap instead of typing. */
const QUICK_PROMPTS = [
  "I have egg, rice and tomato — what can I cook?",
  "Suggest a quick healthy dinner",
  "What drinks go well with pizza?",
  "Tell me a fun food fact",
  "I'm craving something sweet, any ideas?",
];

/**
 * Renders a small slice of markdown (bold, bullet & numbered lists, line
 * breaks) safely — no dangerouslySetInnerHTML, so model output can never
 * inject HTML. Every line wraps with `break-words` so long answers are
 * always fully visible and never clipped at the bubble edge.
 */
function RichText({ text }: { text: string }) {
  // Split out **bold** segments; keep everything else literal.
  const renderInline = (content: string, keyPrefix: string) => {
    const parts = content.split(/\*\*(.+?)\*\*/g);
    return parts.map((part, j) =>
      j % 2 === 1 ? (
        <strong key={`${keyPrefix}-${j}`} className="font-bold">
          {part}
        </strong>
      ) : (
        <span key={`${keyPrefix}-${j}`}>{part}</span>
      ),
    );
  };

  const lines = text.split("\n");
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        if (line.trim() === "") return null;

        // Bullet list item:  - ...   * ...   • ...
        const bullet = line.match(/^\s*[-*•]\s+(.+)$/);
        if (bullet) {
          return (
            <p
              key={i}
              className="flex items-start gap-2 leading-relaxed"
            >
              <span
                aria-hidden
                className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-current opacity-60"
              />
              <span className="min-w-0 flex-1 break-words">
                {renderInline(bullet[1], `b${i}`)}
              </span>
            </p>
          );
        }

        // Numbered list item:  1. ...  1) ...
        const numbered = line.match(/^\s*(\d+)[.)]\s+(.+)$/);
        if (numbered) {
          return (
            <p
              key={i}
              className="flex items-start gap-2 leading-relaxed"
            >
              <span className="mt-px w-5 shrink-0 text-right text-xs font-bold tabular-nums opacity-70">
                {numbered[1]}.
              </span>
              <span className="min-w-0 flex-1 break-words">
                {renderInline(numbered[2], `n${i}`)}
              </span>
            </p>
          );
        }

        // Plain paragraph.
        return (
          <p key={i} className="break-words leading-relaxed">
            {renderInline(line, `p${i}`)}
          </p>
        );
      })}
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 py-1" aria-label="Chef is typing">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-2 rounded-full bg-muted-foreground/60"
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

export function AiChefDialog({
  open,
  onOpenChange,
  ingredients,
  floatingButtonClassName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Labels of the user's currently selected ingredients (from the cook tool). */
  ingredients?: string[];
  /** Extra classes for the floating button (e.g. to clear a mobile bar). */
  floatingButtonClassName?: string;
}) {
  const askChef = useAction(api.ai_chef.askChef);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // The Radix ScrollArea renders its own scrollable viewport internally.
  const viewportRef = useRef<HTMLElement | null>(null);

  // Grab the actual scrollable viewport element so we can scroll it directly
  // (more reliable than scrollIntoView, which can target the wrong ancestor).
  const setScrollAreaRef = (node: HTMLDivElement | null) => {
    viewportRef.current = node?.querySelector(
      "[data-radix-scroll-area-viewport]",
    ) ?? null;
  };

  // Fresh chat every time the dialog opens.
  useEffect(() => {
    if (open) {
      setMessages([]);
      setCopied(false);
      window.setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  // Keep the newest message in view — but only if the user is already at the
  // bottom. If they scrolled up to re-read a long answer, don't yank them down.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const nearBottom =
      viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight < 140;
    if (nearBottom) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages, loading]);

  const send = async (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);
    try {
      const result = await askChef({
        messages: [...messages, { role: "user", content: text }],
        ingredients,
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: result.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "The AI chef hit a snag — please try again in a moment. 🍳",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyLastReply = async () => {
    const last = [...messages].reverse().find((m) => m.role === "assistant");
    if (!last) return;
    try {
      await navigator.clipboard.writeText(last.content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  const hasContext = !!ingredients && ingredients.length > 0;

  return (
    <>
      {/* Floating launcher */}
      <AnimatePresence>
        {!open && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.8, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={() => onOpenChange(true)}
            className={cn(
              "fixed bottom-5 right-5 z-50 inline-flex items-center gap-2.5 rounded-full bg-gradient-to-br from-primary via-primary to-[#8a3512] px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-xl shadow-primary/30 transition-transform hover:scale-105 active:scale-95",
              floatingButtonClassName,
            )}
          >
            <ChefHat className="size-5" />
            Ask the chef
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-foreground/70 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-primary-foreground" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="max-w-md rounded-3xl p-0 sm:max-w-md"
          // Inline styles force the dialog to be a flex column regardless of
          // the base `grid` class, so the scroll area can shrink (min-h-0) and
          // scroll instead of growing past the dialog edge. Height caps keep
          // it inside the visible screen on mobile (dvh + vh fallback).
          style={{
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            gap: 0,
            height: "min(600px, 82dvh)",
            maxHeight: "min(640px, 88dvh)",
          }}
        >
          <DialogTitle className="sr-only">Ask the AI chef</DialogTitle>

          {/* Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-[#8a3512] px-5 py-4 text-primary-foreground">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-4 -top-6 select-none text-6xl leading-none opacity-20"
            >
              🍳
            </div>
            <div className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/15 text-2xl backdrop-blur-sm">
                👨‍🍳
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-base font-extrabold tracking-tight">
                  Chef AI
                </p>
                <p className="flex items-center gap-1.5 text-xs font-medium text-primary-foreground/75">
                  <span className="size-1.5 rounded-full bg-emerald-300" />
                  Online · food & drinks, ask anything
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                aria-label="Close chat"
                className="text-primary-foreground hover:bg-white/15 hover:text-primary-foreground"
              >
                <X className="size-5" />
              </Button>
            </div>

            {hasContext && (
              <div className="mt-3 inline-flex max-w-full items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
                <Sparkles className="size-3.5 shrink-0" />
                <span className="truncate">
                  Cooking with: {ingredients!.join(", ")}
                </span>
              </div>
            )}
          </div>

          {/* Messages — min-h-0 is critical: without it the flex item refuses
              to shrink below its content height, so tall answers blow the
              dialog open, push the input off-screen and make scrolling
              impossible. min-h-0 lets it fill the leftover space and scroll. */}
          <ScrollArea ref={setScrollAreaRef} className="min-h-0 flex-1">
            <div className="min-h-full space-y-4 px-4 py-5">
              {messages.length === 0 && (
                <div className="rounded-2xl border border-border/70 bg-card p-4">
                  <p className="text-sm font-bold">Hi, I&apos;m Chef AI! 👋</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Ask me what to cook or drink — with whatever you have on
                    hand. Recipe ideas, substitutions, food facts, pairing
                    drinks with dinner… I&apos;ve got you.
                  </p>
                </div>
              )}

              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex",
                    m.role === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] overflow-hidden break-words rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                      m.role === "user"
                        ? "rounded-br-md bg-primary text-primary-foreground"
                        : "rounded-bl-md border border-border/70 bg-card",
                    )}
                  >
                    <RichText text={m.content} />
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-bl-md rounded-2xl border border-border/70 bg-card px-4 py-2.5 shadow-sm">
                    <TypingDots />
                  </div>
                </div>
              )}

              {/* Sentinel for auto-scroll (kept for layout; direct viewport
                  scrolling is handled above). */}
              <div ref={bottomRef} aria-hidden />
            </div>
          </ScrollArea>

          {/* Quick prompts */}
          {messages.length === 0 && !loading && (
            <div className="flex gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => send(p)}
                  className="shrink-0 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground active:scale-95"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-border/70 bg-card/60 p-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder={
                hasContext
                  ? `Cook something with ${ingredients!.join(", ")}…`
                  : "Ask about food or drinks…"
              }
              aria-label="Ask the chef"
              className="h-11 flex-1 rounded-xl border border-border bg-background px-3.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
              disabled={loading}
            />
            <Button
              type="button"
              size="icon"
              onClick={() => send()}
              disabled={loading || input.trim() === ""}
              aria-label="Send message"
              className="size-11 shrink-0 rounded-xl"
            >
              {loading ? (
                <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
              ) : (
                <Send className="size-4" />
              )}
            </Button>
          </div>

          {/* Footer — copy button only (NVIDIA attribution removed). */}
          <div className="flex items-center justify-end border-t border-border/50 bg-card/40 px-4 py-2">
            {messages.some((m) => m.role === "assistant") && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={copyLastReply}
                className="h-7 gap-1.5 px-2 text-[11px] font-semibold text-muted-foreground hover:text-foreground"
              >
                {copied ? (
                  <MessageCircle className="size-3 text-emerald-600" />
                ) : (
                  <Copy className="size-3" />
                )}
                {copied ? "Copied!" : "Copy last answer"}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
