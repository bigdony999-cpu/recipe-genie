import { AiChefDialog } from "@/components/ai-chef";
import { Button } from "@/components/ui/button";
import { Brand } from "@/components/Brand";
import { EbookSection } from "@/components/ebook-section";
import { FoodFactWidget } from "@/components/food-fact";
import { InstallAppButton } from "@/components/install-app";
import { SubscribeForm } from "@/components/subscribe-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { INGREDIENT_BY_ID } from "@/data/ingredients";
import { findRecipes } from "@/lib/recipe-matcher";
import { ingredientLabel } from "@/data/recipes";
import { cn } from "@/lib/utils";
import {
  Apple,
  ArrowRight,
  Check,
  ChefHat,
  Clock,
  CookingPot,
  Copy,
  Dice5,
  Leaf,
  Lock,
  MessageCircle,
  RefreshCw,
  Sandwich,
  Share2,
  ShoppingBasket,
  Sparkles,
  UtensilsCrossed,
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

/** Polished dish icons used instead of emoji on recipe tiles. */
const DISH_ICONS = [UtensilsCrossed, Sandwich, CookingPot];

/* ------------------------------------------------------------------ */
/* Hero preview card — the "screenshot-worthy" shortlist, right in the */
/* hero so visitors instantly see what the results look like.          */
/* ------------------------------------------------------------------ */
function HeroPreview() {
  const preview = [
    { name: "Spaghetti Bolognese", time: 40, have: 5, of: 6 },
    { name: "Stovetop Mac & Cheese", time: 20, have: 5, of: 5 },
    { name: "Grilled Cheese", time: 10, have: 3, of: 3 },
  ];
  return (
    <div className="rotate-1 rounded-3xl border border-border bg-card p-5 shadow-xl shadow-primary/10 transition-transform duration-300 hover:rotate-0 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-bold tracking-tight">
            Tonight&apos;s shortlist
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            3 ideas worth cooking
          </p>
        </div>
        <span className="grid size-10 place-items-center rounded-2xl bg-primary/10 text-primary">
          <CookingPot className="size-5" />
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {preview.map((r, i) => {
          const Icon = DISH_ICONS[i % DISH_ICONS.length];
          return (
            <div
              key={r.name}
              className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background p-3"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
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
          );
        })}
      </div>
      <p className="mt-4 text-center text-[11px] font-medium text-muted-foreground">
        Made with <span className="font-bold text-foreground">What Should I
        Cook?</span>
      </p>
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
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
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
                    {ing.label}
                  </button>
                );
              })}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              {picked.length === 0
                ? "Tap a few ingredients above"
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
                matches.map(({ recipe, matched }, i) => {
                  const Icon = DISH_ICONS[i % DISH_ICONS.length];
                  return (
                    <div
                      key={recipe.id}
                      className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background p-3"
                    >
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold">
                          {recipe.name}
                        </p>
                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="size-3" /> {recipe.timeMinutes} min
                          · uses {matched.length} of your picks
                        </p>
                      </div>
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-emerald-500 text-white">
                        <Check className="size-3" />
                        <span className="sr-only">Match</span>
                      </span>
                    </div>
                  );
                })
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
    title: "Built for real kitchens",
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
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
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
    icon: ShoppingBasket,
    title: "1 · Pick your ingredients",
    text: "Tap what's in your kitchen — even a sad half-empty fridge works.",
  },
  {
    icon: CookingPot,
    title: "2 · Get 3–5 recipe ideas",
    text: "We match against 60+ simple recipes and rank the ones you can actually make.",
  },
  {
    icon: Share2,
    title: "3 · Cook & share",
    text: "Open a recipe, screenshot the shortlist, or paste it into the group chat.",
  },
];

function HowItWorks() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <motion.div {...fadeUp} className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
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
              <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary">
                <s.icon className="size-7" />
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
/* Fun facts                                                           */
/* ------------------------------------------------------------------ */
function FunFacts() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Food facts to impress your flatmates
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
              Stuck on the couch while dinner cooks? Hit the button and grab a
              bite-sized fact about food, fruit and drinks. Then copy it
              straight into the group chat.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <Apple className="mt-0.5 size-4 shrink-0 text-primary" />
                Food, fruit, veg, drinks, history and science
              </li>
              <li className="flex items-start gap-2.5">
                <RefreshCw className="mt-0.5 size-4 shrink-0 text-primary" />
                A new fact every click — plus a fresh fact of the day
              </li>
              <li className="flex items-start gap-2.5">
                <Copy className="mt-0.5 size-4 shrink-0 text-primary" />
                One tap to copy and share with your friends
              </li>
            </ul>
          </motion.div>
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
          >
            <FoodFactWidget />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* AI Chef section                                                     */
/* ------------------------------------------------------------------ */
const CHEF_QA = [
  {
    q: "I have eggs, rice & a tomato…",
    a: "Shakshuka, egg fried rice, or a quick tomato rice bowl — instantly.",
  },
  {
    q: "What pairs with pasta night?",
    a: "Drink ideas, side dishes, even a fun fact about the dish. Ask away.",
  },
  {
    q: "No butter? No problem.",
    a: "Chef AI suggests swaps for whatever ingredient you're missing.",
  },
];

function AiChefSection({ onAsk }: { onAsk: () => void }) {
  return (
    <section className="border-t border-border/70 bg-secondary/30 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
              Stuck? Ask{" "}
              <span className="text-primary">Chef AI</span> — your pocket
              cooking buddy
            </h2>
            <p className="mt-4 max-w-lg text-base leading-7 text-muted-foreground">
              Food, drinks, substitutions, facts — ask anything and get a
              friendly, practical answer in seconds. It even knows what&apos;s
              already in your kitchen.
            </p>

            <div className="mt-7 space-y-3">
              {CHEF_QA.map((item) => (
                <div
                  key={item.q}
                  className="rounded-2xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <p className="flex items-center gap-2 text-sm font-bold tracking-tight">
                    <MessageCircle className="size-4 shrink-0 text-primary" />
                    {item.q}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>

            <Button
              size="lg"
              className="mt-7 h-12 gap-2 rounded-xl px-6 text-base"
              onClick={onAsk}
            >
              <MessageCircle className="size-5" /> Ask Chef AI anything
            </Button>
          </motion.div>

          {/* Chat preview card */}
          <motion.div {...fadeUp} className="relative">
            <div className="rounded-3xl border border-border bg-card p-5 shadow-xl shadow-primary/10 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <ChefHat className="size-6" />
                </span>
                <div>
                  <p className="text-sm font-bold">Chef AI</p>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    Online · replies instantly
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-border/70 bg-background px-4 py-2.5 text-sm">
                  I have chicken, rice and broccoli. Quick idea?
                </div>
                <div className="ml-auto max-w-[88%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                  <p>
                    <strong>Chicken &amp; Broccoli Stir-Fry</strong> — 20 min
                  </p>
                  <p className="mt-1 opacity-90">
                    Veggie rice bowls, or a one-pan teriyaki bake. Want a
                    drink pairing too?
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <div className="h-11 flex-1 rounded-xl border border-border bg-background px-3.5 text-sm text-muted-foreground">
                    Ask about food or drinks…
                  </div>
                  <span className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground">
                    <UtensilsCrossed className="size-4" />
                  </span>
                </div>
              </div>
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute -right-5 -top-5 -z-10 size-40 rounded-full bg-primary/10 blur-2xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Newsletter                                                          */
/* ------------------------------------------------------------------ */
function Newsletter() {
  return (
    <section
      id="newsletter"
      className="scroll-mt-20 border-t border-border/70 bg-secondary/30 py-20 sm:py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            If you&apos;d like to be updated on any food recipe,
            <span className="block text-primary">subscribe</span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
            One short, tasty email a week with new recipes and food facts. No
            spam, no clutter — unsubscribe anytime.
          </p>
          <SubscribeForm className="mx-auto mt-8 max-w-lg" />
          <p className="mt-4 inline-flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="size-3.5" />
            Your email stays private and is only used for recipe updates.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function Landing() {
  const [chefOpen, setChefOpen] = useState(false);

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
            <a
              href="#features"
              className="transition-colors hover:text-foreground"
            >
              Why it works
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <InstallAppButton className="hidden md:inline-flex" />
            <ThemeToggle />
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex"
            >
              <Link to="/auth">Sign in</Link>
            </Button>
            {/* The one clear CTA — same action as the hero button */}
            <Button asChild className="gap-1.5">
              <Link to="/cook">
                Find me a recipe <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,oklch(0.55_0.16_32/0.09),transparent)]"
        />
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-2 lg:pb-24 lg:pt-20">
          <div>
            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-[4.25rem]">
              What&apos;s for dinner?
              <span className="block text-primary">
                Stop deciding. Start cooking.
              </span>
            </h1>
            <p className="mt-5 max-w-lg break-words text-base leading-7 text-muted-foreground text-pretty sm:text-lg">
              Tell us what&apos;s in your kitchen and get 3–5 simple recipes
              you can cook right now. No sign-up, no grocery run, no
              &ldquo;what do I even have?&rdquo; staring contests.
            </p>

            {/* One clear CTA */}
            <div className="mt-8">
              <Button
                asChild
                size="lg"
                className="h-12 gap-2.5 rounded-xl px-7 text-base shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
              >
                <Link to="/cook">
                  <CookingPot className="size-5" />
                  Find me a recipe
                  <ArrowRight className="size-5" />
                </Link>
              </Button>
            </div>

            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Free · No sign-up · 60+ recipes
            </p>

            {/* Icon stats strip */}
            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm font-medium text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Leaf className="size-4" />
                </span>
                <span>
                  <strong className="font-bold text-foreground">60+</strong>{" "}
                  recipes
                </span>
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                  <ShoppingBasket className="size-4" />
                </span>
                <span>
                  <strong className="font-bold text-foreground">79</strong>{" "}
                  ingredients
                </span>
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Clock className="size-4" />
                </span>
                Ready in minutes
              </span>
            </div>
          </div>

          {/* Delicious food photo + product preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          >
            <div className="relative">
              <div className="relative overflow-hidden rounded-[1.75rem] border border-border shadow-2xl shadow-primary/15">
                <img
                  src="/images/hero-pasta.jpg"
                  alt="A rustic bowl of spaghetti with cherry tomatoes, basil and shaved parmesan"
                  width={1600}
                  height={1067}
                  className="h-64 w-full object-cover sm:h-80 lg:h-96"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"
                />
              </div>
              <div className="relative z-10 mx-auto -mt-16 w-[94%] sm:-mt-20">
                <HeroPreview />
              </div>
            </div>
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

      {/* Fun facts */}
      <FunFacts />

      {/* AI Chef */}
      <AiChefSection onAsk={() => setChefOpen(true)} />

      {/* Ebook — the paid product */}
      <EbookSection />

      {/* Closing CTA over a delicious food photo */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <motion.div
            {...fadeUp}
            className="relative overflow-hidden rounded-[2rem] shadow-xl"
          >
            <img
              src="/images/cta-dinner.jpg"
              alt=""
              aria-hidden
              width={1600}
              height={1067}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-r from-[#431407]/95 via-[#431407]/85 to-[#431407]/55"
            />
            <div className="relative px-6 py-14 text-center sm:px-12 sm:py-20">
              <h2 className="text-3xl font-extrabold tracking-tight text-[#fff7ed] sm:text-5xl">
                Tonight&apos;s dinner problem:
                <span className="block">solved in 10 seconds.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#ffedd5]/85 sm:text-base">
                Open your fridge, tap what you see, and get cooking. Your
                future self (and your wallet) will thank you.
              </p>
              <Button
                asChild
                size="lg"
                className="mt-8 h-12 gap-2.5 rounded-xl bg-[#fff7ed] px-7 text-base font-bold text-[#431407] shadow-none transition-colors hover:bg-[#fff7ed]/90"
              >
                <Link to="/cook">
                  <CookingPot className="size-5" />
                  Find me a recipe
                  <ArrowRight className="size-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />

      {/* Floating AI chef */}
      <AiChefDialog open={chefOpen} onOpenChange={setChefOpen} />

      {/* Footer */}
      <footer className="border-t border-border/70 py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6">
          <Brand />
          <p className="text-center text-sm text-muted-foreground">
            Made for people who can&apos;t decide what to cook.
          </p>
          <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
            <Link to="/cook" className="transition-colors hover:text-foreground">
              Cook now
            </Link>
            <Link to="/auth" className="transition-colors hover:text-foreground">
              Sign in
            </Link>
            <Link
              to="/privacy"
              className="transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="transition-colors hover:text-foreground"
            >
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
