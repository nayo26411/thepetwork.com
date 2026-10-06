import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, FileCheck2, PawPrint, Upload, Video } from "lucide-react";
import { toast } from "sonner";
import { RequireRole } from "@/components/app/RequireRole";
import { useBusy } from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitApplication } from "@/mock/actions";
import { fileSize } from "@/mock/format";
import { useDemo } from "@/mock/store";
import { PRO_TYPES, type ProType, type User } from "@/mock/types";
import { checkFile } from "@/mock/upload";

export const Route = createFileRoute("/pro-signup")({
  head: () => ({
    meta: [
      { title: "Join The Petwork Pro Network — Professional Application" },
      {
        name: "description",
        content:
          "Apply to join The Petwork Pro Network as a dog walker, groomer, sitter, trainer or vet in Delhi NCR.",
      },
    ],
  }),
  component: () => <RequireRole roles={["pro"]}>{(user) => <ProSignup user={user} />}</RequireRole>,
});

const CODE = [
  "I will treat every animal in my care with patience, gentleness and respect — never with force or fear.",
  "I will be punctual, and I will inform the owner immediately if I am delayed or need to reschedule.",
  "I will communicate transparently about incidents, injuries or behaviour changes, the same day they happen.",
  "I will keep owners' addresses, phone numbers and pet records private and use them only for bookings.",
];

const STEP_LABELS = ["Basic info", "Verification", "Video intro", "Agreement"];

function FilePick({
  label,
  hint,
  accept,
  kind,
  value,
  onChange,
  icon: Icon,
}: {
  label: string;
  hint: string;
  accept: string;
  kind: "document" | "video";
  value: { name: string; size: number } | null;
  onChange: (f: { name: string; size: number } | null) => void;
  icon: typeof Upload;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div
      className={`flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed p-7 text-center ${value ? "border-verified/60 bg-verified/5" : "border-caramel/50"}`}
    >
      {value ? (
        <FileCheck2 className="size-7 text-verified" />
      ) : (
        <Icon className="size-7 text-caramel" />
      )}
      <p className="text-sm font-bold text-foreground">{label}</p>
      {value ? (
        <p className="text-xs font-semibold text-verified">
          {value.name} · {fileSize(value.size)}
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      <input
        ref={ref}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          const problem = checkFile(file, kind);
          if (problem) {
            toast.error(problem);
            return;
          }
          onChange({ name: file.name, size: file.size });
        }}
      />
      <div className="mt-2 flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={() => ref.current?.click()}
        >
          <Upload className="size-4" /> {value ? "Replace file" : "Choose file"}
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="rounded-full"
            onClick={() => onChange(null)}
          >
            Remove
          </Button>
        )}
      </div>
    </div>
  );
}

function ProSignup({ user }: { user: User }) {
  const data = useDemo();
  const navigate = useNavigate();
  const existing = data.applications.find((a) => a.userId === user.id);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: existing?.name ?? user.name,
    phone: existing?.phone ?? user.phone,
    email: existing?.email ?? user.email,
    area: existing?.area ?? user.area,
    years: String(existing?.years ?? ""),
    bio: existing?.bio ?? "",
  });
  const [services, setServices] = useState<ProType[]>(existing?.services ?? []);
  const [idDoc, setIdDoc] = useState<{ name: string; size: number } | null>(
    existing ? { name: existing.idDocName, size: 240_000 } : null,
  );
  const [video, setVideo] = useState<{ name: string; size: number } | null>(
    existing ? { name: existing.videoName, size: 18_000_000 } : null,
  );
  const [refs, setRefs] = useState(
    existing?.references ?? [
      { name: "", phone: "", relation: "" },
      { name: "", phone: "", relation: "" },
    ],
  );
  const [agreed, setAgreed] = useState<boolean[]>(CODE.map(() => !!existing));
  const [busy, run] = useBusy();
  // Set once this form submits, so the "already applied" screen doesn't flash before we navigate away.
  const [submitted, setSubmitted] = useState(false);

  if (
    existing &&
    !submitted &&
    existing.status !== "changes_requested" &&
    existing.status !== "rejected"
  ) {
    return (
      <div className="paw-grid flex min-h-screen items-center justify-center px-4 py-16">
        <div className="card-cozy max-w-md p-8 text-center">
          <h1 className="text-2xl text-foreground">Your application is already in</h1>
          <p className="mt-2 text-muted-foreground">
            You can follow its progress on your verification status page.
          </p>
          <Button
            asChild
            className="mt-6 rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
          >
            <Link to="/pro/application">See status</Link>
          </Button>
        </div>
      </div>
    );
  }

  const set =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const stepError = [
    !form.name.trim() ||
    !form.phone.trim() ||
    !form.area.trim() ||
    services.length === 0 ||
    form.bio.trim().length < 20
      ? "Fill in your name, phone, area, at least one service and a short bio (20+ characters)."
      : null,
    !idDoc || refs.some((r) => !r.name.trim() || !r.phone.trim())
      ? "Upload your ID and add two references with phone numbers."
      : null,
    !video ? "Add your video introduction." : null,
    !agreed.every(Boolean) ? "Please accept each point of the code of conduct." : null,
  ][step];

  const next = () => {
    if (stepError) {
      toast.error(stepError);
      return;
    }
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-oat pb-20">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-5">
          <span className="grid size-9 place-items-center rounded-full bg-caramel text-caramel-foreground">
            <PawPrint className="size-5" />
          </span>
          <div>
            <p className="font-display text-lg font-bold text-foreground">
              The Petwork Pro Network
            </p>
            <p className="text-xs text-muted-foreground">Professional application · Delhi NCR</p>
          </div>
          <Link to="/" className="ml-auto text-sm font-bold text-caramel hover:underline">
            Save &amp; exit
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 pt-8">
        {existing?.status === "changes_requested" && (
          <p className="mb-5 rounded-2xl bg-honey/40 p-4 text-sm font-semibold text-honey-foreground">
            Changes requested:{" "}
            {existing.history[existing.history.length - 1]?.note ||
              "Please review your application."}
          </p>
        )}
        <ol className="flex flex-wrap gap-2" aria-label="Application steps">
          {STEP_LABELS.map((label, i) => (
            <li
              key={label}
              aria-current={i === step ? "step" : undefined}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${
                i === step
                  ? "bg-caramel text-caramel-foreground"
                  : i < step
                    ? "bg-verified/15 text-verified"
                    : "bg-card text-muted-foreground ring-1 ring-border"
              }`}
            >
              {i < step ? <Check className="size-4" /> : <span>{i + 1}</span>} {label}
            </li>
          ))}
        </ol>

        <div className="card-cozy mt-6 p-7 sm:p-9">
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <h1 className="text-xl text-foreground">Tell us who you are</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  This is what pet parents will see first, so write it the way you would speak.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="fullname">Full name</Label>
                  <Input
                    id="fullname"
                    value={form.name}
                    onChange={set("name")}
                    maxLength={80}
                    className="mt-1.5 rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={set("phone")}
                    maxLength={15}
                    placeholder="+91 98xxx xxxxx"
                    className="mt-1.5 rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="pemail">Email</Label>
                  <Input
                    id="pemail"
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    maxLength={120}
                    className="mt-1.5 rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="area">City &amp; area in Delhi NCR</Label>
                  <Input
                    id="area"
                    value={form.area}
                    onChange={set("area")}
                    maxLength={80}
                    placeholder="Vasant Kunj, South Delhi"
                    className="mt-1.5 rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="years">Years of experience</Label>
                  <Input
                    id="years"
                    type="number"
                    min={0}
                    max={60}
                    value={form.years}
                    onChange={set("years")}
                    placeholder="5"
                    className="mt-1.5 rounded-xl"
                  />
                </div>
              </div>
              <fieldset>
                <legend className="text-sm font-medium">Services offered</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {PRO_TYPES.map((s) => {
                    const on = services.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        aria-pressed={on}
                        onClick={() =>
                          setServices((p) => (on ? p.filter((x) => x !== s) : [...p, s]))
                        }
                        className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${on ? "bg-caramel text-caramel-foreground" : "bg-oat text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
              <div>
                <Label htmlFor="bio">Short bio</Label>
                <Textarea
                  id="bio"
                  value={form.bio}
                  onChange={set("bio")}
                  maxLength={600}
                  rows={4}
                  placeholder="How you work with animals, the breeds you know best, and what a session with you looks like."
                  className="mt-1.5 rounded-xl"
                />
                <p className="mt-1 text-right text-xs text-muted-foreground">
                  {form.bio.length}/600
                </p>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h1 className="text-xl text-foreground">Verification documents</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Everything here stays private. It is used only by our verification team.
                </p>
              </div>
              <FilePick
                label="Government ID — Aadhaar or PAN"
                hint="JPG, PNG or PDF, up to 10 MB"
                accept="application/pdf,image/*"
                kind="document"
                value={idDoc}
                onChange={setIdDoc}
                icon={Upload}
              />
              <div className="space-y-4">
                <p className="text-sm font-bold text-foreground">Client references (at least 2)</p>
                {refs.map((r, i) => (
                  <div key={i} className="grid gap-3 rounded-2xl bg-oat p-4 sm:grid-cols-3">
                    {(
                      [
                        ["name", `Reference ${i + 1} name`, "text", ""],
                        ["phone", "Contact number", "tel", ""],
                        ["relation", "Relationship", "text", "Client since 2024"],
                      ] as const
                    ).map(([k, label, type, ph]) => (
                      <div key={k}>
                        <Label htmlFor={`ref-${k}-${i}`}>{label}</Label>
                        <Input
                          id={`ref-${k}-${i}`}
                          type={type}
                          value={r[k]}
                          placeholder={ph}
                          maxLength={80}
                          onChange={(e) =>
                            setRefs((all) =>
                              all.map((x, j) => (j === i ? { ...x, [k]: e.target.value } : x)),
                            )
                          }
                          className="mt-1.5 rounded-xl bg-card"
                        />
                      </div>
                    ))}
                  </div>
                ))}
                <p className="rounded-xl bg-accent p-3 text-sm font-semibold text-accent-foreground">
                  These references will be contacted directly by The Petwork team before your
                  profile is approved.
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h1 className="text-xl text-foreground">Video introduction</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Upload a 60 second video telling us about your experience and why you love working
                  with animals. Speak in whichever language you are most comfortable in.
                </p>
              </div>
              <FilePick
                label="Your video introduction"
                hint="MP4 or MOV, up to 100 MB, roughly 60 seconds"
                accept="video/*"
                kind="video"
                value={video}
                onChange={setVideo}
                icon={Video}
              />
              <p className="rounded-xl bg-accent p-3 text-sm font-semibold text-accent-foreground">
                This video will be reviewed by our team before your profile goes live.
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h1 className="text-xl text-foreground">The Petwork code of conduct</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Please read and accept each point. These are the promises every pro on our network
                  makes to the families who trust them.
                </p>
              </div>
              <ul className="space-y-3">
                {CODE.map((line, i) => (
                  <li key={line} className="flex items-start gap-3 rounded-2xl bg-oat p-4">
                    <Checkbox
                      id={`code-${i}`}
                      checked={agreed[i] ?? false}
                      onCheckedChange={(v) =>
                        setAgreed((prev) => prev.map((x, idx) => (idx === i ? v === true : x)))
                      }
                      className="mt-0.5"
                    />
                    <Label
                      htmlFor={`code-${i}`}
                      className="text-sm font-normal leading-relaxed text-foreground"
                    >
                      {line}
                    </Label>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="ghost"
              disabled={step === 0 || busy}
              onClick={() => setStep((s) => s - 1)}
              className="rounded-full text-muted-foreground"
            >
              <ArrowLeft className="size-4" /> Back
            </Button>
            {step < 3 ? (
              <Button
                type="button"
                onClick={next}
                className="rounded-full bg-caramel px-6 text-caramel-foreground hover:bg-caramel/90"
              >
                Continue <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button
                type="button"
                disabled={!agreed.every(Boolean) || busy}
                onClick={() =>
                  void run(async () => {
                    setSubmitted(true);
                    await submitApplication({
                      name: form.name.trim(),
                      email: form.email.trim(),
                      phone: form.phone.trim(),
                      area: form.area.trim(),
                      years: Number(form.years) || 0,
                      services,
                      bio: form.bio.trim(),
                      idDocName: idDoc!.name,
                      videoName: video!.name,
                      references: refs.map((r) => ({
                        name: r.name.trim(),
                        phone: r.phone.trim(),
                        relation: r.relation.trim(),
                      })),
                    });
                    toast.success("Application submitted");
                    void navigate({ to: "/pro/application" });
                  })
                }
                className="rounded-full bg-caramel px-6 text-caramel-foreground hover:bg-caramel/90"
              >
                {busy ? "Submitting…" : "Submit application"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
