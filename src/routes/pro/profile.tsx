import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, X } from "lucide-react";
import { toast } from "sonner";
import { RequireRole } from "@/components/app/RequireRole";
import { EmptyState, PageHeader, useBusy } from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateProProfile } from "@/mock/actions";
import { useDemo } from "@/mock/store";
import { PRO_TYPES, type ProProfile, type ProType, type User } from "@/mock/types";

export const Route = createFileRoute("/pro/profile")({
  head: () => ({ meta: [{ title: "Public profile | The Petwork Pro Network" }] }),
  component: () => (
    <RequireRole roles={["pro"]}>{(user) => <ProfileEditor user={user} />}</RequireRole>
  ),
});

function ProfileEditor({ user }: { user: User }) {
  const data = useDemo();
  const pro = data.pros.find((p) => p.userId === user.id);
  if (!pro) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-14">
        <EmptyState
          title="Finish your application first"
          text="Your public profile is created when you submit your verification application."
          action={
            <Button
              asChild
              className="rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
            >
              <Link to="/pro-signup">Start application</Link>
            </Button>
          }
        />
      </div>
    );
  }
  return <Editor user={user} pro={pro} />;
}

function Editor({ user, pro }: { user: User; pro: ProProfile }) {
  const [form, setForm] = useState({
    headline: pro.headline,
    bio: pro.bio,
    area: pro.area,
    years: String(pro.years),
    priceFrom: String(pro.priceFrom),
    priceUnit: pro.priceUnit,
    languages: pro.languages.join(", "),
  });
  const [types, setTypes] = useState<ProType[]>(pro.types);
  const [services, setServices] = useState<string[]>(pro.services);
  const [newService, setNewService] = useState("");
  const [busy, run] = useBusy();
  const set =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const addService = () => {
    const s = newService.trim();
    if (s && !services.includes(s)) setServices((x) => [...x, s]);
    setNewService("");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <PageHeader
        label="Pro Network"
        title="Public profile"
        sub="This is what pet owners see on the Pro Portal."
        actions={
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/pro-portal/$proId" params={{ proId: user.id }}>
              <Eye className="size-4" /> Preview
            </Link>
          </Button>
        }
      />
      <form
        className="card-cozy mt-6 space-y-5 p-6 sm:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          if (types.length === 0) {
            toast.error("Choose at least one service type.");
            return;
          }
          void run(async () => {
            await updateProProfile({
              headline: form.headline.trim(),
              bio: form.bio.trim(),
              area: form.area.trim(),
              years: Number(form.years) || 0,
              priceFrom: Number(form.priceFrom) || 0,
              priceUnit: form.priceUnit.trim(),
              languages: form.languages
                .split(",")
                .map((l) => l.trim())
                .filter(Boolean),
              types,
              services,
            });
            toast.success("Profile saved — owners will see the changes straight away");
          });
        }}
      >
        <fieldset>
          <legend className="text-sm font-medium">I offer</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {PRO_TYPES.map((t) => {
              const on = types.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setTypes((x) => (on ? x.filter((y) => y !== t) : [...x, t]))}
                  className={`rounded-full px-4 py-2 text-sm font-bold ${on ? "bg-caramel text-caramel-foreground" : "bg-oat text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </fieldset>
        <div>
          <Label htmlFor="pp-headline">Headline</Label>
          <Input
            id="pp-headline"
            value={form.headline}
            onChange={set("headline")}
            maxLength={90}
            className="mt-1.5 rounded-xl"
            required
          />
        </div>
        <div>
          <Label htmlFor="pp-bio">About you</Label>
          <Textarea
            id="pp-bio"
            value={form.bio}
            onChange={set("bio")}
            rows={5}
            maxLength={800}
            className="mt-1.5 rounded-xl"
            required
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="pp-area">Areas you cover</Label>
            <Input
              id="pp-area"
              value={form.area}
              onChange={set("area")}
              maxLength={80}
              className="mt-1.5 rounded-xl"
              required
            />
          </div>
          <div>
            <Label htmlFor="pp-years">Years of experience</Label>
            <Input
              id="pp-years"
              type="number"
              min={0}
              max={60}
              value={form.years}
              onChange={set("years")}
              className="mt-1.5 rounded-xl"
            />
          </div>
          <div>
            <Label htmlFor="pp-price">Starting price (₹)</Label>
            <Input
              id="pp-price"
              type="number"
              min={0}
              value={form.priceFrom}
              onChange={set("priceFrom")}
              className="mt-1.5 rounded-xl"
            />
          </div>
          <div>
            <Label htmlFor="pp-unit">Price is…</Label>
            <Input
              id="pp-unit"
              value={form.priceUnit}
              onChange={set("priceUnit")}
              maxLength={40}
              placeholder="per 45 min walk"
              className="mt-1.5 rounded-xl"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="pp-lang">Languages (comma separated)</Label>
            <Input
              id="pp-lang"
              value={form.languages}
              onChange={set("languages")}
              maxLength={120}
              className="mt-1.5 rounded-xl"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="pp-service">Specific services</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {services.map((s) => (
              <span
                key={s}
                className="flex items-center gap-1 rounded-full bg-accent py-1 pl-3 pr-1 text-sm font-semibold text-accent-foreground"
              >
                {s}
                <button
                  type="button"
                  onClick={() => setServices((x) => x.filter((y) => y !== s))}
                  aria-label={`Remove ${s}`}
                  className="rounded-full p-1.5 hover:bg-mocha/30"
                >
                  <X className="size-3.5" />
                </button>
              </span>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <Input
              id="pp-service"
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addService();
                }
              }}
              maxLength={40}
              placeholder="Puppy walks, tick treatment…"
              className="rounded-xl"
            />
            <Button type="button" variant="outline" className="rounded-full" onClick={addService}>
              Add
            </Button>
          </div>
        </div>
        <Button
          type="submit"
          disabled={busy}
          className="rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
        >
          {busy ? "Saving…" : "Save profile"}
        </Button>
      </form>
    </div>
  );
}
