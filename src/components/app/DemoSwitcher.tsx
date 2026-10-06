import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, FlaskConical, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { resetDemo, setAutoReplies, signInAs } from "@/mock/actions";
import { useDemo, useSession } from "@/mock/store";
import { landingFor } from "./RequireRole";
import { PersonAvatar } from "./ui";

const PERSONAS = [
  { id: null, name: "Guest", note: "Signed out — what the public sees" },
  { id: "u-aanya", name: "Aanya Sharma", note: "Pet owner · Bruno & Mishti" },
  { id: "u-kabir", name: "Kabir Mehta", note: "Pet owner · Simba" },
  { id: "u-rohan", name: "Rohan Verma", note: "Verified dog walker" },
  { id: "u-aditya", name: "Aditya Rao", note: "Dog walker · verification in review" },
  { id: "u-founder", name: "Petwork Founder", note: "Founder console" },
] as const;

/**
 * Presenter tool: jump between demo accounts without typing passwords,
 * turn simulated replies on or off, and restore the starting data.
 */
export function DemoSwitcher({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const data = useDemo();
  const { user } = useSession();
  const navigate = useNavigate();

  const choose = (id: string | null) => {
    signInAs(id);
    setOpen(false);
    const next = id ? data.users.find((u) => u.id === id) : null;
    toast.success(next ? `Now viewing as ${next.name}` : "Signed out — viewing as a guest");
    void navigate({ to: next ? landingFor(next, data) : "/" });
  };

  return (
    <Popover
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        setConfirmReset(false);
      }}
    >
      <PopoverTrigger asChild>
        <button
          className={`flex items-center gap-1.5 rounded-full border border-dashed border-mocha-foreground/40 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-mocha-foreground/90 hover:bg-sidebar-accent ${compact ? "" : ""}`}
          aria-label="Demo controls"
        >
          <FlaskConical className="size-3.5" /> Demo
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[min(22rem,calc(100vw-2rem))] rounded-3xl p-2">
        <p className="px-3 pb-1 pt-2 font-display text-base font-bold">View the site as…</p>
        <p className="px-3 pb-2 text-xs text-muted-foreground">
          Switch accounts instantly. Each browser tab can be signed in as a different person.
        </p>
        <div className="space-y-0.5">
          {PERSONAS.map((p) => {
            const active = (user?.id ?? null) === p.id;
            return (
              <button
                key={p.name}
                onClick={() => choose(p.id)}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left transition-colors hover:bg-oat ${active ? "bg-oat" : ""}`}
              >
                <PersonAvatar name={p.name} className="size-8 text-xs" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold">{p.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">{p.note}</span>
                </span>
                {active && <Check className="size-4 text-caramel" />}
              </button>
            );
          })}
        </div>

        <div className="mt-2 space-y-2 border-t border-border px-3 pb-1 pt-3">
          <label className="flex items-center justify-between gap-3 text-sm font-semibold">
            <span>
              Simulated replies
              <span className="block text-xs font-normal text-muted-foreground">
                Professionals answer owner messages after a few seconds
              </span>
            </span>
            <Switch checked={data.settings.autoReplies} onCheckedChange={setAutoReplies} />
          </label>
          <button
            onClick={() => {
              if (!confirmReset) {
                setConfirmReset(true);
                return;
              }
              resetDemo();
              signInAs(null);
              setOpen(false);
              setConfirmReset(false);
              toast.success("Demo data restored to the starting point");
              void navigate({ to: "/" });
            }}
            className={`flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
              confirmReset
                ? "bg-destructive text-destructive-foreground"
                : "bg-oat text-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            <RotateCcw className="size-4" />{" "}
            {confirmReset ? "Click again to reset everything" : "Reset demo data"}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
