import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  Check,
  CircleDashed,
  ClipboardList,
  FileWarning,
  PhoneCall,
  ShieldCheck,
  Video,
  XCircle,
} from "lucide-react";
import { RequireRole } from "@/components/app/RequireRole";
import { EmptyState, PageHeader } from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { ago, longDate } from "@/mock/format";
import { useDemo } from "@/mock/store";
import type { ApplicationStatus, User } from "@/mock/types";

export const Route = createFileRoute("/pro/application")({
  head: () => ({ meta: [{ title: "Verification status | The Petwork Pro Network" }] }),
  component: () => (
    <RequireRole roles={["pro"]}>{(user) => <ApplicationStatusPage user={user} />}</RequireRole>
  ),
});

const STATUS_COPY: Record<ApplicationStatus, { title: string; text: string; tone: string }> = {
  submitted: {
    title: "Application received",
    text: "Our team will start reviewing it within one business day.",
    tone: "bg-honey/40 text-honey-foreground",
  },
  in_review: {
    title: "Verification in progress",
    text: "We're checking your ID, calling your references and watching your video. This usually takes 3 to 5 business days.",
    tone: "bg-honey/40 text-honey-foreground",
  },
  changes_requested: {
    title: "We need a few changes",
    text: "Update your application and resubmit — it goes straight back into review.",
    tone: "bg-destructive/10 text-destructive",
  },
  approved: {
    title: "You're verified",
    text: "Your profile is live on the Pro Portal with a verified badge. Pet owners can now book you.",
    tone: "bg-verified/15 text-verified",
  },
  rejected: {
    title: "Application not approved",
    text: "We weren't able to approve your application this time. You can update it and apply again.",
    tone: "bg-destructive/10 text-destructive",
  },
};

const HISTORY_LABEL: Record<ApplicationStatus, string> = {
  submitted: "Application submitted",
  in_review: "Review started",
  changes_requested: "Changes requested",
  approved: "Approved and listed",
  rejected: "Not approved",
};

function ApplicationStatusPage({ user }: { user: User }) {
  const data = useDemo();
  const app = data.applications.find((a) => a.userId === user.id);

  if (!app) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-14">
        <EmptyState
          title="Start your verification"
          text="Complete a short application — ID, two references and a 60 second video — to appear on the Pro Portal."
          action={
            <Button
              asChild
              className="rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
            >
              <Link to="/pro-signup">Start application</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const copy = STATUS_COPY[app.status];
  const decided =
    app.status === "approved" || app.status === "rejected" || app.status === "changes_requested";
  const steps = [
    { label: "Application submitted", done: true, icon: ClipboardList },
    { label: "Government ID checked", done: app.checks.id, icon: ShieldCheck },
    { label: "References called", done: app.checks.references, icon: PhoneCall },
    { label: "Video reviewed", done: app.checks.video, icon: Video },
    {
      label:
        app.status === "approved"
          ? "Verified and listed"
          : app.status === "rejected"
            ? "Not approved"
            : app.status === "changes_requested"
              ? "Changes requested"
              : "Decision",
      done: decided,
      icon:
        app.status === "rejected"
          ? XCircle
          : app.status === "changes_requested"
            ? FileWarning
            : BadgeCheck,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <PageHeader
        label="Pro Network"
        title="Verification status"
        sub={`${app.services.join(", ")} · submitted ${longDate(app.submittedAt.slice(0, 10))}`}
      />

      <section className={`mt-6 rounded-3xl p-6 ${copy.tone}`}>
        <h2 className="text-xl">{copy.title}</h2>
        <p className="mt-1 text-sm font-semibold">{copy.text}</p>
        {app.status === "changes_requested" && app.history[app.history.length - 1]?.note && (
          <p className="mt-3 rounded-2xl bg-card p-3 text-sm text-foreground">
            “{app.history[app.history.length - 1]!.note}”
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {app.status === "approved" ? (
            <>
              <Button
                asChild
                className="rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
              >
                <Link to="/pro/dashboard">Go to my dashboard</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full bg-card">
                <Link to="/pro-portal/$proId" params={{ proId: user.id }}>
                  View my public profile
                </Link>
              </Button>
            </>
          ) : app.status === "changes_requested" || app.status === "rejected" ? (
            <Button
              asChild
              className="rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
            >
              <Link to="/pro-signup">Update application</Link>
            </Button>
          ) : (
            <Button asChild variant="outline" className="rounded-full bg-card">
              <Link to="/pro/profile">Prepare your public profile</Link>
            </Button>
          )}
        </div>
      </section>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section className="card-cozy p-6">
          <h2 className="text-lg text-foreground">Checklist</h2>
          <ol className="mt-4 space-y-1">
            {steps.map((s, i) => (
              <li key={s.label} className="flex items-start gap-3">
                <span className="flex flex-col items-center">
                  <span
                    className={`grid size-9 place-items-center rounded-full ${s.done ? "bg-verified text-verified-foreground" : "bg-oat text-muted-foreground ring-1 ring-border"}`}
                  >
                    {s.done ? <Check className="size-4" /> : <CircleDashed className="size-4" />}
                  </span>
                  {i < steps.length - 1 && (
                    <span className={`h-6 w-0.5 ${s.done ? "bg-verified" : "bg-border"}`} />
                  )}
                </span>
                <span className="pt-1.5">
                  <span
                    className={`flex items-center gap-1.5 text-sm font-bold ${s.done ? "" : "text-muted-foreground"}`}
                  >
                    <s.icon className="size-4" /> {s.label}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section className="card-cozy p-6">
          <h2 className="text-lg text-foreground">What you sent us</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                ID document
              </dt>
              <dd className="font-semibold">{app.idDocName}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Video introduction
              </dt>
              <dd className="font-semibold">{app.videoName}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                References
              </dt>
              {app.references.map((r) => (
                <dd key={r.name} className="font-semibold">
                  {r.name} <span className="font-normal text-muted-foreground">· {r.relation}</span>
                </dd>
              ))}
            </div>
          </dl>
          <h3 className="mt-6 text-sm font-bold uppercase tracking-wide text-caramel">History</h3>
          <ul className="mt-2 space-y-2">
            {[...app.history].reverse().map((h, i) => (
              <li key={i} className="text-sm">
                <span className="font-semibold">{HISTORY_LABEL[h.status]}</span>{" "}
                <span className="text-muted-foreground">· {ago(h.at)}</span>
                {h.note && <span className="block text-xs text-muted-foreground">{h.note}</span>}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
