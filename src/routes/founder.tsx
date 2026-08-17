import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
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
  Image as ImageIcon,
  X,
  Upload,
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

import {
  getFounderSession,
  logoutFounder,
} from "@/lib/founder.functions";

import { SURVEY } from "@/data/content";

import {
  CATEGORIES,
  CATEGORY_COLORS,
  PET_PLACES,
  type Category,
} from "@/data/locations";

import { EmptyMark } from "@/components/EmptyMark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { placePhoto } from "@/lib/photos";

export const Route = createFileRoute("/founder")({
  head: () => ({
    meta: [
      { title: "Founder Dashboard | The Petwork" },
      {
        name: "description",
        content:
          "Internal operations dashboard for The Petwork founding team.",
      },
      {
        property: "og:title",
        content: "Founder Dashboard | The Petwork",
      },
      {
        property: "og:description",
        content: "Internal operations dashboard for The Petwork.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: FounderDashboard,
});

const SECTIONS = [
  {
    key: "overview",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    key: "applications",
    label: "Professional Applications",
    icon: ClipboardList,
  },
  {
    key: "map",
    label: "Map Management",
    icon: MapPinned,
  },
  {
    key: "community",
    label: "Community Management",
    icon: UsersRound,
  },
  {
    key: "analytics",
    label: "Survey & Analytics",
    icon: BarChart3,
  },
  {
    key: "users",
    label: "User Management",
    icon: Users,
  },
] as const;

const PIE_COLORS = [
  "#A9743F",
  "#C1613D",
  "#8A6244",
  "#D9A566",
];

/* =========================================================
   IMAGE STORAGE
   ========================================================= */

const IMAGE_STORAGE_KEY = "petwork-location-images";

function getSavedImages(): Record<string, string> {
  if (typeof window === "undefined") return {};

  try {
    const saved = localStorage.getItem(IMAGE_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function saveLocationImage(id: string, image: string) {
  if (typeof window === "undefined") return;

  const current = getSavedImages();

  current[id] = image;

  localStorage.setItem(
    IMAGE_STORAGE_KEY,
    JSON.stringify(current),
  );
}

function removeLocationImage(id: string) {
  if (typeof window === "undefined") return;

  const current = getSavedImages();

  delete current[id];

  localStorage.setItem(
    IMAGE_STORAGE_KEY,
    JSON.stringify(current),
  );
}

function getLocationImage(
  id: string,
  category: Category,
): string {
  const saved = getSavedImages();

  return (
    saved[id] ||
    placePhoto(id, category, 800)
  );
}

/* =========================================================
   FOUNDER DASHBOARD
   ========================================================= */

function FounderDashboard() {
  const navigate = useNavigate();

  const fetchSession = useServerFn(getFounderSession);
  const signOut = useServerFn(logoutFounder);

  const [section, setSection] =
    useState<(typeof SECTIONS)[number]["key"]>("overview");

  const {
    data: founder,
    isPending,
  } = useQuery({
    queryKey: ["founder-session"],
    queryFn: () => fetchSession(),
    staleTime: 0,
  });

  useEffect(() => {
    if (!isPending && !founder) {
      navigate({
        to: "/founder-access",
        replace: true,
      });
    }
  }, [isPending, founder, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  if (isPending || !founder) {
    return (
      <div className="grid min-h-screen place-items-center bg-mocha text-mocha-foreground">
        <p className="text-sm">
          Checking founder access…
        </p>
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
            <p className="font-display text-lg font-bold">
              The Petwork
            </p>

            <p className="text-xs text-sidebar-foreground/70">
              {founder.name} · founder console
            </p>
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
              <s.icon className="size-4" />
              {s.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto hidden px-3 pb-6 lg:block">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground/80 hover:bg-sidebar-accent"
            onClick={handleSignOut}
          >
            <LogOut className="size-4" />
            Sign out
          </Button>

          <Link
            to="/"
            className="mt-2 block px-4 text-xs text-sidebar-foreground/60 hover:text-caramel"
          >
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
              sub="Applications from professionals wanting to join the network appear here for review."
            />

            <EmptyPanel
              title="No applications yet"
              text="The Pro Portal signup form is live. New applications will appear here."
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
              text="The Pack Social is open for members to create the first community."
            />
          </>
        )}

        {section === "analytics" && <Analytics />}

        {section === "users" && (
          <>
            <SectionHead
              title="User Management"
              sub="Everyone who has signed up to The Petwork."
            />

            <EmptyPanel
              title="No registered users yet"
              text="Owner accounts will appear here as people sign up."
            />
          </>
        )}

        <div className="mt-10 lg:hidden">
          <Button
            variant="outline"
            onClick={handleSignOut}
          >
            <LogOut className="size-4" />
            Sign out
          </Button>
        </div>

      </div>
    </div>
  );
}

/* =========================================================
   SECTION HEAD
   ========================================================= */

function SectionHead({
  title,
  sub,
}: {
  title: string;
  sub: string;
}) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl text-foreground sm:text-3xl">
        {title}
      </h1>

      <p className="mt-1 text-sm text-muted-foreground">
        {sub}
      </p>
    </div>
  );
}

/* =========================================================
   EMPTY PANEL
   ========================================================= */

function EmptyPanel({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="card-cozy flex flex-col items-center px-6 py-14 text-center">
      <EmptyMark />

      <h2 className="mt-4 text-xl text-foreground">
        {title}
      </h2>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {text}
      </p>
    </div>
  );
}

/* =========================================================
   OVERVIEW
   ========================================================= */

function Overview() {
  const stats = [
    {
      label: "Registered owners",
      value: "0",
    },
    {
      label: "Active bookings",
      value: "0",
    },
    {
      label: "Map listings",
      value: String(PET_PLACES.length),
    },
    {
      label: "Pending applications",
      value: "0",
    },
  ];

  return (
    <>
      <SectionHead
        title="Overview"
        sub={`Pre-launch. Live counts today, plus what ${SURVEY.respondents.toLocaleString(
          "en-IN",
        )} Delhi NCR owners told us in our survey.`}
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="card-cozy p-6"
          >
            <p className="text-sm font-semibold text-muted-foreground">
              {s.label}
            </p>

            <p className="mt-2 font-display text-3xl font-bold text-caramel">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="card-cozy mt-6 p-6">
        <h2 className="text-lg text-foreground">
          Feature demand from the owner survey
        </h2>

        <div className="mt-4 h-64">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart data={SURVEY.featureDemand}>
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />

              <Tooltip
                cursor={{
                  fill: "rgba(169,116,63,.08)",
                }}
                formatter={(v: number) => `${v}%`}
              />

              <Bar
                dataKey="value"
                fill="#A9743F"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}

/* =========================================================
   MAP MANAGEMENT
   ========================================================= */

function MapManagement() {
  const [listings, setListings] = useState(() =>
    PET_PLACES.map((p) => ({
      ...p,
      published: true,
      image: getLocationImage(
        p.id,
        p.category,
      ),
    })),
  );

  const [editingImage, setEditingImage] =
    useState<string | null>(null);

  const [previewImage, setPreviewImage] =
    useState<string | null>(null);

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const [uploadingFor, setUploadingFor] =
    useState<string | null>(null);

  const handleFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file || !uploadingFor) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error("Please choose an image smaller than 8MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result !== "string") {
        toast.error("Could not read this image.");
        return;
      }

      saveLocationImage(
        uploadingFor,
        result,
      );

      setListings((prev) =>
        prev.map((listing) =>
          listing.id === uploadingFor
            ? {
                ...listing,
                image: result,
              }
            : listing,
        ),
      );

      setUploadingFor(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.success("Location image updated.");
    };

    reader.onerror = () => {
      toast.error("Could not upload this image.");
    };

    reader.readAsDataURL(file);
  };

  const openUploader = (id: string) => {
    setUploadingFor(id);

    setTimeout(() => {
      fileInputRef.current?.click();
    }, 50);
  };

  const resetImage = (id: string, category: Category) => {
    removeLocationImage(id);

    const fallback = placePhoto(
      id,
      category,
      800,
    );

    setListings((prev) =>
      prev.map((listing) =>
        listing.id === id
          ? {
              ...listing,
              image: fallback,
            }
          : listing,
      ),
    );

    toast.success("Image reset.");
  };

  return (
    <>
      <SectionHead
        title="Map Management"
        sub="Manage every location on The Neighbourhood Watch and upload the exact photo you want displayed."
      />

      {/* HIDDEN FILE INPUT */}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileSelect}
      />

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">

        {/* =================================================
            ADD NEW LOCATION
        ================================================= */}

        <form
          className="card-cozy h-fit space-y-4 p-6"
          onSubmit={(e) => {
            e.preventDefault();

            toast.success(
              "New location queued for publishing.",
            );
          }}
        >
          <h2 className="flex items-center gap-2 text-lg text-foreground">
            <Plus className="size-5 text-caramel" />
            Add New Location
          </h2>

          <div>
            <Label htmlFor="loc-name">
              Place name
            </Label>

            <Input
              id="loc-name"
              maxLength={90}
              className="mt-1.5 rounded-xl"
              required
            />
          </div>

          <div>
            <Label htmlFor="loc-address">
              Address
            </Label>

            <Input
              id="loc-address"
              maxLength={160}
              className="mt-1.5 rounded-xl"
              required
            />
          </div>

          <div>
            <Label htmlFor="loc-cat">
              Category
            </Label>

            <select
              id="loc-cat"
              className="mt-1.5 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="loc-hours">
              Opening hours
            </Label>

            <Input
              id="loc-hours"
              maxLength={80}
              placeholder="Mon–Sun, 10:00 AM – 8:00 PM"
              className="mt-1.5 rounded-xl"
            />
          </div>

          <div>
            <Label htmlFor="loc-cond">
              Pet conditions
            </Label>

            <Textarea
              id="loc-cond"
              rows={4}
              maxLength={600}
              placeholder={
                "Dogs allowed on leash\nOutdoor seating only"
              }
              className="mt-1.5 rounded-xl"
            />
          </div>

          {/* NEW LOCATION PHOTO */}

          <div className="rounded-2xl border border-dashed border-caramel/40 bg-oat/50 p-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="size-4 text-caramel" />

              <p className="text-sm font-bold text-foreground">
                Location photo
              </p>
            </div>

            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              After creating the location, you can upload its
              exact photo directly from your computer.
            </p>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-oat p-3">
            <Label
              htmlFor="loc-pub"
              className="text-sm"
            >
              Publish immediately
            </Label>

            <Switch
              id="loc-pub"
              defaultChecked
            />
          </div>

          <Button
            type="submit"
            className="w-full rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
          >
            Save location
          </Button>
        </form>

        {/* =================================================
            LOCATION LIST
        ================================================= */}

        <div className="space-y-4">

          {listings.map((l) => (
            <div
              key={l.id}
              className="card-cozy overflow-hidden"
            >

              <div className="flex flex-col gap-4 p-4 sm:flex-row">

                {/* IMAGE */}

                <div className="relative shrink-0">

                  <img
                    src={l.image}
                    alt={l.name}
                    className="h-40 w-full rounded-2xl object-cover sm:h-32 sm:w-48"
                    onError={(e) => {
                      e.currentTarget.src =
                        placePhoto(
                          l.id,
                          l.category,
                          800,
                        );
                    }}
                  />

                  {/* IMAGE BUTTONS */}

                  <div className="absolute bottom-2 left-2 right-2 flex gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        openUploader(l.id)
                      }
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-black/80 px-3 py-2 text-xs font-bold text-white backdrop-blur transition hover:bg-black"
                    >
                      <Upload className="size-3.5" />
                      Upload
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImage(l.image);
                      }}
                      className="flex items-center justify-center rounded-full bg-black/80 px-3 py-2 text-xs font-bold text-white backdrop-blur transition hover:bg-black"
                    >
                      <ImageIcon className="size-3.5" />
                    </button>

                  </div>
                </div>

                {/* DETAILS */}

                <div className="min-w-0 flex-1">

                  <div className="flex flex-col justify-between gap-2 sm:flex-row">

                    <div>

                      <h3 className="text-lg font-bold text-foreground">
                        {l.name}
                      </h3>

                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {l.address}
                      </p>

                      <span
                        className="mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold text-caramel-foreground"
                        style={{
                          backgroundColor:
                            CATEGORY_COLORS[
                              l.category
                            ],
                        }}
                      >
                        {l.category}
                      </span>

                    </div>

                    <div className="flex items-center gap-2">

                      <span className="text-xs font-semibold text-muted-foreground">
                        Published
                      </span>

                      <Switch
                        checked={l.published}
                        onCheckedChange={(v) =>
                          setListings((prev) =>
                            prev.map((x) =>
                              x.id === l.id
                                ? {
                                    ...x,
                                    published: v,
                                  }
                                : x,
                            ),
                          )
                        }
                      />

                    </div>

                  </div>

                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span>
                      {l.conditions.length} pet conditions
                    </span>

                    <span>
                      {l.hours}
                    </span>
                  </div>

                  {/* PHOTO CONTROLS */}

                  <div className="mt-4 flex flex-wrap gap-2">

                    <Button
                      type="button"
                      size="sm"
                      onClick={() =>
                        openUploader(l.id)
                      }
                      className="rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
                    >
                      <Upload className="size-4" />
                      Upload New Photo
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        resetImage(
                          l.id,
                          l.category,
                        )
                      }
                      className="rounded-full"
                    >
                      Reset Photo
                    </Button>

                  </div>

                  <p className="mt-2 text-xs text-muted-foreground">
                    JPG, PNG, WEBP or GIF · maximum 8MB
                  </p>

                </div>
              </div>
            </div>
          ))}

          {listings.length === 0 && (
            <div className="card-cozy p-10 text-center">
              <EmptyMark />

              <h2 className="mt-4 text-xl text-foreground">
                No locations yet
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Add your first location using the form.
              </p>
            </div>
          )}

        </div>
      </div>

      {/* =================================================
          FULL IMAGE PREVIEW
      ================================================= */}

      {previewImage && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-5 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
        >

          <div
            className="relative max-h-[90vh] max-w-5xl overflow-hidden rounded-3xl bg-card shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <img
              src={previewImage}
              alt="Location preview"
              className="max-h-[85vh] max-w-full object-contain"
            />

            <button
              type="button"
              onClick={() =>
                setPreviewImage(null)
              }
              className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-black/70 text-white backdrop-blur hover:bg-black"
              aria-label="Close image preview"
            >
              <X className="size-5" />
            </button>

          </div>
        </div>
      )}
    </>
  );
}

/* =========================================================
   PIE CARD
   ========================================================= */

function PieCard({
  title,
  data,
}: {
  title: string;
  data: {
    name: string;
    value: number;
  }[];
}) {
  return (
    <div className="card-cozy p-6">

      <h3 className="text-base text-foreground">
        {title}
      </h3>

      <div className="mt-2 h-64">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={45}
              outerRadius={80}
              paddingAngle={3}
            >
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={
                    PIE_COLORS[
                      i % PIE_COLORS.length
                    ]
                  }
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(v: number) =>
                `${v}%`
              }
            />

            <Legend
              iconType="circle"
              wrapperStyle={{
                fontSize: 12,
              }}
            />

          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* =========================================================
   ANALYTICS
   ========================================================= */

function Analytics() {
  return (
    <>
      <SectionHead
        title="Survey & Analytics"
        sub={`What ${SURVEY.respondents.toLocaleString(
          "en-IN",
        )} Delhi NCR pet owners told us in the launch survey.`}
      />

      <div className="grid gap-6 lg:grid-cols-2">

        <PieCard
          title="Which pet do you have?"
          data={SURVEY.petType}
        />

        <PieCard
          title="Biggest struggle as a pet owner"
          data={SURVEY.biggestStruggle}
        />

        <PieCard
          title="Where owners live"
          data={SURVEY.city}
        />

        <PieCard
          title="Monthly spend per pet"
          data={SURVEY.spend}
        />

      </div>

      <div className="card-cozy mt-6 p-6">

        <h3 className="text-base text-foreground">
          Feature demand (% of respondents who wanted it)
        </h3>

        <div className="mt-4 h-72">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={SURVEY.featureDemand}
            >

              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />

              <Tooltip
                cursor={{
                  fill: "rgba(169,116,63,.08)",
                }}
                formatter={(v: number) =>
                  `${v}%`
                }
              />

              <Bar
                dataKey="value"
                fill="#C1613D"
                radius={[8, 8, 0, 0]}
              />

            </BarChart>
          </ResponsiveContainer>

        </div>
      </div>
    </>
  );
}
