import { useState } from "react";
import { BadgeCheck, FileText, Mail, MapPin, Phone, PlayCircle } from "lucide-react";
import { toast } from "sonner";
import { FormDialog, str } from "@/components/app/FormDialog";
import { EmptyState, PersonAvatar, TabPills, useBusy } from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { reviewApplication, setApplicationCheck } from "@/mock/actions";
import { ago } from "@/mock/format";
import { useDemo } from "@/mock/store";
import type { Application, ApplicationStatus } from "@/mock/types";
import { SectionHead, StatusPill } from "./shared";

export const APP_STATUS: Record<
  ApplicationStatus,
  { label: string; tone: "good" | "warn" | "bad" | "muted" }
> = {
  submitted: { label: "New", tone: "warn" },
  in_review: { label: "In review", tone: "warn" },
  changes_requested: { label: "Changes requested", tone: "muted" },
  approved: { label: "Approved", tone: "good" },
  rejected: { label: "Rejected", tone: "bad" },
};

const FILTERS = [
  { key: "open", label: "To review" },
  { key: "changes_requested", label: "Waiting on applicant" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
] as const;

export function Applications() {
  const data = useDemo();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("open");
  const [openId, setOpenId] = useState<string | null>(null);

  const match = (a: Application, f: (typeof FILTERS)[number]["key"]) =>
    f === "open" ? a.status === "submitted" || a.status === "in_review" : a.status === f;
  const list = data.applications
    .filter((a) => match(a, filter))
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  const active = data.applications.find((a) => a.id === openId) ?? null;

  return (
    <>
      <SectionHead
        title="Professional applications"
        sub="Check ID, call references and watch the video before approving. Approved professionals appear on the Pro Portal with a verified badge."
      />
      <TabPills
        tabs={FILTERS.map((f) => ({
          ...f,
          count: data.applications.filter((a) => match(a, f.key)).length,
        }))}
        value={filter}
        onChange={setFilter}
      />

      <div className="mt-5 space-y-3">
        {list.length === 0 ? (
          <EmptyState
            title="Nothing here"
            text="New applications from the Pro Network signup land here."
          />
        ) : (
          list.map((a) => {
            const checks = Object.values(a.checks).filter(Boolean).length;
            return (
              <button
                key={a.id}
                onClick={() => setOpenId(a.id)}
                className="card-cozy hover-lift flex w-full flex-wrap items-center gap-4 p-5 text-left"
              >
                <PersonAvatar name={a.name} className="size-12" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold">{a.name}</span>
                    <StatusPill tone={APP_STATUS[a.status].tone}>
                      {APP_STATUS[a.status].label}
                    </StatusPill>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {a.services.join(", ")} · {a.area} · {a.years} yrs · submitted{" "}
                    {ago(a.submittedAt)}
                  </p>
                </div>
                <span className="text-sm font-semibold text-muted-foreground">
                  {checks}/3 checks done
                </span>
              </button>
            );
          })
        )}
      </div>

      <Sheet open={!!active} onOpenChange={(v) => !v && setOpenId(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          {active && <ApplicationDetail app={active} onDone={() => setOpenId(null)} />}
        </SheetContent>
      </Sheet>
    </>
  );
}

function ApplicationDetail({ app, onDone }: { app: Application; onDone: () => void }) {
  const [busy, run] = useBusy();
  const [noteFor, setNoteFor] = useState<"changes_requested" | "rejected" | null>(null);
  const allChecks = app.checks.id && app.checks.references && app.checks.video;
  const decided = app.status === "approved" || app.status === "rejected";

  const decide = (status: ApplicationStatus, note = "", msg = "") =>
    run(async () => {
      await reviewApplication(app.id, status, note);
      toast.success(msg);
      if (status !== "in_review") onDone();
    });

  const CHECKS: {
    key: keyof Application["checks"];
    label: string;
    icon: typeof FileText;
    detail: string;
  }[] = [
    { key: "id", label: "Government ID matches", icon: FileText, detail: app.idDocName },
    {
      key: "references",
      label: "Both references called",
      icon: Phone,
      detail: app.references.map((r) => r.name).join(", "),
    },
    { key: "video", label: "Video introduction reviewed", icon: PlayCircle, detail: app.videoName },
  ];

  return (
    <>
      <SheetHeader className="text-left">
        <div className="flex items-center gap-3">
          <PersonAvatar name={app.name} className="size-14 text-lg" />
          <div>
            <SheetTitle className="font-display text-2xl">{app.name}</SheetTitle>
            <SheetDescription>
              {app.services.join(", ")} ·{" "}
              <StatusPill tone={APP_STATUS[app.status].tone}>
                {APP_STATUS[app.status].label}
              </StatusPill>
            </SheetDescription>
          </div>
        </div>
      </SheetHeader>

      <div className="mt-6 space-y-6 px-1 pb-8">
        <div className="grid gap-2 text-sm">
          <p className="flex items-center gap-2">
            <Mail className="size-4 text-caramel" /> {app.email}
          </p>
          <p className="flex items-center gap-2">
            <Phone className="size-4 text-caramel" /> {app.phone}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="size-4 text-caramel" /> {app.area} · {app.years} years experience
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-caramel">Bio</h3>
          <p className="mt-1 text-sm leading-relaxed">{app.bio}</p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-caramel">References</h3>
          <ul className="mt-2 space-y-2">
            {app.references.map((r) => (
              <li
                key={r.name}
                className="flex items-center justify-between gap-3 rounded-2xl bg-oat p-3 text-sm"
              >
                <span>
                  <span className="font-bold">{r.name}</span>
                  <span className="block text-xs text-muted-foreground">{r.relation}</span>
                </span>
                <a
                  href={`tel:${r.phone.replace(/\s/g, "")}`}
                  className="font-semibold text-caramel hover:underline"
                >
                  {r.phone}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-caramel">
            Verification checklist
          </h3>
          <ul className="mt-2 space-y-2">
            {CHECKS.map((c) => (
              <li
                key={c.key}
                className="flex items-center justify-between gap-3 rounded-2xl border border-border p-3"
              >
                <label htmlFor={`chk-${c.key}`} className="flex min-w-0 items-center gap-3 text-sm">
                  <c.icon className="size-5 shrink-0 text-caramel" />
                  <span className="min-w-0">
                    <span className="block font-bold">{c.label}</span>
                    <span className="block truncate text-xs text-muted-foreground">{c.detail}</span>
                  </span>
                </label>
                <Switch
                  id={`chk-${c.key}`}
                  checked={app.checks[c.key]}
                  disabled={decided}
                  onCheckedChange={(v) => void setApplicationCheck(app.id, c.key, v)}
                />
              </li>
            ))}
          </ul>
        </div>

        {!decided && (
          <div className="space-y-2 rounded-3xl bg-oat p-4">
            {app.status === "submitted" && (
              <Button
                disabled={busy}
                variant="outline"
                className="w-full rounded-full bg-card"
                onClick={() =>
                  void decide(
                    "in_review",
                    "",
                    "Marked as in review — the applicant has been notified",
                  )
                }
              >
                Start review
              </Button>
            )}
            <Button
              disabled={busy || !allChecks}
              className="w-full rounded-full bg-verified text-verified-foreground hover:bg-verified/90"
              onClick={() =>
                void decide(
                  "approved",
                  "All checks complete. Welcome to the network!",
                  `${app.name} is approved and now listed on the Pro Portal`,
                )
              }
            >
              <BadgeCheck className="size-4" /> Approve and publish profile
            </Button>
            {!allChecks && (
              <p className="text-center text-xs text-muted-foreground">
                Complete all three checks to approve.
              </p>
            )}
            <div className="grid grid-cols-2 gap-2">
              <Button
                disabled={busy}
                variant="outline"
                className="rounded-full bg-card"
                onClick={() => setNoteFor("changes_requested")}
              >
                Request changes
              </Button>
              <Button
                disabled={busy}
                variant="outline"
                className="rounded-full bg-card text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => setNoteFor("rejected")}
              >
                Reject
              </Button>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-caramel">History</h3>
          <ul className="mt-2 space-y-1.5 text-sm">
            {[...app.history].reverse().map((h, i) => (
              <li key={i}>
                <span className="font-semibold">{APP_STATUS[h.status].label}</span>{" "}
                <span className="text-muted-foreground">· {ago(h.at)}</span>
                {h.note && <span className="block text-xs text-muted-foreground">{h.note}</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <FormDialog
        open={!!noteFor}
        onOpenChange={(v) => !v && setNoteFor(null)}
        title={
          noteFor === "rejected" ? `Reject ${app.name}'s application?` : "What needs to change?"
        }
        description="The applicant sees this message on their status page."
        fields={[
          {
            key: "note",
            label: "Message to the applicant",
            type: "textarea",
            required: true,
            placeholder:
              noteFor === "rejected"
                ? "We couldn't verify your references."
                : "Please upload a clearer photo of your ID.",
          },
        ]}
        initial={{ note: "" }}
        submitLabel={noteFor === "rejected" ? "Reject application" : "Send request"}
        onSubmit={async (v) => {
          await reviewApplication(app.id, noteFor!, str(v["note"]));
          toast.success(
            noteFor === "rejected"
              ? "Application rejected"
              : "Changes requested — the applicant has been notified",
          );
          onDone();
        }}
      />
    </>
  );
}
