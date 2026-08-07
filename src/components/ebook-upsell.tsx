import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { BookOpen, Download, ShieldCheck, Star } from "lucide-react";
import { motion } from "framer-motion";

const EBOOK_URL = "https://greenspot.gumroad.com";

/**
 * Compact ebook upsell shown inside the cook tool once the user has recipe
 * matches — the exact moment they're hungry and engaged. Small enough to
 * never block the core tool, appetizing enough to convert.
 */
export function EbookUpsell() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative mt-6 overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card to-card p-5 sm:p-6"
    >
      {/* faint cover art in the background */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-6 -top-8 select-none text-[110px] leading-none opacity-10"
      >
        📖
      </div>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        {/* Mini book cover */}
        <div className="shrink-0">
          <div className="relative w-24 rotate-[-4deg] overflow-hidden rounded-lg rounded-r-sm bg-gradient-to-br from-[#e2542a] via-[#c2410c] to-[#7c2d12] p-3 text-[#fff7ed] shadow-lg transition-transform duration-300 hover:rotate-0">
            <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-amber-200/90">
              The 10-minute series
            </p>
            <p className="mt-1 text-sm font-black leading-[1.1]">
              Everyday
              <br />
              Cookbook
            </p>
            <div className="mt-1.5 flex gap-0.5 text-amber-200">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="size-2 fill-current" />
              ))}
            </div>
          </div>
        </div>

        {/* Copy */}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Liking these picks? 📖
          </p>
          <h3 className="mt-1 text-lg font-extrabold tracking-tight">
            Get 60+ more recipes in the Everyday Cookbook
          </h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Every recipe in the book uses 5–8 everyday ingredients and cooks
            in under 30 minutes — perfect when the shortlist just isn&apos;t
            enough.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Star className="size-3.5 fill-amber-400 text-amber-400" /> 4.9/5
              from 2,000+ cooks
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Download className="size-3.5" /> Instant PDF · EPUB
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-emerald-600" /> 7-day money-back
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="shrink-0 text-left sm:text-center">
          <p className="text-2xl font-black text-primary">
            $6.99
            <span className="ml-1 align-middle text-[11px] font-semibold text-muted-foreground">
              one-time
            </span>
          </p>
          <Button
            asChild
            size="lg"
            className="mt-2 h-11 w-full gap-2 rounded-xl px-6 sm:w-auto"
          >
            <a
              href={EBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("Ebook Click")}
            >
              <BookOpen className="size-4" /> Get the ebook
            </a>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
