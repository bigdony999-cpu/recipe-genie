import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brand } from "@/components/Brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { INGREDIENT_BY_ID } from "@/data/ingredients";
import { findRecipes } from "@/lib/recipe-matcher";
import { ingredientLabel } from "@/data/recipes";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Check,
  ChefHat,
  Clock,
  CookingPot,
  Copy,
  Dice5,
  Share2,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Link } from "react-router";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55, ease: "easeOut" as const },
};

/* ------------------------------------------------------------------ */
/* Hero preview card — the "screenshot-worthy" shortlist, right in the */
/* hero so visitors instantly see what the results look like.          */
/* ------------------------------------------------------------------ */
function HeroPreview() {
  const preview = [
    { emoji: "🍝", name: "Spaghetti Bolognese", time: 40, have: 5, of: 6 },
    { emoji: "🧀", name: "Stovetop Mac & Cheese", time: 20, have: 5, of: 5 },
    { emoji: "🥪", name: "Grilled Cheese", time: 10, have: 3, of: 3 },
  ];
  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* floating ingredient chips */}
      <div className="absolute -left-6 -top-6 z-10 hidden animate-bounce rounded-2xl border border-border bg-card px-3 py-2 text-sm font-semibold shadow-lg sm:block [animation-duration:3s]">
        🍅 tomato
      </div>
      <div className="absolute -right-4 top-24 z-10 hidden animate-bounce rounded-2xl border border-border bg-card px-3 py-2 text-sm font-semibold shadow-lg sm:block [animation-delay:1.2s] [animation-duration:3.5s]">
        🥑 avocado
      </div>

      <div className="rotate-1 rounded-3xl border border-border bg-card p-5 shadow-xl shadow-primary/10 transition-transform duration-300 hover:rotate-0 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">
              Tonight&apos;s shortlist
            </p>
            <p className="mt-1 text-lg font-bold tracking-tight">
              3 ideas worth cooking
            </p>
          </div>
          <span className="grid size-10 place-items-center rounded-2xl bg-primary/10 text-xl">
            🍳
          </span>
        </div>
        <div className="mt-4 space-y-3">
          {preview.map((r) => (
            <div
              key={r.name}
              className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background p-3"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-2xl">
                {r.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{r.name}</p>
                <p className="text-xs text-muted-foreground">
                  {r.time} min · you have {r.have}/{r.of}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/15 dark:bg-emerald-500/10 dark:text-emerald-300">
                <Check className="size-3" /> Ready
              </span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-[11px] font-medium text-muted-foreground">
          Made with <span className="font-bold text-foreground">What Should I Cook?</span> 🍳
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Interactive demo — pick a few ingredients, see matches instantly.   */
/* ------------------------------------------------------------------ */
const DEMO_IDS = [
  "egg",
  "rice",
  "pasta",
  "chicken",
  "tomato",
  "cheese",
  "onion",
  "soy-sauce",
];

function DemoSection() {
  const [picked, setPicked] = useState<string[]>(["egg", "rice"]);
  const matches = useMemo(() => findRecipes(new Set(picked), 3), [picked]);

  const toggle = (id: string) =>
    setPicked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <motion.div {...fadeUp} className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Try it right here
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Pick three things. Watch the magic.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
            This is the actual tool, live on the page. Tap what&apos;s in your
            kitchen and see recipes appear instantly.
          </p>
        </motion.div>

        <motion.div
          {...fadeUp}
          className="mx-auto mt-10 grid max-w-4xl gap-6 lg:grid-cols-2"
        >
          {/* Ingredient picker */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              I have…
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {DEMO_IDS.map((id) => {
                const ing = INGREDIENT_BY_ID[id];
                const active = picked.includes(id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggle(id)}
                    aria-pressed={active}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all active:scale-95",
                      active
                        ? "border-transparent bg-primary text-primary-foreground shadow-sm"
                        : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
                    )}
                  >
                    {active && <Check className="size-3.5" />}
                    <span aria-hidden>{ing.emoji}</span>
                    {ing.label}
                  </button>
                );
              })}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              {picked.length === 0
                ? "Tap a few ingredients above 👆"
                : `You picked ${picked.length}: ${picked
                    .map((id) => INGREDIENT_BY_ID[id].label)
                    .join(", ")}`}
            </p>
          </div>

          {/* Live matches */}
          <div className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              …so I can cook
            </p>
            <div className="mt-3 flex-1 space-y-3">
              {matches.length === 0 ? (
                <div className="grid h-full min-h-32 place-items-center rounded-2xl border border-dashed border-border text-center">
                  <p className="px-6 text-sm text-muted-foreground">
                    Nothing yet — add a staple like rice, pasta or eggs.
                  </p>
                </div>
              ) : (
                matches.map(({ recipe, matched }) => (
                  <div
                    key={recipe.id}
                    className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background p-3"
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-2xl">
                      {recipe.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">{recipe.name}</p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="size-3" /> {recipe.timeMinutes} min ·
                        uses {matched.length} of your picks
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/15 dark:bg-emerald-500/10 dark:text-emerald-300">
                      ✓
                    </span>
                  </div>
                ))
              )}
            </div>
            <Link
              to="/cook"
              className="mt-4 inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
            >
              Cook with all {Object.keys(INGREDIENT_BY_ID).length} ingredients{" "}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Feature cards                                                       */
/* ------------------------------------------------------------------ */
const FEATURES = [
  {
    icon: ChefHat,
    title: "Built for students",
    text: "Budget-friendly recipes that use what you already have. No fancy equipment, no rare ingredients.",
  },
  {
    icon: Sparkles,
    title: "No sign-up, no ads",
    text: "Open the page and cook. There's no account, no paywall, no grocery run — just dinner ideas.",
  },
  {
    icon: Share2,
    title: "Share-ready results",
    text: "Copy your shortlist and paste it straight into the group chat. Everyone wants this tool.",
  },
  {
    icon: Dice5,
    title: "Surprise me mode",
    text: "Can't even pick from the picks? Hit the dice and let fate choose tonight's dinner.",
  },
];

function FeatureGrid() {
  return (
    <section className="bg-secondary/40 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <motion.div {...fadeUp} className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Why you'll love it
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Made for people who hate deciding
          </h2>
        </motion.div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              {...fadeUp}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
            >
              <span className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <f.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-base font-bold tracking-tight">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {f.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* How it works                                                        */
/* ------------------------------------------------------------------ */
const STEPS = [
  {
    emoji: "🧺",
    title: "1 · Pick your ingredients",
    text: "Tap what's in your kitchen — even a sad half-empty fridge works.",
  },
  {
    emoji: "🍳",
    title: "2 · Get 3–5 recipe ideas",
    text: "We match against 60+ simple recipes and rank the ones you can actually make.",
  },
  {
    emoji: "📋",
    title: "3 · Cook & share",
    text: "Open a recipe, screenshot the shortlist, or paste it into the group chat.",
  },
];

function HowItWorks() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <motion.div {...fadeUp} className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            How it works
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            From fridge to fork in three taps
          </h2>
        </motion.div>
        <div className="relative mt-12 grid gap-6 md:grid-cols-3">
          <div
            aria-hidden
            className="absolute left-[16%] right-[16%] top-10 hidden border-t-2 border-dashed border-primary/25 md:block"
          />
          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              {...fadeUp}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative rounded-3xl border border-border bg-card p-7 text-center shadow-sm"
            >
              <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 text-3xl">
                {s.emoji}
              </span>
              <h3 className="mt-4 text-base font-bold tracking-tight">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {s.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Brand />
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
            <a href="#how" className="transition-colors hover:text-foreground">
              How it works
            </a>
            <a href="#features" className="transition-colors hover:text-foreground">
              Why it works
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/auth">Sign in</Link>
            </Button>
            <Button asChild className="gap-1.5">
              <Link to="/cook">
                Start cooking <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,oklch(0.55_0.16_32/0.09),transparent)]"
        />
        <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-2 lg:pb-28 lg:pt-24">
          <div>
            <Badge className="rounded-full bg-primary/10 px-3 py-1 text-primary shadow-none hover:bg-primary/10">
              🍳 Free · No sign-up · Made for students
            </Badge>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-[4.25rem]">
              What&apos;s for dinner?
              <span className="block text-primary">
                Stop deciding. Start cooking.
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
              Tell us what&apos;s in your kitchen and get 3–5 simple recipes
              you can cook right now. No sign-up, no grocery run, no
              &ldquo;what do I even have?&rdquo; staring contests.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="h-12 gap-2 rounded-xl px-6 text-base">
                <Link to="/cook">
                  <CookingPot className="size-5" /> Find me a recipe
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 gap-2 rounded-xl px-6 text-base"
              >
                <a href="#how">
                  How it works <ArrowRight className="size-4" />
                </a>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Check className="size-4 text-emerald-600" /> 60+ recipes
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="size-4 text-emerald-600" /> 79 ingredients
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="size-4 text-emerald-600" /> 0 decisions made
              </span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          >
            <HeroPreview />
          </motion.div>
        </div>
      </section>

      {/* Interactive demo */}
      <DemoSection />

      {/* How it works */}
      <div id="how">
        <HowItWorks />
      </div>

      {/* Features */}
      <div id="features">
        <FeatureGrid />
      </div>

      {/* CTA */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <motion.div
            {...fadeUp}
            className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary via-primary to-[#8a3512] px-6 py-14 text-center text-primary-foreground shadow-xl shadow-primary/25 sm:px-12 sm:py-20"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -left-6 -top-10 select-none text-[120px] leading-none opacity-15"
            >
              🍝
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-8 right-6 select-none text-[100px] leading-none opacity-15"
            >
              🥗
            </div>
            <h2 className="relative text-3xl font-extrabold tracking-tight sm:text-5xl">
              Tonight&apos;s dinner problem:
              <span className="block">solved in 10 seconds.</span>
            </h2>
            <p className="relative mx-auto mt-4 max-w-md text-sm leading-6 text-primary-foreground/80 sm:text-base">
              Open your fridge, tap what you see, and get cooking. Your future
              self (and your wallet) will thank you.
            </p>
            <Button
              asChild
              size="lg"
              className="relative mt-8 h-12 gap-2 rounded-xl bg-primary-foreground px-7 text-base font-bold text-primary shadow-none hover:bg-primary-foreground/90"
            >
              <Link to="/cook">
                Start cooking <ArrowRight className="size-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/70 py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6">
          <Brand />
          <p className="text-center text-sm text-muted-foreground">
            Made with 🍳 for people who can&apos;t decide what to cook.
          </p>
          <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
            <Link to="/cook" className="transition-colors hover:text-foreground">
              Cook now
            </Link>
            <Link to="/auth" className="transition-colors hover:text-foreground">
              Sign in
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
