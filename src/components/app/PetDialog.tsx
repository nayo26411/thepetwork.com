import { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { savePet } from "@/mock/actions";
import { longDate } from "@/mock/format";
import type { DemoState, Pet } from "@/mock/types";
import { checkFile, resizeImage } from "@/mock/upload";
import { FormDialog, str, type Field } from "./FormDialog";

export const SPECIES = ["Dog", "Cat", "Bird", "Rabbit", "Reptile", "Fish", "Other"] as const;

const FIELDS: Field[] = [
  { key: "name", label: "Pet name", required: true },
  { key: "species", label: "Species", type: "select", options: SPECIES, required: true },
  { key: "breed", label: "Breed", placeholder: "Indie, Labrador, Persian…" },
  { key: "sex", label: "Sex", type: "select", options: ["Male", "Female", "Unknown"] },
  { key: "age", label: "Age", placeholder: "3 years" },
  { key: "weight", label: "Weight", placeholder: "12 kg" },
  {
    key: "allergies",
    label: "Allergies",
    placeholder: "Chicken, dust mites…",
    full: true,
    hint: "Shown to professionals you book, so they can keep your pet safe.",
  },
  {
    key: "about",
    label: "About",
    type: "textarea",
    placeholder: "Temperament, routines, the things a vet or a sitter should know.",
  },
];

export function PetDialog({
  open,
  onOpenChange,
  pet,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  pet?: Pet;
  onSaved?: (id: string) => void;
}) {
  const [photo, setPhoto] = useState(pet?.photo ?? "");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setPhoto(pet?.photo ?? "");
  }, [open, pet?.photo]);

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={pet ? `Edit ${pet.name}` : "Add a pet"}
      description={
        pet ? undefined : "Start their Digital Collar. You can add health records straight after."
      }
      fields={FIELDS}
      initial={{
        name: pet?.name ?? "",
        species: pet?.species ?? "Dog",
        breed: pet?.breed ?? "",
        sex: pet?.sex ?? "Unknown",
        age: pet?.age ?? "",
        weight: pet?.weight ?? "",
        allergies: pet?.allergies ?? "",
        about: pet?.about ?? "",
      }}
      submitLabel={pet ? "Save changes" : "Add pet"}
      onSubmit={async (v) => {
        const id = await savePet(
          {
            name: str(v["name"]),
            species: str(v["species"]),
            breed: str(v["breed"]),
            sex: str(v["sex"]),
            age: str(v["age"]),
            weight: str(v["weight"]),
            allergies: str(v["allergies"]),
            about: str(v["about"]),
            photo,
          },
          pet?.id,
        );
        toast.success(pet ? "Changes saved" : `${str(v["name"])} now has a Digital Collar`);
        onSaved?.(id);
      }}
      extra={
        <div>
          <p className="text-sm font-medium">
            Photo <span className="font-normal text-muted-foreground">(optional)</span>
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              const problem = checkFile(file, "image");
              if (problem) {
                toast.error(problem);
                return;
              }
              try {
                setPhoto(await resizeImage(file));
              } catch {
                toast.error("Could not read that image.");
              }
            }}
          />
          <div className="mt-1.5 flex items-center gap-3">
            {photo ? (
              <span className="relative">
                <img
                  src={photo}
                  alt="Pet preview"
                  className="size-20 rounded-2xl object-cover ring-1 ring-border"
                />
                <button
                  type="button"
                  onClick={() => setPhoto("")}
                  aria-label="Remove photo"
                  className="absolute -right-2 -top-2 rounded-full bg-mocha p-1 text-mocha-foreground"
                >
                  <X className="size-3" />
                </button>
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 rounded-xl border-2 border-dashed border-border px-4 py-3 text-sm font-bold text-caramel hover:border-caramel hover:bg-oat"
            >
              <ImagePlus className="size-4" /> {photo ? "Change photo" : "Upload a photo"}
            </button>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">JPG, PNG or WEBP up to 10 MB.</p>
        </div>
      }
    />
  );
}

const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

/** A printable HTML summary of one or more pets' records. */
export function recordsDocument(data: DemoState, pets: Pet[], ownerName: string) {
  const section = (title: string, rows: string[][], head: string[]) =>
    rows.length
      ? `<h3>${title}</h3><table><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr>${rows
          .map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`)
          .join("")}</table>`
      : `<h3>${title}</h3><p class="muted">Nothing recorded yet.</p>`;

  const body = pets
    .map((p) => {
      const health = data.health.filter((h) => h.petId === p.id);
      const vacc = data.vaccinations.filter((v) => v.petId === p.id);
      const meds = data.medications.filter((m) => m.petId === p.id);
      const docs = data.documents.filter((d) => d.petId === p.id);
      return `<section><h2>${esc(p.name)}</h2>
        <p>${esc([p.species, p.breed, p.sex, p.age, p.weight].filter(Boolean).join(" · "))}</p>
        ${p.allergies ? `<p><strong>Allergies:</strong> ${esc(p.allergies)}</p>` : ""}
        ${p.about ? `<p>${esc(p.about)}</p>` : ""}
        ${section(
          "Vaccinations",
          vacc.map((v) => [
            v.name,
            longDate(v.givenOn),
            v.dueOn ? longDate(v.dueOn) : "—",
            v.clinic,
          ]),
          ["Vaccine", "Given", "Next due", "Clinic"],
        )}
        ${section(
          "Medications",
          meds.map((m) => [m.name, m.dose, m.frequency, m.active ? "Active" : "Finished"]),
          ["Medication", "Dose", "Frequency", "Status"],
        )}
        ${section(
          "Health log",
          health.map((h) => [longDate(h.date), h.title, h.vet, h.notes]),
          ["Date", "Visit", "Vet", "Notes"],
        )}
        ${section(
          "Documents on file",
          docs.map((d) => [d.name, d.kind, longDate(d.uploadedAt.slice(0, 10))]),
          ["File", "Type", "Uploaded"],
        )}
      </section>`;
    })
    .join("");

  return `<!doctype html><html><head><meta charset="utf-8"><title>Pet records — The Petwork</title>
  <style>body{font-family:system-ui,sans-serif;color:#3A2119;max-width:820px;margin:40px auto;padding:0 20px}
  h1{margin-bottom:0}h2{border-bottom:2px solid #8B5E3C;padding-bottom:6px;margin-top:36px}h3{color:#8B5E3C;margin-top:22px}
  table{border-collapse:collapse;width:100%;font-size:14px}th,td{text-align:left;padding:6px 8px;border-bottom:1px solid #ddd}
  .muted{color:#957662}</style></head><body>
  <h1>The Digital Collar</h1><p class="muted">Records for ${esc(ownerName)} · exported ${longDate(new Date().toISOString().slice(0, 10))} from The Petwork</p>
  ${body}</body></html>`;
}
