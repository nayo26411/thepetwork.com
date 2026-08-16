import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Menu,
  X,
  LogOut,
  ShieldCheck,
  Heart,
  ChevronDown,
  MapPin,
  Users,
  BriefcaseBusiness,
  PlayCircle,
  CookingPot,
  Dog,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import favicon from "@/assets/favicon.ico";

const EXPLORE = [
  { to: "/neighbourhood-watch", label: "Neighbourhood Watch", icon: MapPin, hint: "Map of pet friendly places" },
  { to: "/pack-social", label: "The Pack Social", icon: Users, hint: "Communities and shelters" },
  { to: "/pro-portal", label: "Pro Portal", icon: BriefcaseBusiness, hint: "Verified walkers, groomers, vets" },
  { to: "/daily-bark", label: "Daily Bark", icon: PlayCircle, hint: "Beginner video guides" },
  { to: "/munchie-menu", label: "Munchie Menu", icon: CookingPot, hint: "Vet approved recipes" },
  { to: "/digital-collar", label: "Digital Collar", icon: Dog, hint: "Your pet's records" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [explore, setExplore] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { session, signOut } = useAuth();

  useEffect(() => {
    if (!explore) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setExplore(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [explore]);

  return (
    <header className="sticky top-0 z-50 border-b border-sidebar-border bg-mocha text-mocha-foreground">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <Link to="/" className="flex shrink-0 items-center gap-2" onClick={() => setOpen(false)}>
          <span className="grid size-9 place-items-center rounded-full bg-caramel text-caramel-foreground">
           <img
    src={favicon}
    alt="The Petwork"
    className="size-7 object-contain"
  />
          </span>
          <span className="font-display text-xl font-bold tracking-tight">The Petwork</span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            className="rounded-full px-3.5 py-2 text-sm font-semibold text-mocha-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-mocha-foreground data-[status=active]:bg-sidebar-accent data-[status=active]:text-mocha-foreground"
          >
            Home
          </Link>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setExplore((v) => !v)}
              aria-expanded={explore}
              className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold text-mocha-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-mocha-foreground"
            >
              Explore
              <ChevronDown className={`size-4 transition-transform ${explore ? "rotate-180" : ""}`} />
            </button>
            {explore && (
              <div className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-2xl border border-border bg-popover p-2 text-popover-foreground shadow-lift">
                {EXPLORE.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setExplore(false)}
                    className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-oat"
                  >
                    <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-oat text-caramel ring-1 ring-border">
                      <item.icon className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold">{item.label}</span>
                      <span className="block text-xs text-muted-foreground">{item.hint}</span>
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>


        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          {session ? (
            <>
              <span className="hidden text-sm font-semibold sm:inline">
                Hi, {session.name.split(" ")[0]}
              </span>
              <Button size="sm" variant="ghost" className="text-mocha-foreground hover:bg-sidebar-accent" onClick={signOut}>
                <LogOut className="size-4" /> <span className="hidden sm:inline">Sign out</span>
              </Button>
            </>
          ) : (
            <>
              <Button asChild size="sm" className="hidden bg-caramel text-caramel-foreground hover:bg-caramel/90 sm:inline-flex">
                <Link to="/login">
                  <Heart className="size-4" /> I&apos;m a Pet Owner
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="hidden border-mocha-foreground/30 bg-transparent text-mocha-foreground hover:bg-sidebar-accent hover:text-mocha-foreground sm:inline-flex"
              >
                <Link to="/founder-access">
                  <ShieldCheck className="size-4" /> Founder Access
                </Link>
              </Button>
            </>
          )}
          <button
            className="grid size-9 place-items-center rounded-full hover:bg-sidebar-accent lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-sidebar-border px-4 pb-4 lg:hidden">
          <nav className="flex flex-col py-2">
            <Link
              to="/"
              activeOptions={{ exact: true }}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-2.5 text-sm font-semibold text-mocha-foreground/85 hover:bg-sidebar-accent data-[status=active]:text-caramel"
            >
              Home
            </Link>
            <span className="px-3 pb-1 pt-3 text-[0.6875rem] font-extrabold uppercase tracking-[0.14em] text-mocha-foreground/45">
              Explore
            </span>
            {EXPLORE.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-mocha-foreground/85 hover:bg-sidebar-accent data-[status=active]:text-caramel"
              >
                <item.icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            ))}
          </nav>

          {!session && (
            <div className="flex flex-col gap-2">
              <Button asChild className="bg-caramel text-caramel-foreground hover:bg-caramel/90">
                <Link to="/login" onClick={() => setOpen(false)}>
                  I&apos;m a Pet Owner
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-mocha-foreground/30 bg-transparent text-mocha-foreground hover:bg-sidebar-accent hover:text-mocha-foreground"
              >
                <Link to="/founder-access" onClick={() => setOpen(false)}>
                  Founder Access
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
