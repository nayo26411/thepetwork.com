import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  LayoutDashboard,
  LogOut,
  MapPinned,
  PawPrint,
  Plus,
  Users,
  UsersRound,
  ClipboardList,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { getFounderSession, logoutFounder } from "@/lib/founder.functions";
import { SURVEY } from "@/data/content";
import { CATEGORIES, PET_PLACES } from "@/data/locations";
import { EmptyMark } from "@/components/EmptyMark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/founder")({
  head: () => ({
    meta: [
      { title: "Founder Dashboard | The Petwork" },
      { name: "description", content: "Internal operations dashboard for The Petwork founding team." },
      { property: "og:title", content: "Founder Dashboard | The Petwork" },
      { property: "og:description", content: "Internal operations dashboard for The Petwork." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: FounderDashboard,
});

const SECTIONS = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "applications", label: "Professional Applications", icon: ClipboardList },
  { key: "map", label: "Map Management", icon: MapPinned },
  { key: "community", label: "Community Management", icon: UsersRound },
  { key: "analytics", label: "Survey & Analytics", icon: BarChart3 },
  { key: "users", label: "User Management", icon: Users },
] as const;

const PIE_COLORS = ["#A9743F", "#C1613D", "#8A6244", "#D9A566"];

function FounderDashboard() {
  const navigate = useNavigate();
  const fetchSession = useServerFn(getFounderSession);
  const signOut = useServerFn(logoutFounder);
  const [section, setSection] = useState<(typeof SECTIONS)[number]["key"]>("overview");

  const { data: founder, isPending } = useQuery({
    queryKey: ["founder-session"],
    queryFn: () => fetchSession(),
    staleTime: 0,
  });

  useEffect(() => {
    if (!isPending && !founder) navigate({ to: "/founder-access", replace: true });
  }, [isPending, founder, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  if (isPending || !founder) {
    return (
      <div className="grid min-h-screen place-items-center bg-mocha text-mocha-foreground">
        <p className="text-sm">Checking founder access…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      <aside className="bg-sidebar text-sidebar-foreground lg:min-h-screen lg:w-72 lg:shrink-0">
        <div className="flex items-center gap-2 px-5 py-5">
          <span className="grid size-9 place-items-center rounded-full bg-caramel text-caramel-foreground">
            <PawPrint className="size-5" />
          </span>
          <div>
            <p className="font-display text-lg font-bold">The Petwork</p>
            <p className="text-xs text-sidebar-foreground/70">{founder.name} · founder console</p>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSection(s.key)}
              className={`flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                section === s.key
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent"
              }`}
            >
              <s.icon className="size-4" /> {s.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto hidden px-3 pb-6 lg:block">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground/80 hover:bg-sidebar-accent"
            onClick={handleSignOut}
          >
            <LogOut className="size-4" /> Sign out
          </Button>
          <Link to="/" className="mt-2 block px-4 text-xs text-sidebar-foreground/60 hover:text-caramel">
            ← Back to the public site
          </Link>
        </div>
      </aside>

      <div className="flex-1 px-4 py-8 sm:px-8">
        {section === "overview" && <Overview />}
        {section === "applications" && (
          <>
            <SectionHead
              title="Professional Applications"
              sub="Applications from pros wanting to join the network appear here for review."
            />
            <EmptyPanel
              title="No applications yet"
              text="The Pro Portal signup form is live. New applications will land here with ID, references and video introduction attached."
            />
          </>
        )}
        {section === "map" && <MapManagement />}
        {section === "community" && (
          <>
            <SectionHead
              title="Community Management"
              sub="Groups created by members, membership counts and posts flagged for review."
            />
            <EmptyPanel
              title="No communities created yet"
              text="The Pack Social is open for members to create the first community. Groups and flagged posts will show up here as they arrive."
            />
          </>
        )}
        {section === "analytics" && <Analytics />}
        {section === "users" && (
          <>
            <SectionHead title="User Management" sub="Everyone who has signed up to The Petwork." />
            <EmptyPanel
              title="No registered users yet"
              text="We are pre-launch. Owner accounts will appear here with name, email, pet type and join date as people sign up."
            />
          </>
        )}
        <div className="mt-10 lg:hidden">
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="size-4" /> Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}

function SectionHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl text-foreground sm:text-3xl">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
    </div>
  );
}

function EmptyPanel({ title, text }: { title: string; text: string }) {
  return (
    <div className="card-cozy flex flex-col items-center px-6 py-14 text-center">
      <EmptyMark />
      <h2 className="mt-4 text-xl text-foreground">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

function Overview() {
  const stats = [
    { label: "Registered owners", value: "0" },
    { label: "Active bookings", value: "0" },
    { label: "Map listings", value: String(PET_PLACES.length) },
    { label: "Pending applications", value: "0" },
  ];
  return (
    <>
      <SectionHead
        title="Overview"
        sub={`Pre-launch. Live counts today, plus what ${SURVEY.respondents.toLocaleString("en-IN")} Delhi NCR owners told us in our survey.`}
      />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card-cozy p-6">
            <p className="text-sm font-semibold text-muted-foreground">{s.label}</p>
            <p className="mt-2 font-display text-3xl font-bold text-caramel">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="card-cozy mt-6 p-6">
        <h2 className="text-lg text-foreground">Feature demand from the owner survey</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SURVEY.featureDemand}>
              <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip cursor={{ fill: "rgba(169,116,63,.08)" }} formatter={(v: number) => `${v}%`} />
              <Bar dataKey="value" fill="#A9743F" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}

function MapManagement() {
  const [listings, setListings] = useState(PET_PLACES.map((p) => ({ ...p, published: true })));

  return (
    <>
      <SectionHead title="Map Management" sub="Add, edit, publish and unpublish listings on The Neighbourhood Watch." />
      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <form
          className="card-cozy h-fit space-y-4 p-6"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("New location queued for publishing");
          }}
        >
          <h2 className="flex items-center gap-2 text-lg text-foreground">
            <Plus className="size-5 text-caramel" /> Add New Location
          </h2>
          <div>
            <Label htmlFor="loc-name">Place name</Label>
            <Input id="loc-name" maxLength={90} className="mt-1.5 rounded-xl" required />
          </div>
          <div>
            <Label htmlFor="loc-address">Address</Label>
            <Input id="loc-address" maxLength={160} className="mt-1.5 rounded-xl" required />
          </div>
          <div>
            <Label htmlFor="loc-cat">Category</Label>
            <select id="loc-cat" className="mt-1.5 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm">
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="loc-hours">Opening hours</Label>
            <Input id="loc-hours" maxLength={80} placeholder="Mon–Sun, 10:00 AM – 8:00 PM" className="mt-1.5 rounded-xl" />
          </div>
          <div>
            <Label htmlFor="loc-cond">Pet conditions (one per line)</Label>
            <Textarea id="loc-cond" rows={4} maxLength={600} placeholder="Dogs allowed on leash&#10;Outdoor seating only" className="mt-1.5 rounded-xl" />
          </div>
          <div className="flex items-center justify-between rounded-xl bg-oat p-3">
            <Label htmlFor="loc-pub" className="text-sm">Publish immediately</Label>
            <Switch id="loc-pub" defaultChecked />
          </div>
          <Button type="submit" className="w-full rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90">
            Save location
          </Button>
        </form>

        <div className="card-cozy overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="bg-oat text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                {["Place", "Category", "Conditions", "Published"].map((h) => (
                  <th key={h} className="px-5 py-3 font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {listings.map((l) => (
                <tr key={l.id} className="border-t border-border align-top">
                  <td className="px-5 py-4">
                    <p className="font-bold text-foreground">{l.name}</p>
                    <p className="text-xs text-muted-foreground">{l.address}</p>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{l.category}</td>
                  <td className="px-5 py-4 text-xs text-muted-foreground">{l.conditions.length} listed</td>
                  <td className="px-5 py-4">
                    <Switch
                      checked={l.published}
                      onCheckedChange={(v) =>
                        setListings((prev) => prev.map((x) => (x.id === l.id ? { ...x, published: v } : x)))
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function PieCard({ title, data }: { title: string; data: { name: string; value: number }[] }) {
  return (
    <div className="card-cozy p-6">
      <h3 className="text-base text-foreground">{title}</h3>
      <div className="mt-2 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={3}>
              {data.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v: number) => `${v}%`} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Analytics() {
  return (
    <>
      <SectionHead
        title="Survey & Analytics"
        sub={`What ${SURVEY.respondents.toLocaleString("en-IN")} Delhi NCR pet owners told us in the launch survey.`}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <PieCard title="Which pet do you have?" data={SURVEY.petType} />
        <PieCard title="Biggest struggle as a pet owner" data={SURVEY.biggestStruggle} />
        <PieCard title="Where owners live" data={SURVEY.city} />
        <PieCard title="Monthly spend per pet" data={SURVEY.spend} />
      </div>
      <div className="card-cozy mt-6 p-6">
        <h3 className="text-base text-foreground">Feature demand (% of respondents who wanted it)</h3>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SURVEY.featureDemand}>
              <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip cursor={{ fill: "rgba(169,116,63,.08)" }} formatter={(v: number) => `${v}%`} />
              <Bar dataKey="value" fill="#C1613D" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
