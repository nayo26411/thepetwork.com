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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    setBusy(true);

    if (password === FOUNDER_PASSWORD) {
      // Store founder access so /founder does not immediately redirect back.
      sessionStorage.setItem("petwork_founder_access", "true");

      toast.success("Founder access granted");

      navigate({
        to: "/founder",
        replace: true,
      });

      return;
    }

    toast.error("Incorrect founder password");
    setBusy(false);
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
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength={128}
                className="rounded-xl pr-12"
                placeholder="Enter founder password"
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
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
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
