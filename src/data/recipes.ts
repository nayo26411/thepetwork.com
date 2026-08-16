export type RecipeSpecies =
  | "Dogs"
  | "Cats"
  | "Birds"
  | "Rabbits"
  | "Fish"
  | "Reptiles"
  | "Small Pets";

export type Recipe = {
  id: string;
  name: string;
  species: RecipeSpecies;
  time: string;
  diet: string;
  vetApproved: boolean;
  summary: string;
  ingredients: string[];
  instructions: string[];
  avoid: string[];
  sourceName: string;
  sourceUrl: string;
};

export const RECIPE_SPECIES: RecipeSpecies[] = [
  "Dogs",
  "Cats",
  "Birds",
  "Rabbits",
  "Fish",
  "Reptiles",
  "Small Pets",
];

export const RECIPES: Recipe[] = [
  // ================= DOGS =================
  {
    id: "dog-peanut-banana-treats",
    name: "Peanut Butter & Banana Treats",
    species: "Dogs",
    time: "10 min prep · 20 min bake",
    diet: "Baked treat",
    vetApproved: true,
    summary:
      "A three-ingredient baked biscuit built on the classic peanut butter and banana combination, using only foods the AKC lists as safe for dogs.",
    ingredients: [
      "1 ripe banana, mashed",
      "1/2 cup xylitol-free natural peanut butter",
      "1 1/2 cups whole wheat or oat flour",
      "1/4 cup water, as needed",
    ],
    instructions: [
      "Heat the oven to 180°C (350°F) and line a tray with baking paper.",
      "Mash the banana, then mix in the peanut butter until smooth.",
      "Fold in the flour a little at a time, adding water until a stiff dough forms.",
      "Roll to 1 cm thick, cut into small shapes and bake 18–20 minutes until firm.",
      "Cool completely. Keep refrigerated and use within one week.",
    ],
    avoid: [
      "Xylitol (birch sugar) in peanut butter — fatal to dogs even in tiny amounts",
      "Chocolate, raisins, macadamia nuts",
      "Added salt, sugar or honey",
    ],
    sourceName: "American Kennel Club — Dog Nutrition",
    sourceUrl: "https://www.akc.org/expert-advice/nutrition/",
  },
  {
    id: "dog-sweet-potato-chicken-bowl",
    name: "Sweet Potato Chicken Bowl",
    species: "Dogs",
    time: "35 min",
    diet: "Balanced meal",
    vetApproved: true,
    summary:
      "A cooked whole-food bowl of lean chicken, sweet potato and green beans, following AKC guidance on balanced homemade dog food.",
    ingredients: [
      "500 g boneless skinless chicken, diced",
      "2 medium sweet potatoes, peeled and cubed",
      "1 cup green beans, chopped",
      "1 tbsp fish or flaxseed oil",
      "Vet-prescribed calcium and multivitamin supplement",
    ],
    instructions: [
      "Boil the chicken in plain water until cooked through, no salt or masala.",
      "Steam or boil the sweet potato and green beans until soft.",
      "Combine, mash lightly and let it cool to room temperature.",
      "Stir in the oil and the supplement your vet has prescribed for your dog's weight.",
      "Portion into daily servings; refrigerate 3 days or freeze up to 2 months.",
    ],
    avoid: [
      "Onion, garlic and all Indian tadka spices",
      "Cooked bones of any kind",
      "Feeding long term without a vet-prescribed calcium and vitamin supplement",
    ],
    sourceName: "American Kennel Club — Homemade Dog Food",
    sourceUrl: "https://www.akc.org/expert-advice/nutrition/homemade-dog-food/",
  },
  {
    id: "dog-frozen-yogurt-pupsicles",
    name: "Frozen Yogurt Pupsicles",
    species: "Dogs",
    time: "5 min + 4 hr freeze",
    diet: "Summer treat",
    vetApproved: true,
    summary:
      "A cooling summer treat of plain curd and dog-safe fruit, portioned small so it stays an occasional snack rather than a meal.",
    ingredients: [
      "1 cup plain unsweetened curd or Greek yogurt",
      "1/2 cup mashed banana or seedless watermelon",
      "1 tbsp xylitol-free peanut butter (optional)",
    ],
    instructions: [
      "Blend the curd with the fruit until smooth.",
      "Spoon into silicone moulds or an ice tray.",
      "Freeze at least 4 hours until solid.",
      "Serve one small pupsicle on a hot afternoon, outdoors or on a washable floor.",
    ],
    avoid: [
      "Grapes, raisins and any sweetened yogurt",
      "Xylitol-sweetened peanut butter",
      "Large portions for lactose-sensitive dogs — start with a teaspoon",
    ],
    sourceName: "American Kennel Club — Dog Nutrition",
    sourceUrl: "https://www.akc.org/expert-advice/nutrition/",
  },
  {
    id: "dog-oats-blueberry-biscuits",
    name: "Oats & Blueberry Biscuits",
    species: "Dogs",
    time: "15 min prep · 25 min bake",
    diet: "Baked treat",
    vetApproved: true,
    summary:
      "Antioxidant-rich blueberries folded into a simple oat dough, based on PetMD's guidance on fruit that is safe for dogs.",
    ingredients: [
      "2 cups rolled oats, ground into flour",
      "1/2 cup fresh or frozen blueberries",
      "2 eggs",
      "1/4 cup plain unsweetened applesauce",
    ],
    instructions: [
      "Preheat the oven to 175°C (350°F) and line a baking tray.",
      "Whisk the eggs with the applesauce, then stir in the oat flour to form a dough.",
      "Fold in the blueberries gently so they don't burst completely.",
      "Roll out and cut into shapes, bake 22–25 minutes until golden and firm.",
      "Cool fully before serving; store in an airtight container for up to a week.",
    ],
    avoid: [
      "Grapes and raisins — never substitute these for blueberries",
      "Any sweetened or flavoured applesauce with added sugar",
      "Nutmeg or other baking spices toxic to dogs",
    ],
    sourceName: "PetMD — Dog Nutrition",
    sourceUrl: "https://www.petmd.com/dog/nutrition",
  },
  {
    id: "dog-carrot-apple-bites",
    name: "Carrot & Apple Snack Bites",
    species: "Dogs",
    time: "10 min prep · 20 min bake",
    diet: "Baked treat",
    vetApproved: true,
    summary:
      "A crunchy, low-calorie snack combining grated carrot and apple, both listed by the AKC as safe fruit and vegetable choices for dogs.",
    ingredients: [
      "1 cup grated carrot",
      "1 cup grated apple, seeds and core removed",
      "1 1/2 cups whole wheat flour",
      "2 eggs",
    ],
    instructions: [
      "Preheat oven to 180°C (350°F).",
      "Mix the grated carrot and apple with the eggs.",
      "Stir in the flour until a firm dough forms.",
      "Shape into small bite-sized discs and place on a lined tray.",
      "Bake 18–20 minutes until firm and lightly golden; cool before serving.",
    ],
    avoid: [
      "Apple seeds and core — contain trace cyanide compounds",
      "Added sugar or cinnamon-sugar coatings",
      "Large chunks that could be a choking hazard for small dogs",
    ],
    sourceName: "American Kennel Club — Fruits and Vegetables Dogs Can Eat",
    sourceUrl: "https://www.akc.org/expert-advice/nutrition/fruits-vegetables-dogs-can-eat/",
  },
  {
    id: "dog-turmeric-golden-paste",
    name: "Turmeric Golden Paste",
    species: "Dogs",
    time: "10 min",
    diet: "Supplement",
    vetApproved: true,
    summary:
      "A gently cooked turmeric, black pepper and coconut oil paste used as a small daily topper for joint and general wellness support, based on VCA Hospitals' guidance on turmeric use in dogs.",
    ingredients: [
      "1/2 cup turmeric powder",
      "1 cup water",
      "1/4 cup coconut oil",
      "1 1/2 tsp freshly ground black pepper",
    ],
    instructions: [
      "Whisk turmeric and water in a saucepan and simmer on low for 7–10 minutes to form a thick paste, adding water if it dries out.",
      "Remove from heat and stir in the coconut oil and black pepper.",
      "Cool and store in a sealed jar in the fridge for up to two weeks.",
      "Start with 1/8 teaspoon mixed into food daily and increase slowly only as your vet advises.",
    ],
    avoid: [
      "Large doses without vet guidance — turmeric can affect dogs on blood-thinning medication",
      "Using in dogs with a history of pancreatitis without checking with a vet first",
      "Feeding raw, uncooked turmeric powder in large amounts",
    ],
    sourceName: "VCA Animal Hospitals — Turmeric and Dogs",
    sourceUrl: "https://vcahospitals.com/know-your-pet/turmeric-and-dogs",
  },
  {
    id: "dog-watermelon-ice-cubes",
    name: "Watermelon Ice Cubes",
    species: "Dogs",
    time: "5 min + 3 hr freeze",
    diet: "Summer treat",
    vetApproved: true,
    summary:
      "Seedless watermelon puree frozen into small cubes — a hydrating, low-calorie way to cool dogs down in Delhi's summer heat.",
    ingredients: [
      "2 cups seedless watermelon flesh, cubed",
      "1/4 cup water",
    ],
    instructions: [
      "Blend the watermelon flesh with water until smooth.",
      "Pour into a small ice cube tray.",
      "Freeze for at least 3 hours until solid.",
      "Pop out one or two cubes as an occasional hot-weather treat.",
    ],
    avoid: [
      "Watermelon rind and seeds — can cause intestinal blockage",
      "Feeding more than a cube or two at a time; too much can cause loose stools",
    ],
    sourceName: "American Kennel Club — Fruits and Vegetables Dogs Can Eat",
    sourceUrl: "https://www.akc.org/expert-advice/nutrition/fruits-vegetables-dogs-can-eat/",
  },
  {
    id: "dog-chicken-rice-recovery",
    name: "Chicken & Brown Rice Recovery Meal",
    species: "Dogs",
    time: "30 min",
    diet: "Bland diet",
    vetApproved: true,
    summary:
      "A gentle bland meal of boiled chicken and rice that vets commonly recommend short-term for dogs recovering from an upset stomach.",
    ingredients: [
      "2 boneless, skinless chicken breasts",
      "1 cup brown or white rice",
      "3 cups plain water",
    ],
    instructions: [
      "Boil the chicken in plain water until fully cooked, then shred it finely.",
      "Cook the rice separately in plain water until very soft.",
      "Mix chicken and rice in a roughly 1:2 ratio and let cool to room temperature.",
      "Offer small portions every few hours rather than one large meal, and return to regular food gradually as your vet advises.",
    ],
    avoid: [
      "Any salt, oil, butter or seasoning in the boiling water",
      "Continuing a bland diet for more than 2–3 days without vet input",
      "Skin and bones from the chicken",
    ],
    sourceName: "VCA Animal Hospitals — Bland Diet for Dogs",
    sourceUrl: "https://vcahospitals.com/know-your-pet/bland-diet-for-dogs",
  },
  {
    id: "dog-pumpkin-digestive-cookies",
    name: "Pumpkin Digestive Cookies",
    species: "Dogs",
    time: "15 min prep · 20 min bake",
    diet: "Baked treat",
    vetApproved: true,
    summary:
      "Plain pumpkin puree is a well-known fibre source for dogs with sensitive digestion, baked here into a simple crunchy cookie.",
    ingredients: [
      "1 cup plain pumpkin puree (not pie filling)",
      "2 eggs",
      "2 cups whole wheat flour",
      "1 tsp ground cinnamon (small amount, optional)",
    ],
    instructions: [
      "Preheat oven to 180°C (350°F) and line a tray.",
      "Whisk the pumpkin puree with the eggs.",
      "Stir in the flour and cinnamon until a firm dough forms.",
      "Roll out, cut into shapes, and bake 18–20 minutes until firm.",
      "Cool fully before serving; refrigerate up to a week.",
    ],
    avoid: [
      "Canned pumpkin pie filling, which contains added sugar and spices like nutmeg",
      "Large amounts of cinnamon",
      "Pumpkin stems, leaves or vines",
    ],
    sourceName: "PetMD — Can Dogs Eat Pumpkin?",
    sourceUrl: "https://www.petmd.com/dog/nutrition/can-dogs-eat-pumpkin",
  },
  {
    id: "dog-egg-spinach-breakfast",
    name: "Egg & Spinach Breakfast Bowl",
    species: "Dogs",
    time: "10 min",
    diet: "Balanced meal",
    vetApproved: true,
    summary:
      "A quick scrambled egg and spinach bowl offering easily digestible protein and iron, based on AKC advice on eggs as a safe dog food.",
    ingredients: [
      "2 eggs",
      "1/2 cup fresh spinach, finely chopped",
      "1 tsp olive oil",
    ],
    instructions: [
      "Heat the olive oil in a pan over low heat.",
      "Add the spinach and wilt for a minute.",
      "Add the beaten eggs and scramble until fully cooked, with no runny egg remaining.",
      "Cool to room temperature before serving as a topper or occasional small meal.",
    ],
    avoid: [
      "Salt, pepper, butter or any seasoning",
      "Raw or undercooked egg, which carries a salmonella risk",
      "Large regular servings of spinach due to its oxalate content",
    ],
    sourceName: "American Kennel Club — Can Dogs Eat Eggs?",
    sourceUrl: "https://www.akc.org/expert-advice/nutrition/can-dogs-eat-eggs/",
  },
  {
    id: "dog-homemade-bone-broth",
    name: "Homemade Bone Broth",
    species: "Dogs",
    time: "4 hr simmer",
    diet: "Hydration",
    vetApproved: true,
    summary:
      "A long-simmered, unsalted bone broth that adds moisture, flavour and gentle nutrition to a dog's regular food, especially useful for fussy eaters or seniors.",
    ingredients: [
      "1 kg raw chicken or beef bones (from a butcher, not cooked leftovers)",
      "Water to cover",
      "1 tbsp apple cider vinegar",
    ],
    instructions: [
      "Place the bones in a large pot and cover with water, adding the vinegar to help draw out nutrients.",
      "Bring to a simmer and cook on very low heat for 4 hours, skimming any foam.",
      "Strain out all bones and bone fragments completely.",
      "Cool, then refrigerate; skim off solid fat before serving as a topper.",
    ],
    avoid: [
      "Cooked bones left in the broth or given whole — they splinter easily",
      "Onion, garlic or bouillon cubes",
      "Serving while still hot",
    ],
    sourceName: "AKC — Bone Broth for Dogs",
    sourceUrl: "https://www.akc.org/expert-advice/nutrition/bone-broth-for-dogs/",
  },
  {
    id: "dog-coconut-oil-fur-treats",
    name: "Coconut Oil Fur Treats",
    species: "Dogs",
    time: "10 min prep · 1 hr freeze",
    diet: "Skin & coat",
    vetApproved: true,
    summary:
      "A simple frozen coconut oil treat used in small amounts to support skin and coat health, based on AKC's guidance on coconut oil for dogs.",
    ingredients: [
      "1/2 cup melted virgin coconut oil",
      "2 tbsp plain unsweetened peanut butter (xylitol-free)",
      "Small silicone treat moulds",
    ],
    instructions: [
      "Melt the coconut oil gently and stir in the peanut butter until smooth.",
      "Pour into small silicone moulds.",
      "Freeze for at least an hour until solid.",
      "Offer one small treat at a time; too much coconut oil can upset a dog's stomach.",
    ],
    avoid: [
      "Feeding large quantities — coconut oil is high in saturated fat",
      "Xylitol-containing peanut butter",
      "Daily use without checking total calorie intake with your vet",
    ],
    sourceName: "American Kennel Club — Coconut Oil for Dogs",
    sourceUrl: "https://www.akc.org/expert-advice/nutrition/coconut-oil-for-dogs/",
  },

  // ================= CATS =================
  {
    id: "cat-tuna-rice",
    name: "Tuna & Rice Wet Food",
    species: "Cats",
    time: "20 min",
    diet: "High protein",
    vetApproved: true,
    summary:
      "A plain cooked topper of water-packed tuna and soft rice. Cats are obligate carnivores, so this is an occasional bowl alongside a complete diet — never a full-time replacement.",
    ingredients: [
      "1 tin water-packed tuna, no salt, drained",
      "1/4 cup well-cooked plain rice",
      "1 tbsp cooked and flaked white fish or boiled chicken",
      "Vet-recommended taurine supplement",
    ],
    instructions: [
      "Flake the tuna finely and check carefully for bones.",
      "Mix with the cooled rice and the extra cooked protein.",
      "Stir in the taurine supplement at the dose your vet advises.",
      "Serve at room temperature; refrigerate leftovers and use within 24 hours.",
    ],
    avoid: [
      "Onion, garlic, chives and leeks — toxic to cats",
      "Cow's milk, which most adult cats cannot digest",
      "Brine or oil-packed tuna, and any added salt",
    ],
    sourceName: "Cornell Feline Health Center — Feeding Your Cat",
    sourceUrl:
      "https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/feeding-your-cat",
  },
  {
    id: "cat-chicken-broth-ice-cubes",
    name: "Chicken Broth Ice Cubes",
    species: "Cats",
    time: "25 min + freeze",
    diet: "Hydration",
    vetApproved: true,
    summary:
      "Cats drink far too little water. Unsalted homemade chicken broth frozen into cubes is a simple way to add moisture during a Delhi summer.",
    ingredients: [
      "2 boneless chicken thighs or breast pieces",
      "4 cups plain water",
      "Nothing else — no salt, no stock cube, no aromatics",
    ],
    instructions: [
      "Simmer the chicken in plain water for 20 minutes.",
      "Remove the chicken (use it in another meal) and strain the broth.",
      "Cool fully, skim off the fat and pour into an ice tray.",
      "Drop one cube into the water bowl or over food on hot days.",
    ],
    avoid: [
      "Shop-bought stock cubes — almost all contain onion, garlic and heavy salt",
      "Bones left in the broth",
      "Serving frozen cubes whole to kittens or senior cats; melt them first",
    ],
    sourceName: "PetMD — Cat Nutrition",
    sourceUrl: "https://www.petmd.com/cat/nutrition",
  },
  {
    id: "cat-salmon-oat-treats",
    name: "Salmon & Oat Treats",
    species: "Cats",
    time: "10 min prep · 15 min bake",
    diet: "Baked treat",
    vetApproved: true,
    summary:
      "Small baked bites of cooked salmon and egg, rich in omega-3 for coat health. Treats should stay under 10% of your cat's daily calories.",
    ingredients: [
      "1 tin cooked salmon in water, drained and deboned",
      "1 egg, beaten",
      "1/2 cup oat flour",
      "1 tsp catnip (optional)",
    ],
    instructions: [
      "Heat the oven to 180°C (350°F).",
      "Mash the salmon, mix in the egg, then add the flour to make a thick paste.",
      "Roll into pea-sized balls and flatten on a lined tray.",
      "Bake 12–15 minutes until firm, cool completely before serving.",
      "Store refrigerated for up to five days.",
    ],
    avoid: [
      "Raw salmon and raw egg",
      "Onion or garlic powder in any flavouring",
      "Salt-cured or smoked fish",
    ],
    sourceName: "Cornell Feline Health Center",
    sourceUrl:
      "https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center",
  },
  {
    id: "cat-sardine-paste-bites",
    name: "Sardine Paste Bites",
    species: "Cats",
    time: "10 min",
    diet: "High protein",
    vetApproved: true,
    summary:
      "Mashed sardines packed in water make a naturally taurine- and omega-3-rich paste that most cats find irresistible, used here as an occasional topper.",
    ingredients: [
      "2 tins sardines in water, no salt added, drained",
      "1 tbsp plain cooked pumpkin puree",
    ],
    instructions: [
      "Mash the sardines thoroughly with a fork, checking for larger bones.",
      "Mix in the pumpkin puree until a smooth paste forms.",
      "Serve a teaspoon as a topper over regular food.",
      "Refrigerate leftovers in a sealed container for up to two days.",
    ],
    avoid: [
      "Sardines in oil, brine or tomato sauce",
      "Feeding as a daily main meal — it is not nutritionally complete on its own",
      "Any added salt or garlic seasoning",
    ],
    sourceName: "PetMD — Cat Nutrition",
    sourceUrl: "https://www.petmd.com/cat/nutrition",
  },
  {
    id: "cat-chicken-liver-bites",
    name: "Chicken Liver Bites",
    species: "Cats",
    time: "20 min",
    diet: "High protein",
    vetApproved: true,
    summary:
      "Lightly cooked chicken liver, an excellent source of vitamin A and iron for cats, served in small amounts as an occasional treat rather than a regular meal.",
    ingredients: [
      "150 g chicken liver",
      "1 cup plain water for poaching",
    ],
    instructions: [
      "Rinse the liver and poach gently in plain water for 8–10 minutes until fully cooked through.",
      "Cool and cut into small, cat-sized cubes.",
      "Serve one or two small pieces as an occasional treat.",
      "Refrigerate leftovers and use within two days.",
    ],
    avoid: [
      "Feeding liver too often — excess vitamin A can be harmful over time",
      "Raw liver, which carries a bacterial risk",
      "Any seasoning, oil or butter used in cooking",
    ],
    sourceName: "Cornell Feline Health Center — Feeding Your Cat",
    sourceUrl:
      "https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/feeding-your-cat",
  },
  {
    id: "cat-homemade-kitten-mush",
    name: "Homemade Kitten Mush",
    species: "Cats",
    time: "15 min",
    diet: "Weaning meal",
    vetApproved: true,
    summary:
      "A soft, easy-to-eat mush used to help wean kittens onto solid food, combining kitten formula with a smooth protein base as advised by vets.",
    ingredients: [
      "1/4 cup kitten milk replacer, prepared as per label",
      "2 tbsp plain cooked and finely mashed chicken or kitten wet food",
    ],
    instructions: [
      "Prepare the kitten milk replacer according to the packet instructions.",
      "Mix in the mashed chicken or wet food until a soft, spoonable consistency forms.",
      "Warm slightly to just above room temperature and test on your wrist before serving.",
      "Offer in a shallow dish and supervise closely; discard any leftovers after each feeding.",
    ],
    avoid: [
      "Cow's milk in place of a proper kitten milk replacer",
      "Adult cat food or seasoned human food",
      "Feeding cold or too hot; always test temperature first",
    ],
    sourceName: "Cornell Feline Health Center — Feeding Your Cat",
    sourceUrl:
      "https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/feeding-your-cat",
  },
  {
    id: "cat-catnip-tea-ice-cubes",
    name: "Catnip Tea Ice Cubes",
    species: "Cats",
    time: "10 min + freeze",
    diet: "Enrichment",
    vetApproved: true,
    summary:
      "A gentle catnip infusion frozen into small cubes for enrichment play — not a food, but a safe occasional treat used by many cat behaviourists.",
    ingredients: [
      "1 tbsp dried catnip",
      "1 cup hot water",
    ],
    instructions: [
      "Steep the catnip in hot water for 10 minutes like a tea, then strain.",
      "Let the liquid cool completely.",
      "Pour into an ice cube tray and freeze until solid.",
      "Offer one cube in a shallow dish under supervision as enrichment, not as a food source.",
    ],
    avoid: [
      "Sweetened tea or any added sugar",
      "Giving to kittens under three months, who typically don't respond to catnip yet",
      "Leaving ice unsupervised where it could be a slipping or choking hazard",
    ],
    sourceName: "Cornell Feline Health Center",
    sourceUrl:
      "https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center",
  },
  {
    id: "cat-turkey-pea-stew",
    name: "Turkey & Pea Stew",
    species: "Cats",
    time: "25 min",
    diet: "Balanced meal",
    vetApproved: true,
    summary:
      "A soft, protein-forward stew of turkey and peas that can be used as an occasional topper alongside a nutritionally complete commercial diet.",
    ingredients: [
      "200 g ground or diced turkey",
      "2 tbsp cooked and mashed peas",
      "1/2 cup plain water",
      "Vet-recommended taurine supplement",
    ],
    instructions: [
      "Cook the turkey through in plain water with no seasoning.",
      "Mash in the cooked peas until the mixture is soft and easy to eat.",
      "Stir in the taurine supplement as advised by your vet.",
      "Cool to room temperature and serve; refrigerate leftovers for up to 2 days.",
    ],
    avoid: [
      "Onion or garlic powder often found in seasoned deli turkey",
      "Skin, bones or fatty trimmings",
      "Feeding as a sole long-term diet without veterinary nutritional balancing",
    ],
    sourceName: "PetMD — Cat Nutrition",
    sourceUrl: "https://www.petmd.com/cat/nutrition",
  },

  // ================= BIRDS =================
  {
    id: "bird-birdie-bread",
    name: "Birdie Bread with Vegetables",
    species: "Birds",
    time: "15 min prep · 30 min bake",
    diet: "Baked treat",
    vetApproved: true,
    summary:
      "A savoury cornbread-style bake loaded with vegetables, a popular Lafeber-style recipe used to encourage picky parrots to try new foods.",
    ingredients: [
      "1 box cornbread mix (or 1 cup cornmeal + 1 cup flour)",
      "2 eggs, shell included and well washed, or an egg substitute",
      "1/2 cup mixed grated carrot, pumpkin and peas",
      "1/2 cup water or unsweetened apple juice",
    ],
    instructions: [
      "Preheat the oven to 180°C (350°F) and grease a small baking dish.",
      "Mix the cornbread base with the eggs and liquid as per packet directions.",
      "Fold in the grated vegetables.",
      "Pour into the dish and bake 25–30 minutes until a skewer comes out clean.",
      "Cool completely, cut into small cubes and serve; freeze extra portions.",
    ],
    avoid: [
      "Avocado, chocolate and caffeine — all toxic to birds",
      "Salted or seasoned cornbread mixes",
      "Onion and garlic in any added vegetables",
    ],
    sourceName: "Lafeber Company — Bird Recipes",
    sourceUrl: "https://lafeber.com/pet-birds/category/recipes/",
  },
  {
    id: "bird-fruit-seed-salad",
    name: "Fruit & Seed Salad",
    species: "Birds",
    time: "10 min",
    diet: "Fresh salad",
    vetApproved: true,
    summary:
      "A fresh, colourful mix of bird-safe fruit and sprouted seed intended to supplement a pelleted diet, based on Lafeber's fresh-food guidance.",
    ingredients: [
      "1/2 apple, seeds removed, diced",
      "1/4 cup diced papaya or mango",
      "2 tbsp cooked quinoa or sprouted seed mix",
      "1 tbsp finely chopped leafy greens (spinach or kale in moderation)",
    ],
    instructions: [
      "Wash all fruit and greens thoroughly.",
      "Dice everything into bird-appropriate small pieces for the species you keep.",
      "Toss together in a small bowl.",
      "Offer fresh and remove any uneaten portion within a couple of hours to avoid spoilage.",
    ],
    avoid: [
      "Apple, pear and stone fruit seeds/pits — contain cyanogenic compounds",
      "Avocado in any amount",
      "Any fruit showing mould or spoilage",
    ],
    sourceName: "Lafeber Company — Feeding Your Pet Bird",
    sourceUrl: "https://lafeber.com/pet-birds/feeding-your-pet-bird/",
  },
  {
    id: "bird-egg-food-mix",
    name: "Egg Food Mix for Breeding Birds",
    species: "Birds",
    time: "15 min",
    diet: "Breeding support",
    vetApproved: true,
    summary:
      "A protein-rich boiled egg mash commonly recommended for breeding or moulting birds needing extra protein, based on Lafeber's breeding season guidance.",
    ingredients: [
      "2 hard-boiled eggs, shell included, finely chopped",
      "2 tbsp wholegrain breadcrumbs or crushed wholegrain crackers",
      "1 tbsp grated carrot",
    ],
    instructions: [
      "Hard boil the eggs for 10 minutes, then cool and chop finely, shell included for extra calcium.",
      "Mix with the breadcrumbs and grated carrot.",
      "Serve fresh in a clean dish.",
      "Discard any leftovers after 2 hours, especially in warm weather.",
    ],
    avoid: [
      "Leaving egg food out for more than a couple of hours — it spoils quickly",
      "Salted crackers or bread",
      "Feeding as the only food; it is a supplement, not a complete diet",
    ],
    sourceName: "Lafeber Company — Breeding Season Nutrition",
    sourceUrl: "https://lafeber.com/pet-birds/category/recipes/",
  },
  {
    id: "bird-sprout-mix-guide",
    name: "Sprout Mix Guide",
    species: "Birds",
    time: "3–5 days sprouting",
    diet: "Fresh sprouts",
    vetApproved: true,
    summary:
      "A step-by-step method for sprouting seeds and legumes at home, a nutrient-dense fresh food favoured by many companion parrots.",
    ingredients: [
      "1/2 cup mixed sprouting seed (mung bean, lentil, quinoa)",
      "Fresh water for soaking and rinsing",
    ],
    instructions: [
      "Rinse the seed mix thoroughly and soak overnight in fresh water.",
      "Drain completely and place in a sprouting jar or sieve.",
      "Rinse and drain twice daily for 2–4 days until small sprouts appear.",
      "Give a final rinse, then offer fresh, refrigerating unused portions in a sealed container.",
    ],
    avoid: [
      "Sprouts showing any sliminess, mould or sour smell — discard immediately",
      "Skipping rinses, which encourages harmful bacterial growth",
      "Dried kidney beans, which are toxic when improperly sprouted or undercooked",
    ],
    sourceName: "Lafeber Company — Sprouting for Birds",
    sourceUrl: "https://lafeber.com/pet-birds/feeding-your-pet-bird/",
  },
  {
    id: "bird-chop-mix",
    name: "Chop Mix",
    species: "Birds",
    time: "20 min prep",
    diet: "Fresh mix",
    vetApproved: true,
    summary:
      "'Chop' is a widely used parrot community method of batch-preparing a large finely diced vegetable, grain and legume mix that can be frozen in daily portions.",
    ingredients: [
      "Mixed vegetables: carrot, pumpkin, capsicum, leafy greens",
      "Cooked grains: brown rice, quinoa or barley",
      "Cooked legumes: lentils or chickpeas",
      "A small amount of chilli powder or turmeric (optional, in trace amounts)",
    ],
    instructions: [
      "Wash and finely dice all vegetables to a size appropriate for your bird species.",
      "Cook the grains and legumes separately until soft, then cool.",
      "Combine everything in a large bowl and mix well.",
      "Portion into small freezer bags or trays and freeze; thaw one portion daily.",
    ],
    avoid: [
      "Avocado, onion, garlic and mushrooms",
      "Salted or canned vegetables",
      "Refreezing thawed portions more than once",
    ],
    sourceName: "Lafeber Company — Feeding Your Pet Bird",
    sourceUrl: "https://lafeber.com/pet-birds/feeding-your-pet-bird/",
  },

  // ================= RABBITS =================
  {
    id: "rabbit-fresh-herb-salad",
    name: "Fresh Herb Salad",
    species: "Rabbits",
    time: "10 min",
    diet: "Fresh greens",
    vetApproved: true,
    summary:
      "A simple daily salad of rabbit-safe leafy greens and herbs, following House Rabbit Society guidance that fresh greens should be the bulk of a rabbit's daily diet alongside hay.",
    ingredients: [
      "1 cup romaine or leaf lettuce (never iceberg)",
      "1/4 cup fresh coriander or parsley",
      "1/4 cup fresh basil or mint leaves",
      "A few dandelion leaves if pesticide-free",
    ],
    instructions: [
      "Wash all greens and herbs thoroughly and shake dry.",
      "Roughly chop the larger leaves.",
      "Mix together and serve fresh in a shallow dish.",
      "Remove any uneaten portion after a few hours to keep it fresh.",
    ],
    avoid: [
      "Iceberg lettuce — very low nutrition and can cause digestive upset",
      "Any greens sprayed with pesticide or fertiliser",
      "Introducing a new herb suddenly in a large amount; add new foods gradually",
    ],
    sourceName: "House Rabbit Society — Diet",
    sourceUrl: "https://rabbit.org/care/diet/",
  },
  {
    id: "rabbit-banana-oat-cookies",
    name: "Banana & Oat Bunny Cookies",
    species: "Rabbits",
    time: "10 min prep · 15 min bake",
    diet: "Occasional treat",
    vetApproved: true,
    summary:
      "A rare-treat baked cookie using banana and oats, both of which House Rabbit Society lists as safe only in small occasional amounts due to sugar and starch content.",
    ingredients: [
      "1/2 ripe banana, mashed",
      "1/2 cup rolled oats",
      "1 tbsp plain water",
    ],
    instructions: [
      "Preheat the oven to 160°C (325°F).",
      "Mash the banana and mix with the oats and water to form a stiff paste.",
      "Shape into small flat discs on a lined tray.",
      "Bake 12–15 minutes until dry and firm, then cool fully before offering as an occasional treat.",
    ],
    avoid: [
      "Feeding more than a small piece once or twice a week — rabbits need a low-sugar diet",
      "Any added sugar, honey or salt",
      "Replacing hay or fresh greens with these treats",
    ],
    sourceName: "House Rabbit Society — Diet",
    sourceUrl: "https://rabbit.org/care/diet/",
  },
  {
    id: "rabbit-veggie-medley-chop",
    name: "Veggie Medley Chop",
    species: "Rabbits",
    time: "10 min",
    diet: "Fresh vegetables",
    vetApproved: true,
    summary:
      "A varied chopped vegetable mix supplementing daily hay, using vegetables the House Rabbit Society recommends rotating for variety.",
    ingredients: [
      "1/2 cup chopped bell pepper",
      "1/4 cup shredded carrot (as an occasional item, not daily)",
      "1/4 cup chopped celery",
      "A handful of fresh cilantro",
    ],
    instructions: [
      "Wash and chop all vegetables into rabbit-sized pieces.",
      "Mix the vegetables together in a bowl.",
      "Serve alongside unlimited fresh hay, which should remain the majority of the diet.",
      "Remove uneaten fresh vegetables after a few hours.",
    ],
    avoid: [
      "Carrot as a daily staple — it's high in sugar for a rabbit's system",
      "Potato, rhubarb leaves and iceberg lettuce",
      "Sudden diet changes that can upset gut flora",
    ],
    sourceName: "House Rabbit Society — Diet",
    sourceUrl: "https://rabbit.org/care/diet/",
  },
  {
    id: "rabbit-hay-chamomile-blend",
    name: "Hay & Chamomile Relaxation Blend",
    species: "Rabbits",
    time: "5 min",
    diet: "Enrichment",
    vetApproved: true,
    summary:
      "A calming hay-based enrichment mix using dried chamomile flowers, offered occasionally to encourage foraging behaviour and grazing.",
    ingredients: [
      "2 cups fresh timothy or meadow hay",
      "1 tsp dried chamomile flowers (rabbit-safe, pesticide-free)",
    ],
    instructions: [
      "Toss the dried chamomile flowers through a generous pile of fresh hay.",
      "Offer in a hay rack or scattered for foraging enrichment.",
      "Replace with fresh hay daily, as hay should always be available.",
      "Use chamomile only occasionally as an enrichment addition, not a daily supplement.",
    ],
    avoid: [
      "Any hay that smells musty, is damp, or shows mould",
      "Chamomile treated with pesticides or sourced from non-food-grade suppliers",
      "Reducing plain hay availability in favour of flavoured mixes — hay must always be unlimited",
    ],
    sourceName: "House Rabbit Society — Diet",
    sourceUrl: "https://rabbit.org/care/diet/",
  },

  // ================= FISH =================
  {
    id: "fish-gel-food-tropical",
    name: "Homemade Gel Food for Tropical Fish",
    species: "Fish",
    time: "20 min + set",
    diet: "Gel food",
    vetApproved: true,
    summary:
      "A blended gelatin-bound food combining protein and vegetable matter for community tropical fish, following the general gel-food method used by aquarists and referenced by fishkeeping veterinary guides.",
    ingredients: [
      "1/4 cup cooked, unseasoned white fish or shrimp",
      "2 tbsp blanched spinach or peas",
      "1 packet unflavoured gelatin",
      "1/2 cup water",
    ],
    instructions: [
      "Blend the fish/shrimp and vegetables with a little water until smooth.",
      "Dissolve the gelatin in hot water as per packet instructions and mix into the blended paste.",
      "Pour into a shallow tray or ice cube mould and refrigerate until set.",
      "Cut into small cubes sized for your fish and feed a small piece daily, freezing the rest.",
    ],
    avoid: [
      "Any seasoned, salted or garlic/onion-flavoured fish or shrimp",
      "Letting gel food sit out at room temperature for extended periods before feeding",
      "Overfeeding — remove uneaten food from the tank within a few minutes",
    ],
    sourceName: "VCA Animal Hospitals — Aquarium Fish Nutrition",
    sourceUrl: "https://vcahospitals.com/know-your-pet/aquarium-fish-nutrition",
  },
  {
    id: "fish-blanched-veg-herbivore",
    name: "Blanched Vegetable Mix for Herbivore Fish",
    species: "Fish",
    time: "10 min",
    diet: "Vegetable",
    vetApproved: true,
    summary:
      "A simple blanched vegetable feed for herbivorous and omnivorous fish such as plecos and mollies, following common aquarist and veterinary feeding guidance.",
    ingredients: [
      "1 small zucchini, sliced thin",
      "A few leaves of blanched spinach or lettuce",
      "1 slice cucumber",
    ],
    instructions: [
      "Blanch the zucchini slices in boiling water for 1–2 minutes to soften them, then cool.",
      "Weigh the vegetable slice down with a feeding clip or vegetable weight in the tank.",
      "Leave in the tank for a few hours for grazing fish to feed.",
      "Remove any uneaten vegetable within 24 hours to prevent fouling the water.",
    ],
    avoid: [
      "Leaving vegetables in the tank longer than a day — they decompose and harm water quality",
      "Feeding vegetables grown with pesticide residue",
      "Using vegetables as the sole diet for omnivorous species that also need protein",
    ],
    sourceName: "VCA Animal Hospitals — Aquarium Fish Nutrition",
    sourceUrl: "https://vcahospitals.com/know-your-pet/aquarium-fish-nutrition",
  },
  {
    id: "fish-protein-gel-carnivore",
    name: "Protein Gel Food for Carnivore Fish",
    species: "Fish",
    time: "20 min + set",
    diet: "Gel food",
    vetApproved: true,
    summary:
      "A higher-protein gel food for carnivorous fish like bettas and cichlids, using a similar gelatin-set method with fish-appropriate protein sources.",
    ingredients: [
      "1/4 cup cooked, unseasoned prawn or white fish",
      "1 tbsp bloodworms (fresh or thawed frozen)",
      "1 packet unflavoured gelatin",
      "1/2 cup water",
    ],
    instructions: [
      "Blend the protein sources with a small amount of water until a smooth paste forms.",
      "Dissolve gelatin in hot water and combine thoroughly with the paste.",
      "Pour into an ice cube tray and refrigerate until set.",
      "Feed a small cube-sized portion, freezing the remainder in individual portions.",
    ],
    avoid: [
      "Seasoned or salted seafood",
      "Overfeeding — remove excess food promptly to protect water quality",
      "Feeding as the exclusive diet without occasional dry flake or pellet food for balance",
    ],
    sourceName: "VCA Animal Hospitals — Aquarium Fish Nutrition",
    sourceUrl: "https://vcahospitals.com/know-your-pet/aquarium-fish-nutrition",
  },

  // ================= REPTILES =================
  {
    id: "reptile-bearded-dragon-salad",
    name: "Bearded Dragon Salad Bowl",
    species: "Reptiles",
    time: "15 min",
    diet: "Fresh vegetables",
    vetApproved: true,
    summary:
      "A finely chopped vegetable and leafy green bowl for adult bearded dragons, based on general reptile nutrition guidance from VCA Hospitals.",
    ingredients: [
      "1 cup finely chopped collard or mustard greens",
      "1/4 cup grated butternut squash",
      "2 tbsp chopped bell pepper",
      "A light dusting of calcium powder (as advised by your reptile vet)",
    ],
    instructions: [
      "Wash and finely chop all vegetables to a size the dragon can easily eat.",
      "Mix the vegetables together in a shallow dish.",
      "Dust lightly with calcium powder just before serving.",
      "Remove uneaten portions after a few hours to keep the enclosure clean.",
    ],
    avoid: [
      "Avocado, rhubarb and iceberg lettuce",
      "Spinach and beet greens as a regular staple — high oxalates bind calcium",
      "Feeding vegetables without proper calcium/vitamin dusting schedule from your reptile vet",
    ],
    sourceName: "VCA Animal Hospitals — Bearded Dragon Nutrition",
    sourceUrl: "https://vcahospitals.com/know-your-pet/bearded-dragons-diet",
  },
  {
    id: "reptile-calcium-dusted-insects",
    name: "Calcium Dusted Insect Prep",
    species: "Reptiles",
    time: "10 min",
    diet: "Live food prep",
    vetApproved: true,
    summary:
      "A gut-loading and calcium-dusting method for feeder insects given to insectivorous reptiles, based on standard veterinary reptile husbandry guidance.",
    ingredients: [
      "Live crickets or dubia roaches, gut-loaded on fresh vegetables for 24 hours beforehand",
      "Reptile-grade calcium powder with vitamin D3 (as advised by your vet)",
    ],
    instructions: [
      "Feed the insects nutritious vegetables for at least a day before offering them, so they pass on good nutrition (gut-loading).",
      "Place insects in a small container with a pinch of calcium powder.",
      "Gently shake to coat the insects evenly.",
      "Offer the dusted insects immediately, in an amount your reptile can finish within 10–15 minutes.",
    ],
    avoid: [
      "Wild-caught insects, which may carry pesticides or parasites",
      "Over-supplementing with D3 without veterinary guidance, which can be toxic",
      "Insects too large for your reptile — a common cause of impaction",
    ],
    sourceName: "VCA Animal Hospitals — Reptile Nutrition",
    sourceUrl: "https://vcahospitals.com/know-your-pet/reptiles-nutrition",
  },
  {
    id: "reptile-tortoise-fruit-flower-salad",
    name: "Tortoise Fruit & Flower Salad",
    species: "Reptiles",
    time: "15 min",
    diet: "Fresh salad",
    vetApproved: true,
    summary:
      "A fibre-rich weed, flower and occasional-fruit salad for grazing tortoises, based on the Tortoise Trust's guidance on natural high-fibre diets.",
    ingredients: [
      "A large handful of dandelion leaves and flowers",
      "A few nasturtium or hibiscus flowers (pesticide-free)",
      "A small piece of strawberry or melon, as an occasional treat only",
    ],
    instructions: [
      "Wash all weeds, flowers and fruit thoroughly to remove any pesticide residue.",
      "Roughly tear the leaves and flowers into tortoise-sized pieces.",
      "Add only a small amount of fruit as an occasional garnish, not a daily item.",
      "Serve fresh in a shallow dish and remove any uneaten portion by the next day.",
    ],
    avoid: [
      "Regular fruit feeding — high sugar content can disrupt gut bacteria in herbivorous tortoises",
      "Lettuce and spinach as diet staples — poor nutritional value / high oxalates",
      "Any plant sprayed with pesticide or fertiliser",
    ],
    sourceName: "Tortoise Trust — Diet Sheets",
    sourceUrl: "https://www.tortoisetrust.org/articles/diet.html",
  },

  // ================= SMALL PETS =================
  {
    id: "smallpet-seed-grain-mix",
    name: "Seed & Grain Mix",
    species: "Small Pets",
    time: "10 min",
    diet: "Staple mix",
    vetApproved: true,
    summary:
      "A balanced seed and grain base mix suitable for hamsters and gerbils, following general small-mammal nutrition guidance from VCA Hospitals.",
    ingredients: [
      "1/4 cup mixed millet and oats",
      "2 tbsp sunflower seeds (in moderation, high fat)",
      "1 tbsp dried, unsweetened rolled barley",
    ],
    instructions: [
      "Combine all dry ingredients in a clean, dry container.",
      "Mix well to distribute the seeds evenly.",
      "Offer a small measured tablespoon daily alongside a commercial pelleted diet.",
      "Store the remaining mix in an airtight container in a cool, dry place.",
    ],
    avoid: [
      "Feeding sunflower seeds as more than a small portion — they are calorie-dense and can cause obesity",
      "Mouldy or damp grains",
      "Chocolate, candy or any sugary additions to the mix",
    ],
    sourceName: "VCA Animal Hospitals — Hamster Nutrition",
    sourceUrl: "https://vcahospitals.com/know-your-pet/hamsters-feeding",
  },
  {
    id: "smallpet-veggie-skewer-hamster",
    name: "Vegetable Skewer for Hamsters",
    species: "Small Pets",
    time: "10 min",
    diet: "Fresh vegetables",
    vetApproved: true,
    summary:
      "Small pieces of hamster-safe vegetables threaded onto a stick for enrichment, encouraging natural foraging and gnawing behaviour.",
    ingredients: [
      "A few small cucumber slices",
      "A small piece of broccoli floret",
      "A small piece of carrot",
      "A clean wooden skewer or chew-safe stick",
    ],
    instructions: [
      "Wash all vegetables thoroughly.",
      "Cut into small hamster-appropriate pieces.",
      "Thread the pieces loosely onto the skewer.",
      "Place in the enclosure for a few hours, then remove any uneaten fresh food to prevent spoilage.",
    ],
    avoid: [
      "Feeding vegetables in large amounts — hamster stomachs are small and prone to upset",
      "Onion, garlic and raw potato",
      "Leaving fresh food in the cage overnight, where it can rot or attract mould",
    ],
    sourceName: "VCA Animal Hospitals — Hamster Nutrition",
    sourceUrl: "https://vcahospitals.com/know-your-pet/hamsters-feeding",
  },
  {
    id: "smallpet-sunflower-oat-energy-balls",
    name: "Sunflower & Oat Energy Balls",
    species: "Small Pets",
    time: "10 min prep + set",
    diet: "Occasional treat",
    vetApproved: true,
    summary:
      "A rare-treat energy ball for guinea pigs, hamsters and other small pets, made from oats and seed pressed together with a touch of moisture, used sparingly due to its calorie density.",
    ingredients: [
      "1/4 cup rolled oats",
      "1 tbsp sunflower seeds, crushed",
      "1 tbsp plain unsweetened pumpkin puree",
    ],
    instructions: [
      "Mix the oats and crushed sunflower seeds together in a bowl.",
      "Stir in the pumpkin puree until the mixture holds together when pressed.",
      "Roll into very small pea-sized balls appropriate to your pet's size.",
      "Allow to firm up at room temperature for 30 minutes, then offer one occasionally as a treat, refrigerating the rest.",
    ],
    avoid: [
      "Feeding more than one small ball a week — this is a high-calorie occasional treat only",
      "Any added sugar or honey",
      "Offering to guinea pigs without also ensuring plenty of vitamin-C-rich vegetables and hay in the regular diet",
    ],
    sourceName: "VCA Animal Hospitals — Guinea Pig Nutrition",
    sourceUrl: "https://vcahospitals.com/know-your-pet/guinea-pigs-feeding",
  },
];
