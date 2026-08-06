import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { buildShareText, type ScoredRecipe } from "@/lib/recipe-matcher";
import { Check, ClipboardCopy, Share2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Screenshot-worthy "share card" dialog. Shows the top picks styled like a
 * pretty dinner card users will want to screenshot, plus Copy-text and
 * native Share (Web Share API) actions.
 */
export function ShareCardDialog({
  open,
  onOpenChange,
  matches,
  selectedLabels,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  matches: ScoredRecipe[];
  selectedLabels: string[];
}) {
  const [copied, setCopied] = useState(false);

  const top = matches.slice(0, 5);
  const hasShare = typeof navigator !== "undefined" && "share" in navigator;

  const copyText = async () => {
    const text = buildShareText(matches, selectedLabels);
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast("Copied — paste it in the group chat! 📋");
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      toast("Copy isn't available here — screenshot the card instead! 📸");
    }
  };

  const nativeShare = async () => {
    const text = buildShareText(matches, selectedLabels);
    if (!text || !hasShare) return;
    try {
      await navigator.share({
        title: "What Should I Cook?",
        text,
        url: window.location.href,
      });
    } catch {
      // User cancelled the share sheet — that's fine.
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-sm"
      >
        {/* The card itself — designed to look great in a screenshot */}
        <div className="relative bg-gradient-to-br from-[#fff7ed] via-[#ffedd5] to-[#fed7aa] p-6 text-[#431407]">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-6 -top-8 select-none text-8xl leading-none opacity-10"
          >
            🍳
          </div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#c2410c]">
            Tonight I'm cooking
          </p>
          <p className="mt-1 text-xl font-extrabold tracking-tight">
            {top.length === 1
              ? "1 dinner idea"
              : `${top.length} dinner ideas`}
          </p>

          <div className="mt-4 space-y-2.5">
            {top.map(({ recipe, matched }) => (
              <div
                key={recipe.id}
                className="flex items-center gap-3 rounded-2xl border border-[#fdba74]/70 bg-white/80 p-3 shadow-sm"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#ffedd5] text-2xl">
                  {recipe.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-[#431407]">
                    {recipe.name}
                  </p>
                  <p className="text-xs font-medium text-[#9a3412]">
                    {recipe.timeMinutes} min · have {matched.length}/
                    {recipe.ingredients.length}
                  </p>
                </div>
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-emerald-500 text-white">
                  <Check className="size-3.5" />
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 border-t border-dashed border-[#fdba74] pt-3 text-center">
            <p className="text-sm font-extrabold">
              Made with What Should I Cook? 🍳
            </p>
            <p className="mt-0.5 text-[11px] font-medium text-[#9a3412]">
              Pick what's in your kitchen → dinner sorted
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-card p-4">
          <DialogHeader className="sr-only">
            <DialogTitle>Share your dinner shortlist</DialogTitle>
            <DialogDescription>
              Copy the list or share it with your group chat.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-2 sm:justify-center">
            <Button
              variant="outline"
              className="flex-1 gap-1.5"
              onClick={copyText}
            >
              {copied ? (
                <Check className="size-4" />
              ) : (
                <ClipboardCopy className="size-4" />
              )}
              {copied ? "Copied!" : "Copy text"}
            </Button>
            {hasShare && (
              <Button className="flex-1 gap-1.5" onClick={nativeShare}>
                <Share2 className="size-4" /> Share
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              aria-label="Close"
              className="shrink-0"
            >
              <X className="size-4" />
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
