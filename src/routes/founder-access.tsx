import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/founder-access")({
  head: () => ({
    meta: [
      { title: "Founder Access | The Petwork" },
      { name: "description", content: "Private sign-in for The Petwork founding team." },
      { property: "og:title", content: "Founder Access | The Petwork" },
      { property: "og:description", content: "Private sign-in for The Petwork founding team." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: FounderAccess,
});

function FounderAccess() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const FOUNDER_PASSWORD = "thepetwork2011";

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-mocha px-4 py-14">
      <div className="w-full max-w-md rounded-3xl bg-card p-8 shadow-lift">
        <span className="grid size-12 place-items-center rounded-2xl bg-mocha text-mocha-foreground">
          <ShieldCheck className="size-6" />
        </span>

        <h1 className="mt-5 text-2xl text-foreground">Founder Access</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Access restricted to The Petwork founding team only.
        </p>

        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setBusy(true);

            if (password === FOUNDER_PASSWORD) {
              sessionStorage.setItem("petwork_founder_access", "true");
              toast.success("Welcome back.");
              navigate({ to: "/founder" });
            } else {
              toast.error("Incorrect founder password.");
              setBusy(false);
            }
          }}
        >
          <div>
            <Label htmlFor="fpassword">Founder Password</Label>

            <Input
              id="fpassword"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={128}
              className="mt-1.5 rounded-xl"
              placeholder="Enter founder password"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-mocha text-mocha-foreground hover:bg-mocha/90"
          >
            {busy ? "Signing in…" : "Enter Founder Portal"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Not the founding team?{" "}
          <Link
            to="/login"
            className="font-bold text-caramel hover:underline"
          >
            Sign in as a pet owner
          </Link>
        </p>
      </div>
    </div>
  );
}
