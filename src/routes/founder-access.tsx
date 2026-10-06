import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { PasswordInput } from "@/components/app/AuthCard";
import { useBusy } from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signInAs } from "@/mock/actions";
import { DEMO_PASSWORD } from "@/mock/seed";

export const Route = createFileRoute("/founder-access")({
  head: () => ({
    meta: [
      { title: "Founder Access | The Petwork" },
      { name: "description", content: "Private sign-in for The Petwork founding team." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: FounderAccess,
});

function FounderAccess() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, run] = useBusy();

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-mocha px-4 py-14">
      <div className="w-full max-w-md rounded-3xl bg-card p-8 shadow-lift">
        <span className="grid size-12 place-items-center rounded-2xl bg-mocha text-mocha-foreground">
          <ShieldCheck className="size-6" />
        </span>
        <h1 className="mt-5 text-2xl text-foreground">Founder Access</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Access restricted to The Petwork founding team. Founder accounts are created by invitation
          only.
        </p>

        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            void run(async () => {
              const user = await signIn(email, password);
              if (user.role !== "founder")
                throw new Error("This account doesn't have founder access.");
              signInAs(user.id);
              toast.success("Founder access granted");
              void navigate({ to: "/founder", replace: true });
            });
          }}
        >
          <div>
            <Label htmlFor="f-email">Founder email</Label>
            <Input
              id="f-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              maxLength={120}
              className="mt-1.5 rounded-xl"
              required
            />
          </div>
          <div>
            <Label htmlFor="f-password">Password</Label>
            <PasswordInput
              id="f-password"
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
            />
          </div>
          <Button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-mocha text-mocha-foreground hover:bg-mocha/90"
          >
            {busy ? "Opening Founder Console…" : "Enter Founder Console"}
          </Button>
        </form>

        <div className="mt-5 rounded-2xl border border-dashed border-caramel/50 bg-oat/60 p-4">
          <p className="text-xs font-extrabold uppercase tracking-wide text-caramel">
            Demo founder account
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            founder@demo.thepetwork.com · {DEMO_PASSWORD}
          </p>
          <button
            type="button"
            onClick={() => {
              setEmail("founder@demo.thepetwork.com");
              setPassword(DEMO_PASSWORD);
            }}
            className="mt-2 rounded-full bg-card px-3 py-1.5 text-xs font-bold ring-1 ring-border hover:bg-accent hover:text-accent-foreground"
          >
            Fill in demo details
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Not the founding team?{" "}
          <Link to="/login" className="font-bold text-caramel hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
