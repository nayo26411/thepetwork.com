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
  Pencil,
  Trash2,
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

type Listing = (typeof PET_PLACES)[number] & {
  published: boolean;
  image: string;
};

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
    const localAccess =
      typeof window !== "undefined"
        ? sessionStorage.getItem("petwork_founder_access")
        : null;

    if (!isPending && !founder && localAccess !== "true") {
      navigate({
        to: "/founder-access",
        replace: true,
      });
    }
  }, [isPending, founder, navigate]);

  const handleSignOut = async () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("petwork_founder_access");
    }

    try {
      await signOut();
    } catch {
      // Local founder access is still cleared.
    }

    navigate({ to: "/founder-access", replace: true });
  };

  if (isPending && !founder) {
    return (
      <div className="grid min-h-screen place-items-center bg-mocha text-mocha-foreground">
        <p className="text-sm">Checking founder access…</p>
      </div>
    );
  }

  const localAccess =
    typeof window !== "undefined"
      ? sessionStorage.getItem("petwork_founder_access")
      : null;

  if (!founder && localAccess !== "true") {
    return (
      <div className="grid min-h-screen place-items-center bg-mocha text-mocha-foreground">
        <p className="text-sm">Checking founder access…</p>
      </div>
    );
  }

  const founderName = founder?.name ?? "Founder";

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
              {founderName} · founder console
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
            <SectionHead
              title="User Management"
              sub="Everyone who has signed up to The Petwork."
            />

            <EmptyPanel
              title="No registered users yet"
              text="We are pre-launch. Owner accounts will appear here with name, email, pet type and join date as people sign up."
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
          "en-IN"
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
          <ResponsiveContainer width="100%" height="100%">
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

/* =========================================================
   MAP MANAGEMENT
   ========================================================= */

type Listing = (typeof PET_PLACES)[number] & {
  published: boolean;
  image: string;
};

const STORAGE_KEY = "petwork_location_images";
const PUBLISHED_KEY = "petwork_location_published";

function MapManagement() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedUploadId, setSelectedUploadId] = useState<string | null>(
    null
  );

  const [newLocationImage, setNewLocationImage] = useState<string | null>(
    null
  );
  const [newLocationImageName, setNewLocationImageName] = useState("");

  /* ---------------------------------------------------------
     LOAD SAVED LOCATION DATA
     --------------------------------------------------------- */

  useEffect(() => {
    try {
      const savedImages = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "{}"
      );

      const savedPublished = JSON.parse(
        localStorage.getItem(PUBLISHED_KEY) || "{}"
      );

      const initialListings: Listing[] = PET_PLACES.map((p) => ({
        ...p,
        published:
          savedPublished[p.id] !== undefined
            ? savedPublished[p.id]
            : true,

        image:
          savedImages[p.id] ||
          placePhoto(p.id, p.category, 800),
      }));

      setListings(initialListings);
    } catch {
      setListings(
        PET_PLACES.map((p) => ({
          ...p,
          published: true,
          image: placePhoto(p.id, p.category, 800),
        }))
      );
    }
  }, []);

  /* ---------------------------------------------------------
     SAVE IMAGE TO LOCAL STORAGE
     --------------------------------------------------------- */

  const persistImage = (id: string, image: string) => {
    try {
      const existing = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "{}"
      );

      existing[id] = image;

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(existing)
      );
    } catch {
      toast.error(
        "Image could not be saved. The file may be too large."
      );
    }
  };

  /* ---------------------------------------------------------
     SAVE PUBLISHED STATE
     --------------------------------------------------------- */

  const persistPublished = (
    id: string,
    published: boolean
  ) => {
    try {
      const existing = JSON.parse(
        localStorage.getItem(PUBLISHED_KEY) || "{}"
      );

      existing[id] = published;

      localStorage.setItem(
        PUBLISHED_KEY,
        JSON.stringify(existing)
      );
    } catch {
      // Ignore storage errors.
    }
  };

  /* ---------------------------------------------------------
     IMAGE EDITING
     --------------------------------------------------------- */

  const startEditingImage = (id: string) => {
    setEditingImage(id);
    setPreviewImage(null);
    setSelectedUploadId(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const cancelEditing = () => {
    setEditingImage(null);
    setPreviewImage(null);
    setSelectedUploadId(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openFilePicker = (id: string) => {
    setSelectedUploadId(id);

    /*
     * Important:
     * Reset the input so selecting the same image twice
     * still triggers onChange.
     */
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be smaller than 10MB.");
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    /*
     * Existing location image
     */
    if (selectedUploadId) {
      setPreviewImage(imageUrl);

      return;
    }

    /*
     * New location image
     */
    setNewLocationImage(imageUrl);
    setNewLocationImageName(file.name);
  };

  const saveUploadedImage = () => {
    if (!editingImage || !previewImage) {
      toast.error("Choose an image first.");
      return;
    }

    /*
     * Save the actual image data to localStorage.
     *
     * Object URLs disappear after refresh, so we convert
     * the selected image into a persistent data URL first.
     */
    fetch(previewImage)
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader();

        reader.onloadend = () => {
          const persistentImage = reader.result as string;

          setListings((prev) =>
            prev.map((listing) =>
              listing.id === editingImage
                ? {
                    ...listing,
                    image: persistentImage,
                  }
                : listing
            )
          );

          persistImage(
            editingImage,
            persistentImage
          );

          toast.success("Location image saved.");

          setEditingImage(null);
          setPreviewImage(null);
          setSelectedUploadId(null);

          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        };

        reader.readAsDataURL(blob);
      })
      .catch(() => {
        toast.error("Could not save this image.");
      });
  };

  const removeCustomImage = (id: string) => {
    const listing = PET_PLACES.find(
      (p) => p.id === id
    );

    if (!listing) {
      return;
    }

    const fallback = placePhoto(
      listing.id,
      listing.category,
      800
    );

    setListings((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              image: fallback,
            }
          : item
      )
    );

    try {
      const existing = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "{}"
      );

      delete existing[id];

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(existing)
      );
    } catch {
      // Ignore storage errors.
    }

    toast.success("Original image restored.");
  };

  /* ---------------------------------------------------------
     NEW LOCATION
     --------------------------------------------------------- */

  const handleNewLocationSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const form = e.currentTarget;

    const name = (
      form.elements.namedItem(
        "loc-name"
      ) as HTMLInputElement
    ).value;

    const address = (
      form.elements.namedItem(
        "loc-address"
      ) as HTMLInputElement
    ).value;

    const category = (
      form.elements.namedItem(
        "loc-cat"
      ) as HTMLSelectElement
    ).value as Category;

    const hours = (
      form.elements.namedItem(
        "loc-hours"
      ) as HTMLInputElement
    ).value;

    const conditionsText = (
      form.elements.namedItem(
        "loc-cond"
      ) as HTMLTextAreaElement
    ).value;

    const publishSwitch = (
      form.elements.namedItem(
        "loc-pub"
      ) as HTMLButtonElement
    );

    const newId = `custom-${Date.now()}`;

    const newListing: Listing = {
      id: newId,
      name,
      address,
      category,
      hours: hours || "Hours not provided",
      conditions: conditionsText
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      published: true,
      image:
        newLocationImage ||
        placePhoto(newId, category, 800),
    } as Listing;

    setListings((prev) => [
      newListing,
      ...prev,
    ]);

    /*
     * Save new location locally.
     */
    try {
      const savedLocations = JSON.parse(
        localStorage.getItem("petwork_custom_locations") ||
          "[]"
      );

      savedLocations.push({
        ...newListing,
      });

      localStorage.setItem(
        "petwork_custom_locations",
        JSON.stringify(savedLocations)
      );

      if (newLocationImage) {
        persistImage(
          newId,
          newLocationImage
        );
      }
    } catch {
      toast.error(
        "Location could not be saved."
      );
      return;
    }

    form.reset();

    setNewLocationImage(null);
    setNewLocationImageName("");

    toast.success(
      "Location added successfully."
    );
  };

  /* ---------------------------------------------------------
     LOAD CUSTOM LOCATIONS
     --------------------------------------------------------- */

  useEffect(() => {
    try {
      const savedCustomLocations = JSON.parse(
        localStorage.getItem(
          "petwork_custom_locations"
        ) || "[]"
      );

      if (
        Array.isArray(savedCustomLocations) &&
        savedCustomLocations.length
      ) {
        setListings((prev) => {
          const existingIds = new Set(
            prev.map((item) => item.id)
          );

          const additional = savedCustomLocations.filter(
            (item: Listing) =>
              !existingIds.has(item.id)
          );

          return [
            ...prev,
            ...additional,
          ];
        });
      }
    } catch {
      // Ignore malformed local storage.
    }
  }, []);

  return (
    <>
      <SectionHead
        title="Map Management"
        sub="Add, edit, publish and manage every location on The Neighbourhood Watch."
      />

      {/* -------------------------------------------------------
          HIDDEN FILE INPUT
      ------------------------------------------------------- */}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif"
        className="hidden"
        onChange={handleFileUpload}
      />

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">

        {/* =====================================================
            ADD NEW LOCATION
        ===================================================== */}

        <form
          className="card-cozy h-fit space-y-4 p-6"
          onSubmit={handleNewLocationSubmit}
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
              name="loc-name"
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
              name="loc-address"
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
              name="loc-cat"
              className="mt-1.5 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
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
              name="loc-hours"
              maxLength={80}
              placeholder="Mon–Sun, 10:00 AM – 8:00 PM"
              className="mt-1.5 rounded-xl"
            />
          </div>

          <div>
            <Label htmlFor="loc-cond">
              Pet conditions (one per line)
            </Label>

            <Textarea
              id="loc-cond"
              name="loc-cond"
              rows={4}
              maxLength={600}
              placeholder={
                "Dogs allowed on leash\nOutdoor seating only"
              }
              className="mt-1.5 rounded-xl"
            />
          </div>

          {/* IMAGE UPLOAD */}

          <div>
            <Label>
              Location image
            </Label>

            <button
              type="button"
              onClick={() => {
                setSelectedUploadId(null);

                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                  fileInputRef.current.click();
                }
              }}
              className="mt-1.5 flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-oat/50 px-5 py-8 text-center transition hover:border-caramel hover:bg-accent"
            >
              <Upload className="size-7 text-caramel" />

              <span className="mt-2 text-sm font-bold text-foreground">
                Upload location photo
              </span>

              <span className="mt-1 text-xs text-muted-foreground">
                JPG, PNG, WEBP or AVIF · Max 10MB
              </span>
            </button>

            {newLocationImage && (
              <div className="relative mt-3">
                <img
                  src={newLocationImage}
                  alt="New location preview"
                  className="h-40 w-full rounded-2xl object-cover"
                />

                <button
                  type="button"
                  onClick={() => {
                    setNewLocationImage(null);
                    setNewLocationImageName("");
                  }}
                  className="absolute right-2 top-2 rounded-full bg-black/75 p-2 text-white"
                >
                  <X className="size-4" />
                </button>
              </div>
            )}

            {newLocationImageName && (
              <p className="mt-2 text-xs text-muted-foreground">
                {newLocationImageName}
              </p>
            )}
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
              name="loc-pub"
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

        {/* =====================================================
            LOCATION LIST
        ===================================================== */}

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
                    className="h-32 w-full rounded-2xl object-cover sm:w-44"
                    onError={(e) => {
                      e.currentTarget.src =
                        placePhoto(
                          l.id,
                          l.category,
                          800
                        );
                    }}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      startEditingImage(l.id)
                    }
                    className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full bg-black/75 px-3 py-1.5 text-xs font-bold text-white backdrop-blur transition hover:bg-black/90"
                  >
                    <ImageIcon className="size-3.5" />
                    Change Image
                  </button>
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
                              l.category as Category
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
                        onCheckedChange={(value) => {
                          setListings((prev) =>
                            prev.map((x) =>
                              x.id === l.id
                                ? {
                                    ...x,
                                    published: value,
                                  }
                                : x
                            )
                          );

                          persistPublished(
                            l.id,
                            value
                          );
                        }}
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
                </div>
              </div>

              {/* =================================================
                  IMAGE EDITOR
              ================================================= */}

              {editingImage === l.id && (
                <div className="border-t border-border bg-oat/60 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="size-4 text-caramel" />

                      <p className="text-sm font-bold text-foreground">
                        Change location image
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="rounded-full p-1.5 text-muted-foreground hover:bg-accent"
                    >
                      <X className="size-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      openFilePicker(l.id)
                    }
                    className="mt-4 flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card px-5 py-8 text-center transition hover:border-caramel hover:bg-accent sm:w-96"
                  >
                    <Upload className="size-8 text-caramel" />

                    <span className="mt-2 text-sm font-bold text-foreground">
                      Choose image from device
                    </span>

                    <span className="mt-1 text-xs text-muted-foreground">
                      JPG, PNG, WEBP or AVIF · Max 10MB
                    </span>
                  </button>

                  {previewImage && (
                    <div className="mt-4">
                      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                        Preview
                      </p>

                      <img
                        src={previewImage}
                        alt={`${l.name} preview`}
                        className="h-48 w-full rounded-2xl object-cover sm:w-80"
                      />
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      onClick={saveUploadedImage}
                      disabled={!previewImage}
                      className="rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
                    >
                      Save Image
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        removeCustomImage(l.id)
                      }
                      className="rounded-full"
                    >
                      Restore Original
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelEditing}
                      className="rounded-full"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
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
    </>
  );
}

/* =========================================================
   PIE CHART
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
              formatter={(v: number) => `${v}%`}
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
          "en-IN"
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
