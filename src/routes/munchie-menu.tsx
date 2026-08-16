import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AlertTriangle, BadgeCheck, Clock, ExternalLink, TriangleAlert, X } from "lucide-react";
import { POISON_HELP } from "@/data/content";
import { RECIPES, RECIPE_SPECIES, type Recipe } from "@/data/recipes";
import { recipePhoto } from "@/lib/photos";

export const Route = createFileRoute("/munchie-menu")({
  head: () => ({
    meta: [
      { title: "The Munchie Menu — Real Vet-Guided Pet Recipes | The Petwork" },
      {
        name: "description",
        content:
          "Dozens of real recipes for dogs, cats, birds, rabbits, fish, reptiles and small pets with full ingredients, method, toxic-ingredient warnings and a credited source for every recipe.",
      },
      { property: "og:title", content: "The Munchie Menu — Real Vet-Guided Pet Recipes" },
      {
        property: "og:description",
        content: "Real recipes across every pet species, with ingredients, method and safety warnings.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/munchie-menu" },
    ],
    links: [{ rel: "canonical", href: "/munchie-menu" }],
  }),
  component: MunchieMenu,
});

const ALL_SPECIES = ["All", ...RECIPE_SPECIES] as const;

function MunchieMenu() {
  const [species, setSpecies] = useState<(typeof ALL_SPECIES)[number]>("All");
  const [diet, setDiet] = useState<string>("All diets");
  const [active, setActive] = useState<Recipe | null>(null);

  const diets = useMemo(() => {
    const scoped = species === "All" ? RECIPES : RECIPES.filter((r) => r.species === species);
    return ["All diets", ...Array.from(new Set(scoped.map((r) => r.diet)))];
  }, [species]);

  const recipes = useMemo(
    () =>
      RECIPES.filter(
        (r) => (species === "All" || r.species === species) && (diet === "All diets" || r.diet === diet),
      ),
    [species, diet],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="flex items-start gap-3 rounded-2xl border-2 border-destructive/40 bg-destructive/10 p-5">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />
        <p className="text-sm font-bold text-destructive">
          These recipes are for reference only. Always consult your vet before changing your pet's
          diet. Some ingredients safe for humans (or even for other species) are toxic to pets.
          Suspected poisoning?{" "}
          <a href={POISON_HELP.url} target="_blank" rel="noopener noreferrer" className="underline">
            {POISON_HELP.label}
          </a>
          .
        </p>
      </div>

      <p className="section-label mt-10">Recipes</p>
      <h1 className="mt-2 text-4xl text-foreground sm:text-5xl">The Munchie Menu</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
        Real, published recipes for every kind of pet — ingredients, method, and the ingredients you
        must keep out of the bowl. Every card credits where the guidance comes from.
      </p>

      <div className="mt-7 space-y-3">
        <div className="flex flex-wrap gap-2">
          {ALL_SPECIES.map((s) => (
            <button
              key={s}
              onClick={() => {
                setSpecies(s);
                setDiet("All diets");
              }}
              className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
                species === s
                  ? "bg-caramel text-caramel-foreground shadow-cozy"
                  : "bg-card text-muted-foreground ring-1 ring-border hover:bg-accent"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {diets.map((d) => (
            <button
              key={d}
              onClick={() => setDiet(d)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                diet === d ? "bg-terracotta text-terracotta-foreground" : "bg-oat text-muted-foreground hover:bg-accent"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        Showing {recipes.length} recipe{recipes.length === 1 ? "" : "s"}
      </p>

      <div className="mt-5 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((r) => (
          <button
            key={r.id}
            onClick={() => setActive(r)}
            className="card-cozy hover-lift flex flex-col items-start overflow-hidden text-left"
          >
            <img
              src={recipePhoto(r.id, r.species, 800)}
              alt={`${r.name} — a homemade recipe for ${r.species.toLowerCase()}`}
              loading="lazy"
              className="h-48 w-full object-cover"
            />
            <div className="flex w-full flex-1 flex-col items-start p-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-blush-tint px-3 py-1 text-xs font-bold text-terracotta">
                  {r.species}
                </span>
                {r.vetApproved && (
                  <span className="flex items-center gap-1 rounded-full bg-sage-tint px-2.5 py-1 text-xs font-bold text-verified">
                    <BadgeCheck className="size-3.5" /> Vet Approved
                  </span>
                )}
              </div>
              <h2 className="mt-3.5 text-xl text-foreground">{r.name}</h2>
              <p className="mt-2.5 line-clamp-3 flex-1 text-base leading-relaxed text-muted-foreground">
                {r.summary}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 text-sm font-semibold text-muted-foreground">
                  <Clock className="size-4" /> {r.time}
                </span>
                <span className="rounded-full bg-honey/25 px-2.5 py-1 text-xs font-bold text-honey-foreground">
                  {r.diet}
                </span>
              </div>
              <span className="mt-4 text-sm font-bold text-caramel">View full recipe →</span>
            </div>
          </button>
        ))}
      </div>


      {recipes.length === 0 && (
        <p className="mt-10 rounded-2xl bg-oat p-8 text-center text-muted-foreground">
          Nothing matches that combination yet. Try clearing the dietary filter.
        </p>
      )}

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-foreground/40 p-4 py-10 backdrop-blur-sm sm:items-center"
          onClick={() => setActive(null)}
        >
          <div
            className="card-cozy relative w-full max-w-2xl p-7 sm:p-9"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActive(null)}
              aria-label="Close recipe"
              className="absolute right-5 top-5 rounded-full bg-oat p-2 text-muted-foreground hover:bg-accent"
            >
              <X className="size-4" />
            </button>

            <img
              src={recipePhoto(active.id, active.species, 1000)}
              alt={`${active.name} — finished dish`}
              loading="lazy"
              className="mt-2 h-56 w-full rounded-2xl object-cover sm:h-64"
            />

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-blush-tint px-3 py-1 text-xs font-bold text-terracotta">
                {active.species}
              </span>
              <span className="flex items-center gap-1 text-sm font-semibold text-muted-foreground">
                <Clock className="size-4" /> {active.time}
              </span>
              {active.vetApproved && (
                <span className="flex items-center gap-1 rounded-full bg-sage-tint px-2.5 py-1 text-xs font-bold text-verified">
                  <BadgeCheck className="size-3.5" /> Vet Approved
                </span>
              )}
              <span className="rounded-full bg-honey/25 px-2.5 py-1 text-xs font-bold text-honey-foreground">
                {active.diet}
              </span>
            </div>

            <h2 className="mt-4 text-3xl text-foreground">{active.name}</h2>
            <p className="mt-2.5 text-base leading-relaxed text-muted-foreground">{active.summary}</p>


            <h3 className="mt-6 text-sm font-bold uppercase tracking-wide text-caramel">Ingredients</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {active.ingredients.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>

            <h3 className="mt-6 text-sm font-bold uppercase tracking-wide text-caramel">Instructions</h3>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
              {active.instructions.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ol>

            <div className="mt-6 rounded-xl bg-destructive/10 p-4">
              <h3 className="flex items-center gap-2 text-sm font-bold text-destructive">
                <TriangleAlert className="size-4" /> Danger — never include
              </h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-xs font-semibold text-destructive">
                {active.avoid.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>

            <a
              href={active.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-caramel"
            >
              Source: {active.sourceName} <ExternalLink className="size-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
