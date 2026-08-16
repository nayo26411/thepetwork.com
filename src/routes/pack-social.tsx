import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BadgeCheck, MapPin, Plus, Users } from "lucide-react";
import { toast } from "sonner";
import { SHELTERS } from "@/data/content";
import { EmptyMark } from "@/components/EmptyMark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/pack-social")({
  head: () => ({
    meta: [
      { title: "The Pack Social — Start a Delhi NCR Pet Community | The Petwork" },
      {
        name: "description",
        content:
          "Start the first pet community on The Petwork — breed circles, species groups and neighbourhood packs for pet owners across Delhi NCR.",
      },
      { property: "og:title", content: "The Pack Social — Start a Delhi NCR Pet Community" },
      {
        property: "og:description",
        content: "Create the first community for pet owners in your corner of Delhi NCR.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/pack-social" },
    ],
    links: [{ rel: "canonical", href: "/pack-social" }],
  }),
  component: PackSocial,
});

const CATEGORIES = ["Breed", "Species", "Topic", "Location"] as const;

type Community = { name: string; category: string; description: string };

function PackSocial() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [description, setDescription] = useState("");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-4xl text-foreground sm:text-5xl">The Pack Social</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        The best pet advice in Delhi still travels by word of mouth — over chai, in park corners, on
        WhatsApp at midnight. The Pack Social is that conversation, kept in one place. It starts with
        the community you create.
      </p>

      {communities.length === 0 ? (
        <section className="card-cozy mt-10 flex flex-col items-center px-6 py-14 text-center">
          <EmptyMark />
          <h2 className="mt-4 text-2xl text-foreground">No communities yet — be the first to start one.</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Every pack begins with one person. Name yours, describe who it is for, and we will open
            it to pet owners nearby.
          </p>
          <Button
            className="mt-7 rounded-full bg-caramel px-7 text-base text-caramel-foreground shadow-cozy hover:bg-caramel/90"
            size="lg"
            onClick={() => setShowForm(true)}
          >
            <Plus className="size-5" /> Create a Community
          </Button>
        </section>
      ) : (
        <>
          <div className="mt-10 flex items-center justify-between gap-4">
            <h2 className="text-2xl text-foreground">Communities</h2>
            <Button
              className="rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
              onClick={() => setShowForm(true)}
            >
              <Plus className="size-4" /> Create a Community
            </Button>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {communities.map((c) => (
              <article key={c.name} className="card-cozy hover-lift flex flex-col p-7">
                <span className="w-fit rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                  {c.category}
                </span>
                <h3 className="mt-4 text-xl text-foreground">{c.name}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-caramel">
                  <Users className="size-4" /> 1 member · just created
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {c.description}
                </p>
              </article>
            ))}
          </div>
        </>
      )}

      {showForm && (
        <section className="card-cozy mt-8 p-7 sm:p-9">
          <h2 className="text-xl text-foreground">Create a Community</h2>
          <form
            className="mt-5 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const trimmed = name.trim();
              if (!trimmed) return;
              if (communities.some((c) => c.name === trimmed)) {
                toast.error("A community with that name already exists");
                return;
              }
              setCommunities((prev) => [
                ...prev,
                { name: trimmed, category, description: description.trim() },
              ]);
              setName("");
              setDescription("");
              setShowForm(false);
              toast.success(`${trimmed} is live`, {
                description: "You are the first member. Invite the people you walk with.",
              });
            }}
          >
            <div>
              <Label htmlFor="c-name">Community name</Label>
              <Input
                id="c-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={70}
                placeholder="Indie Dog Parents, Saket"
                className="mt-1.5 rounded-xl"
                required
              />
            </div>
            <div>
              <Label htmlFor="c-cat">Category</Label>
              <select
                id="c-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="c-desc">Description</Label>
              <Textarea
                id="c-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                maxLength={400}
                placeholder="Who is this community for, and what will you talk about?"
                className="mt-1.5 rounded-xl"
                required
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                type="submit"
                className="rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
              >
                Create
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="rounded-full"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </section>
      )}

      <h2 className="mt-16 text-2xl text-foreground sm:text-3xl">Shelters &amp; rescues in Delhi NCR</h2>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Established animal welfare organisations working across the city. Contact them directly for
        adoption, rescue or treatment — we do not take a cut and we do not list breeders for sale.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {SHELTERS.map((s) => (
          <article key={s.name} className="card-cozy hover-lift flex flex-col p-8">
            <span className="flex w-fit items-center gap-1.5 rounded-full bg-verified/15 px-3 py-1 text-xs font-bold text-verified">
              <BadgeCheck className="size-3.5" /> Registered organisation
            </span>
            <h3 className="mt-4 text-lg text-foreground">{s.name}</h3>
            <p className="mt-1 text-sm font-semibold text-caramel">{s.species}</p>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4" /> {s.location}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{s.years}+ years of work in NCR</p>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{s.blurb}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
