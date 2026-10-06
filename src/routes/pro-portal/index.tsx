import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, MessageCircle, Search, ShieldCheck, CalendarCheck } from "lucide-react";
import { ProCard } from "@/components/app/ProCard";
import { EmptyState, ListSkeleton, useFakeLoading } from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/mock/store";
import { PRO_TYPES, type ProType } from "@/mock/types";

export const Route = createFileRoute("/pro-portal/")({
  head: () => ({
    meta: [
      { title: "The Pro Portal — Verified Pet Pros in Delhi NCR | The Petwork" },
      {
        name: "description",
        content:
          "Book verified dog walkers, groomers, sitters, trainers and vets across Delhi NCR. Every professional is ID-checked, reference-called and video-interviewed.",
      },
      { property: "og:title", content: "The Pro Portal — Verified Pet Pros in Delhi NCR" },
    ],
  }),
  component: ProPortal,
});

const TABS: { key: "all" | ProType; label: string }[] = [
  { key: "all", label: "Everyone" },
  { key: "Dog Walker", label: "Dog Walkers" },
  { key: "Groomer", label: "Groomers" },
  { key: "Vet", label: "Vets" },
  { key: "Sitter", label: "Sitters" },
  { key: "Trainer", label: "Trainers" },
];

const STEPS = [
  {
    icon: Search,
    title: "Browse verified professionals",
    text: "Every pro is ID-checked, reference-called and video-interviewed by our team before they appear here.",
  },
  {
    icon: CalendarCheck,
    title: "Request a booking",
    text: "Pick your pet, a day and a time slot. The professional confirms or suggests another time.",
  },
  {
    icon: MessageCircle,
    title: "Stay in touch",
    text: "Message your professional directly and get updates on every booking in one place.",
  },
];

function ProPortal() {
  const data = useDemo();
  const loading = useFakeLoading();
  const [tab, setTab] = useState<"all" | ProType>("all");
  const [q, setQ] = useState("");

  const pros = useMemo(() => {
    const term = q.trim().toLowerCase();
    return data.pros
      .filter((p) => p.listed)
      .map((p) => ({ pro: p, user: data.users.find((u) => u.id === p.userId)! }))
      .filter(({ pro, user }) => user && user.status === "active")
      .filter(({ pro }) => tab === "all" || pro.types.includes(tab))
      .filter(
        ({ pro, user }) =>
          !term ||
          `${user.name} ${pro.area} ${pro.headline} ${pro.services.join(" ")}`
            .toLowerCase()
            .includes(term),
      )
      .sort((a, b) => b.pro.rating - a.pro.rating);
  }, [data.pros, data.users, tab, q]);

  const label = TABS.find((t) => t.key === tab)!.label.toLowerCase();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-4xl text-foreground sm:text-5xl">The Pro Portal</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Leaving your pet with a stranger is a leap of faith. We do the background work first, so you
        only meet people we would trust with our own pets.
      </p>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div
          className="inline-flex max-w-full flex-wrap gap-2 rounded-3xl bg-oat p-1.5"
          role="tablist"
        >
          {TABS.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
                tab === t.key
                  ? "bg-caramel text-caramel-foreground shadow-cozy"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <label className="relative w-full lg:w-80">
          <span className="sr-only">Search professionals</span>
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, area or service"
            className="w-full rounded-full border border-border bg-card py-2.5 pl-11 pr-4 text-sm outline-none focus:border-caramel"
          />
        </label>
      </div>

      <div className="mt-8">
        {loading ? (
          <ListSkeleton rows={3} />
        ) : pros.length === 0 ? (
          <EmptyState
            title={`No verified ${label} found`}
            text={
              q
                ? "Try a different search, or browse everyone."
                : "Profiles appear here only after ID checks, reference calls and a video interview are complete."
            }
            action={
              <Button
                asChild
                className="rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
              >
                <Link to="/signup" search={{ role: "pro" }}>
                  Apply to join the network
                </Link>
              </Button>
            }
          />
        ) : (
          <>
            <h2 className="mb-4 font-sans text-sm font-normal text-muted-foreground">
              {pros.length} verified professional{pros.length === 1 ? "" : "s"}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pros.map(({ pro, user }) => (
                <ProCard key={pro.userId} pro={pro} user={user} />
              ))}
            </div>
          </>
        )}
      </div>

      <section className="mt-16">
        <h2 className="text-2xl text-foreground sm:text-3xl">How it works</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.title} className="card-cozy p-7">
              <span className="grid size-12 place-items-center rounded-2xl bg-accent text-caramel">
                <s.icon className="size-6" />
              </span>
              <p className="mt-4 text-xs font-bold uppercase tracking-wide text-caramel">
                Step {i + 1}
              </p>
              <h3 className="mt-1 text-lg text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 flex flex-col items-start gap-5 rounded-3xl bg-mocha px-7 py-9 text-mocha-foreground sm:flex-row sm:items-center">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-sidebar-accent text-mocha-foreground">
          <ShieldCheck className="size-6" />
        </span>
        <div className="flex-1">
          <h2 className="text-2xl text-mocha-foreground">
            Are you a pet professional? Join The Petwork Pro Network
          </h2>
          <p className="mt-2 text-sm text-mocha-foreground/80">
            Create an account, complete verification (ID, two references and a short video), and
            start receiving booking requests across Delhi NCR.
          </p>
        </div>
        <Button
          asChild
          size="lg"
          className="shrink-0 rounded-full bg-caramel px-7 text-base text-caramel-foreground hover:bg-caramel/90"
        >
          <Link to="/signup" search={{ role: "pro" }}>
            Apply now <ArrowRight className="size-4" />
          </Link>
        </Button>
      </section>
    </div>
  );
}
