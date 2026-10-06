import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  BellRing,
  CalendarCheck,
  Download,
  FileText,
  Pencil,
  Pill,
  Plus,
  Syringe,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { FormDialog, str, type Field, type Values } from "@/components/app/FormDialog";
import { PetDialog, recordsDocument } from "@/components/app/PetDialog";
import { ReminderDialog } from "@/components/app/ReminderDialog";
import { RequireRole } from "@/components/app/RequireRole";
import { EmptyState, PetPhoto, TabPills, useBusy } from "@/components/app/ui";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deletePet, deleteRecord, saveRecord, toggleReminder } from "@/mock/actions";
import { dayLabel, daysUntil, dueLabel, fileSize, longDate } from "@/mock/format";
import { useDemo } from "@/mock/store";
import type { Pet, User } from "@/mock/types";
import { checkFile, documentData, downloadFile } from "@/mock/upload";

const TABS = [
  { key: "health", label: "Health log" },
  { key: "vaccinations", label: "Vaccinations" },
  { key: "medications", label: "Medications" },
  { key: "documents", label: "Documents" },
  { key: "reminders", label: "Reminders" },
] as const;
type Tab = (typeof TABS)[number]["key"];

export const Route = createFileRoute("/digital-collar/$petId")({
  validateSearch: (s: Record<string, unknown>): { tab?: Tab } =>
    TABS.some((t) => t.key === s["tab"]) ? { tab: s["tab"] as Tab } : {},
  head: () => ({ meta: [{ title: "Pet profile | The Digital Collar" }] }),
  component: () => <RequireRole roles={["owner"]}>{(user) => <PetPage user={user} />}</RequireRole>,
});

const today = () => new Date().toISOString().slice(0, 10);

const HEALTH_FIELDS: Field[] = [
  { key: "date", label: "Date", type: "date", required: true },
  { key: "title", label: "Reason for visit", required: true, placeholder: "Annual check-up" },
  { key: "vet", label: "Vet or clinic", full: true },
  { key: "notes", label: "Notes", type: "textarea", placeholder: "Diagnosis, advice, weight…" },
];
const VACC_FIELDS: Field[] = [
  { key: "name", label: "Vaccine", required: true, placeholder: "Rabies, DHPPi, FVRCP…" },
  { key: "clinic", label: "Clinic" },
  { key: "givenOn", label: "Date given", type: "date", required: true },
  { key: "dueOn", label: "Next due", type: "date", hint: "We'll create a reminder for this date." },
];
const MED_FIELDS: Field[] = [
  { key: "name", label: "Medication", required: true, full: true },
  { key: "dose", label: "Dose", placeholder: "1 tablet" },
  { key: "frequency", label: "How often", placeholder: "Twice a day" },
  { key: "startOn", label: "Start date", type: "date", required: true },
  { key: "endOn", label: "End date", type: "date" },
  { key: "active", label: "Currently taking this", type: "switch", full: true },
  { key: "notes", label: "Notes", type: "textarea" },
];

type Editing = {
  kind: "health" | "vaccinations" | "medications";
  id?: string;
  initial: Values;
} | null;

function PetPage({ user }: { user: User }) {
  const { petId } = Route.useParams();
  const { tab = "health" } = Route.useSearch();
  const navigate = useNavigate();
  const data = useDemo();
  const pet = data.pets.find((p) => p.id === petId && p.ownerId === user.id);
  const [editingPet, setEditingPet] = useState(false);
  const [editing, setEditing] = useState<Editing>(null);
  const [reminderOpen, setReminderOpen] = useState(false);
  const [deleting, runDelete] = useBusy();

  const records = useMemo(
    () => ({
      health: data.health
        .filter((h) => h.petId === petId)
        .sort((a, b) => b.date.localeCompare(a.date)),
      vaccinations: data.vaccinations
        .filter((v) => v.petId === petId)
        .sort((a, b) => (a.dueOn || "9").localeCompare(b.dueOn || "9")),
      medications: data.medications
        .filter((m) => m.petId === petId)
        .sort((a, b) => Number(b.active) - Number(a.active)),
      documents: data.documents.filter((d) => d.petId === petId),
      reminders: data.reminders
        .filter((r) => r.petId === petId)
        .sort((a, b) => Number(a.done) - Number(b.done) || a.dueOn.localeCompare(b.dueOn)),
    }),
    [data, petId],
  );

  if (!pet) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-14">
        <EmptyState
          title="We couldn't find that pet"
          text="It may have been removed, or it belongs to a different account."
          action={
            <Button
              asChild
              className="rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
            >
              <Link to="/digital-collar">Back to my pets</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const setTab = (t: Tab) =>
    void navigate({
      to: "/digital-collar/$petId",
      params: { petId },
      search: { tab: t },
      replace: true,
    });
  const counts: Record<Tab, number> = {
    health: records.health.length,
    vaccinations: records.vaccinations.length,
    medications: records.medications.filter((m) => m.active).length,
    documents: records.documents.length,
    reminders: records.reminders.filter((r) => !r.done).length,
  };

  const addLabel: Record<Tab, string> = {
    health: "Log a vet visit",
    vaccinations: "Add a vaccination",
    medications: "Add a medication",
    documents: "Upload a document",
    reminders: "Set a reminder",
  };

  const startAdd = () => {
    if (tab === "health")
      setEditing({ kind: "health", initial: { date: today(), title: "", vet: "", notes: "" } });
    if (tab === "vaccinations")
      setEditing({
        kind: "vaccinations",
        initial: { name: "", clinic: "", givenOn: today(), dueOn: "" },
      });
    if (tab === "medications")
      setEditing({
        kind: "medications",
        initial: {
          name: "",
          dose: "",
          frequency: "",
          startOn: today(),
          endOn: "",
          active: true,
          notes: "",
        },
      });
    if (tab === "reminders") setReminderOpen(true);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link
        to="/digital-collar"
        className="inline-flex items-center gap-1 py-2 text-sm font-bold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> All pets
      </Link>

      <section className="card-cozy mt-4 flex flex-col gap-6 p-6 sm:flex-row sm:p-7">
        <PetPhoto pet={pet} className="size-32 sm:size-40" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl text-foreground sm:text-4xl">{pet.name}</h1>
              <p className="mt-1 text-sm font-semibold text-caramel">
                {[pet.species, pet.breed, pet.sex, pet.age, pet.weight].filter(Boolean).join(" · ")}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => {
                  downloadFile(
                    `${pet.name.toLowerCase()}-records.html`,
                    recordsDocument(data, [pet], user.name),
                    "text/html",
                  );
                  toast.success(`${pet.name}'s records downloaded`);
                }}
              >
                <Download className="size-4" /> Records
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => setEditingPet(true)}
              >
                <Pencil className="size-4" /> Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                    aria-label={`Remove ${pet.name}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-3xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove {pet.name}?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This deletes {pet.name}'s profile with every health record, document and
                      reminder. It can't be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-full">Keep</AlertDialogCancel>
                    <AlertDialogAction
                      disabled={deleting}
                      className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() =>
                        void runDelete(async () => {
                          await deletePet(pet.id);
                          toast.success(`${pet.name} was removed`);
                          void navigate({ to: "/digital-collar" });
                        })
                      }
                    >
                      Remove
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          {pet.allergies && (
            <p className="mt-3 w-fit rounded-full bg-destructive/10 px-3 py-1 text-xs font-bold text-destructive">
              Allergies: {pet.allergies}
            </p>
          )}
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {pet.about || "No notes yet — add temperament, routines and vet preferences."}
          </p>
        </div>
      </section>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <TabPills
          tabs={TABS.map((t) => ({ ...t, count: counts[t.key] }))}
          value={tab}
          onChange={setTab}
        />
        {tab === "documents" ? (
          <DocumentUpload petId={pet.id} />
        ) : (
          <Button
            className="rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
            onClick={startAdd}
          >
            <Plus className="size-4" /> {addLabel[tab]}
          </Button>
        )}
      </div>

      <div className="mt-5">
        <h2 className="sr-only">{TABS.find((t) => t.key === tab)?.label}</h2>
        {tab === "health" && (
          <RecordList
            empty={`No vet visits logged for ${pet.name} yet. Add one after your next appointment and it stays here for good.`}
            items={records.health.map((h) => ({
              id: h.id,
              icon: CalendarCheck,
              title: h.title,
              meta: `${longDate(h.date)}${h.vet ? ` · ${h.vet}` : ""}`,
              body: h.notes,
              onEdit: () =>
                setEditing({
                  kind: "health",
                  id: h.id,
                  initial: { date: h.date, title: h.title, vet: h.vet, notes: h.notes },
                }),
              onDelete: () => deleteRecord("health", h.id),
            }))}
          />
        )}
        {tab === "vaccinations" && (
          <RecordList
            empty="No vaccinations recorded yet. Add the last date for rabies, DHPPi or FVRCP and we'll remind you before the next one is due."
            items={records.vaccinations.map((v) => ({
              id: v.id,
              icon: Syringe,
              title: v.name,
              meta: `Given ${longDate(v.givenOn)}${v.clinic ? ` · ${v.clinic}` : ""}`,
              badge: v.dueOn
                ? {
                    text: `${dueLabel(v.dueOn)} (${dayLabel(v.dueOn)})`,
                    warn: daysUntil(v.dueOn) <= 14,
                  }
                : undefined,
              onEdit: () =>
                setEditing({
                  kind: "vaccinations",
                  id: v.id,
                  initial: { name: v.name, clinic: v.clinic, givenOn: v.givenOn, dueOn: v.dueOn },
                }),
              onDelete: () => deleteRecord("vaccinations", v.id),
            }))}
          />
        )}
        {tab === "medications" && (
          <RecordList
            empty="No medications on file. Add tick and flea preventives, supplements or a prescription course to get dose reminders."
            items={records.medications.map((m) => ({
              id: m.id,
              icon: Pill,
              title: m.name,
              meta: [
                m.dose,
                m.frequency,
                `from ${longDate(m.startOn)}`,
                m.endOn ? `to ${longDate(m.endOn)}` : "ongoing",
              ]
                .filter(Boolean)
                .join(" · "),
              body: m.notes,
              badge: { text: m.active ? "Active" : "Finished", warn: false, muted: !m.active },
              onEdit: () =>
                setEditing({
                  kind: "medications",
                  id: m.id,
                  initial: {
                    name: m.name,
                    dose: m.dose,
                    frequency: m.frequency,
                    startOn: m.startOn,
                    endOn: m.endOn,
                    active: m.active,
                    notes: m.notes,
                  },
                }),
              onDelete: () => deleteRecord("medications", m.id),
            }))}
          />
        )}
        {tab === "documents" && (
          <RecordList
            empty="No documents uploaded. Keep the vaccination card, pet licence and any reports where you can find them."
            items={records.documents.map((d) => ({
              id: d.id,
              icon: FileText,
              title: d.name,
              meta: `${d.kind} · ${fileSize(d.size)} · uploaded ${longDate(d.uploadedAt.slice(0, 10))}`,
              badge: { text: "Private", warn: false, muted: true },
              onDownload: () => {
                if (d.dataUrl) {
                  const a = document.createElement("a");
                  a.href = d.dataUrl;
                  a.download = d.name;
                  a.click();
                } else {
                  downloadFile(
                    `${d.name}.txt`,
                    `${d.name}\n${d.kind} for ${pet.name}\n\nThis demo keeps only the file details for larger uploads.`,
                  );
                }
                toast.success("Download started");
              },
              onDelete: () => deleteRecord("documents", d.id),
            }))}
          />
        )}
        {tab === "reminders" && (
          <RecordList
            empty={`No reminders set for ${pet.name}. Add a vaccination due date, a deworming cycle, a grooming appointment or a medication time.`}
            items={records.reminders.map((r) => ({
              id: r.id,
              icon: BellRing,
              title: r.title,
              meta: `${r.kind} · ${dayLabel(r.dueOn)}${r.time ? ` at ${r.time}` : ""}${r.repeat !== "none" ? ` · repeats ${r.repeat}` : ""}`,
              badge: r.done
                ? { text: "Done", warn: false, muted: true }
                : { text: dueLabel(r.dueOn), warn: daysUntil(r.dueOn) <= 3 },
              onToggle: { done: r.done, run: () => toggleReminder(r.id) },
            }))}
          />
        )}
      </div>

      <PetDialog open={editingPet} onOpenChange={setEditingPet} pet={pet} />
      <ReminderDialog
        open={reminderOpen}
        onOpenChange={setReminderOpen}
        pets={[pet]}
        defaultPetId={pet.id}
      />
      <RecordDialog editing={editing} pet={pet} onClose={() => setEditing(null)} />
    </div>
  );
}

function RecordDialog({
  editing,
  pet,
  onClose,
}: {
  editing: Editing;
  pet: Pet;
  onClose: () => void;
}) {
  const kind = editing?.kind ?? "health";
  const config = {
    health: { title: "vet visit", fields: HEALTH_FIELDS },
    vaccinations: { title: "vaccination", fields: VACC_FIELDS },
    medications: { title: "medication", fields: MED_FIELDS },
  }[kind];

  return (
    <FormDialog
      open={!!editing}
      onOpenChange={(v) => !v && onClose()}
      title={`${editing?.id ? "Edit" : "Add a"} ${config.title} for ${pet.name}`}
      fields={config.fields}
      initial={editing?.initial ?? {}}
      onSubmit={async (v) => {
        const id = editing?.id;
        if (kind === "health") {
          await saveRecord("health", {
            ...(id ? { id } : {}),
            petId: pet.id,
            date: str(v["date"]),
            title: str(v["title"]),
            vet: str(v["vet"]),
            notes: str(v["notes"]),
          });
        } else if (kind === "vaccinations") {
          await saveRecord("vaccinations", {
            ...(id ? { id } : {}),
            petId: pet.id,
            name: str(v["name"]),
            clinic: str(v["clinic"]),
            givenOn: str(v["givenOn"]),
            dueOn: str(v["dueOn"]),
          });
        } else {
          await saveRecord("medications", {
            ...(id ? { id } : {}),
            petId: pet.id,
            name: str(v["name"]),
            dose: str(v["dose"]),
            frequency: str(v["frequency"]),
            startOn: str(v["startOn"]),
            endOn: str(v["endOn"]),
            active: v["active"] === true,
            notes: str(v["notes"]),
          });
        }
        toast.success(
          id
            ? "Record updated"
            : kind === "vaccinations" && str(v["dueOn"])
              ? "Vaccination saved and reminder created"
              : "Record saved",
        );
      }}
    />
  );
}

const DOC_KINDS = [
  "Vaccination card",
  "Vet report",
  "Lab result",
  "Prescription",
  "Licence",
  "Insurance",
  "Other",
];

function DocumentUpload({ petId }: { petId: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const [kind, setKind] = useState(DOC_KINDS[0]!);
  const [busy, run] = useBusy();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label htmlFor="doc-kind" className="sr-only">
        Document type
      </label>
      <select
        id="doc-kind"
        value={kind}
        onChange={(e) => setKind(e.target.value)}
        className="rounded-full border border-input bg-card px-3 py-2 text-sm"
      >
        {DOC_KINDS.map((k) => (
          <option key={k}>{k}</option>
        ))}
      </select>
      <input
        ref={ref}
        type="file"
        accept="application/pdf,image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          const problem = checkFile(file, "document");
          if (problem) {
            toast.error(problem);
            return;
          }
          void run(async () => {
            const dataUrl = await documentData(file);
            await saveRecord("documents", {
              petId,
              name: file.name,
              kind,
              size: file.size,
              mime: file.type,
              uploadedAt: new Date().toISOString(),
              dataUrl,
            });
            toast.success(`${file.name} uploaded`);
          });
        }}
      />
      <Button
        disabled={busy}
        className="rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
        onClick={() => ref.current?.click()}
      >
        <Upload className="size-4" /> {busy ? "Uploading…" : "Upload a document"}
      </Button>
    </div>
  );
}

type Item = {
  id: string;
  icon: typeof Pill;
  title: string;
  meta: string;
  body?: string;
  badge?: { text: string; warn: boolean; muted?: boolean } | undefined;
  onEdit?: () => void;
  onDelete?: () => Promise<void>;
  onDownload?: () => void;
  onToggle?: { done: boolean; run: () => Promise<void> };
};

function RecordList({ items, empty }: { items: Item[]; empty: string }) {
  if (items.length === 0) return <EmptyState title="Nothing here yet" text={empty} />;
  return (
    <ul className="space-y-3">
      {items.map((it) => (
        <RecordRow key={it.id} item={it} />
      ))}
    </ul>
  );
}

function RecordRow({ item }: { item: Item }) {
  const [busy, run] = useBusy();
  const Icon = item.icon;
  return (
    <li
      className={`card-cozy flex flex-col gap-3 p-5 sm:flex-row sm:items-start ${busy ? "opacity-60" : ""}`}
    >
      {item.onToggle ? (
        <button
          onClick={() => void run(item.onToggle!.run)}
          aria-label={item.onToggle.done ? "Mark as not done" : "Mark as done"}
          className={`grid size-11 shrink-0 place-items-center rounded-2xl border-2 ${item.onToggle.done ? "border-verified bg-verified/15 text-verified" : "border-border bg-card text-muted-foreground hover:border-caramel"}`}
        >
          <Icon className="size-5" />
        </button>
      ) : (
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-accent text-caramel">
          <Icon className="size-5" />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3
            className={`text-base text-foreground ${item.onToggle?.done ? "line-through opacity-60" : ""}`}
          >
            {item.title}
          </h3>
          {item.badge && (
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                item.badge.warn
                  ? "bg-honey/50 text-honey-foreground"
                  : item.badge.muted
                    ? "bg-oat text-muted-foreground ring-1 ring-border"
                    : "bg-verified/15 text-verified"
              }`}
            >
              {item.badge.text}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">{item.meta}</p>
        {item.body && (
          <p className="mt-2 text-sm leading-relaxed text-foreground/85">{item.body}</p>
        )}
      </div>
      <div className="flex shrink-0 gap-1">
        {item.onDownload && (
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full"
            onClick={item.onDownload}
            aria-label={`Download ${item.title}`}
          >
            <Download className="size-4" />
          </Button>
        )}
        {item.onEdit && (
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full"
            onClick={item.onEdit}
            aria-label={`Edit ${item.title}`}
          >
            <Pencil className="size-4" />
          </Button>
        )}
        {item.onDelete && (
          <Button
            variant="ghost"
            size="sm"
            disabled={busy}
            className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() =>
              void run(async () => {
                await item.onDelete!();
                toast.success("Deleted");
              })
            }
            aria-label={`Delete ${item.title}`}
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      </div>
    </li>
  );
}
