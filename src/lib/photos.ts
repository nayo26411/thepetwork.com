/**
 * Warm lifestyle photography (free Unsplash images) used across the directory.
 * Photos are picked deterministically per item id so a card always shows the same image.
 */
import type { Category } from "@/data/locations";
import type { RecipeSpecies } from "@/data/recipes";

const BASE = "https://images.unsplash.com/";

function url(id: string, w = 800) {
  return `${BASE}${id}?auto=format&fit=crop&w=${w}&q=70`;
}

function pick(pool: string[], seed: string, w?: number) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return url(pool[h % pool.length]!, w);
}

const PLACE_POOLS: Record<Category, string[]> = {
  "Veterinary Clinic": [
    "photo-1583337130417-3346a1be7dee",
    "photo-1596492784531-6e6eb5ea9993",
    "photo-1559715745-e1b33a271c8f",
    "photo-1591946614720-90a587da4a36",
  ],
  "Grooming Salon": [
    "photo-1516734212186-a967f81ad0d7",
    "photo-1560807707-8cc77767d783",
    "photo-1583511655857-d19b40a7a54e",
    "photo-1587764379873-97837921fd44",
  ],
  "Pet Store": [
    "photo-1601758228041-f3b2795255f1",
    "photo-1568640347023-a616a30bc3bd",
    "photo-1607623814075-e51df1bdc82f",
    "photo-1543852786-1cf6624b9987",
  ],
  "Pet Friendly Cafe": [
    "photo-1554118811-1e0d58224f24",
    "photo-1501339847302-ac426a4a7cbb",
    "photo-1445116572660-236099ec97a0",
    "photo-1559925393-8be0ec4767c8",
  ],
  "Pet Friendly Hotel": [
    "photo-1566073771259-6a8506099945",
    "photo-1611892440504-42a792e24d32",
    "photo-1590490360182-c33d57733427",
    "photo-1445019980597-93fa8acb246c",
  ],
  "Off Leash Park": [
    "photo-1519331379826-f10be5486c6f",
    "photo-1441974231531-c6227db76b6e",
    "photo-1552083375-1447ce886485",
    "photo-1518717758536-85ae29035b6d",
  ],
};

const RECIPE_POOLS: Record<RecipeSpecies, string[]> = {
  Dogs: [
    "photo-1558961363-fa8fdf82db35",
    "photo-1590080875515-8a3a8dc5735e",
    "photo-1587049352846-4a222e784d38",
    "photo-1607301405390-d831c242f59b",
    "photo-1490645935967-10de6ba17061",
  ],
  Cats: [
    "photo-1548681528-6a5c45b66b42",
    "photo-1519708227418-c8fd9a32b7a2",
    "photo-1606787366850-de6330128bfc",
    "photo-1504674900247-0877df9cc836",
  ],
  Birds: [
    "photo-1452570053594-1b985d6ea890",
    "photo-1444212477490-ca407925329e",
    "photo-1490474418585-ba9bad8fd0ea",
  ],
  Rabbits: [
    "photo-1585110396000-c9ffd4e4b308",
    "photo-1591382386627-349b692688ff",
    "photo-1512058564366-18510be2db19",
  ],
  Fish: ["photo-1520302630591-fd1c66edc19d", "photo-1522069169874-c58ec4b76be5"],
  Reptiles: ["photo-1504450758481-7338eba7524a", "photo-1531386151447-fd76ad50012f"],
  "Small Pets": [
    "photo-1563379091339-03b21ab4a4f8",
    "photo-1591382386627-349b692688ff",
    "photo-1476718406336-bb5a9690ee2a",
  ],
};

/** Photo for a mapped place, chosen from its category pool. */
export function placePhoto(id: string, category: Category, w?: number) {
  return pick(PLACE_POOLS[category], id, w);
}

/** Appetising photo for a recipe card, chosen from its species pool. */
export function recipePhoto(id: string, species: RecipeSpecies, w?: number) {
  return pick(RECIPE_POOLS[species], id, w);
}
