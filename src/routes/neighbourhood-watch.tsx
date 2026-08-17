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

const IMAGES: Record<string, string> = {
  atheyka: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1200&q=85",
  colocal: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1200&q=85",
  roastery: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=85",
  cyberhub: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85",
  "cafe-lodhi": "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=85",
  "cafe-hauzkhas": "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1200&q=85",
  "cafe-cyberhub-social": "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=1200&q=85",
  "cafe-dwarka": "https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=1200&q=85",
  "piano-man-safdarjung": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=85",
  "cafe-lota-pragati-maidan": "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1200&q=85",
  "all-american-diner-ihc": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=85",
  "soi7-gurugram": "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1200&q=85",

  claridges: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=85",
  "taj-mansingh": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=85",
  "hotel-leela": "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=85",
  "hotel-lalit": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=85",
  "hotel-roseate": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=85",
  "oberoi-new-delhi": "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=85",
  "itc-maurya": "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=85",
  "lemon-tree-aerocity": "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85",

  "maxpetz-vk": "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=1200&q=85",
  "dcc-defence": "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1200&q=85",
  "vetic-gk": "https://images.unsplash.com/photo-1559715745-e1b33a271c8f?auto=format&fit=crop&w=1200&q=85",
  "petsy-noida": "https://images.unsplash.com/photo-1597600159211-d6c104f408d1?auto=format&fit=crop&w=1200&q=85",
  "cgs-dwarka": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=1200&q=85",
  "vet-lajpat": "https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&w=1200&q=85",
  "sanjay-gandhi-animal-care-raja-garden": "https://images.unsplash.com/photo-1548767797-d8c844163c4a?auto=format&fit=crop&w=1200&q=85",
  "cgs-hospital-dlf-phase3": "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&w=1200&q=85",
  "dr-anands-pets-hospital-vikaspuri": "https://images.unsplash.com/photo-1603481546238-487240415921?auto=format&fit=crop&w=1200&q=85",
  "friendicoes-seca-jangpura": "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=85",
  "pfa-delhi-animal-hospital-harinagar": "https://images.unsplash.com/photo-1581888227599-779811939961?auto=format&fit=crop&w=1200&q=85",
  "shroffs-animal-wing-daryaganj": "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&q=85",
  "jeevashram-animal-hospital-gurgaon": "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=1200&q=85",
  "mahendales-pet-clinic-noida-50": "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=1200&q=85",
  "animal-care-centre-greater-noida": "https://images.unsplash.com/photo-1615233500064-138da78a0ece?auto=format&fit=crop&w=1200&q=85",
  "cessna-lifeline-vasant-kunj": "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1200&q=85",
  "bark-meow-saket": "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&w=1200&q=85",
  "delhi-spca-srinivaspuri": "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=85",

  "scoopy-gk": "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1200&q=85",
  "furrmaid-noida": "https://images.unsplash.com/photo-1535294435445-d7249524ef2e?auto=format&fit=crop&w=1200&q=85",
  "pawfect-gurgaon": "https://images.unsplash.com/photo-1587764379873-97837921fd44?auto=format&fit=crop&w=1200&q=85",
  "groom-dwarka": "https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=1200&q=85",
  "fur-ball-story-hauzkhas": "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1200&q=85",
  "petstudio-noida-50": "https://images.unsplash.com/photo-1591160690555-5d7e4a2669b8?auto=format&fit=crop&w=1200&q=85",
  "groom-room-gurugram": "https://images.unsplash.com/photo-1548767797-d8c844163c4a?auto=format&fit=crop&w=1200&q=85",
  "snip-wag-vk": "https://images.unsplash.com/photo-1494947665470-20322015e3a8?auto=format&fit=crop&w=1200&q=85",
  "pawfect-grooming-dwarka": "https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?auto=format&fit=crop&w=1200&q=85",

  "heads-up-vk": "https://images.unsplash.com/photo-1607923432780-7a9c30adcb73?auto=format&fit=crop&w=1200&q=85",
  "hut-cp": "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=1200&q=85",
  "store-lajpat": "https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=1200&q=85",
  "store-gnoida": "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1200&q=85",
  "store-gurgaon": "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=1200&q=85",
  "petkart-noida-18": "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1200&q=85",
  "hupt-dlf-promenade": "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=1200&q=85",
  "wiggles-lajpat": "https://images.unsplash.com/photo-1603189343302-e603f7add05a?auto=format&fit=crop&w=1200&q=85",
  "petsutra-janakpuri": "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1200&q=85",
  "pet-shop-cp": "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1200&q=85",
  "paws-claws-gnoida": "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=85",

  "park-lodhi": "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&q=85",
  "park-nehru": "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=1200&q=85",
  "park-dda-vk": "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=1200&q=85",
  "park-noida-sec-50": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=85",
  "park-leisure-valley": "https://images.unsplash.com/photo-1552083375-1447ce886485?auto=format&fit=crop&w=1200&q=85",
  "park-dwarka-sec-11": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=85",
  "park-gnoida": "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=1200&q=85",
  "lodhi-garden-full": "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=85",
  "sanjay-van": "https://images.unsplash.com/photo-1473081556163-2a17de81fc2a?auto=format&fit=crop&w=1200&q=85",
  "dda-park-dwarka-10": "https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?auto=format&fit=crop&w=1200&q=85",
  "central-park-cp": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=85",
  "garden-of-five-senses": "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=1200&q=85",
  "botanical-garden-noida": "https://images.unsplash.com/photo-1444212477490-ca407925329e?auto=format&fit=crop&w=1200&q=85",
};

function getImage(id: string) {
  return (
    IMAGES[id] ??
    "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1200&q=85"
  );
}

export const Route = createFileRoute("/neighbourhood-watch")({
  head: () => ({
    meta: [
      {
        title: "The Neighbourhood Watch — Pet Friendly Map of Delhi NCR | The Petwork",
      },
      {
        name: "description",
        content:
          "An interactive map of vets, groomers, pet stores, pet friendly cafes and hotels, and parks across Delhi NCR.",
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
              style={on ? { backgroundColor: CATEGORY_COLORS[cat] } : undefined}
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
              active.length === CATEGORIES.length ? [] : [...CATEGORIES],
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
              <div className="h-52 w-full overflow-hidden bg-oat">
                <img
                  src={getImage(selected.id)}
                  alt={selected.name}
                  className="h-full w-full object-cover"
                  loading="eager"
                />
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
                    src={getImage(place.id)}
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
                    style={{ color: CATEGORY_COLORS[place.category] }}
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
