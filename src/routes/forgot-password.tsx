import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BadgeCheck, KeyRound, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { AuthCard, PasswordInput } from "@/components/app/AuthCard";
import { useBusy } from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordReset, resetPassword } from "@/mock/actions";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset your password | The Petwork" }] }),
  component: ForgotPassword,
});

type Step = "request" | "sent" | "reset" | "done";

function ForgotPassword() {
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, run] = useBusy();

  if (step === "sent") {
    return (
      <AuthCard
        icon={<MailCheck className="size-6" />}
        title="Check your inbox"
        sub={`If an account exists for ${email}, we've sent a link to reset your password. It expires in 30 minutes.`}
      >
        <div className="mt-6 rounded-2xl border border-dashed border-caramel/50 bg-oat/60 p-4 text-sm">
          <p className="font-bold">Demo: open the email link</p>
          <p className="mt-1 text-xs text-muted-foreground">
            In the live product this button is the link inside the email.
          </p>
          <Button
            onClick={() =>
              userId
                ? setStep("reset")
                : toast.error("No demo account uses that email. Try aanya@demo.thepetwork.com.")
            }
            className="mt-3 rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
          >
            Open reset link
          </Button>
        </div>
        <button
          onClick={() => setStep("request")}
          className="mt-5 text-sm font-bold text-muted-foreground hover:text-foreground"
        >
          ← Use a different email
        </button>
      </AuthCard>
    );
  }

  if (step === "reset") {
    const mismatch = confirm.length > 0 && confirm !== password;
    return (
      <AuthCard icon={<KeyRound className="size-6" />} title="Choose a new password">
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (password.length < 8 || mismatch || !userId) return;
            void run(async () => {
              await resetPassword(userId, password);
              setStep("done");
            });
          }}
        >
          <div>
            <Label htmlFor="np">New password</Label>
            <PasswordInput
              id="np"
              value={password}
              onChange={setPassword}
              autoComplete="new-password"
              placeholder="At least 8 characters"
            />
          </div>
          <div>
            <Label htmlFor="np2">Confirm new password</Label>
            <PasswordInput
              id="np2"
              value={confirm}
              onChange={setConfirm}
              autoComplete="new-password"
            />
            {mismatch && (
              <p className="mt-1.5 text-xs font-semibold text-destructive">
                Passwords don't match.
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={busy || password.length < 8 || mismatch}
            className="w-full rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
          >
            {busy ? "Saving…" : "Save new password"}
          </Button>
        </form>
      </AuthCard>
    );
  }

  if (step === "done") {
    return (
      <AuthCard
        icon={<BadgeCheck className="size-6" />}
        title="Password updated"
        sub="You can now sign in with your new password."
      >
        <Button
          asChild
          className="mt-6 w-full rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
        >
          <Link to="/login">Back to sign in</Link>
        </Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      icon={<KeyRound className="size-6" />}
      title="Forgot your password?"
      sub="Enter the email you signed up with and we'll send you a reset link."
    >
      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          void run(async () => {
            const user = await requestPasswordReset(email);
            setUserId(user?.id ?? null);
            setStep("sent");
          });
        }}
      >
        <div>
          <Label htmlFor="fp-email">Email</Label>
          <Input
            id="fp-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={120}
            autoComplete="email"
            className="mt-1.5 rounded-xl"
            required
          />
        </div>
        <Button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
        >
          {busy ? "Sending…" : "Send reset link"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link to="/login" className="font-bold text-caramel hover:underline">
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
