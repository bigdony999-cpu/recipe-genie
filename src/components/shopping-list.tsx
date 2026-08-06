import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { INGREDIENT_BY_ID, INGREDIENT_CATEGORIES } from "@/data/ingredients";
import { ingredientEmoji, ingredientLabel } from "@/data/recipes";
import type { ScoredRecipe } from "@/lib/recipe-matcher";
import { Check, CheckSquare, ClipboardCopy, ShoppingBasket, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/**
 * Aggregates the missing ingredients across the current shortlist into a
 * tidy, tick-off-able shopping list grouped by pantry category.
 */
export function ShoppingListDialog({
  open,
  onOpenChange,
  matches,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  matches: ScoredRecipe[];
}) {
  const [ticked, setTicked] = useState<Set<string>>(new Set());

  const grouped = useMemo(() => {
    const counts = new Map<string, number>();
    matches.forEach(({ missing }) => {
      missing.forEach((id) => counts.set(id, (counts.get(id) ?? 0) + 1));
    });
    return INGREDIENT_CATEGORIES.map((category) => ({
      category,
      items: [...counts.entries()]
        .filter(([id]) => INGREDIENT_BY_ID[id]?.category === category)
        .sort((a, b) => b[1] - a[1]),
    })).filter((g) => g.items.length > 0);
  }, [matches]);

  const total = grouped.reduce((n, g) => n + g.items.length, 0);
  const remaining = total - ticked.size;

  const toggle = (id: string) =>
    setTicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const copyList = async () => {
    const lines: string[] = ["🛒 Shopping list for tonight's picks:"];
    grouped.forEach(({ category, items }) => {
      const unticked = items.filter(([id]) => !ticked.has(id));
      if (unticked.length === 0) return;
      lines.push(`\n${category}:`);
      unticked.forEach(([id, count]) => {
        lines.push(
          `${ticked.has(id) ? "☑" : "☐"} ${ingredientEmoji(id)} ${ingredientLabel(id)}${
            count > 1 ? ` (×${count})` : ""
          }`,
        );
      });
    });
    lines.push("\nMade with What Should I Cook? 🍳");
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      toast("Shopping list copied! 🛒");
    } catch {
      toast("Copy isn't available here — screenshot the list! 📸");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingBasket className="size-5 text-primary" /> Shopping list
          </DialogTitle>
          <DialogDescription>
            {matches.length === 0
              ? "Pick some ingredients first and we'll build your list."
              : `${remaining} of ${total} to grab${
                  remaining === 0 ? " — all ticked off! 🎉" : ""
                }`}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[45vh] overflow-y-auto pr-1">
          {grouped.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              🎉 Nothing missing — you already have everything these recipes need!
            </p>
          ) : (
            <div className="space-y-5">
              {grouped.map(({ category, items }) => (
                <div key={category}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {category}
                  </p>
                  <div className="mt-2 space-y-1.5">
                    {items.map(([id, count]) => {
                      const done = ticked.has(id);
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => toggle(id)}
                          aria-pressed={done}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition-all active:scale-[0.99]",
                            done
                              ? "border-emerald-500/30 bg-emerald-50/60 text-muted-foreground dark:bg-emerald-500/10"
                              : "border-border bg-card hover:border-primary/40 hover:bg-accent/50",
                          )}
                        >
                          <span
                            className={cn(
                              "grid size-5 shrink-0 place-items-center rounded-md border",
                              done
                                ? "border-emerald-500 bg-emerald-500 text-white"
                                : "border-border bg-background",
                            )}
                          >
                            {done && <Check className="size-3.5" />}
                          </span>
                          <span aria-hidden>{ingredientEmoji(id)}</span>
                          <span className="flex-1">{ingredientLabel(id)}</span>
                          {count > 1 && (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                              ×{count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground"
            onClick={() => setTicked(new Set())}
            disabled={ticked.size === 0}
          >
            <CheckSquare className="size-4" /> Reset
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={copyList}
              disabled={total === 0 || remaining === 0}
            >
              <ClipboardCopy className="size-4" /> Copy list
            </Button>
            <Button size="sm" onClick={() => onOpenChange(false)}>
              <X className="size-4" /> Done
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
