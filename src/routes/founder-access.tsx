import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
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

const FOUNDER_PASSWORD = "thepetwork2011";

function FounderAccess() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== FOUNDER_PASSWORD) {
      toast.error("Incorrect founder password");
      return;
    }

    setBusy(true);

    // Store access in both sessionStorage and localStorage.
    // This prevents the founder dashboard from immediately
    // redirecting back to the login page.
    try {
      sessionStorage.setItem("petwork_founder_access", "true");
      localStorage.setItem("petwork_founder_access", "true");
    } catch {
      // Continue with navigation even if browser storage is unavailable.
    }

    toast.success("Founder access granted");

    // Small delay allows the storage write + toast to complete
    // before navigating to the dashboard.
    setTimeout(() => {
      navigate({
        to: "/founder",
        replace: true,
      });
    }, 150);
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

        <p className="mt-2 text-sm text-muted-foreground">
          Access restricted to The Petwork founding team only.
        </p>

        <form
          className="mt-6 space-y-5"
          onSubmit={handleLogin}
        >
          <div>
            <Label htmlFor="fpassword">
              Founder password
            </Label>

            <div className="relative mt-1.5">
              <Input
                id="fpassword"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength={128}
                className="rounded-xl pr-12"
                placeholder="Enter founder password"
                disabled={busy}
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
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
            disabled={busy || !password}
            className="w-full rounded-full bg-mocha text-mocha-foreground hover:bg-mocha/90"
          >
            {busy
              ? "Opening Founder Portal..."
              : "Enter Founder Portal"}
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
