import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, PawPrint } from "lucide-react";
import { toast } from "sonner";
import { AuthCard, CodeStep, PasswordInput } from "@/components/app/AuthCard";
import { landingFor } from "@/components/app/RequireRole";
import { useBusy } from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, verifyCode } from "@/mock/actions";
import { DEMO_PASSWORD } from "@/mock/seed";
import { getState } from "@/mock/store";
import type { User } from "@/mock/types";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } =>
    typeof search["redirect"] === "string" ? { redirect: search["redirect"] } : {},
  head: () => ({
    meta: [
      { title: "Sign In | The Petwork" },
      {
        name: "description",
        content: "Sign in to The Petwork as a pet owner or a verified pet professional.",
      },
      { property: "og:title", content: "Sign In | The Petwork" },
      { property: "og:description", content: "Sign in to your warm corner of The Petwork." },
    ],
  }),
  component: LoginPage,
});

const QUICK = [
  { label: "Pet owner", email: "aanya@demo.thepetwork.com" },
  { label: "Dog walker", email: "rohan@demo.thepetwork.com" },
  { label: "Founder", email: "founder@demo.thepetwork.com" },
];

function LoginPage() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState<User | null>(null);
  const [busy, run] = useBusy();

  if (pending) {
    return (
      <AuthCard
        icon={<Heart className="size-6" />}
        title="Check your email"
        sub="One more step to keep your account safe."
      >
        <CodeStep
          email={pending.email}
          onBack={() => setPending(null)}
          onVerify={async (code) => {
            const user = await verifyCode(pending.id, code);
            toast.success(`Welcome back, ${user.name.split(" ")[0]}`);
            void navigate({ href: redirect ?? landingFor(user, getState()) });
          }}
        />
      </AuthCard>
    );
  }

  return (
    <AuthCard
      icon={<Heart className="size-6" />}
      title="Welcome back"
      sub="Sign in as a pet owner or a Petwork professional to pick up where you left off."
    >
      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          void run(async () => setPending(await signIn(email, password)));
        }}
      >
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={120}
            autoComplete="email"
            placeholder="you@email.com"
            className="mt-1.5 rounded-xl"
            required
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              to="/forgot-password"
              className="inline-block py-1.5 text-xs font-bold text-caramel hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
          />
        </div>
        <Button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
        >
          <PawPrint className="size-4" /> {busy ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <div className="mt-5 rounded-2xl border border-dashed border-caramel/50 bg-oat/60 p-4">
        <p className="text-xs font-extrabold uppercase tracking-wide text-caramel">Demo accounts</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Password for every demo account: {DEMO_PASSWORD}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {QUICK.map((q) => (
            <button
              key={q.email}
              type="button"
              onClick={() => {
                setEmail(q.email);
                setPassword(DEMO_PASSWORD);
              }}
              className="rounded-full bg-card px-3 py-1.5 text-xs font-bold text-foreground ring-1 ring-border hover:bg-accent hover:text-accent-foreground"
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to The Petwork?{" "}
        <Link to="/signup" className="font-bold text-caramel hover:underline">
          Create a free account
        </Link>
      </p>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Running The Petwork?{" "}
        <Link to="/founder-access" className="font-bold text-caramel hover:underline">
          Founder Access
        </Link>
      </p>
    </AuthCard>
  );
}
