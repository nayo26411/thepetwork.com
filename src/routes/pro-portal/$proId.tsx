import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarCheck,
  Clock,
  Languages,
  MapPin,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
  Video,
} from "lucide-react";
import { VerifiedBadge } from "@/components/app/ProCard";
import { EmptyState, PersonAvatar, Stars } from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { threadWith } from "@/mock/actions";
import { nextDays, openSlots, WEEKDAYS } from "@/mock/availability";
import { ago, dayLabel, rupees, timeLabel } from "@/mock/format";
import { useDemo, useSession } from "@/mock/store";

export const Route = createFileRoute("/pro-portal/$proId")({
  head: () => ({ meta: [{ title: "Professional profile | The Pro Portal" }] }),
  component: ProProfilePage,
});

const CHECKS = [
  { icon: ShieldCheck, label: "Government ID checked" },
  { icon: PhoneCall, label: "Two client references called" },
  { icon: Video, label: "Video interview reviewed" },
];

function ProProfilePage() {
  const { proId } = Route.useParams();
  const data = useDemo();
  const { user: viewer } = useSession();
  const navigate = useNavigate();

  const pro = data.pros.find((p) => p.userId === proId);
  const user = data.users.find((u) => u.id === proId);
  const isSelf = viewer?.id === proId;

  const days = useMemo(
    () => (pro ? nextDays(7).map((d) => ({ date: d, slots: openSlots(data, pro, d) })) : []),
    [data, pro],
  );
  const reviews = useMemo(
    () =>
      data.bookings
        .filter((b) => b.proId === proId && b.review)
        .map((b) => ({
          ...b.review!,
          by: data.users.find((u) => u.id === b.ownerId)?.name ?? "Pet owner",
          at: b.updatedAt,
        })),
    [data.bookings, data.users, proId],
  );

  if (!pro || !user || ((!pro.listed || user.status !== "active") && !isSelf)) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-14">
        <EmptyState
          title="This profile isn't available"
          text="The professional may still be completing verification, or their profile is paused."
          action={
            <Button
              asChild
              className="rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
            >
              <Link to="/pro-portal">Browse verified professionals</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const requireOwner = (then: () => void) => {
    if (!viewer) {
      void navigate({ to: "/login", search: { redirect: `/pro-portal/${proId}` } });
      return;
    }
    then();
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link
        to="/pro-portal"
        className="inline-flex items-center gap-1 py-2 text-sm font-bold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> All professionals
      </Link>

      {isSelf && !pro.listed && (
        <p className="mt-4 rounded-2xl bg-honey/40 p-4 text-sm font-semibold text-honey-foreground">
          Preview: this is how your profile will look once verification is complete. It isn't
          visible to pet owners yet.
        </p>
      )}

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0 space-y-6">
          <section className="card-cozy p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <PersonAvatar name={user.name} className="size-24 text-3xl" />
              <div className="min-w-0">
                <h1 className="text-3xl text-foreground">{user.name}</h1>
                <p className="mt-1 font-semibold text-caramel">{pro.types.join(" · ")}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  {pro.listed && <VerifiedBadge />}
                  {pro.reviewCount > 0 && (
                    <span className="flex items-center gap-1.5">
                      <Stars value={pro.rating} />{" "}
                      <span className="font-bold text-foreground">{pro.rating.toFixed(1)}</span> (
                      {pro.reviewCount} reviews)
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <MapPin className="size-4 text-caramel" /> {pro.area}
                  </span>
                </div>
              </div>
            </div>
            <p className="mt-6 text-lg font-semibold text-foreground">{pro.headline}</p>
            <p className="mt-3 leading-relaxed text-muted-foreground">{pro.bio}</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-oat p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Experience
                </p>
                <p className="mt-1 font-bold">{pro.years} years</p>
              </div>
              <div className="rounded-2xl bg-oat p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Price
                </p>
                <p className="mt-1 font-bold">
                  {rupees(pro.priceFrom)}{" "}
                  <span className="text-xs font-semibold text-muted-foreground">
                    {pro.priceUnit}
                  </span>
                </p>
              </div>
              <div className="rounded-2xl bg-oat p-4">
                <p className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  <Languages className="size-3.5" /> Languages
                </p>
                <p className="mt-1 font-bold">{pro.languages.join(", ")}</p>
              </div>
            </div>

            {pro.services.length > 0 && (
              <>
                <h2 className="mt-7 text-sm font-bold uppercase tracking-wide text-caramel">
                  Services
                </h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {pro.services.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-accent px-3 py-1 text-sm font-semibold text-accent-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </>
            )}
          </section>

          <section className="card-cozy p-6 sm:p-8">
            <h2 className="text-xl text-foreground">Reviews</h2>
            {reviews.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                {pro.reviewCount > 0
                  ? `${pro.reviewCount} reviews from bookings before The Petwork launched.`
                  : "No reviews yet."}
              </p>
            ) : (
              <ul className="mt-4 space-y-4">
                {reviews.map((r, i) => (
                  <li key={i} className="rounded-2xl bg-oat p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-sm font-bold">
                        <PersonAvatar name={r.by} className="size-7 text-[0.625rem]" /> {r.by}
                      </span>
                      <Stars value={r.rating} />
                    </div>
                    {r.text && <p className="mt-2 text-sm text-foreground/85">{r.text}</p>}
                    <p className="mt-1 text-xs text-muted-foreground">{ago(r.at)}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="min-w-0 space-y-5 lg:sticky lg:top-40 lg:self-start">
          <div className="card-cozy p-6">
            <h2 className="flex items-center gap-2 text-lg text-foreground">
              <CalendarCheck className="size-5 text-caramel" /> Availability this week
            </h2>
            <ul className="mt-4 space-y-2">
              {days.map((d) => (
                <li key={d.date} className="flex items-start justify-between gap-3 text-sm">
                  <span className="w-20 shrink-0 font-bold">
                    {dayLabel(d.date) === "Today" || dayLabel(d.date) === "Tomorrow"
                      ? dayLabel(d.date)
                      : `${WEEKDAYS[new Date(`${d.date}T12:00:00`).getDay()]} ${d.date.slice(8)}`}
                  </span>
                  {d.slots.length ? (
                    <span className="flex flex-wrap justify-end gap-1">
                      {d.slots.map((s) => (
                        <span
                          key={s}
                          className="rounded-full bg-verified/10 px-2 py-0.5 text-xs font-semibold text-verified"
                        >
                          {timeLabel(s)}
                        </span>
                      ))}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Unavailable</span>
                  )}
                </li>
              ))}
            </ul>
            {!isSelf && viewer?.role !== "pro" && viewer?.role !== "founder" && (
              <div className="mt-5 flex flex-col gap-2">
                <Button
                  className="rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
                  onClick={() =>
                    requireOwner(() => void navigate({ to: "/book/$proId", params: { proId } }))
                  }
                >
                  <CalendarCheck className="size-4" /> Request a booking
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() =>
                    requireOwner(
                      () => void navigate({ to: "/messages", search: { t: threadWith(proId) } }),
                    )
                  }
                >
                  <MessageCircle className="size-4" /> Message{" "}
                  {user.name.replace(/^Dr\.\s*/, "").split(" ")[0]}
                </Button>
              </div>
            )}
            {isSelf && (
              <Button asChild variant="outline" className="mt-5 w-full rounded-full">
                <Link to="/pro/profile">Edit my profile</Link>
              </Button>
            )}
          </div>

          <div className="card-cozy p-6">
            <h2 className="flex items-center gap-2 text-lg text-foreground">
              <BadgeCheck className="size-5 text-verified" /> What we checked
            </h2>
            <ul className="mt-3 space-y-2">
              {CHECKS.map((c) => (
                <li
                  key={c.label}
                  className={`flex items-center gap-2 text-sm ${pro.listed ? "" : "opacity-50"}`}
                >
                  <c.icon className="size-4 text-verified" /> {c.label}
                </li>
              ))}
            </ul>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="size-3.5" /> On The Petwork since{" "}
              {new Date(user.joinedAt).toLocaleDateString("en-IN", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
