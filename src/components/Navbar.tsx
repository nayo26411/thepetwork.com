import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Menu,
  X,
  LogOut,
  ShieldCheck,
  ChevronDown,
  MapPin,
  Users,
  BriefcaseBusiness,
  PlayCircle,
  CookingPot,
  Dog,
  Landmark,
  Siren,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoSwitcher } from "@/components/app/DemoSwitcher";
import { NotificationBell } from "@/components/app/NotificationBell";
import { MENU_LINKS, UserMenu } from "@/components/app/UserMenu";
import { signOut } from "@/mock/actions";
import { useDemo, useSession } from "@/mock/store";
import favicon from "@/assets/favicon.ico";

const EXPLORE = [
  {
    to: "/neighbourhood-watch",
    label: "Neighbourhood Watch",
    icon: MapPin,
    hint: "Map of pet friendly places",
  },
  { to: "/pack-social", label: "The Pack Social", icon: Users, hint: "Communities and shelters" },
  {
    to: "/pro-portal",
    label: "Pro Portal",
    icon: BriefcaseBusiness,
    hint: "Verified walkers, groomers, vets",
  },
  { to: "/daily-bark", label: "Daily Bark", icon: PlayCircle, hint: "Stories, tips and questions" },
  { to: "/munchie-menu", label: "Munchie Menu", icon: CookingPot, hint: "Vet approved recipes" },
  { to: "/digital-collar", label: "Digital Collar", icon: Dog, hint: "Your pet's records" },
  {
    to: "/municipal-rules",
    label: "Municipal Rules",
    icon: Landmark,
    hint: "Registration, leash and waste rules by city",
  },
  {
    to: "/emergency",
    label: "Emergency",
    icon: Siren,
    hint: "24×7 vets and rescue, no login needed",
  },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [explore, setExplore] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user } = useSession();
  const data = useDemo();
  const navigate = useNavigate();

  const unreadMessages = user
    ? data.messages.filter((m) => {
        if (m.readBy.includes(user.id)) return false;
        const t = data.threads.find((x) => x.id === m.threadId);
        return !!t && (t.ownerId === user.id || t.proId === user.id);
      }).length
    : 0;

  useEffect(() => {
    if (!explore) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setExplore(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setExplore(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [explore]);

  return (
    <header
      data-menu-open={open || undefined}
      className="sticky top-0 z-50 border-b border-sidebar-border bg-mocha text-mocha-foreground"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <Link to="/" className="flex shrink-0 items-center gap-2" onClick={() => setOpen(false)}>
          <span className="grid size-9 place-items-center rounded-full bg-caramel text-caramel-foreground">
            <img src={favicon} alt="" className="size-7 object-contain" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight">The Petwork</span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Main">
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
              aria-haspopup="true"
              className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold text-mocha-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-mocha-foreground"
            >
              Explore
              <ChevronDown
                className={`size-4 transition-transform ${explore ? "rotate-180" : ""}`}
              />
            </button>
            {explore && (
              <div className="absolute right-0 top-full mt-2 grid w-[34rem] grid-cols-2 gap-1 overflow-hidden rounded-2xl border border-border bg-popover p-2 text-popover-foreground shadow-lift">
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

        <div className="ml-auto flex items-center gap-1.5 lg:ml-2">
          <span className="hidden sm:inline-flex">
            <DemoSwitcher />
          </span>
          {user ? (
            <>
              {user.role !== "founder" && (
                <Link
                  to="/messages"
                  aria-label={`Messages${unreadMessages ? `, ${unreadMessages} unread` : ""}`}
                  className="relative grid size-9 place-items-center rounded-full hover:bg-sidebar-accent"
                >
                  <MessageCircle className="size-5" />
                  {unreadMessages > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-caramel px-1 text-[0.6875rem] font-extrabold text-caramel-foreground ring-2 ring-mocha">
                      {unreadMessages}
                    </span>
                  )}
                </Link>
              )}
              <NotificationBell userId={user.id} />
              <span className="hidden lg:inline-flex">
                <UserMenu user={user} />
              </span>
            </>
          ) : (
            <>
              <Button
                asChild
                size="sm"
                variant="ghost"
                className="hidden text-mocha-foreground hover:bg-sidebar-accent hover:text-mocha-foreground sm:inline-flex"
              >
                <Link to="/login">Sign in</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="hidden bg-caramel text-caramel-foreground hover:bg-caramel/90 sm:inline-flex"
              >
                <Link to="/signup">Join free</Link>
              </Button>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="hidden border-mocha-foreground/30 bg-transparent text-mocha-foreground hover:bg-sidebar-accent hover:text-mocha-foreground xl:inline-flex"
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
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-sidebar-border px-4 pb-5 lg:hidden">
          <nav className="flex flex-col py-2" aria-label="Mobile">
            <Link
              to="/"
              activeOptions={{ exact: true }}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-2.5 text-sm font-semibold text-mocha-foreground/85 hover:bg-sidebar-accent data-[status=active]:text-blush"
            >
              Home
            </Link>
            {user && (
              <>
                <span className="px-3 pb-1 pt-3 text-[0.6875rem] font-extrabold uppercase tracking-[0.14em] text-mocha-foreground/45">
                  {user.name}
                </span>
                {MENU_LINKS[user.role].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-mocha-foreground/85 hover:bg-sidebar-accent data-[status=active]:text-blush"
                  >
                    <item.icon className="size-4 shrink-0" />
                    {item.label}
                  </Link>
                ))}
              </>
            )}
            <span className="px-3 pb-1 pt-3 text-[0.6875rem] font-extrabold uppercase tracking-[0.14em] text-mocha-foreground/45">
              Explore
            </span>
            {EXPLORE.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-mocha-foreground/85 hover:bg-sidebar-accent data-[status=active]:text-blush"
              >
                <item.icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mb-3 sm:hidden">
            <DemoSwitcher compact />
          </div>

          {user ? (
            <Button
              variant="outline"
              className="w-full border-mocha-foreground/30 bg-transparent text-mocha-foreground hover:bg-sidebar-accent hover:text-mocha-foreground"
              onClick={() => {
                signOut();
                setOpen(false);
                void navigate({ to: "/" });
              }}
            >
              <LogOut className="size-4" /> Sign out
            </Button>
          ) : (
            <div className="flex flex-col gap-2">
              <Button asChild className="bg-caramel text-caramel-foreground hover:bg-caramel/90">
                <Link to="/signup" onClick={() => setOpen(false)}>
                  Join free
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-mocha-foreground/30 bg-transparent text-mocha-foreground hover:bg-sidebar-accent hover:text-mocha-foreground"
              >
                <Link to="/login" onClick={() => setOpen(false)}>
                  Sign in
                </Link>
              </Button>
              <Link
                to="/founder-access"
                onClick={() => setOpen(false)}
                className="mt-1 text-center text-xs font-bold text-mocha-foreground/70 hover:text-blush"
              >
                Founder Access
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
