export type FactCategory =
  | "Food"
  | "Fruit"
  | "Drink"
  | "Veggie"
  | "History"
  | "Science";

export interface FoodFact {
  id: string;
  category: FactCategory;
  emoji: string;
  fact: string;
}

/** A hand-picked bank of fun, well-known food facts (food, fruit, drinks, veggies…). */
export const FOOD_FACTS: FoodFact[] = [
  {
    id: "tomato-berry",
    category: "Fruit",
    emoji: "🍅",
    fact: "Botanically, a tomato is a fruit — a berry, even. Legally? The US Supreme Court ruled it a vegetable in 1893.",
  },
  {
    id: "honey-never-spoils",
    category: "Food",
    emoji: "🍯",
    fact: "Honey never spoils. Archaeologists have eaten 3,000-year-old honey found in Egyptian tombs.",
  },
  {
    id: "carrot-original",
    category: "Veggie",
    emoji: "🥕",
    fact: "Carrots were originally purple or white. Orange ones were bred in the Netherlands in the 17th century.",
  },
  {
    id: "bananas-are-berries",
    category: "Fruit",
    emoji: "🍌",
    fact: "Bananas are berries, botanically speaking. Strawberries aren't. Botanists are chaotic like that.",
  },
  {
    id: "egg-color",
    category: "Food",
    emoji: "🥚",
    fact: "Brown and white eggs are identical inside — the shell colour comes from the hen's breed.",
  },
  {
    id: "pineapple-slow",
    category: "Fruit",
    emoji: "🍍",
    fact: "A single pineapple takes 18–24 months to grow. Good things take time.",
  },
  {
    id: "avocado-berry",
    category: "Fruit",
    emoji: "🥑",
    fact: "Avocados are berries too — and they only ripen after they're picked.",
  },
  {
    id: "popcorn-pop",
    category: "Science",
    emoji: "🍿",
    fact: "Popcorn pops because water inside the kernel flashes to steam. A kernel can leap about 3 feet.",
  },
  {
    id: "cacao-currency",
    category: "History",
    emoji: "🍫",
    fact: "The Aztecs used cacao beans as currency. A turkey cost about 100 beans.",
  },
  {
    id: "broccoli-protein",
    category: "Veggie",
    emoji: "🥦",
    fact: "By calories, broccoli packs more protein than beef steak.",
  },
  {
    id: "strawberry-seeds",
    category: "Fruit",
    emoji: "🍓",
    fact: "Strawberries are the only fruit with their seeds on the outside — about 200 of them per berry.",
  },
  {
    id: "tea-second",
    category: "Drink",
    emoji: "🍵",
    fact: "Tea is the second most-consumed drink on Earth after water.",
  },
  {
    id: "milk-adults",
    category: "Drink",
    emoji: "🥛",
    fact: "Humans are the only mammals that drink milk as adults.",
  },
  {
    id: "cheddar-top",
    category: "Food",
    emoji: "🧀",
    fact: "Cheddar is the most popular cheese in the world.",
  },
  {
    id: "navel-orange",
    category: "Fruit",
    emoji: "🍊",
    fact: "Every navel orange is a clone of one mutant tree that appeared in Brazil in the 1800s.",
  },
  {
    id: "potato-space",
    category: "Science",
    emoji: "🥔",
    fact: "Potatoes were the first vegetable grown in space, aboard the Space Shuttle Columbia in 1995.",
  },
  {
    id: "apple-floats",
    category: "Fruit",
    emoji: "🍎",
    fact: "Apples float because about 25% of their volume is air.",
  },
  {
    id: "coffee-cherry",
    category: "Drink",
    emoji: "☕",
    fact: "Coffee beans are actually the pits of a fruit — coffee cherries.",
  },
  {
    id: "rice-half",
    category: "Food",
    emoji: "🍚",
    fact: "Rice feeds more than half of the world's population.",
  },
  {
    id: "peanut-legume",
    category: "Food",
    emoji: "🥜",
    fact: "Peanuts aren't nuts — they're legumes, cousins of beans and lentils.",
  },
  {
    id: "lemon-floats",
    category: "Science",
    emoji: "🍋",
    fact: "Lemons float in water; limes sink. Different density, same citrus family.",
  },
  {
    id: "kiwi-vitamin-c",
    category: "Fruit",
    emoji: "🥝",
    fact: "One kiwi packs more vitamin C than an orange.",
  },
  {
    id: "lettuce-sunflower",
    category: "Veggie",
    emoji: "🥬",
    fact: "Lettuce is a member of the sunflower family.",
  },
  {
    id: "watermelon-water",
    category: "Fruit",
    emoji: "🍉",
    fact: "Watermelon is 92% water — a drink you have to chew.",
  },
  {
    id: "onion-tears",
    category: "Science",
    emoji: "🧅",
    fact: "Onions make you cry by releasing a gas that turns into sulfuric acid in your eyes.",
  },
  {
    id: "saffron-pricy",
    category: "History",
    emoji: "🧡",
    fact: "Saffron is the world's priciest spice — about 75,000 flowers make a single pound.",
  },
  {
    id: "salt-rock",
    category: "Science",
    emoji: "🧂",
    fact: "Salt is the only rock humans eat directly.",
  },
  {
    id: "chickens-outnumber",
    category: "Food",
    emoji: "🍗",
    fact: "There are roughly 3 chickens for every person on Earth.",
  },
  {
    id: "cucumber-water",
    category: "Veggie",
    emoji: "🥒",
    fact: "Cucumbers are 96% water — even more than watermelon.",
  },
  {
    id: "croissant-austria",
    category: "History",
    emoji: "🥐",
    fact: "The croissant was invented in Austria, not France. It's a relative of the kipferl.",
  },
  {
    id: "espresso-caffeine",
    category: "Drink",
    emoji: "☕",
    fact: "Espresso has less caffeine per cup than drip coffee — it's just more concentrated.",
  },
  {
    id: "bee-honey",
    category: "Science",
    emoji: "🐝",
    fact: "A single honeybee makes about a twelfth of a teaspoon of honey in its lifetime.",
  },
  {
    id: "ketchup-medicine",
    category: "History",
    emoji: "🍅",
    fact: "In the 1830s, ketchup was sold in American pharmacies as a medicine.",
  },
  {
    id: "lemon-tree",
    category: "Fruit",
    emoji: "🍋",
    fact: "A single lemon tree can produce more than 500 lemons a year.",
  },
];
