import {
  INGREDIENT_CATEGORIES,
  INGREDIENTS,
  PANTRY_QUICK_PICKS,
  type IngredientCategory,
} from "@/data/ingredients";
import {
  buildShareText,
  findRecipes,
  surpriseMe,
  type ScoredRecipe,
} from "@/lib/recipe-matcher";
import { ingredientEmoji, ingredientLabel } from "@/data/recipes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brand } from "@/components/Brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSavedRecipes } from "@/hooks/use-saved-recipes";
import { cn } from "@/lib/utils";
import {
  ArrowDown,
  Check,
  ChefHat,
  Clock,
  CookingPot,
  Copy,
  ExternalLink,
  Heart,
  RotateCcw,
  Search,
  Shuffle,
  Sparkles,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

function IngredientChip({
  id,
  label,
  emoji,
  selected,
  onToggle,
}: {
  id: string;
  label: string;
  emoji: string;
  selected: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(id)}
      aria-pressed={selected}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-150 active:scale-95",
        selected
          ? "border-transparent bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {selected && <Check className="size-3.5 shrink-0" />}
      <span aria-hidden>{emoji}</span>
      {label}
    </button>
  );
}

function RecipeCard({
  item,
  surprise,
  index,
  saved,
  onToggleSaved,
}: {
  item: ScoredRecipe;
  surprise: boolean;
  index: number;
  saved: boolean;
  onToggleSaved: (id: string) => void;
}) {
  const { recipe, matched, missing } = item;
  return (
    <motion.div
      layout
      id={`recipe-${recipe.id}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.05, 0.2) }}
      className={cn(
        "rounded-2xl border bg-card p-5 shadow-sm transition-shadow sm:p-6",
        surprise &&
          "ring-2 ring-primary/70 shadow-lg shadow-primary/10 border-transparent",
      )}
    >
      <div className="flex gap-4">
        <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-primary/10 text-3xl">
          <span aria-hidden>{recipe.emoji}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <h3 className="text-lg font-bold tracking-tight">
              {recipe.name}
            </h3>
            <Badge
              variant="secondary"
              className="rounded-full text-[11px] font-semibold"
            >
              {recipe.difficulty}
            </Badge>
          </div>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {recipe.description}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" /> {recipe.timeMinutes} min
            </span>
            <span className="inline-flex items-center gap-1">
              <Users className="size-3.5" /> {recipe.servings} servings
            </span>
            <span className="inline-flex items-center gap-1">
              <ChefHat className="size-3.5" /> {recipe.difficulty}
            </span>
            <a
              href={recipe.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-primary transition-colors hover:text-primary/80 hover:underline"
            >
              Get the recipe <ExternalLink className="size-3.5" />
            </a>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {matched.map((id) => (
              <span
                key={id}
                className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/15 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20"
              >
                <Check className="size-3" /> {ingredientLabel(id)}
              </span>
            ))}
            {missing.length > 0 && (
              <span className="text-xs text-muted-foreground/80">
                + {missing.length} more needed
              </span>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onToggleSaved(recipe.id)}
          aria-pressed={saved}
          aria-label={
            saved
              ? `Remove ${recipe.name} from your saved list`
              : `Save ${recipe.name} for later`
          }
          title={saved ? "Remove from saved" : "Save for later"}
          className={cn(
            "grid size-9 shrink-0 place-items-center self-start rounded-full border transition-all active:scale-90",
            saved
              ? "border-transparent bg-primary text-primary-foreground shadow-sm"
              : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary",
          )}
        >
          <Heart className={cn("size-4", saved && "fill-current")} />
        </button>
      </div>
    </motion.div>
  );
}

export default function CookTool() {
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [surpriseId, setSurpriseId] = useState<string | null>(null);
  const [savedOnly, setSavedOnly] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { saved, isSaved, toggleSaved } = useSavedRecipes();

  const matches = useMemo(
    () => findRecipes(new Set(selected)),
    [selected],
  );

  const visibleMatches = savedOnly
    ? matches.filter((m) => saved.includes(m.recipe.id))
    : matches;

  const handleToggleSaved = (id: string) => {
    const wasSaved = isSaved(id);
    toggleSaved(id);
    if (!wasSaved) toast("Saved to your list — tap the heart to undo ❤️");
  };

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const clearAll = () => setSelected([]);

  const scrollToResults = () => {
    resultsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleSurprise = () => {
    const pick = surpriseMe(new Set(selected));
    if (!pick) {
      toast("Add a couple more ingredients first 🧺");
      return;
    }
    setSurpriseId(null);
    // Clear previous highlight before re-triggering the animation.
    requestAnimationFrame(() => {
      setSurpriseId(pick.recipe.id);
      document
        .getElementById(`recipe-${pick.recipe.id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    window.setTimeout(() => setSurpriseId(null), 3500);
  };

  const handleCopy = async () => {
    const text = buildShareText(matches, selected.map(ingredientLabel));
    if (!text) {
      toast("Pick a few ingredients first 🧺");
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      toast("Your shortlist is copied — paste it in the group chat! 📋");
    } catch {
      toast("Copy isn't available in this browser, but here's your list:");
      console.info(text);
    }
  };

  const visibleIngredients =
    query.trim().length > 0
      ? INGREDIENTS.filter((i) =>
          i.label.toLowerCase().includes(query.trim().toLowerCase()),
        )
      : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            to="/"
            className="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Brand />
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/">Home</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/auth">Sign in</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-8 sm:px-6 lg:pb-12 lg:pt-12">
        <div className="grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-12">
          {/* ---------- Ingredients ---------- */}
          <section className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Step 1 · Your pantry
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              What&apos;s in your kitchen?
            </h1>
            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Tap everything you have. We&apos;ll match you with recipes you
              can cook tonight — no extra grocery run required.
            </p>

            {/* Quick staples */}
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Common staples
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {PANTRY_QUICK_PICKS.map((id) => {
                  const active = selected.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggle(id)}
                      aria-pressed={active}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold transition-all active:scale-95",
                        active
                          ? "border-transparent bg-primary text-primary-foreground"
                          : "border-dashed border-border bg-transparent text-muted-foreground hover:border-primary/50 hover:text-foreground",
                      )}
                    >
                      {active ? (
                        <Check className="size-3" />
                      ) : (
                        <Sparkles className="size-3" />
                      )}
                      {ingredientEmoji(id)} {ingredientLabel(id)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search */}
            <div className="relative mt-6">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search ingredients… (e.g. chicken, rice, cheese)"
                className="h-11 rounded-xl pl-9"
                aria-label="Search ingredients"
              />
            </div>

            {/* Category groups */}
            <div className="mt-6 space-y-6">
              {INGREDIENT_CATEGORIES.map((category: IngredientCategory) => {
                const group =
                  visibleIngredients ??
                  INGREDIENTS.filter((i) => i.category === category);
                if (group.length === 0) return null;
                const inGroup = group.filter((i) => i.category === category);
                if (inGroup.length === 0) return null;
                const selectedCount = inGroup.filter((i) =>
                  selected.includes(i.id),
                ).length;
                return (
                  <div key={category}>
                    <div className="mb-2.5 flex items-center gap-2">
                      <h2 className="text-sm font-bold tracking-tight">
                        {category}
                      </h2>
                      {selectedCount > 0 && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                          {selectedCount}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {inGroup.map((ing) => (
                        <IngredientChip
                          key={ing.id}
                          id={ing.id}
                          label={ing.label}
                          emoji={ing.emoji}
                          selected={selected.includes(ing.id)}
                          onToggle={toggle}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
              {visibleIngredients && visibleIngredients.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No ingredients match &ldquo;{query}&rdquo; — try something
                  like &ldquo;rice&rdquo; or &ldquo;cheese&rdquo;.
                </p>
              )}
            </div>

            {/* Selected summary */}
            {selected.length > 0 && (
              <div className="mt-8 flex flex-wrap items-center gap-2 rounded-2xl border border-primary/25 bg-primary/5 p-4">
                <span className="text-sm font-semibold">
                  {selected.length} selected
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selected.map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggle(id)}
                      className="inline-flex items-center gap-1 rounded-full bg-card px-2.5 py-1 text-xs font-medium text-foreground ring-1 ring-inset ring-border transition hover:ring-primary/50"
                      title={`Remove ${ingredientLabel(id)}`}
                    >
                      {ingredientEmoji(id)} {ingredientLabel(id)}
                      <span aria-hidden className="text-muted-foreground">
                        ×
                      </span>
                    </button>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto gap-1.5 text-muted-foreground"
                  onClick={clearAll}
                >
                  <RotateCcw className="size-3.5" /> Clear all
                </Button>
              </div>
            )}
          </section>

          {/* ---------- Results ---------- */}
          <section
            ref={resultsRef}
            className="min-w-0 scroll-mt-20 lg:sticky lg:top-24 lg:self-start"
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Step 2 · Your dinner
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Tonight&apos;s shortlist
            </h2>

            {/* Saved / all filter */}
            <div className="mt-5 inline-flex items-center gap-1 rounded-full border border-border bg-card p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setSavedOnly(false)}
                aria-pressed={!savedOnly}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all",
                  !savedOnly
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                All picks
              </button>
              <button
                type="button"
                onClick={() => setSavedOnly(true)}
                aria-pressed={savedOnly}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all",
                  savedOnly
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Heart className={cn("size-3.5", savedOnly && "fill-current")} />
                Saved
                {saved.length > 0 && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[11px] leading-none",
                      savedOnly
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-primary/10 text-primary",
                    )}
                  >
                    {saved.length}
                  </span>
                )}
              </button>
            </div>

            {/* Results banner */}
            <div className="relative mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-[#8a3512] p-6 text-primary-foreground shadow-lg shadow-primary/20 sm:p-7">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-4 -top-6 select-none text-[110px] leading-none opacity-15"
              >
                🍳
              </div>
              <div
                aria-hidden
                className="pointer-events-none absolute bottom-2 right-16 select-none text-5xl leading-none opacity-15"
              >
                🥑
              </div>
              {matches.length > 0 ? (
                <>
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/70">
                    Made for your pantry
                  </p>
                  <p className="mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl">
                    {matches.length === 1
                      ? "1 idea worth cooking"
                      : `${matches.length} ideas worth cooking`}
                  </p>
                  <p className="mt-1 text-sm text-primary-foreground/75">
                    Using {selected.length}{" "}
                    {selected.length === 1 ? "ingredient" : "ingredients"} you
                    already have.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/70">
                    Ready when you are
                  </p>
                  <p className="mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl">
                    Pick some ingredients to begin
                  </p>
                  <p className="mt-1 text-sm text-primary-foreground/75">
                    Start with rice, pasta, eggs or chicken — the classics
                    unlock the most recipes.
                  </p>
                </>
              )}

              <div className="mt-5 flex flex-wrap gap-2.5">
                <Button
                  variant="secondary"
                  className="gap-2 bg-primary-foreground font-semibold text-primary shadow-none hover:bg-primary-foreground/90"
                  onClick={handleSurprise}
                  disabled={matches.length === 0}
                >
                  <Shuffle className="size-4" /> Surprise me
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 border-primary-foreground/30 bg-transparent text-primary-foreground shadow-none hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  onClick={handleCopy}
                  disabled={matches.length === 0}
                >
                  <Copy className="size-4" /> Copy my picks
                </Button>
              </div>
            </div>

            {/* Recipe list */}
            <div className="mt-5 space-y-4">
              <AnimatePresence mode="popLayout">
                {visibleMatches.map((item, index) => (
                  <RecipeCard
                    key={item.recipe.id}
                    item={item}
                    index={index}
                    surprise={surpriseId === item.recipe.id}
                    saved={isSaved(item.recipe.id)}
                    onToggleSaved={handleToggleSaved}
                  />
                ))}
              </AnimatePresence>

              {savedOnly && visibleMatches.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center">
                  <p className="text-3xl">💗</p>
                  <h3 className="mt-2 font-bold">
                    {saved.length === 0
                      ? "Nothing saved yet"
                      : "No saved recipes in these picks"}
                  </h3>
                  <p className="mx-auto mt-1 max-w-xs text-sm leading-6 text-muted-foreground">
                    {saved.length === 0
                      ? "Tap the heart on any recipe to keep it here — your list is saved on this device."
                      : "None of these matches are bookmarked. Tap the heart on a recipe to save it, or flip back to all picks."}
                  </p>
                  <Button
                    className="mt-4 gap-1.5"
                    variant="outline"
                    onClick={() => setSavedOnly(false)}
                  >
                    <Heart className="size-4" /> Show all picks
                  </Button>
                </div>
              )}

              {selected.length > 0 && matches.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center">
                  <p className="text-3xl">🤔</p>
                  <h3 className="mt-2 font-bold">Nothing clicked yet</h3>
                  <p className="mx-auto mt-1 max-w-xs text-sm leading-6 text-muted-foreground">
                    Those ingredients don&apos;t overlap with our recipes yet.
                    Add a staple like rice, pasta, eggs or chicken — they
                    unlock tons of dishes.
                  </p>
                  <Button
                    className="mt-4 gap-1.5"
                    variant="outline"
                    onClick={() => {
                      const staples = PANTRY_QUICK_PICKS.filter(
                        (id) => !selected.includes(id),
                      );
                      setSelected((prev) => [...prev, ...staples]);
                    }}
                  >
                    <Sparkles className="size-4" /> Add the staples
                  </Button>
                </div>
              )}

              {selected.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center">
                  <p className="text-3xl">🍳</p>
                  <h3 className="mt-2 font-bold">Your shortlist appears here</h3>
                  <p className="mx-auto mt-1 max-w-xs text-sm leading-6 text-muted-foreground">
                    Tap 3–4 ingredients you actually have. We&apos;ll suggest
                    dishes you can cook right now.
                  </p>
                  <Button
                    className="mt-4 gap-1.5"
                    onClick={() => {
                      setSelected((prev) => [...new Set([...prev, ...PANTRY_QUICK_PICKS])]);
                      scrollToResults();
                    }}
                  >
                    <CookingPot className="size-4" /> Try the common staples
                  </Button>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Mobile floating bar */}
      {matches.length > 0 && (
        <div className="fixed inset-x-4 bottom-4 z-40 lg:hidden">
          <div className="mx-auto flex max-w-md items-center justify-between gap-3 rounded-2xl border border-border bg-card/95 p-3 pl-5 shadow-lg backdrop-blur">
            <p className="text-sm font-semibold">
              {matches.length === 1
                ? "1 idea for tonight"
                : `${matches.length} ideas for tonight`}
            </p>
            <Button size="sm" className="gap-1.5" onClick={scrollToResults}>
              See them <ArrowDown className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
