import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, PawPrint, Upload, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/pro-signup")({
  head: () => ({
    meta: [
      { title: "Join The Petwork Pro Network — Professional Signup" },
      {
        name: "description",
        content:
          "Apply to join The Petwork Pro Network as a dog walker, groomer, vet or trainer in Delhi NCR. Verified profiles, escrow payouts, steady bookings.",
      },
      { property: "og:title", content: "Join The Petwork Pro Network — Professional Signup" },
      { property: "og:description", content: "Apply to become a verified pet professional in Delhi NCR." },
    ],
  }),
  component: ProSignup,
});

const SERVICES = ["Dog Walker", "Groomer", "Vet", "Trainer"];

const CODE = [
  "I will treat every animal in my care with patience, gentleness and respect — never with force or fear.",
  "I will be punctual, and I will inform the owner immediately if I am delayed or need to reschedule.",
  "I will communicate transparently about incidents, injuries or behaviour changes, the same day they happen.",
  "I agree to GPS tracking during every booked session, and to sharing start and end photos with the owner.",
];

const STEP_LABELS = ["Basic Info", "Verification", "Video Intro", "Agreement"];

function ProSignup() {
  const [step, setStep] = useState(0);
  const [services, setServices] = useState<string[]>([]);
  const [agreed, setAgreed] = useState<boolean[]>([false, false, false, false]);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="paw-grid flex min-h-screen items-center justify-center px-4 py-16">
        <div className="card-cozy max-w-lg p-10 text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-verified/15 text-verified">
            <Check className="size-8" />
          </span>
          <h1 className="mt-6 text-2xl text-foreground">Thank you for applying to The Petwork Pro Network.</h1>
          <p className="mt-3 text-muted-foreground">
            Our team will review your application within 3 to 5 business days. You will be notified
            via email and WhatsApp.
          </p>
          <ol className="mt-6 space-y-2 text-left text-sm text-muted-foreground">
            {[
              "Day 1 — We check your government ID against the name and phone number you gave us.",
              "Day 2 to 3 — We call both of your client references personally.",
              "Day 3 to 4 — A team member watches your video introduction and may call you back.",
              "Day 5 — You are either verified and listed, or told exactly what is missing.",
            ].map((line) => (
              <li key={line} className="flex items-start gap-2 rounded-xl bg-oat p-3">
                <Check className="mt-0.5 size-4 shrink-0 text-verified" />
                <span>{line}</span>
              </li>
            ))}
          </ol>
          <Button asChild className="mt-7 rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90">
            <Link to="/pro-portal">Back to The Pro Portal</Link>
          </Button>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-oat pb-20">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-5">
          <span className="grid size-9 place-items-center rounded-full bg-caramel text-caramel-foreground">
            <PawPrint className="size-5" />
          </span>
          <div>
            <h1 className="font-display text-lg font-bold text-foreground">The Petwork Pro Network</h1>
            <p className="text-xs text-muted-foreground">Professional application · Delhi NCR</p>
          </div>
          <Link to="/pro-portal" className="ml-auto text-sm font-bold text-caramel hover:underline">
            Exit
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 pt-8">
        <ol className="flex flex-wrap gap-2">
          {STEP_LABELS.map((label, i) => (
            <li
              key={label}
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
                <h2 className="text-xl text-foreground">Tell us who you are</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  This is what pet parents will see first, so write it the way you would speak.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="fullname">Full name</Label>
                  <Input id="fullname" maxLength={80} placeholder="Your full name" className="mt-1.5 rounded-xl" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone number</Label>
                  <Input id="phone" type="tel" maxLength={15} placeholder="+91 98xxx xxxxx" className="mt-1.5 rounded-xl" />
                </div>
                <div>
                  <Label htmlFor="pemail">Email</Label>
                  <Input id="pemail" type="email" maxLength={120} placeholder="you@email.com" className="mt-1.5 rounded-xl" />
                </div>
                <div>
                  <Label htmlFor="area">City &amp; area in Delhi NCR</Label>
                  <Input id="area" maxLength={80} placeholder="Vasant Kunj, South Delhi" className="mt-1.5 rounded-xl" />
                </div>
                <div>
                  <Label htmlFor="years">Years of experience</Label>
                  <Input id="years" type="number" min={0} max={60} placeholder="5" className="mt-1.5 rounded-xl" />
                </div>
              </div>
              <div>
                <Label>Services offered</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {SERVICES.map((s) => {
                    const on = services.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setServices((p) => (on ? p.filter((x) => x !== s) : [...p, s]))}
                        className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
                          on ? "bg-caramel text-caramel-foreground" : "bg-oat text-muted-foreground hover:bg-accent"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <Label htmlFor="bio">Short bio</Label>
                <Textarea id="bio" maxLength={600} rows={4} placeholder="How you work with animals, the breeds you know best, and what a session with you looks like." className="mt-1.5 rounded-xl" />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl text-foreground">Verification documents</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Everything here stays private. It is used only by our verification team.
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-caramel/50 p-8 text-center">
                <Upload className="size-7 text-caramel" />
                <p className="text-sm font-bold text-foreground">Government ID — Aadhaar or PAN</p>
                <p className="text-xs text-muted-foreground">JPG, PNG or PDF, up to 10 MB</p>
                <Input type="file" className="mt-3 max-w-xs rounded-xl" />
              </div>

              <div className="space-y-4">
                <p className="text-sm font-bold text-foreground">Client references (at least 2)</p>
                {[1, 2].map((n) => (
                  <div key={n} className="grid gap-3 rounded-2xl bg-oat p-4 sm:grid-cols-3">
                    <div>
                      <Label htmlFor={`ref-name-${n}`}>Reference {n} name</Label>
                      <Input id={`ref-name-${n}`} maxLength={80} className="mt-1.5 rounded-xl bg-card" />
                    </div>
                    <div>
                      <Label htmlFor={`ref-phone-${n}`}>Contact number</Label>
                      <Input id={`ref-phone-${n}`} type="tel" maxLength={15} className="mt-1.5 rounded-xl bg-card" />
                    </div>
                    <div>
                      <Label htmlFor={`ref-rel-${n}`}>Relationship</Label>
                      <Input id={`ref-rel-${n}`} maxLength={60} placeholder="Client since 2024" className="mt-1.5 rounded-xl bg-card" />
                    </div>
                  </div>
                ))}
                <p className="rounded-xl bg-accent p-3 text-sm font-semibold text-accent-foreground">
                  These references will be contacted directly by The Petwork team before your profile
                  is approved.
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl text-foreground">Video introduction</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Record or upload a 60 second video telling us about your experience and why you
                  love working with animals. Speak in whichever language you are most comfortable in.
                </p>
              </div>
              <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-caramel/50 p-10 text-center">
                <Video className="size-8 text-caramel" />
                <p className="text-sm font-bold text-foreground">Record now or upload a file</p>
                <p className="text-xs text-muted-foreground">MP4 or MOV, up to 100 MB, roughly 60 seconds</p>
                <div className="mt-3 flex flex-wrap justify-center gap-3">
                  <Button type="button" className="rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90">
                    Record video
                  </Button>
                  <Input type="file" accept="video/*" className="max-w-xs rounded-xl" />
                </div>
              </div>
              <p className="rounded-xl bg-accent p-3 text-sm font-semibold text-accent-foreground">
                This video will be reviewed by our team before your profile goes live.
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl text-foreground">The Petwork code of conduct</h2>
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
                    <Label htmlFor={`code-${i}`} className="text-sm font-normal leading-relaxed text-foreground">
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
              disabled={step === 0}
              onClick={() => setStep((s) => s - 1)}
              className="rounded-full text-muted-foreground"
            >
              <ArrowLeft className="size-4" /> Back
            </Button>
            {step < 3 ? (
              <Button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="rounded-full bg-caramel px-6 text-caramel-foreground hover:bg-caramel/90"
              >
                Continue <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button
                type="button"
                disabled={!agreed.every(Boolean)}
                onClick={() => setDone(true)}
                className="rounded-full bg-caramel px-6 text-caramel-foreground hover:bg-caramel/90"
              >
                Submit application
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
