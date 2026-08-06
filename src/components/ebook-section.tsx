import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, Download, ShieldCheck, Sparkles, Star, UtensilsCrossed } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55, ease: "easeOut" as const },
};

/* ------------------------------------------------------------------ */
/* A book cover built entirely in CSS — layered pages, spine, and a    */
/* rich food-themed cover with floating badges.                        */
/* ------------------------------------------------------------------ */
function BookCover() {
  return (
    <div className="relative mx-auto w-fit [perspective:1600px]">
      {/* Hover glow */}
      <div
        aria-hidden
        className="absolute -inset-8 -z-10 rounded-full bg-gradient-to-br from-primary/25 via-amber-400/15 to-transparent blur-2xl"
      />

      <div className="group relative transition-transform duration-700 ease-out [transform:rotateY(-18deg)_rotateX(6deg)] hover:[transform:rotateY(-6deg)_rotateX(2deg)]">
        {/* Page block behind the cover */}
        <div
          aria-hidden
          className="absolute inset-y-0 -right-3 w-6 rounded-r-md bg-gradient-to-b from-[#f8efe2] via-[#efe2cc] to-[#e3d2b8] shadow-[6px_0_14px_rgba(67,20,7,0.18)]"
        />
        <div
          aria-hidden
          className="absolute inset-y-0 -right-6 w-6 rounded-r-md bg-gradient-to-b from-[#f3e8d6] via-[#e9d9bf] to-[#dbc6a6] shadow-[10px_0_18px_rgba(67,20,7,0.15)]"
        />

        {/* Spine */}
        <div
          aria-hidden
          className="absolute inset-y-0 -left-3 w-4 rounded-l-md bg-gradient-to-b from-[#4a1608] to-[#2b0d04] shadow-[inset_-2px_0_6px_rgba(0,0,0,0.5)]"
        />

        {/* Front cover */}
        <div className="relative w-72 overflow-hidden rounded-r-xl rounded-l-[6px] bg-gradient-to-br from-[#e2542a] via-[#c2410c] to-[#7c2d12] p-7 text-[#fff7ed] shadow-[24px_28px_60px_-12px_rgba(124,45,18,0.55)] transition-shadow duration-500 group-hover:shadow-[18px_22px_50px_-10px_rgba(124,45,18,0.5)] sm:w-80">
          {/* Cover art — food emoji pattern */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-8 -top-8 select-none text-[150px] leading-none opacity-20"
          >
            🍝
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-10 -left-6 select-none text-[130px] leading-none opacity-15"
          >
            🍳
          </div>

          <div className="relative">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-200/90">
              The 10-minute series
            </p>
            <h3 className="mt-3 text-3xl font-black leading-[1.1] tracking-tight text-white sm:text-[2.15rem]">
              Student
              <br />
              Cookbook
            </h3>
            <p className="mt-2 text-sm font-medium text-amber-100/90">
              60+ cheap, delicious recipes for busy people
            </p>

            <div className="mt-5 flex items-center gap-2 text-amber-200">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="size-4 fill-current" />
              ))}
            </div>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
              <Download className="size-3.5" /> Instant PDF · EPUB
            </div>
          </div>
        </div>

        {/* Floating badge: price */}
        <div className="absolute -right-7 top-6 rotate-6 rounded-2xl border border-amber-200/60 bg-white px-4 py-2 text-center shadow-xl transition-transform duration-500 group-hover:-rotate-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Launch price
          </p>
          <p className="text-xl font-black text-primary">
            $4.99
            <span className="ml-1 text-xs font-semibold text-muted-foreground line-through">
              $12.99
            </span>
          </p>
        </div>

        {/* Floating badge: recipes */}
        <div className="absolute -left-8 bottom-10 -rotate-6 rounded-2xl border border-border bg-card px-4 py-2.5 text-center shadow-xl transition-transform duration-500 group-hover:rotate-3">
          <p className="text-2xl font-black text-foreground">60+</p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            recipes
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Persuasive sales copy                                               */
/* ------------------------------------------------------------------ */
const PERKS = [
  {
    icon: UtensilsCrossed,
    title: "Dinner, decided",
    text: "Every recipe uses 5–8 ingredients you can actually buy on a student budget.",
  },
  {
    icon: Sparkles,
    title: "Cooked in under 30 min",
    text: "From pantry to plate before your lecture's next Zoom starts.",
  },
  {
    icon: BookOpen,
    title: "Learn the methods",
    text: "A short kitchen-skills crash course so you can improvise any dish.",
  },
  {
    icon: ShieldCheck,
    title: "No wasted food",
    text: "Each chapter pairs recipes to the same shopping list — use everything up.",
  },
];

export function EbookSection() {
  return (
    <section className="relative overflow-hidden border-t border-border/70 bg-secondary/30 py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_15%_20%,oklch(0.7_0.15_55/0.1),transparent)]"
      />
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-12">
          {/* Book */}
          <motion.div
            {...fadeUp}
            className="order-2 flex justify-center lg:order-1"
          >
            <BookCover />
          </motion.div>

          {/* Copy */}
          <motion.div {...fadeUp} className="order-1 lg:order-2">
            <Badge className="rounded-full bg-primary/10 px-3 py-1 text-primary shadow-none hover:bg-primary/10">
              📖 Now available
            </Badge>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
              The Student Cookbook —{" "}
              <span className="text-primary">every recipe you&apos;ll ever need</span>{" "}
              in one book
            </h2>
            <p className="mt-4 max-w-lg text-base leading-7 text-muted-foreground">
              You know that feeling: it&apos;s 7pm, you&apos;re hungry, and the
              fridge has &ldquo;nothing&rdquo;. This ebook turns that fridge into
              60+ real dinners — written for students, by people who actually ate
              like students.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {PERKS.map((perk) => (
                <div
                  key={perk.title}
                  className="rounded-2xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <perk.icon className="size-5 text-primary" />
                  <h3 className="mt-2.5 text-sm font-bold tracking-tight">
                    {perk.title}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {perk.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Button
                asChild
                size="lg"
                className="h-12 gap-2 rounded-xl px-6 text-base"
              >
                <a href="#newsletter">
                  <Download className="size-5" /> Get the ebook
                </a>
              </Button>
              <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <ShieldCheck className="size-4 text-emerald-600" />
                7-day money-back guarantee
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                4.9/5 from 2,000+ students
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Download className="size-4" /> Instant delivery
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ArrowRight className="size-4" /> Read on any device
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
