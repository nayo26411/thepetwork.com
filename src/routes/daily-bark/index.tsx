import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FileText, HelpCircle, PenLine, Plus, Search, Sparkles, Video } from "lucide-react";
import { PostCard } from "@/components/app/PostCard";
import { PostComposer } from "@/components/app/PostComposer";
import { ListSkeleton, useFakeLoading } from "@/components/app/ui";
import { useRequireLogin } from "@/components/app/useRequireLogin";
import { useDemo, useSession } from "@/mock/store";
import { POST_SPECIES, POST_TYPES, type PostType } from "@/mock/types";

export const Route = createFileRoute("/daily-bark/")({
  head: () => ({
    meta: [
      { title: "The Daily Bark | The Petwork" },
      {
        name: "description",
        content: "Stories, tips, questions and experiences from pet parents across Delhi NCR.",
      },
      { property: "og:title", content: "The Daily Bark | The Petwork" },
      {
        property: "og:description",
        content:
          "A community space for pet parents to share stories, tips, questions and experiences.",
      },
    ],
  }),
  component: DailyBark,
});

const CREATE: { type: PostType; label: string; hint: string; icon: typeof PenLine }[] = [
  { type: "Stories", label: "Share a story", hint: "Tell the community something", icon: PenLine },
  {
    type: "Tips",
    label: "Share a tip",
    hint: "Something other pet parents should know",
    icon: Sparkles,
  },
  {
    type: "Questions",
    label: "Ask something",
    hint: "Get perspectives from pet parents",
    icon: HelpCircle,
  },
  { type: "Blogs", label: "Write a blog", hint: "Tell a longer story or guide", icon: FileText },
  { type: "Videos", label: "Share a video", hint: "Upload a clip or share a link", icon: Video },
];

function DailyBark() {
  const data = useDemo();
  const { user } = useSession();
  const gate = useRequireLogin();
  const loading = useFakeLoading();
  const [type, setType] = useState<"All" | PostType>("All");
  const [species, setSpecies] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);
  const [composer, setComposer] = useState<{ open: boolean; type: PostType }>({
    open: false,
    type: "Stories",
  });

  const posts = useMemo(() => {
    const term = search.trim().toLowerCase();
    const blocked = new Set(
      data.blocks.filter((b) => b.userId === user?.id).map((b) => b.blockedId),
    );
    return data.posts
      .filter(
        (p) => p.status === "published" || (p.status === "pending" && p.authorId === user?.id),
      )
      .filter((p) => !blocked.has(p.authorId))
      .filter((p) => type === "All" || p.type === type)
      .filter((p) => species === "All" || p.species === species || p.species === "Other")
      .filter((p) => !savedOnly || (user && p.savedBy.includes(user.id)))
      .filter(
        (p) => !term || `${p.title} ${p.content} ${p.authorName}`.toLowerCase().includes(term),
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [data.posts, data.blocks, user, type, species, search, savedOnly]);

  const open = (t: PostType) =>
    gate(() => setComposer({ open: true, type: t }), "Sign in to share with the community");

  return (
    <div className="min-h-screen bg-background">
      <section className="border-b border-border bg-oat/40">
        <div className="mx-auto max-w-5xl px-4 py-14 text-center sm:py-20">
          <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-caramel/15 text-caramel">
            <Sparkles className="size-7" />
          </div>
          <h1 className="text-4xl leading-tight text-foreground sm:text-5xl">The Daily Bark</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Stories, questions, tips and little moments from the people who know what it is really
            like to live with pets.
          </p>
          <button
            onClick={() => open("Stories")}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-caramel px-6 py-3 text-sm font-bold text-caramel-foreground shadow-cozy transition-transform hover:-translate-y-0.5"
          >
            <Plus className="size-4" /> Share something
          </button>
          <p className="mx-auto mt-3 max-w-md text-xs text-muted-foreground">
            Every submission is reviewed before it becomes part of the public Daily Bark.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {CREATE.map((c) => (
            <button
              key={c.type}
              onClick={() => open(c.type)}
              className="card-cozy flex items-center gap-3 p-4 text-left transition-transform hover:-translate-y-0.5"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-caramel/15 text-caramel">
                <c.icon className="size-5" />
              </span>
              <span>
                <span className="block font-bold text-foreground">{c.label}</span>
                <span className="text-xs text-muted-foreground">{c.hint}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-7 flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="relative w-full max-w-xl">
              <span className="sr-only">Search the Daily Bark</span>
              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search stories, tips and questions…"
                className="w-full rounded-full border border-border bg-card py-3 pl-11 pr-4 text-sm text-foreground outline-none transition focus:border-caramel"
              />
            </label>
            {user && (
              <button
                onClick={() => setSavedOnly((v) => !v)}
                aria-pressed={savedOnly}
                className={`rounded-full px-4 py-2.5 text-sm font-bold ${savedOnly ? "bg-mocha text-mocha-foreground" : "bg-card text-muted-foreground ring-1 ring-border hover:bg-oat"}`}
              >
                Saved posts
              </button>
            )}
          </div>
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              What are you looking for?
            </p>
            <div className="flex flex-wrap gap-2">
              {(["All", ...POST_TYPES] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setType(item)}
                  aria-pressed={type === item}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${type === item ? "bg-caramel text-caramel-foreground shadow-cozy" : "bg-card text-muted-foreground ring-1 ring-border hover:bg-oat"}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Pet
            </p>
            <div className="flex flex-wrap gap-2">
              {["All", ...POST_SPECIES].map((item) => (
                <button
                  key={item}
                  onClick={() => setSpecies(item)}
                  aria-pressed={species === item}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${species === item ? "bg-mocha text-mocha-foreground" : "bg-card text-muted-foreground ring-1 ring-border hover:bg-oat"}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <ListSkeleton rows={3} />
        ) : posts.length === 0 ? (
          <div className="rounded-3xl bg-oat p-12 text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-caramel/15 text-caramel">
              <Search className="size-5" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-foreground">
              {savedOnly ? "No saved posts yet" : "Nothing here yet"}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              {savedOnly
                ? "Tap the bookmark on any post to keep it here."
                : "Be the first person to share something with the Daily Bark community."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      <PostComposer
        open={composer.open}
        onOpenChange={(v) => setComposer((c) => ({ ...c, open: v }))}
        type={composer.type}
      />
    </div>
  );
}
