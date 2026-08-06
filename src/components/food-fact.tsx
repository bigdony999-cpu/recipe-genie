import { Button } from "@/components/ui/button";
import { FOOD_FACTS, type FactCategory } from "@/data/facts";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, Lightbulb, Shuffle } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

const CATEGORY_STYLES: Record<FactCategory, string> = {
  Food: "bg-amber-50 text-amber-700 ring-amber-600/15 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/20",
  Fruit:
    "bg-rose-50 text-rose-700 ring-rose-600/15 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-400/20",
  Drink:
    "bg-sky-50 text-sky-700 ring-sky-600/15 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-400/20",
  Veggie:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/15 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20",
  History:
    "bg-violet-50 text-violet-700 ring-violet-600/15 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-400/20",
  Science:
    "bg-teal-50 text-teal-700 ring-teal-600/15 dark:bg-teal-500/10 dark:text-teal-300 dark:ring-teal-400/20",
};

/** Deterministic "fact of the day" so returning visitors see a stable pick. */
function pickOfTheDay(): number {
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  return dayIndex % FOOD_FACTS.length;
}

/** A fact card that shuffles through the food-fact bank. */
export function FoodFactWidget({ className }: { className?: string }) {
  const [index, setIndex] = useState<number>(pickOfTheDay);
  const fact = FOOD_FACTS[index];

  const nextFact = useCallback(() => {
    setIndex((prev) => {
      let next = prev;
      while (next === prev) {
        next = Math.floor(Math.random() * FOOD_FACTS.length);
      }
      return next;
    });
  }, []);

  const copyFact = useCallback(async () => {
    const text = `${fact.emoji} ${fact.fact} — via What Should I Cook? 🍳`;
    try {
      await navigator.clipboard.writeText(text);
      toast("Fact copied — impress the group chat! 📋");
    } catch {
      toast("Copy isn't available here, but enjoy the fact anyway 😄");
    }
  }, [fact]);

  return (
    <div
      className={cn(
        "rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-7",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
          <Lightbulb className="size-4" />
        </span>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Did you know?
        </p>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={fact.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          <p className="mt-4 text-4xl" aria-hidden>
            {fact.emoji}
          </p>
          <span
            className={cn(
              "mt-3 inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset",
              CATEGORY_STYLES[fact.category],
            )}
          >
            {fact.category}
          </span>
          <p className="mt-3 text-base font-medium leading-7 sm:text-lg">
            {fact.fact}
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Button size="sm" className="gap-1.5" onClick={nextFact}>
          <Shuffle className="size-4" /> Another fact
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5"
          onClick={copyFact}
        >
          <Copy className="size-4" /> Copy it
        </Button>
        <span className="ml-auto text-xs text-muted-foreground">
          🍳 {FOOD_FACTS.length} facts in the jar
        </span>
      </div>
    </div>
  );
}
