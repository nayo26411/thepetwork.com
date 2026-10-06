import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, BadgeCheck, BriefcaseBusiness, Heart, PawPrint, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AuthCard, CodeStep, PasswordInput } from "@/components/app/AuthCard";
import { useBusy } from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp, verifyCode } from "@/mock/actions";
import { PRO_TYPES, type Role, type User } from "@/mock/types";

type SignupRole = Exclude<Role, "founder">;

export const Route = createFileRoute("/signup")({
  validateSearch: (search: Record<string, unknown>): { role?: SignupRole } =>
    search["role"] === "pro" || search["role"] === "owner" ? { role: search["role"] } : {},
  head: () => ({
    meta: [
      { title: "Join The Petwork — Create a Free Account" },
      {
        name: "description",
        content:
          "Create a free Petwork account as a pet owner, or apply as a dog walker, groomer, sitter, trainer or vet in Delhi NCR.",
      },
    ],
  }),
  component: SignupPage,
});

const ROLES: {
  key: SignupRole;
  title: string;
  text: string;
  icon: typeof Heart;
  points: string[];
}[] = [
  {
    key: "owner",
    title: "I'm a pet owner",
    text: "Keep your pet's records, book verified pros and join local communities.",
    icon: Heart,
    points: [
      "Digital Collar health records",
      "Reminders for vaccines and meds",
      "Book and message professionals",
    ],
  },
  {
    key: "pro",
    title: "I'm a pet professional",
    text: `${PRO_TYPES.join(", ")} — get verified and receive bookings.`,
    icon: BriefcaseBusiness,
    points: [
      "ID, reference and video verification",
      "Verified badge on your profile",
      "Booking requests and messaging",
    ],
  },
];

function SignupPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [role, setRole] = useState<SignupRole | null>(search.role ?? null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", area: "", password: "" });
  const [pending, setPending] = useState<User | null>(null);
  const [busy, run] = useBusy();
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  if (pending) {
    return (
      <AuthCard
        icon={<Sparkles className="size-6" />}
        title="Verify your email"
        sub="This keeps fake accounts off The Petwork."
      >
        <CodeStep
          email={pending.email}
          onBack={() => setPending(null)}
          onVerify={async (code) => {
            await verifyCode(pending.id, code);
            if (pending.role === "pro") {
              toast.success("Account created. Next: your verification application.");
              void navigate({ to: "/pro-signup" });
            } else {
              toast.success(`Welcome to The Petwork, ${pending.name.split(" ")[0]}!`);
              void navigate({ to: "/digital-collar" });
            }
          }}
        />
      </AuthCard>
    );
  }

  if (!role) {
    return (
      <div className="paw-grid flex min-h-[70vh] items-center justify-center px-4 py-14">
        <div className="w-full max-w-3xl">
          <div className="text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-accent text-caramel">
              <PawPrint className="size-6" />
            </span>
            <h1 className="mt-5 text-3xl text-foreground sm:text-4xl">Join The Petwork</h1>
            <p className="mx-auto mt-2 max-w-md text-muted-foreground">
              Free for pet owners. Professionals are verified before they appear on the Pro Portal.
            </p>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {ROLES.map((r) => (
              <button
                key={r.key}
                onClick={() => setRole(r.key)}
                className="card-cozy hover-lift flex flex-col p-7 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel"
              >
                <span className="grid size-12 place-items-center rounded-2xl bg-honey/30 text-caramel">
                  <r.icon className="size-6" />
                </span>
                <span className="mt-4 font-display text-xl font-bold text-foreground">
                  {r.title}
                </span>
                <span className="mt-1.5 text-sm text-muted-foreground">{r.text}</span>
                <ul className="mt-4 space-y-1.5">
                  {r.points.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm text-foreground">
                      <BadgeCheck className="size-4 shrink-0 text-verified" /> {p}
                    </li>
                  ))}
                </ul>
                <span className="mt-5 text-sm font-bold text-caramel">Continue →</span>
              </button>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-caramel hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  const isPro = role === "pro";
  const tooShort = form.password.length > 0 && form.password.length < 8;

  return (
    <AuthCard
      icon={isPro ? <BriefcaseBusiness className="size-6" /> : <Heart className="size-6" />}
      title={isPro ? "Create your professional account" : "Create your owner account"}
      sub={
        isPro
          ? "After this you'll complete a short verification application: ID, two references and a video intro."
          : "Free forever for pet owners."
      }
    >
      <button
        onClick={() => setRole(null)}
        className="mt-4 flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Change account type
      </button>
      <form
        className="mt-5 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (form.password.length < 8) return;
          void run(async () => setPending(await signUp({ ...form, role, marketing: false })));
        }}
      >
        <div>
          <Label htmlFor="su-name">Full name</Label>
          <Input
            id="su-name"
            value={form.name}
            onChange={(e) => set("name")(e.target.value)}
            maxLength={80}
            autoComplete="name"
            className="mt-1.5 rounded-xl"
            required
          />
        </div>
        <div>
          <Label htmlFor="su-email">Email</Label>
          <Input
            id="su-email"
            type="email"
            value={form.email}
            onChange={(e) => set("email")(e.target.value)}
            maxLength={120}
            autoComplete="email"
            className="mt-1.5 rounded-xl"
            required
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="su-phone">
              Phone{" "}
              {!isPro && <span className="font-normal text-muted-foreground">(optional)</span>}
            </Label>
            <Input
              id="su-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => set("phone")(e.target.value)}
              maxLength={15}
              autoComplete="tel"
              placeholder="+91 98xxx xxxxx"
              className="mt-1.5 rounded-xl"
              required={isPro}
            />
          </div>
          <div>
            <Label htmlFor="su-area">Area in Delhi NCR</Label>
            <Input
              id="su-area"
              value={form.area}
              onChange={(e) => set("area")(e.target.value)}
              maxLength={80}
              placeholder="Saket, South Delhi"
              className="mt-1.5 rounded-xl"
              required
            />
          </div>
        </div>
        <div>
          <Label htmlFor="su-password">Password</Label>
          <PasswordInput
            id="su-password"
            value={form.password}
            onChange={set("password")}
            autoComplete="new-password"
            placeholder="At least 8 characters"
          />
          {tooShort && (
            <p className="mt-1.5 text-xs font-semibold text-destructive">
              Use at least 8 characters.
            </p>
          )}
        </div>
        <Button
          type="submit"
          disabled={busy || tooShort}
          className="w-full rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
        >
          {busy ? "Creating account…" : "Create account"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="font-bold text-caramel hover:underline">
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
