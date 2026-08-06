import { RECIPES, ingredientLabel, type Recipe } from "@/data/recipes";

export interface ScoredRecipe {
  recipe: Recipe;
  matched: string[];
  missing: string[];
  /** Higher = better fit for the user's pantry. */
  score: number;
}

/**
 * Rank recipes by how well they fit the ingredients the user has.
 * Favours recipes that use a high proportion of their ingredients
 * (so picking 3–4 things still surfaces genuinely cookable dishes).
 */
export function findRecipes(selectedIds: Set<string>, limit = 5): ScoredRecipe[] {
  if (selectedIds.size === 0) return [];

  const scored: ScoredRecipe[] = RECIPES.map((recipe) => {
    const matched = recipe.ingredients.filter((id) => selectedIds.has(id));
    const coverage = matched.length / recipe.ingredients.length;
    // Coverage first, then absolute match count, then quickest wins.
    const score = coverage * 100 + matched.length * 2;

    // A recipe is cookable if it uses a meaningful share of what you have:
    // at least 2 matches, or a single match on a very small recipe.
    const qualifies =
      matched.length >= 2 || (matched.length === 1 && recipe.ingredients.length <= 3);

    return {
      recipe,
      matched,
      missing: recipe.ingredients.filter((id) => !selectedIds.has(id)),
      score: qualifies ? score : -1,
    };
  });

  return scored
    .filter((s) => s.score >= 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.recipe.timeMinutes - b.recipe.timeMinutes ||
        a.recipe.name.localeCompare(b.recipe.name),
    )
    .slice(0, limit);
}

/** Pick a random cookable recipe from the current matches. */
export function surpriseMe(selectedIds: Set<string>): ScoredRecipe | null {
  const matches = findRecipes(selectedIds, RECIPES.length);
  if (matches.length === 0) return null;
  return matches[Math.floor(Math.random() * matches.length)];
}

/** Build a clean, shareable text summary of the picks (great for group chats). */
export function buildShareText(
  matches: ScoredRecipe[],
  selectedLabels: string[],
): string {
  if (matches.length === 0) return "";

  const lines: string[] = ["🥘 What should I cook? Here's my shortlist:"];
  matches.forEach(({ recipe, matched }, index) => {
    const used = matched.map(ingredientLabel).join(", ");
    lines.push(
      `${index + 1}. ${recipe.emoji} ${recipe.name} — ${recipe.timeMinutes} min · ${recipe.difficulty}`,
    );
    lines.push(`   ${recipe.description}`);
    if (used) lines.push(`   ✅ I already have: ${used}`);
  });
  lines.push("");
  lines.push("Made with What Should I Cook? 🍳");

  if (selectedLabels.length > 0) {
    lines.push(`My ingredients: ${selectedLabels.join(", ")}`);
  }

  return lines.join("\n");
}
