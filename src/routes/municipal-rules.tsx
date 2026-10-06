import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  BadgeInfo,
  CalendarCheck2,
  ExternalLink,
  FileBadge,
  IdCard,
  Info,
  Landmark,
  Leaf,
  Link2,
  Trees,
} from "lucide-react";
import { longDate } from "@/mock/format";
import { useDemo } from "@/mock/store";
import type { MunicipalRule } from "@/mock/types";

export const Route = createFileRoute("/municipal-rules")({
  head: () => ({
    meta: [
      { title: "Municipal Pet Rules in Delhi NCR | The Petwork" },
      {
        name: "description",
        content:
          "Pet registration, licensing, leash, waste and public-space rules for Delhi, Noida, Gurugram and Ghaziabad, with links to each official authority.",
      },
    ],
  }),
  component: MunicipalRules,
});

const SECTIONS: { key: keyof MunicipalRule; label: string; icon: typeof Leaf }[] = [
  { key: "registration", label: "Pet registration", icon: IdCard },
  { key: "licensing", label: "Licensing & renewal", icon: FileBadge },
  { key: "leash", label: "Leash rules", icon: Link2 },
  { key: "waste", label: "Waste disposal", icon: Leaf },
  { key: "publicSpaces", label: "Parks & public spaces", icon: Trees },
  { key: "guidance", label: "Other guidance", icon: BadgeInfo },
];

function MunicipalRules() {
  const data = useDemo();
  const cities = useMemo(
    () => Array.from(new Set(data.municipal.map((r) => r.city))),
    [data.municipal],
  );
  const [city, setCity] = useState(cities[0] ?? "Delhi");
  const rules = data.municipal.filter((r) => r.city === city);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="section-label">Know the rules</p>
      <h1 className="mt-2 text-4xl text-foreground sm:text-5xl">Municipal pet rules</h1>
      <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">
        Registration, licensing, leash and waste rules depend on which local authority your home
        falls under. Pick your city to see what applies, with a link to the official source.
      </p>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-caramel/40 bg-honey/20 p-4 text-sm">
        <Info className="mt-0.5 size-5 shrink-0 text-caramel" />
        <p>
          Rules change, and fees and deadlines are set by each authority. Always check the official
          source before you act — every card shows when our team last checked it.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="City">
        {cities.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={city === c}
            onClick={() => setCity(c)}
            className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all ${city === c ? "bg-caramel text-caramel-foreground shadow-cozy" : "bg-card text-muted-foreground ring-1 ring-border hover:bg-oat"}`}
          >
            {c}
          </button>
        ))}
      </div>

      {rules.length > 1 && (
        <p className="mt-4 text-sm text-muted-foreground">
          {city} has {rules.length} separate authorities. Check your property tax bill or RWA if
          you're not sure which one covers your address.
        </p>
      )}

      <div className="mt-6 space-y-8">
        {rules.map((r) => (
          <section key={r.id} className="card-cozy overflow-hidden">
            <header className="flex flex-col gap-3 bg-mocha px-6 py-5 text-mocha-foreground sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-2xl bg-sidebar-accent">
                  <Landmark className="size-5" />
                </span>
                <div>
                  <h2 className="text-xl text-mocha-foreground">{r.authority}</h2>
                  <p className="flex items-center gap-1.5 text-xs text-mocha-foreground/75">
                    <CalendarCheck2 className="size-3.5" /> Last checked {longDate(r.lastChecked)}
                  </p>
                </div>
              </div>
              <a
                href={r.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-fit items-center gap-1.5 rounded-full bg-caramel px-4 py-2 text-sm font-bold text-caramel-foreground"
              >
                Official source: {r.sourceName} <ExternalLink className="size-3.5" />
              </a>
            </header>
            <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
              {SECTIONS.map((s) => (
                <div key={s.key} className="bg-card p-6">
                  <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-caramel">
                    <s.icon className="size-4" /> {s.label}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                    {String(r[s.key]) || "No specific rule recorded."}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
