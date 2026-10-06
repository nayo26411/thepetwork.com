import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ExternalLink, Eye, EyeOff, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { FormDialog, str, type Values } from "@/components/app/FormDialog";
import { TabPills, useBusy } from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { RECIPES } from "@/data/recipes";
import type { EmergencyVet } from "@/data/emergency";
import {
  deleteEmergencyContact,
  saveEmergencyContact,
  saveMunicipalRule,
  setRecipeOverride,
  uid,
} from "@/mock/actions";
import { longDate } from "@/mock/format";
import { useDemo } from "@/mock/store";
import type { MunicipalRule } from "@/mock/types";
import { SectionHead, StatusPill, Table } from "./shared";

const TABS = [
  { key: "emergency", label: "Emergency contacts" },
  { key: "municipal", label: "Municipal rules" },
  { key: "recipes", label: "Recipes" },
] as const;

export function PublicInfo() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("emergency");
  return (
    <>
      <SectionHead
        title="Public information"
        sub="Edit the information everyone sees without signing in. Changes publish immediately."
      />
      <TabPills tabs={TABS} value={tab} onChange={setTab} />
      <div className="mt-5">
        {tab === "emergency" && <EmergencyEditor />}
        {tab === "municipal" && <MunicipalEditor />}
        {tab === "recipes" && <RecipeEditor />}
      </div>
    </>
  );
}

/* --------------------------------------------------------------- emergency */

function EmergencyEditor() {
  const data = useDemo();
  const [editing, setEditing] = useState<EmergencyVet | "new" | null>(null);
  const [busy, run] = useBusy();
  const current = editing === "new" ? null : editing;

  return (
    <>
      <div className="mb-4 flex flex-wrap justify-between gap-2">
        <Button asChild variant="outline" className="rounded-full">
          <Link to="/emergency">
            View public page <ExternalLink className="size-4" />
          </Link>
        </Button>
        <Button
          className="rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
          onClick={() => setEditing("new")}
        >
          <Plus className="size-4" /> Add contact
        </Button>
      </div>
      <Table head={["Name", "Area", "Phone", "Hours", ""]}>
        {data.emergency.map((v) => (
          <tr key={v.id}>
            <td className="px-4 py-3">
              <p className="font-bold">{v.name}</p>
              <p className="line-clamp-1 text-xs text-muted-foreground">{v.services}</p>
            </td>
            <td className="px-4 py-3">{v.area}</td>
            <td className="px-4 py-3">{v.phone}</td>
            <td className="px-4 py-3">
              <StatusPill tone={v.open24 ? "good" : "muted"}>
                {v.open24 ? "24×7" : "OPD hours"}
              </StatusPill>
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-right">
              <Button
                size="sm"
                variant="ghost"
                className="rounded-full"
                onClick={() => setEditing(v)}
                aria-label={`Edit ${v.name}`}
              >
                <Pencil className="size-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                disabled={busy}
                className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                aria-label={`Delete ${v.name}`}
                onClick={() =>
                  void run(async () => {
                    await deleteEmergencyContact(v.id);
                    toast.success(`${v.name} removed from the emergency page`);
                  })
                }
              >
                <Trash2 className="size-4" />
              </Button>
            </td>
          </tr>
        ))}
      </Table>

      <FormDialog
        open={!!editing}
        onOpenChange={(v) => !v && setEditing(null)}
        title={current ? `Edit ${current.name}` : "Add an emergency contact"}
        description="Only list contacts you have verified. Avoid claiming 24×7 or vet approval unless confirmed."
        fields={[
          { key: "name", label: "Name", required: true, full: true },
          { key: "area", label: "Area", required: true },
          { key: "phone", label: "Phone", required: true },
          { key: "services", label: "Services", type: "textarea", required: true },
          { key: "open24", label: "Open 24×7 (verified)", type: "switch" },
        ]}
        initial={{
          name: current?.name ?? "",
          area: current?.area ?? "",
          phone: current?.phone ?? "",
          services: current?.services ?? "",
          open24: current?.open24 ?? false,
        }}
        onSubmit={async (v: Values) => {
          await saveEmergencyContact({
            id: current?.id ?? uid("vet"),
            name: str(v["name"]),
            area: str(v["area"]),
            phone: str(v["phone"]),
            services: str(v["services"]),
            open24: v["open24"] === true,
            lat: current?.lat ?? 28.6,
            lng: current?.lng ?? 77.2,
          });
          toast.success("Emergency page updated");
        }}
      />
    </>
  );
}

/* --------------------------------------------------------------- municipal */

const RULE_FIELDS = [
  { key: "registration", label: "Pet registration" },
  { key: "licensing", label: "Licensing & renewal" },
  { key: "leash", label: "Leash rules" },
  { key: "waste", label: "Waste disposal" },
  { key: "publicSpaces", label: "Parks & public spaces" },
  { key: "guidance", label: "Other guidance" },
] as const;

function MunicipalEditor() {
  const data = useDemo();
  const [editing, setEditing] = useState<MunicipalRule | null>(null);
  return (
    <>
      <div className="mb-4">
        <Button asChild variant="outline" className="rounded-full">
          <Link to="/municipal-rules">
            View public page <ExternalLink className="size-4" />
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {data.municipal.map((r) => (
          <div key={r.id} className="card-cozy p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-caramel">{r.city}</p>
            <h3 className="mt-1 text-lg text-foreground">{r.authority}</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Last checked {longDate(r.lastChecked)} · source: {r.sourceName}
            </p>
            <Button
              size="sm"
              variant="outline"
              className="mt-4 rounded-full"
              onClick={() => setEditing(r)}
            >
              <Pencil className="size-4" /> Review & edit
            </Button>
          </div>
        ))}
      </div>
      <FormDialog
        open={!!editing}
        onOpenChange={(v) => !v && setEditing(null)}
        title={editing ? `${editing.authority}` : ""}
        description="Saving updates the last-checked date to today."
        fields={[
          ...RULE_FIELDS.map((f) => ({
            key: f.key,
            label: f.label,
            type: "textarea" as const,
            required: true,
          })),
          { key: "sourceName", label: "Source name", required: true },
          { key: "sourceUrl", label: "Official source link", required: true },
        ]}
        initial={
          editing
            ? Object.fromEntries([
                ...RULE_FIELDS.map((f) => [f.key, editing[f.key]]),
                ["sourceName", editing.sourceName],
                ["sourceUrl", editing.sourceUrl],
              ])
            : {}
        }
        onSubmit={async (v) => {
          if (!editing) return;
          await saveMunicipalRule({
            ...editing,
            ...Object.fromEntries(RULE_FIELDS.map((f) => [f.key, str(v[f.key])])),
            sourceName: str(v["sourceName"]),
            sourceUrl: str(v["sourceUrl"]),
            lastChecked: new Date().toISOString().slice(0, 10),
          });
          toast.success("Rules updated and marked as checked today");
        }}
      />
    </>
  );
}

/* ----------------------------------------------------------------- recipes */

function RecipeEditor() {
  const data = useDemo();
  const [q, setQ] = useState("");
  const [noteFor, setNoteFor] = useState<string | null>(null);
  const list = useMemo(
    () =>
      RECIPES.filter(
        (r) => !q.trim() || `${r.name} ${r.species}`.toLowerCase().includes(q.trim().toLowerCase()),
      ),
    [q],
  );
  const target = RECIPES.find((r) => r.id === noteFor);

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="relative min-w-60 flex-1">
          <span className="sr-only">Search recipes</span>
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search recipes"
            className="w-full rounded-full border border-border bg-card py-2.5 pl-11 pr-4 text-sm outline-none focus:border-caramel"
          />
        </label>
        <Button asChild variant="outline" className="rounded-full">
          <Link to="/munchie-menu">
            View public page <ExternalLink className="size-4" />
          </Link>
        </Button>
      </div>
      <Table head={["Recipe", "Species", "Source", "Note", "Visibility"]}>
        {list.map((r) => {
          const o = data.recipeOverrides[r.id] ?? {};
          return (
            <tr key={r.id} className={o.hidden ? "opacity-60" : ""}>
              <td className="px-4 py-3 font-bold">{r.name}</td>
              <td className="px-4 py-3">{r.species}</td>
              <td className="px-4 py-3">
                <a
                  href={r.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-caramel hover:underline"
                >
                  {r.sourceName}
                </a>
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => setNoteFor(r.id)}
                  className="text-left text-xs font-semibold text-muted-foreground hover:text-caramel"
                >
                  {o.note ? o.note : "+ Add note"}
                </button>
              </td>
              <td className="px-4 py-3">
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => {
                    void setRecipeOverride(r.id, { hidden: !o.hidden });
                    toast.success(
                      o.hidden
                        ? `${r.name} is visible again`
                        : `${r.name} hidden from the Munchie Menu`,
                    );
                  }}
                >
                  {o.hidden ? <Eye className="size-4" /> : <EyeOff className="size-4" />}{" "}
                  {o.hidden ? "Show" : "Hide"}
                </Button>
              </td>
            </tr>
          );
        })}
      </Table>
      <FormDialog
        open={!!noteFor}
        onOpenChange={(v) => !v && setNoteFor(null)}
        title={`Note on ${target?.name ?? "recipe"}`}
        description="Shown at the top of the recipe, e.g. a correction or an extra safety warning."
        fields={[{ key: "note", label: "Note", type: "textarea" }]}
        initial={{ note: (noteFor && data.recipeOverrides[noteFor]?.note) || "" }}
        onSubmit={async (v) => {
          if (!noteFor) return;
          await setRecipeOverride(noteFor, { note: str(v["note"]) });
          toast.success("Recipe note saved");
        }}
      />
    </>
  );
}
