import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  BellRing,
  CalendarCheck,
  ChevronRight,
  Download,
  FileText,
  Pill,
  Plus,
  Syringe,
} from "lucide-react";
import { toast } from "sonner";
import { PetDialog, recordsDocument } from "@/components/app/PetDialog";
import { RequireRole } from "@/components/app/RequireRole";
import {
  EmptyState,
  ListSkeleton,
  PageHeader,
  PetPhoto,
  useFakeLoading,
} from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { dayLabel, dueLabel, daysUntil } from "@/mock/format";
import { useDemo } from "@/mock/store";
import type { User } from "@/mock/types";
import { downloadFile } from "@/mock/upload";

export const Route = createFileRoute("/digital-collar/")({
  head: () => ({
    meta: [
      { title: "The Digital Collar — Your Pet's Health Records | The Petwork" },
      {
        name: "description",
        content:
          "Keep vet visits, vaccination reminders, medications and documents for every pet in one warm, shareable profile.",
      },
      { property: "og:title", content: "The Digital Collar — Your Pet's Health Records" },
      {
        property: "og:description",
        content: "Health log, vaccination tracker, medications and documents in one place.",
      },
    ],
  }),
  component: () => (
    <RequireRole roles={["owner"]}>{(user) => <DigitalCollar user={user} />}</RequireRole>
  ),
});

function DigitalCollar({ user }: { user: User }) {
  const data = useDemo();
  const loading = useFakeLoading();
  const [adding, setAdding] = useState(false);

  const pets = useMemo(() => data.pets.filter((p) => p.ownerId === user.id), [data.pets, user.id]);
  const upcoming = useMemo(
    () =>
      data.reminders
        .filter((r) => r.ownerId === user.id && !r.done && daysUntil(r.dueOn) <= 14)
        .sort((a, b) => a.dueOn.localeCompare(b.dueOn))
        .slice(0, 4),
    [data.reminders, user.id],
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <PageHeader
        label={`Hi ${user.name.split(" ")[0]}`}
        title="The Digital Collar"
        sub="One profile per pet: the health log, vaccination dates, medications and every document, kept in one place you can hand to a vet in seconds."
        actions={
          pets.length > 0 && (
            <>
              <Button
                variant="outline"
                className="rounded-full border-2 border-caramel text-caramel hover:bg-accent hover:text-accent-foreground"
                onClick={() => {
                  downloadFile(
                    "petwork-records.html",
                    recordsDocument(data, pets, user.name),
                    "text/html",
                  );
                  toast.success("Records downloaded. Open the file to print or share it.");
                }}
              >
                <Download className="size-4" /> Download records
              </Button>
              <Button
                className="rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
                onClick={() => setAdding(true)}
              >
                <Plus className="size-4" /> Add a pet
              </Button>
            </>
          )
        }
      />

      {loading ? (
        <ListSkeleton rows={2} className="mt-8" />
      ) : pets.length === 0 ? (
        <EmptyState
          className="mt-10"
          title="No pets on your collar yet"
          text="Add your pet and start their record today — the first vaccination reminder is worth it on its own."
          action={
            <Button
              size="lg"
              className="rounded-full bg-caramel px-7 text-base text-caramel-foreground shadow-cozy hover:bg-caramel/90"
              onClick={() => setAdding(true)}
            >
              <Plus className="size-5" /> Add your first pet
            </Button>
          }
        />
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="grid min-w-0 gap-5 sm:grid-cols-2">
            {pets.map((pet) => {
              const vacc = data.vaccinations.filter((v) => v.petId === pet.id);
              const meds = data.medications.filter((m) => m.petId === pet.id && m.active);
              const docs = data.documents.filter((d) => d.petId === pet.id);
              const visits = data.health.filter((h) => h.petId === pet.id);
              const nextDue = [...vacc]
                .filter((v) => v.dueOn)
                .sort((a, b) => a.dueOn.localeCompare(b.dueOn))[0];
              return (
                <Link
                  key={pet.id}
                  to="/digital-collar/$petId"
                  params={{ petId: pet.id }}
                  className="card-cozy hover-lift group flex flex-col overflow-hidden"
                >
                  <PetPhoto pet={pet} className="h-44 w-full rounded-none ring-0" />
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="text-2xl text-foreground">{pet.name}</h2>
                    <p className="mt-1 text-sm font-semibold text-caramel">
                      {[pet.species, pet.breed, pet.age].filter(Boolean).join(" · ")}
                    </p>
                    {nextDue && (
                      <p
                        className={`mt-3 w-fit rounded-full px-3 py-1 text-xs font-bold ${daysUntil(nextDue.dueOn) <= 7 ? "bg-honey/50 text-honey-foreground" : "bg-oat text-muted-foreground"}`}
                      >
                        {nextDue.name} · {dueLabel(nextDue.dueOn)}
                      </p>
                    )}
                    <dl className="mt-4 grid grid-cols-4 gap-2 text-center">
                      {[
                        [CalendarCheck, visits.length, "Visits"],
                        [Syringe, vacc.length, "Vaccines"],
                        [Pill, meds.length, "Meds"],
                        [FileText, docs.length, "Docs"],
                      ].map(([Icon, n, label]) => {
                        const I = Icon as typeof Pill;
                        return (
                          <div key={label as string} className="rounded-xl bg-oat px-1 py-2">
                            <I className="mx-auto size-4 text-caramel" />
                            <dd className="mt-1 text-sm font-bold">{n as number}</dd>
                            <dt className="text-[0.6875rem] text-muted-foreground">
                              {label as string}
                            </dt>
                          </div>
                        );
                      })}
                    </dl>
                    <span className="mt-5 flex items-center gap-1 text-sm font-bold text-caramel">
                      Open {pet.name}'s records{" "}
                      <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          <aside className="min-w-0 space-y-5">
            <div className="card-cozy p-6">
              <h2 className="flex items-center gap-2 text-lg text-foreground">
                <BellRing className="size-5 text-caramel" /> Coming up
              </h2>
              {upcoming.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  Nothing due in the next two weeks.
                </p>
              ) : (
                <ul className="mt-3 space-y-2.5">
                  {upcoming.map((r) => {
                    const pet = pets.find((p) => p.id === r.petId);
                    const overdue = daysUntil(r.dueOn) < 0;
                    return (
                      <li key={r.id} className="rounded-2xl bg-oat p-3">
                        <p className="text-sm font-bold">{r.title}</p>
                        <p
                          className={`text-xs ${overdue ? "font-bold text-destructive" : "text-muted-foreground"}`}
                        >
                          {pet?.name} · {r.kind} · {dayLabel(r.dueOn)} ({dueLabel(r.dueOn)})
                        </p>
                      </li>
                    );
                  })}
                </ul>
              )}
              <Button asChild variant="outline" className="mt-4 w-full rounded-full">
                <Link to="/reminders">Manage reminders</Link>
              </Button>
            </div>
            <div className="card-cozy bg-blush-tint p-6">
              <h2 className="text-lg text-foreground">Need a hand?</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Book a verified walker, groomer or vet who can see your pet's allergies and notes.
              </p>
              <Button
                asChild
                className="mt-4 rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
              >
                <Link to="/pro-portal">Find a professional</Link>
              </Button>
            </div>
          </aside>
        </div>
      )}

      <PetDialog open={adding} onOpenChange={setAdding} />
    </div>
  );
}
