import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Bookmark,
  Camera,
  FileText,
  HelpCircle,
  Image as ImageIcon,
  PenLine,
  Plus,
  Search,
  Send,
  Share2,
  Sparkles,
  Video,
  X,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/daily-bark")({
  head: () => ({
    meta: [
      {
        title: "The Daily Bark | The Petwork",
      },
      {
        name: "description",
        content:
          "Stories, tips, questions and experiences from pet parents across Delhi NCR.",
      },
      {
        property: "og:title",
        content: "The Daily Bark | The Petwork",
      },
      {
        property: "og:description",
        content:
          "A community space for pet parents to share stories, tips, questions and experiences.",
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

const POST_TYPES = [
  "All",
  "Stories",
  "Tips",
  "Questions",
  "Blogs",
  "Videos",
] as const;

type PostType = Exclude<(typeof POST_TYPES)[number], "All">;

type Post = {
  id: string;
  type: PostType;
  title: string;
  content: string;
  author: string;
  species: (typeof SPECIES)[number];
  time: string;
  likes: number;
  comments: number;
  saved: boolean;
};

const INITIAL_POSTS: Post[] = [
  {
    id: "story-1",
    type: "Stories",
    title: "The little things that make pet parenting worth it",
    content:
      "Sometimes it is the smallest moments that make having a pet feel so special. The excited greeting when you get home, the sleepy afternoon naps and all the little routines you build together.",
    author: "The Petwork Community",
    species: "Dogs",
    time: "Today",
    likes: 24,
    comments: 6,
    saved: false,
  },
  {
    id: "tip-1",
    type: "Tips",
    title: "A reminder for new pet parents",
    content:
      "Save the contact details of your regular vet, nearest emergency clinic and a trusted pet sitter somewhere easy to find. You do not want to be searching for them in a stressful moment.",
    author: "The Petwork Team",
    species: "Other",
    time: "Yesterday",
    likes: 31,
    comments: 8,
    saved: false,
  },
  {
    id: "question-1",
    type: "Questions",
    title: "What is something you wish you knew before getting your first pet?",
    content:
      "Everyone has that one piece of advice they wish someone had told them earlier. Share yours with the community.",
    author: "The Petwork Community",
    species: "Other",
    time: "2 days ago",
    likes: 18,
    comments: 12,
    saved: false,
  },
  {
    id: "blog-1",
    type: "Blogs",
    title: "Things I wish someone had told me before adopting",
    content:
      "Adopting a pet is exciting, but there are so many practical things you only learn once you start living together. From finding the right vet to understanding their routines, here are some lessons worth knowing beforehand.",
    author: "The Petwork Community",
    species: "Cats",
    time: "3 days ago",
    likes: 42,
    comments: 14,
    saved: false,
  },
];

function DailyBark() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [type, setType] =
    useState<(typeof POST_TYPES)[number]>("All");
  const [species, setSpecies] =
    useState<(typeof SPECIES)[number]>("All");
  const [search, setSearch] = useState("");
  const [showComposer, setShowComposer] = useState(false);
  const [composerType, setComposerType] = useState<PostType>("Stories");

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newSpecies, setNewSpecies] =
    useState<(typeof SPECIES)[number]>("Dogs");

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesType =
        type === "All" || post.type === type;

      const matchesSpecies =
        species === "All" ||
        post.species === species ||
        post.species === "Other";

      const searchText =
        `${post.title} ${post.content} ${post.author}`.toLowerCase();

      const matchesSearch =
        !search.trim() ||
        searchText.includes(search.toLowerCase());

      return matchesType && matchesSpecies && matchesSearch;
    });
  }, [posts, type, species, search]);

  function openComposer(selectedType: PostType) {
    setComposerType(selectedType);
    setShowComposer(true);
  }

  function closeComposer() {
    setShowComposer(false);
    setNewTitle("");
    setNewContent("");
    setNewSpecies("Dogs");
  }

  function submitPost() {
    if (!newTitle.trim() || !newContent.trim()) {
      toast.error("Add a title and something to share first.");
      return;
    }

    const newPost: Post = {
      id: `post-${Date.now()}`,
      type: composerType,
      title: newTitle.trim(),
      content: newContent.trim(),
      author: "You",
      species: newSpecies,
      time: "Just now",
      likes: 0,
      comments: 0,
      saved: false,
    };

    setPosts((prev) => [newPost, ...prev]);
    closeComposer();

    toast.success(
      "Your post has been submitted for review.",
    );
  }

  function toggleSave(id: string) {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? { ...post, saved: !post.saved }
          : post,
      ),
    );

    toast.success("Saved to your collection.");
  }

  function sharePost(post: Post) {
    const text = `${post.title} | The Daily Bark`;

    if (navigator.share) {
      navigator
        .share({
          title: post.title,
          text,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      toast.success("Link copied.");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* HERO */}
      <section className="border-b border-border bg-oat/40">
        <div className="mx-auto max-w-5xl px-4 py-14 text-center sm:py-20">
          <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-caramel/15 text-caramel">
            <Sparkles className="size-7" />
          </div>

          <h1 className="text-4xl leading-tight text-foreground sm:text-5xl">
            The Daily Bark
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Stories, questions, tips and little moments from the people
            who know what it is really like to live with pets.
          </p>

          <button
            onClick={() => openComposer("Stories")}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-caramel px-6 py-3 text-sm font-bold text-caramel-foreground shadow-cozy transition-transform hover:-translate-y-0.5"
          >
            <Plus className="size-4" />
            Share something
          </button>

          <p className="mx-auto mt-3 max-w-md text-xs text-muted-foreground">
            Every submission is reviewed before it becomes part of the
            public Daily Bark.
          </p>
        </div>
      </section>

      {/* CREATE OPTIONS */}
      <section className="mx-auto max-w-7xl px-4 pt-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <button
            onClick={() => openComposer("Stories")}
            className="card-cozy flex items-center gap-3 p-4 text-left transition-transform hover:-translate-y-0.5"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-caramel/15 text-caramel">
              <PenLine className="size-5" />
            </span>
            <span>
              <span className="block font-bold text-foreground">
                Share a story
              </span>
              <span className="text-xs text-muted-foreground">
                Tell the community something
              </span>
            </span>
          </button>

          <button
            onClick={() => openComposer("Tips")}
            className="card-cozy flex items-center gap-3 p-4 text-left transition-transform hover:-translate-y-0.5"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-caramel/15 text-caramel">
              <Sparkles className="size-5" />
            </span>
            <span>
              <span className="block font-bold text-foreground">
                Share a tip
              </span>
              <span className="text-xs text-muted-foreground">
                Something other pet parents should know
              </span>
            </span>
          </button>

          <button
            onClick={() => openComposer("Questions")}
            className="card-cozy flex items-center gap-3 p-4 text-left transition-transform hover:-translate-y-0.5"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-caramel/15 text-caramel">
              <HelpCircle className="size-5" />
            </span>
            <span>
              <span className="block font-bold text-foreground">
                Ask something
              </span>
              <span className="text-xs text-muted-foreground">
                Get perspectives from pet parents
              </span>
            </span>
          </button>

          <button
            onClick={() => openComposer("Blogs")}
            className="card-cozy flex items-center gap-3 p-4 text-left transition-transform hover:-translate-y-0.5"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-caramel/15 text-caramel">
              <FileText className="size-5" />
            </span>
            <span>
              <span className="block font-bold text-foreground">
                Write a blog
              </span>
              <span className="text-xs text-muted-foreground">
                Tell a longer story or guide
              </span>
            </span>
          </button>

          <button
            onClick={() => openComposer("Videos")}
            className="card-cozy flex items-center gap-3 p-4 text-left transition-transform hover:-translate-y-0.5"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-caramel/15 text-caramel">
              <Video className="size-5" />
            </span>
            <span>
              <span className="block font-bold text-foreground">
                Share a video
              </span>
              <span className="text-xs text-muted-foreground">
                Recommend something useful
              </span>
            </span>
          </button>
        </div>
      </section>

      {/* FEED */}
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-7 flex flex-col gap-4">
          {/* SEARCH */}
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search stories, tips and questions..."
              className="w-full rounded-full border border-border bg-card py-3 pl-11 pr-4 text-sm text-foreground outline-none transition focus:border-caramel"
            />
          </div>

          {/* TYPE FILTER */}
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              What are you looking for?
            </p>

            <div className="flex flex-wrap gap-2">
              {POST_TYPES.map((item) => (
                <button
                  key={item}
                  onClick={() => setType(item)}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
                    type === item
                      ? "bg-caramel text-caramel-foreground shadow-cozy"
                      : "bg-card text-muted-foreground ring-1 ring-border hover:bg-accent"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* SPECIES FILTER */}
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Pet
            </p>

            <div className="flex flex-wrap gap-2">
              {SPECIES.map((item) => (
                <button
                  key={item}
                  onClick={() => setSpecies(item)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                    species === item
                      ? "bg-mocha text-mocha-foreground"
                      : "bg-card text-muted-foreground ring-1 ring-border hover:bg-accent"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* POSTS */}
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="card-cozy flex flex-col overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="grid size-10 place-items-center rounded-full bg-caramel/15 text-sm font-bold text-caramel">
                      {post.author.charAt(0)}
                    </div>

                    <div>
                      <p className="text-sm font-bold text-foreground">
                        {post.author}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {post.time}
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-oat px-3 py-1 text-xs font-bold text-caramel">
                    {post.type}
                  </span>
                </div>

                <h2 className="mt-5 text-xl leading-snug text-foreground">
                  {post.title}
                </h2>

                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {post.content}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-muted-foreground">
                    {post.species}
                  </span>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                  <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground">
                    <span>♡ {post.likes}</span>
                    <span>💬 {post.comments}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSave(post.id)}
                      aria-label={
                        post.saved ? "Remove from saved" : "Save post"
                      }
                      className="grid size-9 place-items-center rounded-full bg-accent text-muted-foreground transition-colors hover:bg-caramel hover:text-caramel-foreground"
                    >
                      <Bookmark
                        className={`size-4 ${
                          post.saved ? "fill-current" : ""
                        }`}
                      />
                    </button>

                    <button
                      onClick={() => sharePost(post)}
                      aria-label="Share post"
                      className="grid size-9 place-items-center rounded-full bg-accent text-muted-foreground transition-colors hover:bg-caramel hover:text-caramel-foreground"
                    >
                      <Share2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="rounded-3xl bg-oat p-12 text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-caramel/15 text-caramel">
              <Search className="size-5" />
            </div>

            <h2 className="mt-4 text-xl font-bold text-foreground">
              Nothing here yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Be the first person to share something with the Daily Bark
              community.
            </p>

            <button
              onClick={() => openComposer("Stories")}
              className="mt-5 rounded-full bg-caramel px-5 py-2.5 text-sm font-bold text-caramel-foreground"
            >
              Share something
            </button>
          </div>
        )}
      </main>

      {/* COMPOSER MODAL */}
      {showComposer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-caramel">
                  The Daily Bark
                </p>

                <h2 className="mt-1 text-2xl text-foreground">
                  {composerType === "Blogs"
                    ? "Write a blog"
                    : composerType === "Questions"
                      ? "Ask the community"
                      : composerType === "Tips"
                        ? "Share a tip"
                        : composerType === "Videos"
                          ? "Share a video"
                          : "Share a story"}
                </h2>
              </div>

              <button
                onClick={closeComposer}
                className="grid size-9 place-items-center rounded-full bg-accent text-muted-foreground hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-5 p-6">
              {/* TITLE */}
              <div>
                <label className="mb-2 block text-sm font-bold text-foreground">
                  {composerType === "Questions"
                    ? "Your question"
                    : composerType === "Blogs"
                      ? "Blog title"
                      : "Title"}
                </label>

                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={
                    composerType === "Questions"
                      ? "What would you like to ask?"
                      : composerType === "Blogs"
                        ? "Give your blog a title..."
                        : "Give your post a title..."
                  }
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-caramel"
                />
              </div>

              {/* CONTENT */}
              <div>
                <label className="mb-2 block text-sm font-bold text-foreground">
                  {composerType === "Blogs"
                    ? "Your story"
                    : composerType === "Questions"
                      ? "Tell us a little more"
                      : "What would you like to share?"}
                </label>

                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={composerType === "Blogs" ? 10 : 6}
                  placeholder={
                    composerType === "Blogs"
                      ? "Write your story or guide here..."
                      : "Write something the community would find useful..."
                  }
                  className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm leading-relaxed text-foreground outline-none focus:border-caramel"
                />
              </div>

              {/* SPECIES */}
              <div>
                <label className="mb-2 block text-sm font-bold text-foreground">
                  Which pet is this about?
                </label>

                <div className="flex flex-wrap gap-2">
                  {SPECIES.filter((s) => s !== "All").map((item) => (
                    <button
                      key={item}
                      onClick={() => setNewSpecies(item)}
                      className={`rounded-full px-3.5 py-2 text-xs font-bold transition-all ${
                        newSpecies === item
                          ? "bg-caramel text-caramel-foreground"
                          : "bg-accent text-muted-foreground hover:bg-oat"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* FUTURE MEDIA */}
              <div className="rounded-2xl bg-oat/70 p-4">
                <div className="flex items-start gap-3">
                  <ImageIcon className="mt-0.5 size-5 text-caramel" />

                  <div>
                    <p className="text-sm font-bold text-foreground">
                      Photos, videos and links
                    </p>

                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      Media uploads will be available once community
                      accounts and storage are connected.
                    </p>
                  </div>
                </div>
              </div>

              {/* REVIEW NOTICE */}
              <div className="rounded-2xl border border-border bg-background p-4">
                <div className="flex items-start gap-3">
                  <Send className="mt-0.5 size-5 text-caramel" />

                  <div>
                    <p className="text-sm font-bold text-foreground">
                      A quick review first
                    </p>

                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      Your submission will be reviewed before appearing
                      publicly. This helps us keep the Daily Bark useful,
                      respectful and safe for pet owners.
                    </p>
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  onClick={closeComposer}
                  className="rounded-full bg-accent px-5 py-3 text-sm font-bold text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>

                <button
                  onClick={submitPost}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-caramel px-6 py-3 text-sm font-bold text-caramel-foreground shadow-cozy"
                >
                  <Send className="size-4" />
                  Submit for review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
