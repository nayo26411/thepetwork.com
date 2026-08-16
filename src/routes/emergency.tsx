import { createFileRoute } from "@tanstack/react-router";
import { Phone, ShieldAlert, Siren, Stethoscope } from "lucide-react";
import { DELHI_ANIMAL_HELPLINE, EMERGENCY_VETS, type EmergencyVet } from "@/data/emergency";

export const Route = createFileRoute("/emergency")({
  head: () => ({
    meta: [
      { title: "Pet Emergency & 24×7 Vets in Delhi NCR | The Petwork" },
      {
        name: "description",
        content:
          "Find 24x7 animal hospitals, local vet clinics and pet ambulance & rescue contacts across Delhi NCR — with one tap to call in an emergency.",
      },
      { property: "og:title", content: "Pet Emergency & 24×7 Vets in Delhi NCR" },
      {
        property: "og:description",
        content: "Help, any hour — 24x7 hospitals, local clinics and rescue numbers for Delhi NCR pets.",
      },
    ],
  }),
  component: EmergencyPage,
});

function telHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  return `tel:${digits}`;
}

function VetCard({ vet }: { vet: EmergencyVet }) {
  const callable = vet.phone.toLowerCase().includes("contact") ? null : vet.phone;
  return (
    <div className="card-cozy hover-lift flex min-w-0 flex-col gap-3.5 p-7">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-bold text-foreground">{vet.name}</h3>
          <p className="truncate text-sm text-muted-foreground">{vet.area}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
            vet.open24
              ? "bg-terracotta text-terracotta-foreground"
              : "bg-oat text-foreground"
          }`}
        >
          {vet.open24 ? "24×7" : "OPD"}
        </span>
      </div>
      <p className="min-w-0 text-sm text-foreground">{vet.services}</p>
      {callable ? (
        <a
          href={telHref(callable)}
          className="mt-1 flex items-center justify-center gap-2 rounded-full bg-caramel px-4 py-3 text-sm font-bold text-caramel-foreground transition-transform hover:scale-[1.02]"
        >
          <Phone className="size-4 shrink-0" />
          <span className="truncate">Call {vet.phone}</span>
        </a>
      ) : (
        <span className="mt-1 flex items-center justify-center gap-2 rounded-full border border-dashed border-caramel px-4 py-3 text-sm font-bold text-muted-foreground">
          <Phone className="size-4 shrink-0" />
          <span className="truncate">{vet.phone}</span>
        </span>
      )}
    </div>
  );
}

function EmergencyPage() {
  const hospitals24 = EMERGENCY_VETS.filter((v) => v.open24);
  const localClinics = EMERGENCY_VETS.filter(
    (v) => !v.open24 && !["Rescue, rehabilitation, adoption, OPD", "Rescue, OPD, adoption"].includes(v.services)
  );
  const rescue = EMERGENCY_VETS.filter((v) =>
    ["Rescue, rehabilitation, adoption, OPD", "Rescue, OPD, adoption"].includes(v.services)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-14">
      <div className="card-cozy min-w-0 border border-destructive/20 bg-destructive/5 p-6 sm:p-8">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <span className="section-label flex items-center gap-2 text-destructive">
              <Siren className="size-4 shrink-0" /> Pet emergencies
            </span>
            <h1 className="mt-2 text-4xl text-foreground sm:text-5xl">Help, any hour.</h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              When something goes wrong with your pet, minutes matter. Here is every 24x7 hospital,
              trusted local clinic and rescue number we could find across Delhi NCR.
            </p>
          </div>
          <a
            href={telHref(DELHI_ANIMAL_HELPLINE)}
            className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-destructive px-6 py-4 text-base font-bold text-destructive-foreground shadow-cozy transition-transform hover:scale-[1.02]"
          >
            <Phone className="size-5 shrink-0" />
            Call pet ambulance
          </a>
        </div>
        <p className="mt-5 flex min-w-0 items-start gap-2 text-xs text-muted-foreground">
          <ShieldAlert className="mt-0.5 size-4 shrink-0" />
          <span className="min-w-0">
            Contacts are sourced from public listings and may change — please confirm hours and
            availability by phone before heading out, especially late at night.
          </span>
        </p>
      </div>

      <section className="mt-10">
        <h2 className="flex items-center gap-2 text-xl text-foreground">
          <Stethoscope className="size-5 shrink-0 text-caramel" /> 24×7 hospitals near me
        </h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {hospitals24.map((v) => (
            <VetCard key={v.id} vet={v} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="flex items-center gap-2 text-xl text-foreground">
          <Stethoscope className="size-5 shrink-0 text-caramel" /> Local vet clinics
        </h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {localClinics.map((v) => (
            <VetCard key={v.id} vet={v} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="flex items-center gap-2 text-xl text-foreground">
          <Siren className="size-5 shrink-0 text-terracotta" /> Pet ambulance & rescue
        </h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rescue.map((v) => (
            <VetCard key={v.id} vet={v} />
          ))}
        </div>
      </section>
    </div>
  );
}
