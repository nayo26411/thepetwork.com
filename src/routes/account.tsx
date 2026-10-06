import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Bell, Download, KeyRound, Trash2, UserRound } from "lucide-react";
import { toast } from "sonner";
import { PasswordInput } from "@/components/app/AuthCard";
import { RequireRole } from "@/components/app/RequireRole";
import { PageHeader, useBusy } from "@/components/app/ui";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  changePassword,
  deleteAccount,
  exportMyData,
  updateAccount,
  updatePrefs,
} from "@/mock/actions";
import { downloadFile } from "@/mock/upload";
import type { User } from "@/mock/types";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "Account settings | The Petwork" }] }),
  component: () => (
    <RequireRole roles={["owner", "pro", "founder"]}>
      {(user) => <Account user={user} />}
    </RequireRole>
  ),
});

const PREF_ROWS: { key: keyof User["prefs"]; label: string; hint: string }[] = [
  { key: "inApp", label: "In-app notifications", hint: "The bell in the top bar" },
  { key: "email", label: "Email notifications", hint: "A copy of important updates by email" },
  {
    key: "reminders",
    label: "Pet care reminders",
    hint: "Vaccinations, medication, grooming and appointments",
  },
  { key: "bookings", label: "Booking updates", hint: "Requests, confirmations and cancellations" },
  { key: "messages", label: "New messages", hint: "When someone messages you" },
  { key: "community", label: "Community activity", hint: "Replies, comments and post approvals" },
  { key: "marketing", label: "News and offers", hint: "Occasional updates from The Petwork" },
];

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Bell;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="card-cozy p-6 sm:p-7">
      <h2 className="flex items-center gap-2 text-lg text-foreground">
        <Icon className="size-5 text-caramel" /> {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Account({ user }: { user: User }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    area: user.area,
  });
  const [pw, setPw] = useState({ current: "", next: "" });
  const [savingProfile, runProfile] = useBusy();
  const [savingPw, runPw] = useBusy();
  const [deleting, runDelete] = useBusy();

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-12">
      <PageHeader
        label="Your account"
        title="Account settings"
        sub="Update your details, choose which notifications you get, and manage your data."
      />

      <Section icon={UserRound} title="Profile">
        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            void runProfile(async () => {
              await updateAccount(profile);
              toast.success("Profile saved");
            });
          }}
        >
          {(
            [
              ["name", "Full name", "text", "name"],
              ["email", "Email", "email", "email"],
              ["phone", "Phone", "tel", "tel"],
              ["area", "Area in Delhi NCR", "text", "address-level2"],
            ] as const
          ).map(([key, label, type, auto]) => (
            <div key={key}>
              <Label htmlFor={`acc-${key}`}>{label}</Label>
              <Input
                id={`acc-${key}`}
                type={type}
                autoComplete={auto}
                value={profile[key]}
                onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))}
                maxLength={120}
                className="mt-1.5 rounded-xl"
                required={key === "name" || key === "email"}
              />
            </div>
          ))}
          <div className="sm:col-span-2">
            <Button
              type="submit"
              disabled={savingProfile}
              className="rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
            >
              {savingProfile ? "Saving…" : "Save profile"}
            </Button>
          </div>
        </form>
      </Section>

      <Section icon={Bell} title="Notifications">
        <ul className="divide-y divide-border">
          {PREF_ROWS.map((row) => (
            <li key={row.key} className="flex items-center justify-between gap-4 py-3">
              <label htmlFor={`pref-${row.key}`} className="min-w-0">
                <span className="block text-sm font-bold">{row.label}</span>
                <span className="block text-xs text-muted-foreground">{row.hint}</span>
              </label>
              <Switch
                id={`pref-${row.key}`}
                checked={user.prefs[row.key]}
                onCheckedChange={(v) => {
                  void updatePrefs({ [row.key]: v });
                  toast.success(`${row.label} ${v ? "on" : "off"}`);
                }}
              />
            </li>
          ))}
        </ul>
      </Section>

      <Section icon={KeyRound} title="Password">
        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (pw.next.length < 8) {
              toast.error("Use at least 8 characters for the new password.");
              return;
            }
            void runPw(async () => {
              await changePassword(pw.current, pw.next);
              setPw({ current: "", next: "" });
              toast.success("Password changed");
            });
          }}
        >
          <div>
            <Label htmlFor="pw-current">Current password</Label>
            <PasswordInput
              id="pw-current"
              value={pw.current}
              onChange={(v) => setPw((p) => ({ ...p, current: v }))}
              autoComplete="current-password"
            />
          </div>
          <div>
            <Label htmlFor="pw-next">New password</Label>
            <PasswordInput
              id="pw-next"
              value={pw.next}
              onChange={(v) => setPw((p) => ({ ...p, next: v }))}
              autoComplete="new-password"
              placeholder="At least 8 characters"
            />
          </div>
          <div className="sm:col-span-2">
            <Button
              type="submit"
              variant="outline"
              disabled={savingPw}
              className="rounded-full border-2 border-caramel text-caramel hover:bg-accent hover:text-accent-foreground"
            >
              {savingPw ? "Updating…" : "Change password"}
            </Button>
          </div>
        </form>
      </Section>

      <Section icon={Download} title="Your data">
        <p className="text-sm text-muted-foreground">
          Download a copy of everything you've stored on The Petwork, or delete your account and all
          of it.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => {
              downloadFile(
                `petwork-data-${user.name.split(" ")[0]!.toLowerCase()}.json`,
                JSON.stringify(exportMyData(), null, 2),
                "application/json",
              );
              toast.success("Your data download has started");
            }}
          >
            <Download className="size-4" /> Download my data
          </Button>
          {user.role !== "founder" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-full border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-4" /> Delete account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-3xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This removes your profile, pets, health records, reminders and notifications.
                    Bookings already made stay on the professional's history. This can't be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-full">Keep my account</AlertDialogCancel>
                  <AlertDialogAction
                    disabled={deleting}
                    className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() =>
                      void runDelete(async () => {
                        await deleteAccount();
                        toast.success("Your account has been deleted");
                        void navigate({ to: "/" });
                      })
                    }
                  >
                    Delete everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </Section>
    </div>
  );
}
