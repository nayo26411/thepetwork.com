import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  BellRing,
  Check,
  Pencil,
  Plus,
  Repeat,
  Scissors,
  Stethoscope,
  Syringe,
  Pill,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { ReminderDialog } from "@/components/app/ReminderDialog";
import { RequireRole } from "@/components/app/RequireRole";
import {
  EmptyState,
  ListSkeleton,
  PageHeader,
  TabPills,
  useBusy,
  useFakeLoading,
} from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { deleteReminder, toggleReminder } from "@/mock/actions";
import { dayLabel, daysUntil, dueLabel, timeLabel } from "@/mock/format";
import { useDemo } from "@/mock/store";
import type { Reminder, ReminderKind, User } from "@/mock/types";

export const Route = createFileRoute("/reminders")({
  head: () => ({ meta: [{ title: "Reminders | The Petwork" }] }),
  component: () => (
    <RequireRole roles={["owner"]}>{(user) => <Reminders user={user} />}</RequireRole>
  ),
});

const KIND_ICON: Record<ReminderKind, typeof Pill> = {
  Vaccination: Syringe,
  Medication: Pill,
  Appointment: Stethoscope,
  Grooming: Scissors,
  Other: BellRing,
};

const FILTERS = [
  { key: "upcoming", label: "Upcoming" },
  { key: "done", label: "Done" },
  { key: "all", label: "All" },
] as const;

function Reminders({ user }: { user: User }) {
  const data = useDemo();
  const loading = useFakeLoading();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("upcoming");
  const [dialog, setDialog] = useState<{ open: boolean; reminder?: Reminder }>({ open: false });
  const pets = useMemo(() => data.pets.filter((p) => p.ownerId === user.id), [data.pets, user.id]);

  const all = useMemo(
    () =>
      data.reminders
        .filter((r) => r.ownerId === user.id)
        .sort((a, b) => a.dueOn.localeCompare(b.dueOn)),
    [data.reminders, user.id],
  );
  const shown = all.filter((r) => (filter === "all" ? true : filter === "done" ? r.done : !r.done));
  const overdue = all.filter((r) => !r.done && daysUntil(r.dueOn) < 0).length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <PageHeader
        label="Digital Collar"
        title="Reminders"
        sub="Vaccinations, medication, appointments and grooming for every pet, in one list."
        actions={
          pets.length > 0 && (
            <Button
              className="rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
              onClick={() => setDialog({ open: true })}
            >
              <Plus className="size-4" /> New reminder
            </Button>
          )
        }
      />

      {overdue > 0 && (
        <p className="mt-6 rounded-2xl bg-destructive/10 p-4 text-sm font-bold text-destructive">
          {overdue} reminder{overdue === 1 ? " is" : "s are"} overdue.
        </p>
      )}

      <TabPills
        className="mt-6"
        tabs={FILTERS.map((f) => ({
          ...f,
          count: f.key === "upcoming" ? all.filter((r) => !r.done).length : undefined,
        }))}
        value={filter}
        onChange={setFilter}
      />

      <div className="mt-5">
        <h2 className="sr-only">{FILTERS.find((f) => f.key === filter)?.label} reminders</h2>
        {loading ? (
          <ListSkeleton rows={4} />
        ) : pets.length === 0 ? (
          <EmptyState
            title="Add a pet first"
            text="Reminders belong to a pet. Start their Digital Collar, then set the first one."
            action={
              <Button
                asChild
                className="rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
              >
                <Link to="/digital-collar">Add a pet</Link>
              </Button>
            }
          />
        ) : shown.length === 0 ? (
          <EmptyState
            title={filter === "done" ? "Nothing ticked off yet" : "You're all caught up"}
            text="New reminders appear here as you add them."
          />
        ) : (
          <ul className="space-y-3">
            {shown.map((r) => (
              <ReminderRow
                key={r.id}
                r={r}
                petName={pets.find((p) => p.id === r.petId)?.name ?? "Pet"}
                onEdit={() => setDialog({ open: true, reminder: r })}
              />
            ))}
          </ul>
        )}
      </div>

      <ReminderDialog
        open={dialog.open}
        onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}
        pets={pets}
        {...(dialog.reminder ? { reminder: dialog.reminder } : {})}
      />
    </div>
  );
}

function ReminderRow({ r, petName, onEdit }: { r: Reminder; petName: string; onEdit: () => void }) {
  const [busy, run] = useBusy();
  const Icon = KIND_ICON[r.kind];
  const n = daysUntil(r.dueOn);
  return (
    <li className={`card-cozy flex items-start gap-4 p-5 ${busy ? "opacity-60" : ""}`}>
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-accent text-caramel">
        <Icon className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className={`text-base text-foreground ${r.done ? "line-through opacity-60" : ""}`}>
            {r.title}
          </h3>
          {!r.done && (
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${n < 0 ? "bg-destructive/10 text-destructive" : n <= 3 ? "bg-honey/50 text-honey-foreground" : "bg-oat text-muted-foreground"}`}
            >
              {dueLabel(r.dueOn)}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {petName} · {r.kind} · {dayLabel(r.dueOn)}
          {r.time ? ` at ${timeLabel(r.time)}` : ""}
          {r.repeat !== "none" && (
            <span className="ml-1 inline-flex items-center gap-1">
              · <Repeat className="size-3" /> {r.repeat}
            </span>
          )}
        </p>
        {r.notes && <p className="mt-1.5 text-sm text-foreground/80">{r.notes}</p>}
      </div>
      <div className="flex shrink-0 flex-wrap justify-end gap-1">
        <Button
          size="sm"
          variant={r.done ? "outline" : "default"}
          disabled={busy}
          aria-label={r.done ? `Mark ${r.title} as not done` : `Mark ${r.title} as done`}
          className={`rounded-full ${r.done ? "" : "bg-verified text-verified-foreground hover:bg-verified/90"}`}
          onClick={() =>
            void run(async () => {
              await toggleReminder(r.id);
              toast.success(r.done ? "Moved back to upcoming" : "Marked as done");
            })
          }
        >
          <Check className="size-4" />{" "}
          <span className="hidden sm:inline">{r.done ? "Undo" : "Done"}</span>
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="rounded-full"
          onClick={onEdit}
          aria-label="Edit reminder"
        >
          <Pencil className="size-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          disabled={busy}
          className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
          aria-label="Delete reminder"
          onClick={() =>
            void run(async () => {
              await deleteReminder(r.id);
              toast.success("Reminder deleted");
            })
          }
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </li>
  );
}
