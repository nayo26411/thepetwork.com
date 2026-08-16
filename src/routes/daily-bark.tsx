import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Bookmark, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { VIDEOS } from "@/data/content";

export const Route = createFileRoute("/daily-bark")({
  head: () => ({
    meta: [
      { title: "The Daily Bark — Beginner Pet Care Videos | The Petwork" },
      {
        name: "description",
        content:
          "Hand-picked beginner videos on puppies, kittens, pet birds, reptiles and rabbits — real guides from vets and experienced keepers, filtered by species.",
      },
      { property: "og:title", content: "The Daily Bark — Beginner Pet Care Videos" },
      {
        property: "og:description",
        content: "Real beginner pet care videos from vets and experienced keepers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/daily-bark" },
    ],
    links: [{ rel: "canonical", href: "/daily-bark" }],
  }),
  component: DailyBark,
});

const SPECIES = [
  "All",
  "Dogs",
  "Cats",
  "Birds",
  "Rabbits",
  "Reptiles",
  "Fish",
  "Hamsters",
  "Other",
] as const;

function DailyBark() {
  const [species, setSpecies] = useState<(typeof SPECIES)[number]>("All");
const [saved, setSaved] = useState<string[]>([]);
const [failedVideos, setFailedVideos] = useState<string[]>([]);

 const videos = useMemo(
  () =>
    (species === "All"
      ? VIDEOS
      : VIDEOS.filter((v) => v.species === species)
    ).filter((v) => !failedVideos.includes(v.id)),
  [species, failedVideos],
);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-4xl text-foreground sm:text-5xl">The Daily Bark</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Beginner guides we have watched and would send to a friend — from vets, trainers and keepers
        who have already made the mistakes. Every video plays here, credited to its creator.
      </p>

      <div className="mt-7 flex flex-wrap gap-2">
        {SPECIES.map((s) => (
          <button
            key={s}
            onClick={() => setSpecies(s)}
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

      <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((v) => {
          const isSaved = saved.includes(v.id);
          return (
            <article key={v.id} className="card-cozy hover-lift flex flex-col overflow-hidden">
              <div className="aspect-video w-full bg-accent">
                {failedVideos.includes(v.id) ? (
  <div className="flex h-full items-center justify-center bg-accent p-6 text-center">
    <p className="text-sm font-semibold text-muted-foreground">
      This video is currently unavailable.
    </p>
  </div>
) : (
  <iframe
    src={`https://www.youtube-nocookie.com/embed/${v.id}`}
    title={v.title}
    loading="lazy"
    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
    className="size-full border-0"
    onError={() => {
      setFailedVideos((prev) =>
        prev.includes(v.id) ? prev : [...prev, v.id],
      );
    }}
  />
)}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-oat px-3 py-1 text-xs font-bold text-caramel">
                    {v.species}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">{v.duration}</span>
                </div>
                <h2 className="mt-3 text-lg leading-snug text-foreground">{v.title}</h2>
                <p className="mt-1 flex-1 text-sm font-semibold text-caramel">{v.channel}</p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      setSaved((prev) =>
                        isSaved ? prev.filter((id) => id !== v.id) : [...prev, v.id],
                      );
                      toast.success(isSaved ? "Removed from saved" : "Saved to your collection");
                    }}
                    className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                      isSaved
                        ? "bg-caramel text-caramel-foreground"
                        : "bg-accent text-accent-foreground hover:bg-caramel hover:text-caramel-foreground"
                    }`}
                  >
                    <Bookmark className={`size-4 ${isSaved ? "fill-current" : ""}`} />
                    {isSaved ? "Saved" : "Save"}
                  </button>
                  <a
                    href={`https://www.youtube.com/watch?v=${v.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-caramel"
                  >
                    Watch on YouTube <ExternalLink className="size-3.5" />
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {videos.length === 0 && (
        <p className="mt-10 rounded-2xl bg-oat p-8 text-center text-muted-foreground">
          No {species.toLowerCase()} guides in the shelf yet — we add new ones as we watch them.
        </p>
      )}
    </div>
  );
}
