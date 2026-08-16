import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, ShieldCheck, Navigation, ArrowRight } from "lucide-react";
import { EmptyMark } from "@/components/EmptyMark";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/pro-portal")({
  head: () => ({
    meta: [
      { title: "The Pro Portal — Verified Pet Pros in Delhi NCR | The Petwork" },
      {
        name: "description",
        content:
          "The Petwork Pro Network is opening in Delhi NCR. Walkers, groomers, vets and trainers are being verified now — apply to join the first cohort.",
      },
      { property: "og:title", content: "The Pro Portal — Verified Pet Pros in Delhi NCR" },
      {
        property: "og:description",
        content: "Verification-first hiring with escrow payments and GPS-tracked sessions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/pro-portal" },
    ],
    links: [{ rel: "canonical", href: "/pro-portal" }],
  }),
  component: ProPortal,
});

const TABS = [
  { key: "walkers", label: "Dog Walkers" },
  { key: "groomers", label: "Groomers" },
  { key: "vets", label: "Vets" },
  { key: "sitters", label: "Temporary Sitters" },
  { key: "trainers", label: "Trainers" },
] as const;


const STEPS = [
  { icon: Search, title: "Browse verified professionals", text: "Every pro is ID-checked, reference-called and video-interviewed by our team before they appear here." },
  { icon: ShieldCheck, title: "Book securely with escrow payment", text: "Your money is held safely by The Petwork and released to the pro only after the session is complete." },
  { icon: Navigation, title: "Track in real time with GPS", text: "Watch the walk route live, get start and end photos, and see exactly how long your dog was out." },
];

function ProPortal() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("walkers");
  const label = TABS.find((t) => t.key === tab)!.label.toLowerCase();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-4xl text-foreground sm:text-5xl">The Pro Portal</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Leaving your dog with a stranger is a leap of faith. We do the background work first, so you
        only meet people we would trust with our own pets — which is why nobody is listed here until
        they have cleared verification.
      </p>

      <div className="mt-8 inline-flex flex-wrap gap-2 rounded-full bg-oat p-1.5">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
              tab === t.key
                ? "bg-caramel text-caramel-foreground shadow-cozy"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <section className="card-cozy mt-8 flex flex-col items-center px-6 py-14 text-center">
        <EmptyMark />
        <h2 className="mt-4 text-2xl text-foreground">No verified {label} listed yet</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Applications for the first Delhi NCR cohort are open. Profiles appear here only after ID
          checks, reference calls and a video interview are complete.
        </p>
        <Button
          asChild
          size="lg"
          className="mt-7 rounded-full bg-caramel px-7 text-base text-caramel-foreground shadow-cozy hover:bg-caramel/90"
        >
          <Link to="/pro-signup">Apply to join the network</Link>
        </Button>
      </section>

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
        <div className="flex-1">
          <h2 className="text-2xl text-mocha-foreground">
            Are you a pet professional? Join The Petwork Pro Network
          </h2>
          <p className="mt-2 text-sm text-mocha-foreground/80">
            Steady bookings across Delhi NCR, payments held in escrow and released on completion,
            and a profile that shows owners you have been checked properly.
          </p>
        </div>
        <Button
          asChild
          size="lg"
          className="shrink-0 rounded-full bg-caramel px-7 text-base text-caramel-foreground hover:bg-caramel/90"
        >
          <Link to="/pro-signup">
            Apply Now <ArrowRight className="size-4" />
          </Link>
        </Button>
      </section>
    </div>
  );
}
