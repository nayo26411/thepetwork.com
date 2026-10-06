import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BadgeCheck, MapPin, Plus, Search, Users } from "lucide-react";
import { toast } from "sonner";
import { FormDialog, str } from "@/components/app/FormDialog";
import { ListSkeleton, useBusy, useFakeLoading } from "@/components/app/ui";
import { useRequireLogin } from "@/components/app/useRequireLogin";
import { Button } from "@/components/ui/button";
import { SHELTERS } from "@/data/content";
import { createCommunity, toggleMembership } from "@/mock/actions";
import { memberCount } from "@/mock/format";
import { useDemo, useSession } from "@/mock/store";
import { COMMUNITY_CATEGORIES, type Community } from "@/mock/types";

export const Route = createFileRoute("/pack-social/")({
  head: () => ({
    meta: [
      { title: "The Pack Social — Delhi NCR Pet Communities | The Petwork" },
      {
        name: "description",
        content:
          "Breed circles, species groups and neighbourhood packs for pet owners across Delhi NCR, plus trusted shelters and rescues.",
      },
    ],
  }),
  component: PackSocial,
});

function PackSocial() {
  const data = useDemo();
  const { user } = useSession();
  const gate = useRequireLogin();
  const navigate = useNavigate();
  const loading = useFakeLoading();
  const [category, setCategory] = useState<string>("All");
  const [q, setQ] = useState("");
  const [creating, setCreating] = useState(false);

  const communities = useMemo(() => {
    const term = q.trim().toLowerCase();
    return data.communities
      .filter((c) => c.status === "active")
      .filter((c) =>
        category === "All"
          ? true
          : category === "Mine"
            ? !!user && c.members.includes(user.id)
            : c.category === category,
      )
      .filter((c) => !term || `${c.name} ${c.description}`.toLowerCase().includes(term))
      .sort((a, b) => memberCount(b) - memberCount(a));
  }, [data.communities, category, q, user]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl text-foreground sm:text-5xl">The Pack Social</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            The best pet advice in Delhi still travels by word of mouth — over chai, in park
            corners, on WhatsApp at midnight. The Pack Social is that conversation, kept in one
            place.
          </p>
        </div>
        <Button
          className="rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
          onClick={() => gate(() => setCreating(true), "Sign in to start a community")}
        >
          <Plus className="size-4" /> Create a community
        </Button>
      </div>

      <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {["All", ...(user ? ["Mine"] : []), ...COMMUNITY_CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={`rounded-full px-4 py-2 text-sm font-bold ${category === c ? "bg-caramel text-caramel-foreground shadow-cozy" : "bg-card text-muted-foreground ring-1 ring-border hover:bg-oat"}`}
            >
              {c === "Mine" ? "My communities" : c}
            </button>
          ))}
        </div>
        <label className="relative w-full lg:w-80">
          <span className="sr-only">Search communities</span>
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search communities"
            className="w-full rounded-full border border-border bg-card py-2.5 pl-11 pr-4 text-sm outline-none focus:border-caramel"
          />
        </label>
      </div>

      <div className="mt-6">
        {loading ? (
          <ListSkeleton rows={2} />
        ) : communities.length === 0 ? (
          <div className="card-cozy p-10 text-center">
            <h2 className="text-xl text-foreground">No communities match</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Start the one you're looking for — you'll be its first member.
            </p>
          </div>
        ) : (
          <>
            <h2 className="sr-only">Communities</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {communities.map((c) => (
                <CommunityCard key={c.id} c={c} />
              ))}
            </div>
          </>
        )}
      </div>

      <h2 className="mt-16 text-2xl text-foreground sm:text-3xl">
        Shelters &amp; rescues in Delhi NCR
      </h2>
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

      <FormDialog
        open={creating}
        onOpenChange={setCreating}
        title="Create a community"
        description="Name it, describe who it's for, and we'll open it to pet owners nearby."
        fields={[
          {
            key: "name",
            label: "Community name",
            required: true,
            placeholder: "Indie Dog Parents, Saket",
            full: true,
          },
          {
            key: "category",
            label: "Category",
            type: "select",
            options: COMMUNITY_CATEGORIES,
            required: true,
            full: true,
          },
          {
            key: "description",
            label: "Description",
            type: "textarea",
            required: true,
            placeholder: "Who is this community for, and what will you talk about?",
          },
        ]}
        initial={{ name: "", category: "Location", description: "" }}
        submitLabel="Create community"
        onSubmit={async (v) => {
          const id = await createCommunity({
            name: str(v["name"]),
            category: str(v["category"]),
            description: str(v["description"]),
          });
          toast.success(`${str(v["name"])} is live`, {
            description: "You're the first member. Invite the people you walk with.",
          });
          void navigate({ to: "/pack-social/$communityId", params: { communityId: id } });
        }}
      />
    </div>
  );
}

function CommunityCard({ c }: { c: Community }) {
  const { user } = useSession();
  const gate = useRequireLogin();
  const [busy, run] = useBusy();
  const member = !!user && c.members.includes(user.id);

  return (
    <article className="card-cozy hover-lift flex flex-col p-7">
      <span className="w-fit rounded-full bg-oat px-3 py-1 text-xs font-bold text-caramel ring-1 ring-border">
        {c.category}
      </span>
      <Link
        to="/pack-social/$communityId"
        params={{ communityId: c.id }}
        className="mt-4 text-xl font-bold text-foreground hover:text-caramel"
      >
        <h3>{c.name}</h3>
      </Link>
      <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-caramel">
        <Users className="size-4" /> {memberCount(c).toLocaleString("en-IN")} members
      </p>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        {c.description}
      </p>
      <div className="mt-5 flex gap-2">
        <Button
          size="sm"
          disabled={busy}
          variant={member ? "outline" : "default"}
          className={`rounded-full ${member ? "" : "bg-caramel text-caramel-foreground hover:bg-caramel/90"}`}
          onClick={() =>
            gate(
              () =>
                void run(async () => {
                  const joined = await toggleMembership(c.id);
                  toast.success(joined ? `You joined ${c.name}` : `You left ${c.name}`);
                }),
              "Sign in to join communities",
            )
          }
        >
          {member ? "Joined ✓" : "Join"}
        </Button>
        <Button asChild size="sm" variant="ghost" className="rounded-full">
          <Link to="/pack-social/$communityId" params={{ communityId: c.id }}>
            Open
          </Link>
        </Button>
      </div>
    </article>
  );
}
