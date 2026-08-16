import { Link } from "@tanstack/react-router";
import {
  MapPin,
  Handshake,
  MessageCircleHeart,
  PlayCircle,
  BookOpen,
  Heart,
  Siren,
} from "lucide-react";

/** Category rail of The Petwork's own features, shown under the header on every page. */
export const CATEGORY_NAV = [
  { label: "The Neighbourhood Watch", short: "Neighbourhood Watch", icon: MapPin, to: "/neighbourhood-watch" },
  { label: "The Pro Portal", short: "Pro Portal", icon: Handshake, to: "/pro-portal" },
  { label: "The Pack Social", short: "Pack Social", icon: MessageCircleHeart, to: "/pack-social" },
  { label: "The Daily Bark", short: "Daily Bark", icon: PlayCircle, to: "/daily-bark" },
  { label: "The Munchie Menu", short: "Munchie Menu", icon: BookOpen, to: "/munchie-menu" },
  { label: "The Digital Collar", short: "Digital Collar", icon: Heart, to: "/digital-collar" },
  { label: "Emergency", short: "Emergency", icon: Siren, to: "/emergency" },
] as const;

export function CategoryBar() {
  return (
    <nav
      aria-label="Browse The Petwork"
      className="sticky top-[3.75rem] z-40 border-b border-border bg-cream/95 backdrop-blur"
    >
      <div className="mx-auto max-w-7xl overflow-x-auto px-2">
        <ul className="flex min-w-max items-stretch justify-center gap-1 py-1.5">
          {CATEGORY_NAV.map((item) => (
            <li key={item.label}>
              <Link
                to={item.to}
                title={item.label}
                className="flex w-[6.5rem] flex-col items-center gap-1.5 rounded-2xl px-2 py-2.5 text-center text-muted-foreground transition-colors hover:bg-oat hover:text-foreground data-[status=active]:bg-accent data-[status=active]:text-caramel"
              >
                <item.icon className="size-5 shrink-0" strokeWidth={1.75} />
                <span className="text-[0.6875rem] font-bold leading-tight">{item.short}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
