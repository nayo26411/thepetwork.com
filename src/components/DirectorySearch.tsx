import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, MapPin } from "lucide-react";
import { PET_PLACES } from "@/data/locations";

const PAGES = [
  { label: "Hire a walker, groomer or vet", to: "/pro-portal" },
  { label: "Recipes by species", to: "/munchie-menu" },
  { label: "Emergency & 24×7 vets", to: "/emergency" },
  { label: "Beginner video guides", to: "/daily-bark" },
  { label: "Community groups & shelters", to: "/pack-social" },
  { label: "My pet's records & reminders", to: "/digital-collar" },
] as const;

/** Directory-style search across mapped places and Petwork sections. */
export function DirectorySearch() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const term = q.trim().toLowerCase();

  const places = useMemo(() => {
    if (term.length < 2) return [];
    return PET_PLACES.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.address.toLowerCase().includes(term),
    ).slice(0, 6);
  }, [term]);

  const pages = useMemo(
    () => (term.length < 2 ? [] : PAGES.filter((p) => p.label.toLowerCase().includes(term))),
    [term],
  );

  const hasResults = places.length > 0 || pages.length > 0;

  return (
    <div ref={boxRef} className="relative mx-auto w-full max-w-2xl">
      <div className="flex items-center gap-3 rounded-full border border-border bg-card px-5 py-3.5 shadow-cozy focus-within:border-caramel">
        <Search className="size-5 shrink-0 text-caramel" />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          maxLength={80}
          aria-label="Search stays, groomers, vets, cafes"
          placeholder="Search stays, groomers, vets, cafes..."
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground sm:text-base"
        />
      </div>

      {open && term.length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-border bg-popover p-2 text-left shadow-lift">
          {!hasResults && (
            <p className="px-3 py-4 text-sm text-muted-foreground">
              Nothing matched “{q}”. Try “vet”, “cafe”, “Noida” or “grooming”.
            </p>
          )}
          {places.map((p) => (
            <Link
              key={p.id}
              to="/neighbourhood-watch"
              onClick={() => setOpen(false)}
              className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-oat"
            >
              <MapPin className="mt-0.5 size-4 shrink-0 text-caramel" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-foreground">{p.name}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {p.category} · {p.address}
                </span>
              </span>
            </Link>
          ))}
          {pages.map((p) => (
            <Link
              key={p.to}
              to={p.to}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-2.5 text-sm font-bold text-caramel transition-colors hover:bg-oat"
            >
              {p.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
