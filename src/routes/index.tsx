import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone, ArrowRight, Siren } from "lucide-react";
import { DirectorySearch } from "@/components/DirectorySearch";
import { CATEGORY_NAV } from "@/components/CategoryBar";
import { PET_PLACES } from "@/data/locations";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Petwork — A home for every pet and every owner" },
      {
        name: "description",
        content:
          "Search pet friendly stays, cafes, groomers, vets, parks and stores across Delhi NCR — plus community, recipes, guides and pet records, all in one warm place.",
      },
      { property: "og:title", content: "The Petwork — A home for every pet and every owner" },
      {
        property: "og:description",
        content: "A warm directory of everything a Delhi NCR pet owner needs.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const FEATURE_TEXT: Record<string, string> = {
  "/neighbourhood-watch":
    "Vets, groomers, stores, pet friendly cafes, hotels and off-leash parks across Delhi NCR — with the real pet rules for each place.",
  "/pro-portal":
    "Book verified walkers, groomers, sitters, trainers and vets with escrow payments and live GPS tracking.",
  "/pack-social":
    "Neighbourhood groups for your breed and your stage of pet parenting, plus verified shelters you can trust.",
  "/daily-bark":
    "Honest beginner videos for dogs, cats, birds, rabbits, reptiles, fish and small pets.",
  "/munchie-menu":
    "Vet-approved home recipes with clear toxic-ingredient warnings, sorted by species and dietary need.",
  "/digital-collar":
    "Health log, vaccination and appointment reminders, medications and documents for every pet.",
  "/emergency":
    "24×7 hospitals, ambulances and rescue contacts across Delhi, Noida and Gurugram, one tap away.",
};

function Home() {
  const stats = [
    {
      value: `${PET_PLACES.length}`,
      label: "Pet friendly places mapped across Delhi NCR, with real pet rules",
    },
    { value: "1,240", label: "Delhi NCR pet owners surveyed before we built a single page" },
    { value: "3–5 days", label: "Verification time for every professional joining the network" },
  ];

  return (
    <div>
      {/* Search bar — directory first */}
      <section className="border-b border-border bg-oat/50">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:py-20">
          <h1 className="text-4xl leading-tight text-foreground sm:text-5xl">
            A home for every pet and every owner.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Everything a Delhi NCR pet owner needs — maps, community, hiring, guides and care.
          </p>
          <div className="mt-8">
            <DirectorySearch />
          </div>
        </div>
      </section>

      {/* Feature directory grid */}
      <section className="band-cream reveal border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
          <p className="section-label">Browse The Petwork</p>
          <h2 className="mt-2 text-3xl text-foreground sm:text-4xl">Seven places to start</h2>
          <div className="mt-9 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORY_NAV.map((f) => (
              <Link key={f.to} to={f.to} className="card-cozy hover-lift group flex flex-col p-8">
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-honey/25 text-caramel">
                  <f.icon className="size-7" strokeWidth={1.75} />
                </span>
                <h3 className="mt-5 text-xl text-foreground">{f.label}</h3>
                <p className="mt-2.5 flex-1 text-base leading-relaxed text-muted-foreground">
                  {FEATURE_TEXT[f.to]}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-base font-bold text-caramel">
                  Open{" "}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="band-sage reveal border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
          <p className="section-label">The Petwork so far</p>
          <h2 className="mt-2 text-3xl text-foreground sm:text-4xl">Built on real groundwork</h2>
          <div className="mt-8 grid gap-7 sm:grid-cols-3">
            {stats.map((s) => (
              <div key={s.label} className="card-cozy hover-lift p-8">
                <p className="font-display text-5xl font-bold text-caramel">{s.value}</p>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency helpline */}
      <section className="band-blush reveal">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
          <div className="flex flex-col gap-5 rounded-3xl border border-destructive/25 bg-card p-8 shadow-cozy sm:flex-row sm:items-center">
            <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-destructive/10 text-destructive">
              <Siren className="size-8" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="section-label text-destructive">Emergency · Delhi NCR</p>
              <h2 className="mt-1 text-2xl text-foreground">Help, any hour.</h2>
              <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                Delhi Animal Helpline 011-23258100 · 24×7 hospitals, ambulances and rescue contacts
                across Delhi, Noida and Gurugram.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <a
                href="tel:01123258100"
                className="inline-flex items-center gap-2 rounded-full bg-destructive px-6 py-3 text-base font-bold text-destructive-foreground transition-transform hover:scale-105"
              >
                <Phone className="size-5" /> Call helpline
              </a>
              <Link
                to="/emergency"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-base font-bold text-foreground transition-colors hover:bg-honey/25"
              >
                All emergency vets
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

