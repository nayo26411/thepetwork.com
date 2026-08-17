import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/founder-access")({
  head: () => ({
    meta: [
      { title: "Founder Access | The Petwork" },
      {
        name: "description",
        content: "Private sign-in for The Petwork founding team.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: FounderAccess,
});

function FounderAccess() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  const FOUNDER_PASSWORD = "thepetwork2011";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      toast.error("Please enter the founder password.");
      return;
    }

    setBusy(true);

    if (password === FOUNDER_PASSWORD) {
      // Store founder access for this browser session
      sessionStorage.setItem("petwork_founder_access", "true");

      toast.success("Founder access granted.");

      // Give the sessionStorage write a moment before navigating
      setTimeout(() => {
        window.location.href = "/founder";
      }, 200);
    } else {
      toast.error("Incorrect founder password.");
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-mocha px-4 py-14">
      <div className="w-full max-w-md rounded-3xl bg-card p-8 shadow-lift">
        <span className="grid size-12 place-items-center rounded-2xl bg-mocha text-mocha-foreground">
          <ShieldCheck className="size-6" />
        </span>

        <h1 className="mt-5 text-2xl text-foreground">
          Founder Access
        </h1>

        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Access restricted to The Petwork founding team only.
        </p>

        <form onSubmit={handleLogin} className="mt-6 space-y-5">
          <div>
            <Label htmlFor="fpassword">Founder Password</Label>

            <div className="relative mt-1.5">
              <Input
                id="fpassword"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength={128}
                placeholder="Enter founder password"
                className="rounded-xl pr-12"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-mocha text-mocha-foreground hover:bg-mocha/90"
          >
            {busy ? "Opening Founder Portal…" : "Enter Founder Portal"}
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
