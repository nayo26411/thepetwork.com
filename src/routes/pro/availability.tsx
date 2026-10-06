import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { RequireRole } from "@/components/app/RequireRole";
import { EmptyState, PageHeader, useBusy } from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProProfile } from "@/mock/actions";
import { nextDays, WEEKDAYS, worksOn } from "@/mock/availability";
import { timeLabel } from "@/mock/format";
import { useDemo } from "@/mock/store";
import type { ProProfile, User } from "@/mock/types";

export const Route = createFileRoute("/pro/availability")({
  head: () => ({ meta: [{ title: "Availability | The Petwork Pro Network" }] }),
  component: () => (
    <RequireRole roles={["pro"]}>{(user) => <Availability user={user} />}</RequireRole>
  ),
});

function Availability({ user }: { user: User }) {
  const data = useDemo();
  const pro = data.pros.find((p) => p.userId === user.id);
  if (!pro)
    return (
      <div className="mx-auto max-w-3xl px-4 py-14">
        <EmptyState title="Finish your application first" />
      </div>
    );
  return (
    <Editor
      pro={pro}
      bookings={data.bookings.filter(
        (b) => b.proId === user.id && (b.status === "accepted" || b.status === "requested"),
      )}
    />
  );
}

function Editor({
  pro,
  bookings,
}: {
  pro: ProProfile;
  bookings: { date: string; time: string; status: string }[];
}) {
  const [days, setDays] = useState<number[]>(pro.workDays);
  const [slots, setSlots] = useState<string[]>(pro.slots);
  const [blocked, setBlocked] = useState<string[]>(pro.blockedDates);
  const [newSlot, setNewSlot] = useState("09:00");
  const [busy, run] = useBusy();
  const calendar = nextDays(21);
  const draft = { ...pro, workDays: days, blockedDates: blocked };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <PageHeader
        label="Pro Network"
        title="Availability"
        sub="Set the days and times you work. Owners can only request open slots, and a slot closes as soon as it's booked."
        actions={
          <Button
            disabled={busy}
            className="rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
            onClick={() =>
              void run(async () => {
                await updateProProfile({
                  workDays: [...days].sort(),
                  slots: [...slots].sort(),
                  blockedDates: blocked,
                });
                toast.success("Availability saved");
              })
            }
          >
            {busy ? "Saving…" : "Save availability"}
          </Button>
        }
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="card-cozy p-6">
          <h2 className="text-lg text-foreground">Working days</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {WEEKDAYS.map((d, i) => {
              const on = days.includes(i);
              return (
                <button
                  key={d}
                  aria-pressed={on}
                  onClick={() => setDays((x) => (on ? x.filter((y) => y !== i) : [...x, i]))}
                  className={`w-14 rounded-2xl py-2.5 text-sm font-bold ${on ? "bg-caramel text-caramel-foreground" : "bg-oat text-muted-foreground"}`}
                >
                  {d}
                </button>
              );
            })}
          </div>

          <h2 className="mt-7 text-lg text-foreground">Time slots</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {[...slots].sort().map((s) => (
              <span
                key={s}
                className="flex items-center gap-1 rounded-full bg-verified/10 py-1 pl-3 pr-1 text-sm font-bold text-verified"
              >
                {timeLabel(s)}
                <button
                  onClick={() => setSlots((x) => x.filter((y) => y !== s))}
                  aria-label={`Remove ${timeLabel(s)}`}
                  className="rounded-full p-1.5 hover:bg-verified/20"
                >
                  <X className="size-3.5" />
                </button>
              </span>
            ))}
            {slots.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No slots — owners won't be able to book you.
              </p>
            )}
          </div>
          <div className="mt-3 flex gap-2">
            <label htmlFor="new-slot" className="sr-only">
              New time slot
            </label>
            <Input
              id="new-slot"
              type="time"
              value={newSlot}
              onChange={(e) => setNewSlot(e.target.value)}
              className="w-36 rounded-xl"
            />
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => {
                if (newSlot && !slots.includes(newSlot)) setSlots((x) => [...x, newSlot]);
              }}
            >
              <Plus className="size-4" /> Add slot
            </Button>
          </div>
        </section>

        <section className="card-cozy p-6">
          <h2 className="text-lg text-foreground">Next three weeks</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Tap a working day to block it off (holidays, sick days).
          </p>
          <div className="mt-4 grid grid-cols-7 gap-1.5 text-center">
            {WEEKDAYS.map((d) => (
              <span key={d} className="text-[0.6875rem] font-bold uppercase text-muted-foreground">
                {d}
              </span>
            ))}
            {Array.from({ length: new Date(`${calendar[0]}T12:00:00`).getDay() }).map((_, i) => (
              <span key={`pad-${i}`} />
            ))}
            {calendar.map((date) => {
              const day = new Date(`${date}T12:00:00`).getDay();
              const working = days.includes(day);
              const isBlocked = blocked.includes(date);
              const count = bookings.filter((b) => b.date === date).length;
              const open = worksOn(draft, date);
              return (
                <button
                  key={date}
                  disabled={!working}
                  onClick={() =>
                    setBlocked((x) => (isBlocked ? x.filter((y) => y !== date) : [...x, date]))
                  }
                  aria-label={`${date}${isBlocked ? ", blocked" : working ? ", working" : ", day off"}${count ? `, ${count} bookings` : ""}`}
                  className={`relative aspect-square rounded-xl text-sm font-bold transition-colors ${
                    !working
                      ? "bg-oat/50 text-muted-foreground/50"
                      : isBlocked
                        ? "bg-destructive/15 text-destructive line-through"
                        : open
                          ? "bg-verified/10 text-verified hover:bg-verified/20"
                          : "bg-oat"
                  }`}
                >
                  {Number(date.slice(8))}
                  {count > 0 && (
                    <span className="absolute bottom-1 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-caramel" />
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded bg-verified/20" /> Open
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded bg-destructive/20" /> Blocked
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-caramel" /> Has bookings
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
