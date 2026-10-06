import { useState, type ReactNode } from "react";
import { Eye, EyeOff, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useBusy } from "./ui";

export function AuthCard({
  icon,
  title,
  sub,
  children,
}: {
  icon: ReactNode;
  title: string;
  sub?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="paw-grid flex min-h-[70vh] items-center justify-center px-4 py-14">
      <div className="card-cozy w-full max-w-md p-7 sm:p-8">
        <span className="grid size-12 place-items-center rounded-2xl bg-accent text-caramel">
          {icon}
        </span>
        <h1 className="mt-5 text-2xl text-foreground">{title}</h1>
        {sub && <p className="mt-2 text-sm text-muted-foreground">{sub}</p>}
        {children}
      </div>
    </div>
  );
}

export function PasswordInput({
  id,
  value,
  onChange,
  autoComplete,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete: string;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative mt-1.5">
      <Input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        maxLength={128}
        placeholder={placeholder}
        className="rounded-xl pr-11"
        required
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

/** Email verification step. Any 6 digits are accepted in the demo. */
export function CodeStep({
  email,
  onVerify,
  onBack,
}: {
  email: string;
  onVerify: (code: string) => Promise<unknown>;
  onBack: () => void;
}) {
  const [code, setCode] = useState("");
  const [busy, run] = useBusy();
  const [resent, setResent] = useState(false);

  return (
    <form
      className="mt-6 space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        void run(() => onVerify(code));
      }}
    >
      <div className="flex items-start gap-3 rounded-2xl bg-oat p-4 text-sm">
        <MailCheck className="mt-0.5 size-5 shrink-0 text-caramel" />
        <p>
          We sent a 6-digit code to <span className="font-bold">{email}</span>.
          <span className="mt-1 block text-xs text-muted-foreground">
            Demo: any 6 digits work, e.g. 123456.
          </span>
        </p>
      </div>
      <div className="flex justify-center">
        <InputOTP
          maxLength={6}
          value={code}
          onChange={setCode}
          aria-label="Verification code"
          autoFocus
        >
          <InputOTPGroup>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <InputOTPSlot key={i} index={i} className="size-11 bg-card text-base" />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>
      <Button
        type="submit"
        disabled={busy || code.length !== 6}
        className="w-full rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
      >
        {busy ? "Verifying…" : "Verify and continue"}
      </Button>
      <div className="flex justify-between text-sm">
        <button
          type="button"
          onClick={onBack}
          className="font-bold text-muted-foreground hover:text-foreground"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={() => setResent(true)}
          disabled={resent}
          className="font-bold text-caramel hover:underline disabled:text-muted-foreground disabled:no-underline"
        >
          {resent ? "Code sent again" : "Resend code"}
        </button>
      </div>
    </form>
  );
}
