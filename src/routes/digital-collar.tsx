import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BellRing, CalendarCheck, Download, FileText, Pill, Plus, Syringe, Upload } from "lucide-react";
import { toast } from "sonner";
import { EmptyMark } from "@/components/EmptyMark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePets, type Pet } from "@/lib/pets";

export const Route = createFileRoute("/digital-collar")({
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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/digital-collar" },
    ],
    links: [{ rel: "canonical", href: "/digital-collar" }],
  }),
  component: DigitalCollar,
});

const SPECIES = ["Dog", "Cat", "Bird", "Rabbit", "Reptile", "Fish"] as const;

function DigitalCollar() {
  const { pets, addPet } = usePets();
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState<Pet>({
    name: "",
    species: SPECIES[0],
    breed: "",
    age: "",
    weight: "",
    about: "",
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl text-foreground sm:text-5xl">The Digital Collar</h1>
        {pets.length > 0 && (
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="rounded-full border-2 border-caramel text-caramel hover:bg-accent hover:text-accent-foreground"
              onClick={() => setShowForm(true)}
            >
              <Plus className="size-4" /> Add Another Pet
            </Button>
            <Button
              className="rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
              onClick={() => toast.success("Records download will start once you add health entries")}
            >
              <Download className="size-4" /> Download Records
            </Button>
          </div>
        )}
      </div>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        One profile per pet — the about page, the health log, the vaccination dates you always forget,
        medications and every document, kept in one place you can hand to a vet in seconds.
      </p>

      {pets.length === 0 && !showForm && (
        <section className="card-cozy mt-10 flex flex-col items-center px-6 py-14 text-center">
          <EmptyMark />
          <h2 className="mt-4 text-2xl text-foreground">No pets on your collar yet</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Add your pet and start their record today — the first vaccination reminder is worth it on
            its own.
          </p>
          <Button
            size="lg"
            className="mt-7 rounded-full bg-caramel px-7 text-base text-caramel-foreground shadow-cozy hover:bg-caramel/90"
            onClick={() => setShowForm(true)}
          >
            <Plus className="size-5" /> Add Your First Pet
          </Button>
        </section>
      )}

      {showForm && (
        <section className="card-cozy mt-8 p-7 sm:p-9">
          <h2 className="text-xl text-foreground">Add a pet</h2>
          <form
            className="mt-5 grid gap-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!draft.name.trim()) return;
              addPet({ ...draft, name: draft.name.trim() });
              toast.success(`${draft.name.trim()} now has a Digital Collar`);
              setDraft({ name: "", species: SPECIES[0], breed: "", age: "", weight: "", about: "" });
              setShowForm(false);
            }}
          >
            <div>
              <Label htmlFor="p-name">Pet name</Label>
              <Input
                id="p-name"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                maxLength={40}
                className="mt-1.5 rounded-xl"
                required
              />
            </div>
            <div>
              <Label htmlFor="p-species">Species</Label>
              <select
                id="p-species"
                value={draft.species}
                onChange={(e) => setDraft({ ...draft, species: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm"
              >
                {SPECIES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="p-breed">Breed</Label>
              <Input
                id="p-breed"
                value={draft.breed}
                onChange={(e) => setDraft({ ...draft, breed: e.target.value })}
                maxLength={50}
                className="mt-1.5 rounded-xl"
              />
            </div>
            <div>
              <Label htmlFor="p-age">Age</Label>
              <Input
                id="p-age"
                value={draft.age}
                onChange={(e) => setDraft({ ...draft, age: e.target.value })}
                maxLength={20}
                placeholder="3 years"
                className="mt-1.5 rounded-xl"
              />
            </div>
            <div>
              <Label htmlFor="p-weight">Weight</Label>
              <Input
                id="p-weight"
                value={draft.weight}
                onChange={(e) => setDraft({ ...draft, weight: e.target.value })}
                maxLength={20}
                placeholder="12 kg"
                className="mt-1.5 rounded-xl"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="p-about">About</Label>
              <Textarea
                id="p-about"
                value={draft.about}
                onChange={(e) => setDraft({ ...draft, about: e.target.value })}
                rows={3}
                maxLength={400}
                placeholder="Temperament, allergies, the things a vet or a sitter should know."
                className="mt-1.5 rounded-xl"
              />
            </div>
            <div className="flex flex-wrap gap-3 sm:col-span-2">
              <Button type="submit" className="rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90">
                Save pet
              </Button>
              <Button type="button" variant="ghost" className="rounded-full" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </section>
      )}

      {pets.map((pet) => (
        <section key={pet.name} className="mt-8 space-y-6">
          <div className="card-cozy p-7">
            <h2 className="text-2xl text-foreground">{pet.name}</h2>
            <p className="mt-1 text-sm font-semibold text-caramel">
              {[pet.species, pet.breed, pet.age, pet.weight].filter(Boolean).join(" · ")}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {pet.about || "No about notes yet — add allergies, temperament and vet preferences here."}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <RecordCard
              icon={CalendarCheck}
              title="Health Log"
              text={`No vet visits logged for ${pet.name} yet. Add a visit after your next appointment and it stays here for good.`}
              action="Log a vet visit"
            />
            <RecordCard
              icon={Syringe}
              title="Vaccination Tracker"
              text="No vaccinations recorded yet. Add the last date for rabies, DHPPi or FVRCP and we will remind you before the next one is due."
              action="Add a vaccination"
            />
            <RecordCard
              icon={Pill}
              title="Medications"
              text="No medications on file. Add tick and flea preventives, supplements or a prescription course to get dose reminders."
              action="Add a medication"
            />
            <RecordCard
              icon={FileText}
              title="Document Storage"
              text="No documents uploaded. Keep the vaccination card, MCD pet licence and any reports where you can find them."
              action="Upload a document"
              actionIcon={Upload}
            />
            <RecordCard
              icon={BellRing}
              title="Reminders & Alerts"
              text={`No reminders set for ${pet.name}. Add a vaccination due date, a deworming cycle, a grooming appointment or a medication time and we will nudge you by email a week before, then again on the day.`}
              action="Set a reminder"
            />
          </div>

        </section>
      ))}
    </div>
  );
}

function RecordCard({
  icon: Icon,
  title,
  text,
  action,
  actionIcon: ActionIcon = Plus,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
  action: string;
  actionIcon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="card-cozy flex flex-col p-7">
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-2xl bg-accent text-caramel">
          <Icon className="size-5" />
        </span>
        <h3 className="text-lg text-foreground">{title}</h3>
      </div>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
      <Button
        variant="outline"
        className="mt-5 w-fit rounded-full border-2 border-caramel text-caramel hover:bg-accent hover:text-accent-foreground"
        onClick={() => toast.info("Sign in as a pet owner to start saving records")}
      >
        <ActionIcon className="size-4" /> {action}
      </Button>
    </div>
  );
}
