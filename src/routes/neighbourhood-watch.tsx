import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Clock, MapPin, PawPrint, X } from "lucide-react";
import { PetMap } from "@/components/PetMap";
import {
  CATEGORIES,
  CATEGORY_COLORS,
  PET_PLACES,
  type Category,
  type PetPlace,
} from "@/data/locations";
import { placePhoto } from "@/lib/photos";

export const Route = createFileRoute("/neighbourhood-watch")({
  head: () => ({
    meta: [
      {
        title: "The Neighbourhood Watch — Pet Friendly Map of Delhi NCR | The Petwork",
      },
      {
        name: "description",
        content:
          "An interactive map of vets, groomers, pet stores, pet friendly cafes and hotels, and parks across Delhi NCR — with real pet conditions for every place.",
      },
      {
        property: "og:title",
        content: "The Neighbourhood Watch — Pet Friendly Map of Delhi NCR",
      },
      {
        property: "og:description",
        content:
          "Every pet friendly place in Delhi NCR, with the rules spelled out.",
      },
    ],
  }),
  component: WatchPage,
});

function WatchPage() {
  const [active, setActive] = useState<Category[]>([...CATEGORIES]);
  const [selected, setSelected] = useState<PetPlace | null>(null);

  const places = useMemo(
    () => PET_PLACES.filter((p) => active.includes(p.category)),
    [active],
  );

  const toggle = (cat: Category) => {
    setActive((prev) =>
      prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : [...prev, cat],
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-14">
      <h1 className="text-4xl text-foreground sm:text-5xl">
        The Neighbourhood Watch
      </h1>

      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
        {PET_PLACES.length} places across Delhi NCR — every one with its pet
        conditions listed, so you know what to expect before you go.
      </p>

      <div className="mt-7 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const on = active.includes(cat);

          return (
            <button
              key={cat}
              onClick={() => toggle(cat)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-all ${
                on
                  ? "border-transparent text-caramel-foreground shadow-cozy"
                  : "border-border bg-card text-muted-foreground hover:bg-accent"
              }`}
              style={
                on
                  ? { backgroundColor: CATEGORY_COLORS[cat] }
                  : undefined
              }
            >
              <span
                className="size-2.5 rounded-full"
                style={{
                  backgroundColor: on
                    ? "rgba(255,247,236,.9)"
                    : CATEGORY_COLORS[cat],
                }}
              />
              {cat}
            </button>
          );
        })}

        <button
          onClick={() =>
            setActive(
              active.length === CATEGORIES.length
                ? []
                : [...CATEGORIES],
            )
          }
          className="rounded-full border border-dashed border-caramel px-4 py-2 text-sm font-bold text-caramel hover:bg-accent"
        >
          {active.length === CATEGORIES.length ? "Clear all" : "Show all"}
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="card-cozy overflow-hidden p-2">
          <div className="h-[520px]">
            <PetMap
              places={places}
              onSelect={setSelected}
              selectedId={selected?.id}
            />
          </div>
        </div>

        <div className="space-y-4">
          {selected ? (
            <div className="card-cozy overflow-hidden">
              <div className="relative h-52 w-full overflow-hidden bg-oat">
                <img
                  src={placePhoto(selected.id, selected.category, 1200)}
                  alt={selected.name}
                  loading="eager"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent" />
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span
                      className="inline-block rounded-full px-3 py-1 text-xs font-bold text-caramel-foreground"
                      style={{
                        backgroundColor:
                          CATEGORY_COLORS[selected.category],
                      }}
                    >
                      {selected.category}
                    </span>

                    <h2 className="mt-2.5 text-2xl text-foreground">
                      {selected.name}
                    </h2>
                  </div>

                  <button
                    onClick={() => setSelected(null)}
                    aria-label="Close"
                    className="rounded-full p-1 text-muted-foreground hover:bg-accent"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                <p className="mt-3 flex gap-2 text-base text-muted-foreground">
                  <MapPin className="mt-1 size-4 shrink-0 text-caramel" />
                  {selected.address}
                </p>

                <p className="mt-2 flex gap-2 text-base text-muted-foreground">
                  <Clock className="mt-1 size-4 shrink-0 text-caramel" />
                  {selected.hours}
                </p>

                <h3 className="mt-5 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-caramel">
                  <PawPrint className="size-4" />
                  Pet conditions
                </h3>

                <ul className="mt-2.5 space-y-2">
                  {selected.conditions.map((condition) => (
                    <li
                      key={condition}
                      className="flex gap-2 text-base leading-relaxed text-foreground"
                    >
                      <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-terracotta" />
                      {condition}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="card-cozy bg-blush-tint p-7">
              <h2 className="text-xl text-foreground">
                Tap a pin to see the rules
              </h2>

              <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                Every listing tells you the pet rules, opening hours, location,
                and access conditions.
              </p>
            </div>
          )}

          <div className="card-cozy max-h-[420px] overflow-y-auto p-2.5">
            {places.map((place) => (
              <button
                key={place.id}
                onClick={() => setSelected(place)}
                className={`flex w-full items-center gap-3.5 rounded-2xl p-3 text-left transition-colors hover:bg-accent ${
                  selected?.id === place.id ? "bg-accent" : ""
                }`}
              >
                <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-oat">
                  <img
                    src={placePhoto(place.id, place.category, 400)}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>

                <span className="min-w-0">
                  <span className="block truncate text-base font-bold text-foreground">
                    {place.name}
                  </span>

                  <span className="block truncate text-sm text-muted-foreground">
                    {place.address}
                  </span>

                  <span
                    className="mt-1 block text-xs font-bold"
                    style={{
                      color: CATEGORY_COLORS[place.category],
                    }}
                  >
                    {place.category}
                  </span>
                </span>
              </button>
            ))}

            {places.length === 0 && (
              <p className="p-4 text-sm text-muted-foreground">
                No categories selected — turn one back on to see places.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
