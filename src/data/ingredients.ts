/**
 * Canonical ingredient catalog for "What Should I Cook?".
 * Recipes reference ingredients by `id`, so every id used in recipes.ts
 * must exist here.
 */

export type IngredientCategory =
  | "Proteins"
  | "Vegetables"
  | "Dairy & eggs"
  | "Pantry"
  | "Spices"
  | "Fruits";

export interface Ingredient {
  id: string;
  label: string;
  emoji: string;
  category: IngredientCategory;
}

export const INGREDIENT_CATEGORIES: IngredientCategory[] = [
  "Proteins",
  "Vegetables",
  "Dairy & eggs",
  "Pantry",
  "Spices",
  "Fruits",
];

export const INGREDIENTS: Ingredient[] = [
  // Proteins
  { id: "chicken", label: "Chicken", emoji: "🍗", category: "Proteins" },
  { id: "ground-beef", label: "Ground beef", emoji: "🥩", category: "Proteins" },
  { id: "bacon", label: "Bacon", emoji: "🥓", category: "Proteins" },
  { id: "sausage", label: "Sausage", emoji: "🌭", category: "Proteins" },
  { id: "tuna", label: "Canned tuna", emoji: "🐟", category: "Proteins" },
  { id: "salmon", label: "Salmon", emoji: "🐟", category: "Proteins" },
  { id: "shrimp", label: "Shrimp", emoji: "🍤", category: "Proteins" },
  { id: "egg", label: "Eggs", emoji: "🥚", category: "Proteins" },
  { id: "tofu", label: "Tofu", emoji: "🧊", category: "Proteins" },
  { id: "chickpeas", label: "Chickpeas", emoji: "🫘", category: "Proteins" },
  { id: "black-beans", label: "Black beans", emoji: "🫘", category: "Proteins" },
  { id: "lentils", label: "Lentils", emoji: "🫘", category: "Proteins" },
  { id: "ham", label: "Ham", emoji: "🍖", category: "Proteins" },

  // Vegetables
  { id: "onion", label: "Onion", emoji: "🧅", category: "Vegetables" },
  { id: "garlic", label: "Garlic", emoji: "🧄", category: "Vegetables" },
  { id: "tomato", label: "Tomato", emoji: "🍅", category: "Vegetables" },
  { id: "potato", label: "Potato", emoji: "🥔", category: "Vegetables" },
  { id: "carrot", label: "Carrot", emoji: "🥕", category: "Vegetables" },
  { id: "bell-pepper", label: "Bell pepper", emoji: "🫑", category: "Vegetables" },
  { id: "spinach", label: "Spinach", emoji: "🥬", category: "Vegetables" },
  { id: "broccoli", label: "Broccoli", emoji: "🥦", category: "Vegetables" },
  { id: "zucchini", label: "Zucchini", emoji: "🥒", category: "Vegetables" },
  { id: "corn", label: "Corn", emoji: "🌽", category: "Vegetables" },
  { id: "mushroom", label: "Mushrooms", emoji: "🍄", category: "Vegetables" },
  { id: "cabbage", label: "Cabbage", emoji: "🥬", category: "Vegetables" },
  { id: "cucumber", label: "Cucumber", emoji: "🥒", category: "Vegetables" },
  { id: "avocado", label: "Avocado", emoji: "🥑", category: "Vegetables" },
  { id: "lettuce", label: "Lettuce", emoji: "🥗", category: "Vegetables" },
  { id: "celery", label: "Celery", emoji: "🥬", category: "Vegetables" },
  { id: "eggplant", label: "Eggplant", emoji: "🍆", category: "Vegetables" },
  { id: "sweet-potato", label: "Sweet potato", emoji: "🍠", category: "Vegetables" },
  { id: "cauliflower", label: "Cauliflower", emoji: "🥦", category: "Vegetables" },
  { id: "peas", label: "Peas", emoji: "🫛", category: "Vegetables" },
  { id: "green-beans", label: "Green beans", emoji: "🫛", category: "Vegetables" },

  // Dairy & eggs
  { id: "milk", label: "Milk", emoji: "🥛", category: "Dairy & eggs" },
  { id: "butter", label: "Butter", emoji: "🧈", category: "Dairy & eggs" },
  { id: "cheese", label: "Cheese", emoji: "🧀", category: "Dairy & eggs" },
  { id: "mozzarella", label: "Mozzarella", emoji: "🧀", category: "Dairy & eggs" },
  { id: "parmesan", label: "Parmesan", emoji: "🧀", category: "Dairy & eggs" },
  { id: "yogurt", label: "Yogurt", emoji: "🥛", category: "Dairy & eggs" },
  { id: "cream", label: "Cream", emoji: "🥛", category: "Dairy & eggs" },
  { id: "sour-cream", label: "Sour cream", emoji: "🥛", category: "Dairy & eggs" },

  // Pantry
  { id: "rice", label: "Rice", emoji: "🍚", category: "Pantry" },
  { id: "pasta", label: "Pasta", emoji: "🍝", category: "Pantry" },
  { id: "noodles", label: "Noodles", emoji: "🍜", category: "Pantry" },
  { id: "tortillas", label: "Tortillas", emoji: "🫓", category: "Pantry" },
  { id: "bread", label: "Bread", emoji: "🍞", category: "Pantry" },
  { id: "flour", label: "Flour", emoji: "🌾", category: "Pantry" },
  { id: "sugar", label: "Sugar", emoji: "🍬", category: "Pantry" },
  { id: "oats", label: "Oats", emoji: "🥣", category: "Pantry" },
  { id: "honey", label: "Honey", emoji: "🍯", category: "Pantry" },
  { id: "peanut-butter", label: "Peanut butter", emoji: "🥜", category: "Pantry" },
  { id: "olive-oil", label: "Olive oil", emoji: "🫒", category: "Pantry" },
  { id: "soy-sauce", label: "Soy sauce", emoji: "🍶", category: "Pantry" },
  { id: "tomato-sauce", label: "Tomato sauce", emoji: "🥫", category: "Pantry" },
  { id: "canned-tomatoes", label: "Canned tomatoes", emoji: "🥫", category: "Pantry" },
  { id: "broth", label: "Broth", emoji: "🍲", category: "Pantry" },
  { id: "vinegar", label: "Vinegar", emoji: "🍶", category: "Pantry" },
  { id: "mayo", label: "Mayonnaise", emoji: "🥫", category: "Pantry" },
  { id: "mustard", label: "Mustard", emoji: "🟡", category: "Pantry" },
  { id: "ketchup", label: "Ketchup", emoji: "🍅", category: "Pantry" },
  { id: "cocoa", label: "Cocoa powder", emoji: "🍫", category: "Pantry" },
  { id: "maple-syrup", label: "Maple syrup", emoji: "🍁", category: "Pantry" },

  // Spices
  { id: "paprika", label: "Paprika", emoji: "🌶️", category: "Spices" },
  { id: "cumin", label: "Cumin", emoji: "✨", category: "Spices" },
  { id: "chili-powder", label: "Chili powder", emoji: "🌶️", category: "Spices" },
  { id: "oregano", label: "Oregano", emoji: "🌿", category: "Spices" },
  { id: "basil", label: "Basil", emoji: "🌿", category: "Spices" },
  { id: "curry-powder", label: "Curry powder", emoji: "🍛", category: "Spices" },
  { id: "ginger", label: "Ginger", emoji: "🫚", category: "Spices" },
  { id: "cinnamon", label: "Cinnamon", emoji: "🟤", category: "Spices" },
  { id: "turmeric", label: "Turmeric", emoji: "🟡", category: "Spices" },

  // Fruits
  { id: "banana", label: "Banana", emoji: "🍌", category: "Fruits" },
  { id: "apple", label: "Apple", emoji: "🍎", category: "Fruits" },
  { id: "lemon", label: "Lemon", emoji: "🍋", category: "Fruits" },
  { id: "lime", label: "Lime", emoji: "🍋‍🟩", category: "Fruits" },
  { id: "orange", label: "Orange", emoji: "🍊", category: "Fruits" },
  { id: "berries", label: "Berries", emoji: "🫐", category: "Fruits" },
  { id: "pineapple", label: "Pineapple", emoji: "🍍", category: "Fruits" },
];

export const INGREDIENT_BY_ID: Record<string, Ingredient> = Object.fromEntries(
  INGREDIENTS.map((ingredient) => [ingredient.id, ingredient]),
);

/** Ingredients that make almost every recipe work — one-tap shortcuts. */
export const PANTRY_QUICK_PICKS: string[] = [
  "rice",
  "pasta",
  "egg",
  "onion",
  "garlic",
  "tomato",
  "cheese",
  "chicken",
  "canned-tomatoes",
  "soy-sauce",
];
