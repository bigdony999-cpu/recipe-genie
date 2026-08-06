import { CookingPot } from "lucide-react";
import { cn } from "@/lib/utils";

/** Brand mark + wordmark, used in the landing page and the cook tool header. */
export function Brand({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/30">
        <CookingPot className="size-5" />
      </span>
      <span className="text-base font-extrabold tracking-tight">
        What Should{" "}
        <span className="text-primary">I Cook?</span>
      </span>
    </span>
  );
}
