import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { loginFounder } from "@/lib/founder.functions";
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
  const login = useServerFn(loginFounder);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

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
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            try {
              const res = await login({ data: { email, password } });
              if (!res.ok) {
                toast.error("Those credentials are not recognised");
                return;
              }
              navigate({ to: "/founder" });
            } catch {
              toast.error("Sign-in failed. Please try again.");
            } finally {
              setBusy(false);
            }
          }}
        >
          <div>
            <Label htmlFor="femail">Email</Label>
            <Input
              id="femail"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={120}
              className="mt-1.5 rounded-xl"
              required
            />
          </div>
          <div>
            <Label htmlFor="fpassword">Password</Label>
            <Input
              id="fpassword"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={128}
              className="mt-1.5 rounded-xl"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-mocha text-mocha-foreground hover:bg-mocha/90"
          >
            {busy ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Not the founding team?{" "}
          <Link to="/login" className="font-bold text-caramel hover:underline">
            Sign in as a pet owner
          </Link>
        </p>
      </div>
    </div>
  );
}
