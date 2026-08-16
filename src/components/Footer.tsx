import { Link } from "@tanstack/react-router";
import { PawPrint, Instagram, Facebook, Youtube, Twitter } from "lucide-react";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/neighbourhood-watch", label: "The Neighbourhood Watch" },
  { to: "/pack-social", label: "The Pack Social" },
  { to: "/pro-portal", label: "The Pro Portal" },
  { to: "/daily-bark", label: "The Daily Bark" },
  { to: "/munchie-menu", label: "The Munchie Menu" },
  { to: "/digital-collar", label: "The Digital Collar" },
  { to: "/pro-signup", label: "Join as a Professional" },
] as const;

export function Footer() {
  return (
    <footer className="mt-20 bg-mocha text-mocha-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid size-10 place-items-center rounded-full bg-caramel text-caramel-foreground">
              <PawPrint className="size-5" />
            </span>
            <span className="font-display text-2xl font-bold">The Petwork</span>
          </div>
          <p className="mt-4 max-w-sm text-mocha-foreground/80">
            A home for every pet and every owner. Built in Delhi NCR, for the people who share their
            homes, their sofas and their evenings with animals.
          </p>
          <p className="mt-4 text-sm text-mocha-foreground/70">
            Delhi Animal Helpline · 011-23258100
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wide text-caramel">Explore</h4>
          <ul className="mt-4 space-y-2">
            {LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-sm text-mocha-foreground/80 transition-colors hover:text-caramel">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wide text-caramel">Say hello</h4>
          <p className="mt-4 text-sm text-mocha-foreground/80">hello@thepetwork.com</p>
          <p className="text-sm text-mocha-foreground/80">thepetwork.com</p>
          <p className="text-sm text-mocha-foreground/80">Hauz Khas, New Delhi</p>
          <div className="mt-5 flex gap-3">
            {[Instagram, Facebook, Youtube, Twitter].map((Icon, i) => (
              <span
                key={i}
                className="grid size-9 place-items-center rounded-full bg-sidebar-accent text-mocha-foreground/85 transition-colors hover:bg-caramel hover:text-caramel-foreground"
              >
                <Icon className="size-4" />
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-sidebar-border py-5 text-center text-xs text-mocha-foreground/60">
        © 2026 The Petwork · thepetwork.com · Made warmly in Delhi NCR
      </div>
    </footer>
  );
}
