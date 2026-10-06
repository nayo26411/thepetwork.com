import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalendarCheck, ClipboardList, Flag, MapPinned, Users, UsersRound } from "lucide-react";
import { SURVEY } from "@/data/content";
import { allPlaces, ago } from "@/mock/format";
import { useDemo } from "@/mock/store";
import { ChartValues, SectionHead } from "./shared";

export type FounderSection =
  | "overview"
  | "applications"
  | "map"
  | "community"
  | "moderation"
  | "users"
  | "bookings"
  | "content"
  | "analytics";

export function Overview({ go }: { go: (s: FounderSection) => void }) {
  const data = useDemo();
  const today = new Date().toISOString().slice(0, 10);
  const pendingApps = data.applications.filter(
    (a) => a.status === "submitted" || a.status === "in_review",
  ).length;
  const openReports = data.reports.filter((r) => r.status === "open").length;
  const pendingPosts = data.posts.filter((p) => p.status === "pending").length;

  const stats: { label: string; value: number; icon: typeof Users; section: FounderSection }[] = [
    {
      label: "Registered owners",
      value: data.users.filter((u) => u.role === "owner").length,
      icon: Users,
      section: "users",
    },
    {
      label: "Verified professionals",
      value: data.pros.filter((p) => p.listed).length,
      icon: UsersRound,
      section: "users",
    },
    {
      label: "Active bookings",
      value: data.bookings.filter(
        (b) => (b.status === "accepted" || b.status === "requested") && b.date >= today,
      ).length,
      icon: CalendarCheck,
      section: "bookings",
    },
    {
      label: "Published map listings",
      value: allPlaces(data).filter((p) => p.published).length,
      icon: MapPinned,
      section: "map",
    },
    {
      label: "Pending applications",
      value: pendingApps,
      icon: ClipboardList,
      section: "applications",
    },
    {
      label: "Items to moderate",
      value: openReports + pendingPosts,
      icon: Flag,
      section: "moderation",
    },
  ];

  const bookingsByStatus = ["requested", "accepted", "completed", "cancelled", "declined"].map(
    (s) => ({
      name: s[0]!.toUpperCase() + s.slice(1),
      value: data.bookings.filter((b) => b.status === s).length,
    }),
  );

  const nameOf = (id: string) => data.users.find((u) => u.id === id)?.name ?? "Someone";
  const activity = [
    ...data.applications.map((a) => ({
      at: a.history[a.history.length - 1]!.at,
      text: `${a.name}: application ${a.status.replace("_", " ")}`,
    })),
    ...data.bookings.map((b) => ({
      at: b.updatedAt,
      text: `Booking ${b.status}: ${nameOf(b.ownerId)} with ${nameOf(b.proId)}`,
    })),
    ...data.reports.map((r) => ({ at: r.at, text: `Report: ${r.reason}` })),
    ...data.users.map((u) => ({
      at: u.joinedAt,
      text: `${u.name} joined as ${u.role === "pro" ? "a professional" : u.role === "owner" ? "a pet owner" : "founder"}`,
    })),
  ]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 8);

  return (
    <>
      <SectionHead
        title="Overview"
        sub="Live counts from everything stored on The Petwork, plus what pet owners told us in the launch survey."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((s) => (
          <button
            key={s.label}
            onClick={() => go(s.section)}
            className="card-cozy hover-lift flex items-center gap-4 p-5 text-left"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent text-caramel">
              <s.icon className="size-5" />
            </span>
            <span>
              <span className="block font-display text-3xl font-bold text-caramel">{s.value}</span>
              <span className="text-sm font-semibold text-muted-foreground">{s.label}</span>
            </span>
          </button>
        ))}
      </div>

      {(pendingApps > 0 || openReports + pendingPosts > 0) && (
        <div className="mt-6 flex flex-wrap gap-3 rounded-3xl bg-honey/40 p-5 text-sm font-semibold text-honey-foreground">
          <span>Needs your attention:</span>
          {pendingApps > 0 && (
            <button onClick={() => go("applications")} className="py-1.5 underline">
              {pendingApps} application{pendingApps === 1 ? "" : "s"} to review
            </button>
          )}
          {openReports > 0 && (
            <button onClick={() => go("moderation")} className="py-1.5 underline">
              {openReports} open report{openReports === 1 ? "" : "s"}
            </button>
          )}
          {pendingPosts > 0 && (
            <button onClick={() => go("moderation")} className="py-1.5 underline">
              {pendingPosts} post{pendingPosts === 1 ? "" : "s"} awaiting approval
            </button>
          )}
        </div>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="card-cozy p-6">
          <h2 className="text-lg text-foreground">Bookings by status</h2>
          <ChartValues data={bookingsByStatus} unit="" />
          <div className="mt-4 h-60" aria-hidden="true">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingsByStatus}>
                <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip cursor={{ fill: "rgba(169,116,63,.08)" }} />
                <Bar dataKey="value" fill="#8B5E3C" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card-cozy p-6">
          <h2 className="text-lg text-foreground">Recent activity</h2>
          <ul className="mt-3 divide-y divide-border">
            {activity.map((a, i) => (
              <li key={i} className="flex items-start justify-between gap-3 py-2.5 text-sm">
                <span>{a.text}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{ago(a.at)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card-cozy mt-6 p-6">
        <h2 className="text-lg text-foreground">Feature demand from the owner survey</h2>
        <ChartValues data={SURVEY.featureDemand} unit="%" />
        <div className="mt-4 h-64" aria-hidden="true">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SURVEY.featureDemand}>
              <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip
                cursor={{ fill: "rgba(169,116,63,.08)" }}
                formatter={(v: number) => `${v}%`}
              />
              <Bar dataKey="value" fill="#A9743F" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
