import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  CalendarCheck,
  CalendarDays,
  ChevronRight,
  Inbox,
  MessageCircle,
  Star,
  UserRound,
  Wallet,
} from "lucide-react";
import { BookingCard } from "@/components/app/BookingCard";
import { VerifiedBadge } from "@/components/app/ProCard";
import { RequireRole } from "@/components/app/RequireRole";
import {
  EmptyState,
  ListSkeleton,
  PageHeader,
  PersonAvatar,
  useFakeLoading,
} from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { ago, dayLabel, rupees, timeLabel } from "@/mock/format";
import { useDemo } from "@/mock/store";
import type { User } from "@/mock/types";

export const Route = createFileRoute("/pro/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard | The Petwork Pro Network" }] }),
  component: () => <RequireRole roles={["pro"]}>{(user) => <Dashboard user={user} />}</RequireRole>,
});

function Dashboard({ user }: { user: User }) {
  const data = useDemo();
  const loading = useFakeLoading();
  const pro = data.pros.find((p) => p.userId === user.id);
  const app = data.applications.find((a) => a.userId === user.id);

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const weekEnd = new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10);
    const monthStart = today.slice(0, 8) + "01";
    const mine = data.bookings.filter((b) => b.proId === user.id);
    return {
      requests: mine
        .filter((b) => b.status === "requested")
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
      upcoming: mine
        .filter((b) => b.status === "accepted" && b.date >= today)
        .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)),
      thisWeek: mine.filter((b) => b.status === "accepted" && b.date >= today && b.date <= weekEnd)
        .length,
      earnings: mine
        .filter((b) => b.status === "completed" && b.date >= monthStart)
        .reduce((s, b) => s + b.price, 0),
      completed: mine.filter((b) => b.status === "completed").length,
    };
  }, [data.bookings, user.id]);

  const threads = useMemo(
    () =>
      data.threads
        .filter((t) => t.proId === user.id)
        .map((t) => {
          const msgs = data.messages.filter((m) => m.threadId === t.id);
          return {
            t,
            last: msgs[msgs.length - 1],
            unread: msgs.filter((m) => !m.readBy.includes(user.id)).length,
            owner: data.users.find((u) => u.id === t.ownerId),
          };
        })
        .filter((x) => x.last)
        .sort((a, b) => b.last!.at.localeCompare(a.last!.at))
        .slice(0, 3),
    [data.threads, data.messages, data.users, user.id],
  );

  const approved = app?.status === "approved";

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <PageHeader
        label="Pro Network"
        title={`Good to see you, ${user.name.replace(/^Dr\.\s*/, "").split(" ")[0]}`}
        sub={pro ? `${pro.types.join(" · ")} · ${pro.area}` : undefined}
        actions={
          approved && (
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/pro-portal/$proId" params={{ proId: user.id }}>
                <UserRound className="size-4" /> View public profile
              </Link>
            </Button>
          )
        }
      />

      {!approved && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-honey/40 p-5 text-honey-foreground">
          <p className="text-sm font-semibold">
            Your profile isn't visible to pet owners until verification is complete.
          </p>
          <Button
            asChild
            size="sm"
            className="rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
          >
            <Link to="/pro/application">Check status</Link>
          </Button>
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: Inbox,
            label: "New requests",
            value: String(stats.requests.length),
            to: "/pro/bookings",
          },
          {
            icon: CalendarCheck,
            label: "Booked this week",
            value: String(stats.thisWeek),
            to: "/pro/bookings",
          },
          {
            icon: Wallet,
            label: "Earned this month",
            value: rupees(stats.earnings),
            to: "/pro/bookings",
          },
          {
            icon: Star,
            label: "Rating",
            value: pro && pro.reviewCount ? `${pro.rating.toFixed(1)} ★` : "—",
            to: "/pro/profile",
          },
        ].map((s) => (
          <Link key={s.label} to={s.to} className="card-cozy hover-lift p-5">
            <s.icon className="size-5 text-caramel" />
            <p className="mt-3 font-display text-3xl font-bold text-foreground">{s.value}</p>
            <p className="text-sm font-semibold text-muted-foreground">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-6">
          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-xl text-foreground">Booking requests</h2>
              <Link
                to="/pro/bookings"
                className="inline-block py-1.5 text-sm font-bold text-caramel hover:underline"
              >
                All bookings
              </Link>
            </div>
            <div className="mt-3 space-y-4">
              {loading ? (
                <ListSkeleton rows={2} />
              ) : stats.requests.length === 0 ? (
                <EmptyState
                  title="No new requests"
                  text="New booking requests from pet owners will appear here."
                />
              ) : (
                stats.requests.map((b) => <BookingCard key={b.id} booking={b} viewer={user} />)
              )}
            </div>
          </section>
        </div>

        <aside className="min-w-0 space-y-5">
          <section className="card-cozy p-6">
            <h2 className="flex items-center gap-2 text-lg text-foreground">
              <CalendarDays className="size-5 text-caramel" /> Coming up
            </h2>
            {stats.upcoming.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No confirmed bookings yet.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {stats.upcoming.slice(0, 4).map((b) => {
                  const pet = data.pets.find((p) => p.id === b.petId);
                  return (
                    <li key={b.id} className="rounded-2xl bg-oat p-3">
                      <p className="text-sm font-bold">
                        {dayLabel(b.date)}, {timeLabel(b.time)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {b.service} · {pet?.name} ({pet?.breed || pet?.species})
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
            <Button asChild variant="outline" className="mt-4 w-full rounded-full">
              <Link to="/pro/availability">Edit availability</Link>
            </Button>
          </section>

          <section className="card-cozy p-6">
            <h2 className="flex items-center gap-2 text-lg text-foreground">
              <MessageCircle className="size-5 text-caramel" /> Messages
            </h2>
            {threads.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No messages yet.</p>
            ) : (
              <ul className="mt-3 space-y-1">
                {threads.map(({ t, last, unread, owner }) => (
                  <li key={t.id}>
                    <Link
                      to="/messages"
                      search={{ t: t.id }}
                      className="flex items-center gap-3 rounded-2xl p-2 hover:bg-oat"
                    >
                      <PersonAvatar name={owner?.name ?? "?"} className="size-9 text-xs" />
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block truncate text-sm ${unread ? "font-extrabold" : "font-bold"}`}
                        >
                          {owner?.name}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {last!.body} · {ago(last!.at)}
                        </span>
                      </span>
                      {unread > 0 ? (
                        <span className="grid min-w-5 place-items-center rounded-full bg-caramel px-1 text-xs font-bold text-caramel-foreground">
                          {unread}
                        </span>
                      ) : (
                        <ChevronRight className="size-4 text-muted-foreground" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {pro && approved && (
            <section className="card-cozy bg-sage-tint p-6">
              <VerifiedBadge />
              <p className="mt-2 text-sm text-muted-foreground">
                {stats.completed} completed booking{stats.completed === 1 ? "" : "s"} on The
                Petwork. Keep your availability up to date so owners can book you.
              </p>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
