import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Check, MessageCircle, PawPrint } from "lucide-react";
import { toast } from "sonner";
import { VerifiedBadge } from "@/components/app/ProCard";
import { RequireRole } from "@/components/app/RequireRole";
import { EmptyState, PersonAvatar, PetPhoto, useBusy } from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { requestBooking, threadWith } from "@/mock/actions";
import { nextDays, openSlots, WEEKDAYS } from "@/mock/availability";
import { dayLabel, longDate, rupees, timeLabel } from "@/mock/format";
import { useDemo } from "@/mock/store";
import type { ProType, User } from "@/mock/types";

export const Route = createFileRoute("/book/$proId")({
  head: () => ({ meta: [{ title: "Request a booking | The Petwork" }] }),
  component: () => <RequireRole roles={["owner"]}>{(user) => <Book user={user} />}</RequireRole>,
});

const DURATIONS = [30, 45, 60, 90];

function Book({ user }: { user: User }) {
  const { proId } = Route.useParams();
  const data = useDemo();
  const navigate = useNavigate();
  const pro = data.pros.find((p) => p.userId === proId && p.listed);
  const proUser = data.users.find((u) => u.id === proId);
  const pets = data.pets.filter((p) => p.ownerId === user.id);

  const [petId, setPetId] = useState(pets[0]?.id ?? "");
  const [service, setService] = useState<ProType | "">(pro?.types[0] ?? "");
  const days = useMemo(
    () => (pro ? nextDays(14).map((d) => ({ date: d, slots: openSlots(data, pro, d) })) : []),
    [data, pro],
  );
  const [date, setDate] = useState(() => days.find((d) => d.slots.length)?.date ?? "");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(45);
  const [notes, setNotes] = useState("");
  const [doneId, setDoneId] = useState<string | null>(null);
  const [busy, run] = useBusy();

  if (!pro || !proUser) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-14">
        <EmptyState
          title="This professional can't take bookings right now"
          action={
            <Button asChild className="rounded-full bg-caramel text-caramel-foreground">
              <Link to="/pro-portal">Browse professionals</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const first = proUser.name.replace(/^Dr\.\s*/, "").split(" ")[0];
  const slots = days.find((d) => d.date === date)?.slots ?? [];
  const pet = pets.find((p) => p.id === petId);
  const ready = pet && service && date && time;

  if (doneId) {
    return (
      <div className="paw-grid flex min-h-[70vh] items-center justify-center px-4 py-14">
        <div className="card-cozy w-full max-w-lg p-8 text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-verified/15 text-verified">
            <Check className="size-8" />
          </span>
          <h1 className="mt-5 text-2xl text-foreground">Request sent to {first}</h1>
          <p className="mt-2 text-muted-foreground">
            {service} for {pet?.name} on {longDate(date)} at {timeLabel(time)}. You'll get a
            notification as soon as {first} confirms — usually within a few hours.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              className="rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
            >
              <Link to="/bookings">View my bookings</Link>
            </Button>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => void navigate({ to: "/messages", search: { t: threadWith(proId) } })}
            >
              <MessageCircle className="size-4" /> Message {first}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link
        to="/pro-portal/$proId"
        params={{ proId }}
        className="inline-flex items-center gap-1 py-2 text-sm font-bold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to {first}'s profile
      </Link>
      <h1 className="mt-4 text-3xl text-foreground sm:text-4xl">Request a booking</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-6">
          <Step n={1} title="Which pet?">
            {pets.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                You haven't added a pet yet.{" "}
                <Link to="/digital-collar" className="font-bold text-caramel hover:underline">
                  Add one to your Digital Collar
                </Link>{" "}
                first.
              </p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {pets.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPetId(p.id)}
                    aria-pressed={petId === p.id}
                    className={`flex items-center gap-3 rounded-2xl border-2 p-2 pr-4 text-left transition-colors ${petId === p.id ? "border-caramel bg-accent/10" : "border-border hover:border-caramel/50"}`}
                  >
                    <PetPhoto pet={p} className="size-12" />
                    <span>
                      <span className="block font-bold">{p.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {p.breed || p.species}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}
            {pet?.allergies && (
              <p className="mt-3 text-xs font-semibold text-muted-foreground">
                {first} will see {pet.name}'s allergies: {pet.allergies}
              </p>
            )}
          </Step>

          {pro.types.length > 1 && (
            <Step n={2} title="Service">
              <div className="flex flex-wrap gap-2">
                {pro.types.map((t) => (
                  <button
                    key={t}
                    onClick={() => setService(t)}
                    aria-pressed={service === t}
                    className={`rounded-full px-4 py-2 text-sm font-bold ${service === t ? "bg-caramel text-caramel-foreground" : "bg-oat text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Step>
          )}

          <Step n={pro.types.length > 1 ? 3 : 2} title="Day and time">
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
              {days.map((d) => {
                const dt = new Date(`${d.date}T12:00:00`);
                const disabled = d.slots.length === 0;
                return (
                  <button
                    key={d.date}
                    disabled={disabled}
                    onClick={() => {
                      setDate(d.date);
                      setTime("");
                    }}
                    aria-pressed={date === d.date}
                    className={`flex w-16 shrink-0 flex-col items-center rounded-2xl border-2 py-2.5 text-center transition-colors ${
                      date === d.date
                        ? "border-caramel bg-caramel text-caramel-foreground"
                        : disabled
                          ? "border-transparent bg-oat/60 text-muted-foreground/50"
                          : "border-border bg-card hover:border-caramel/60"
                    }`}
                  >
                    <span className="text-xs font-bold uppercase">{WEEKDAYS[dt.getDay()]}</span>
                    <span className="text-lg font-bold">{dt.getDate()}</span>
                    <span className="text-[0.625rem] font-semibold">
                      {disabled ? "Full" : `${d.slots.length} open`}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mt-4">
              <p className="text-sm font-bold">
                {date ? `Open times on ${dayLabel(date)}` : "Pick a day"}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {slots.map((s) => (
                  <button
                    key={s}
                    onClick={() => setTime(s)}
                    aria-pressed={time === s}
                    className={`rounded-full px-4 py-2 text-sm font-bold ${time === s ? "bg-caramel text-caramel-foreground" : "bg-oat text-foreground hover:bg-accent hover:text-accent-foreground"}`}
                  >
                    {timeLabel(s)}
                  </button>
                ))}
                {date && slots.length === 0 && (
                  <p className="text-sm text-muted-foreground">No open times on this day.</p>
                )}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-bold">Duration</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {DURATIONS.map((m) => (
                  <button
                    key={m}
                    onClick={() => setDuration(m)}
                    aria-pressed={duration === m}
                    className={`rounded-full px-4 py-2 text-sm font-bold ${duration === m ? "bg-mocha text-mocha-foreground" : "bg-oat text-muted-foreground hover:text-foreground"}`}
                  >
                    {m} min
                  </button>
                ))}
              </div>
            </div>
          </Step>

          <Step n={pro.types.length > 1 ? 4 : 3} title="Anything they should know?">
            <Label htmlFor="bk-notes" className="sr-only">
              Notes for the professional
            </Label>
            <Textarea
              id="bk-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Routes to avoid, gate codes, how your pet reacts to other dogs…"
              className="rounded-xl"
            />
          </Step>
        </div>

        <aside className="min-w-0 lg:sticky lg:top-40 lg:self-start">
          <div className="card-cozy p-6">
            <div className="flex items-center gap-3">
              <PersonAvatar name={proUser.name} className="size-12" />
              <div className="min-w-0">
                <p className="truncate font-bold">{proUser.name}</p>
                <VerifiedBadge />
              </div>
            </div>
            <dl className="mt-5 space-y-2 text-sm">
              {[
                ["Pet", pet?.name ?? "—"],
                ["Service", service || "—"],
                ["When", date && time ? `${dayLabel(date)}, ${timeLabel(time)}` : "—"],
                ["Duration", `${duration} min`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="text-right font-semibold">{v}</dd>
                </div>
              ))}
              <div className="flex justify-between gap-3 border-t border-border pt-3">
                <dt className="font-bold">Estimated price</dt>
                <dd className="font-bold">{rupees(pro.priceFrom)}</dd>
              </div>
            </dl>
            <p className="mt-2 text-xs text-muted-foreground">
              You agree the final price and payment directly with the professional.
            </p>
            <Button
              disabled={!ready || busy}
              className="mt-5 w-full rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
              onClick={() =>
                void run(async () => {
                  const id = await requestBooking({
                    proId,
                    petId,
                    service: service as ProType,
                    date,
                    time,
                    durationMins: duration,
                    notes: notes.trim(),
                    price: pro.priceFrom,
                  });
                  toast.success("Booking request sent");
                  setDoneId(id);
                })
              }
            >
              <PawPrint className="size-4" /> {busy ? "Sending request…" : "Send booking request"}
            </Button>
            {!ready && (
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Choose a pet, a day and a time to continue.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="card-cozy p-6">
      <h2 className="flex items-center gap-3 text-lg text-foreground">
        <span className="grid size-7 place-items-center rounded-full bg-caramel text-sm text-caramel-foreground">
          {n}
        </span>
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
