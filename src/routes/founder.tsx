import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  BookOpenText,
  CalendarCheck,
  ClipboardList,
  Flag,
  LayoutDashboard,
  LogOut,
  MapPinned,
  PawPrint,
  ShieldCheck,
  Users,
  UsersRound,
} from "lucide-react";
import { Analytics } from "@/components/founder/Analytics";
import { Applications } from "@/components/founder/Applications";
import {
  BookingOversight,
  CommunityManagement,
  UserManagement,
} from "@/components/founder/Management";
import { MapManagement } from "@/components/founder/MapManagement";
import { Moderation } from "@/components/founder/Moderation";
import { Overview, type FounderSection } from "@/components/founder/Overview";
import { PublicInfo } from "@/components/founder/PublicInfo";
import { NotificationBell } from "@/components/app/NotificationBell";
import { Button } from "@/components/ui/button";
import { signOut } from "@/mock/actions";
import { useDemo, useSession } from "@/mock/store";

const SECTIONS: { key: FounderSection; label: string; icon: typeof LayoutDashboard }[] = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "applications", label: "Professional applications", icon: ClipboardList },
  { key: "moderation", label: "Content moderation", icon: Flag },
  { key: "users", label: "User management", icon: Users },
  { key: "bookings", label: "Booking oversight", icon: CalendarCheck },
  { key: "map", label: "Map management", icon: MapPinned },
  { key: "community", label: "Community management", icon: UsersRound },
  { key: "content", label: "Public information", icon: BookOpenText },
  { key: "analytics", label: "Survey & analytics", icon: BarChart3 },
];

export const Route = createFileRoute("/founder")({
  validateSearch: (s: Record<string, unknown>): { section?: FounderSection } =>
    SECTIONS.some((x) => x.key === s["section"]) ? { section: s["section"] as FounderSection } : {},
  head: () => ({
    meta: [
      { title: "Founder Console | The Petwork" },
      {
        name: "description",
        content: "Internal operations console for The Petwork founding team.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: FounderConsole,
});

function FounderConsole() {
  const { user, ready } = useSession();
  const data = useDemo();
  const navigate = useNavigate();
  const { section = "overview" } = Route.useSearch();
  const go = (s: FounderSection) => void navigate({ to: "/founder", search: { section: s } });

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-mocha text-mocha-foreground">
        <p className="text-sm">Checking founder access…</p>
      </div>
    );
  }

  if (!user || user.role !== "founder") {
    return (
      <div className="grid min-h-screen place-items-center bg-mocha px-4 text-mocha-foreground">
        <div className="max-w-sm text-center">
          <ShieldCheck className="mx-auto size-10" />
          <h1 className="mt-4 text-2xl text-mocha-foreground">Founders only</h1>
          <p className="mt-2 text-sm text-mocha-foreground/80">
            Sign in with a founder account to open the console.
          </p>
          <Button
            asChild
            className="mt-6 rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
          >
            <Link to="/founder-access">Founder sign in</Link>
          </Button>
        </div>
      </div>
    );
  }

  const badge: Partial<Record<FounderSection, number>> = {
    applications: data.applications.filter(
      (a) => a.status === "submitted" || a.status === "in_review",
    ).length,
    moderation:
      data.reports.filter((r) => r.status === "open").length +
      data.posts.filter((p) => p.status === "pending").length,
  };

  const handleSignOut = () => {
    signOut();
    void navigate({ to: "/founder-access", replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      <aside className="bg-sidebar text-sidebar-foreground lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-72 lg:shrink-0 lg:flex-col">
        <div className="flex items-center gap-2 px-5 py-5">
          <span className="grid size-9 place-items-center rounded-full bg-caramel text-caramel-foreground">
            <PawPrint className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg font-bold">The Petwork</p>
            <p className="truncate text-xs text-sidebar-foreground/70">
              {user.name} · founder console
            </p>
          </div>
          <NotificationBell userId={user.id} />
        </div>

        <div className="px-4 pb-4 lg:hidden">
          <label htmlFor="founder-section" className="sr-only">
            Section
          </label>
          <select
            id="founder-section"
            value={section}
            onChange={(e) => go(e.target.value as FounderSection)}
            className="w-full rounded-xl border border-sidebar-border bg-sidebar-accent px-3 py-2.5 text-sm font-semibold text-sidebar-foreground"
          >
            {SECTIONS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
                {badge[s.key] ? ` (${badge[s.key]})` : ""}
              </option>
            ))}
          </select>
        </div>

        <nav
          className="hidden gap-1 px-3 pb-3 lg:flex lg:flex-1 lg:flex-col lg:overflow-y-auto"
          aria-label="Founder console"
        >
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => go(s.key)}
              aria-current={section === s.key ? "page" : undefined}
              className={`flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                section === s.key
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent"
              }`}
            >
              <s.icon className="size-4" />
              <span className="flex-1 text-left">{s.label}</span>
              {!!badge[s.key] && (
                <span className="rounded-full bg-caramel px-1.5 text-xs font-bold text-caramel-foreground">
                  {badge[s.key]}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="hidden px-3 pb-6 lg:block">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="size-4" /> Sign out
          </Button>
          <Link
            to="/"
            className="mt-2 block px-4 text-xs text-sidebar-foreground/60 hover:text-blush"
          >
            ← Back to the public site
          </Link>
        </div>
      </aside>

      <div className="min-w-0 flex-1 px-4 py-8 sm:px-8">
        {section === "overview" && <Overview go={go} />}
        {section === "applications" && <Applications />}
        {section === "moderation" && <Moderation />}
        {section === "users" && <UserManagement />}
        {section === "bookings" && <BookingOversight />}
        {section === "map" && <MapManagement />}
        {section === "community" && <CommunityManagement />}
        {section === "content" && <PublicInfo />}
        {section === "analytics" && <Analytics />}

        <div className="mt-10 flex gap-3 lg:hidden">
          <Button variant="outline" className="rounded-full" onClick={handleSignOut}>
            <LogOut className="size-4" /> Sign out
          </Button>
          <Button asChild variant="ghost" className="rounded-full">
            <Link to="/">Public site</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
