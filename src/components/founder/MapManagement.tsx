import { useMemo, useRef, useState } from "react";
import { ExternalLink, Image as ImageIcon, Plus, RotateCcw, Search, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
import { fieldClass, useBusy } from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES, CATEGORY_COLORS, IMAGES, type Category } from "@/data/locations";
import { addCustomPlace, setPlaceOverride, uid } from "@/mock/actions";
import { allPlaces, categoryBadge } from "@/mock/format";
import { useDemo } from "@/mock/store";
import { checkFile, resizeImage } from "@/mock/upload";
import { placePhoto } from "@/lib/photos";
import { SectionHead, StatusPill } from "./shared";

const defaultImage = (id: string, category: Category) =>
  IMAGES[id] ?? placePhoto(id, category, 800);

/** Founders add, publish and re-photograph listings; changes show on the public map straight away. */
export function MapManagement() {
  const data = useDemo();
  const listings = useMemo(() => allPlaces(data), [data]);
  const [q, setQ] = useState("");
  const [onlyHidden, setOnlyHidden] = useState(false);
  const [newImage, setNewImage] = useState<string | null>(null);
  const [category, setCategory] = useState<Category>(CATEGORIES[0]!);
  const [publish, setPublish] = useState(true);
  const [busy, run] = useBusy();
  const fileRef = useRef<HTMLInputElement>(null);
  const target = useRef<string | null>(null);

  const shown = listings.filter(
    (l) =>
      (!onlyHidden || !l.published) &&
      (!q.trim() ||
        `${l.name} ${l.address} ${l.category}`.toLowerCase().includes(q.trim().toLowerCase())),
  );

  const pickImage = (forId: string | null) => {
    target.current = forId;
    if (fileRef.current) {
      fileRef.current.value = "";
      fileRef.current.click();
    }
  };

  return (
    <>
      <SectionHead
        title="Map management"
        sub="Add, edit, publish and re-photograph every location on The Neighbourhood Watch. Changes are visible to everyone immediately."
        actions={
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/neighbourhood-watch">
              View public map <ExternalLink className="size-4" />
            </Link>
          </Button>
        }
      />

      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const problem = checkFile(file, "image");
          if (problem) {
            toast.error(problem);
            return;
          }
          try {
            const img = await resizeImage(file, 900);
            if (target.current) {
              setPlaceOverride(target.current, { image: img });
              toast.success("Location image updated on the public map");
            } else {
              setNewImage(img);
            }
          } catch {
            toast.error("Could not read that image.");
          }
        }}
      />

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <form
          className="card-cozy h-fit space-y-4 p-6"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const get = (n: string) =>
              (form.elements.namedItem(n) as HTMLInputElement).value.trim();
            const lat = Number(get("loc-lat")) || 28.56 + Math.random() * 0.1;
            const lng = Number(get("loc-lng")) || 77.18 + Math.random() * 0.12;
            void run(async () => {
              await addCustomPlace(
                {
                  id: uid("place"),
                  name: get("loc-name"),
                  address: get("loc-address"),
                  category,
                  hours: get("loc-hours") || "Hours not provided",
                  conditions: get("loc-cond")
                    .split("\n")
                    .map((s) => s.trim())
                    .filter(Boolean),
                  lat,
                  lng,
                  published: publish,
                },
                newImage ?? undefined,
              );
              form.reset();
              setNewImage(null);
              toast.success(publish ? "Location added and published" : "Location saved as a draft");
            });
          }}
        >
          <h2 className="flex items-center gap-2 text-lg text-foreground">
            <Plus className="size-5 text-caramel" /> Add new location
          </h2>
          <div>
            <Label htmlFor="loc-name">Place name</Label>
            <Input
              id="loc-name"
              name="loc-name"
              maxLength={90}
              className="mt-1.5 rounded-xl"
              required
            />
          </div>
          <div>
            <Label htmlFor="loc-address">Address</Label>
            <Input
              id="loc-address"
              name="loc-address"
              maxLength={160}
              className="mt-1.5 rounded-xl"
              required
            />
          </div>
          <div>
            <Label htmlFor="loc-cat">Category</Label>
            <select
              id="loc-cat"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className={fieldClass}
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="loc-hours">Opening hours</Label>
            <Input
              id="loc-hours"
              name="loc-hours"
              maxLength={80}
              placeholder="Mon–Sun, 10:00 AM – 8:00 PM"
              className="mt-1.5 rounded-xl"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="loc-lat">Latitude</Label>
              <Input
                id="loc-lat"
                name="loc-lat"
                inputMode="decimal"
                placeholder="28.5245"
                className="mt-1.5 rounded-xl"
              />
            </div>
            <div>
              <Label htmlFor="loc-lng">Longitude</Label>
              <Input
                id="loc-lng"
                name="loc-lng"
                inputMode="decimal"
                placeholder="77.2066"
                className="mt-1.5 rounded-xl"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="loc-cond">Pet conditions (one per line)</Label>
            <Textarea
              id="loc-cond"
              name="loc-cond"
              rows={4}
              maxLength={600}
              placeholder={"Dogs allowed on leash\nOutdoor seating only"}
              className="mt-1.5 rounded-xl"
            />
          </div>
          <div>
            <Label>Location image</Label>
            {newImage ? (
              <div className="relative mt-1.5">
                <img
                  src={newImage}
                  alt="New location preview"
                  className="h-40 w-full rounded-2xl object-cover"
                />
                <button
                  type="button"
                  onClick={() => setNewImage(null)}
                  aria-label="Remove image"
                  className="absolute right-2 top-2 rounded-full bg-black/75 p-2 text-white"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => pickImage(null)}
                className="mt-1.5 flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-oat/50 px-5 py-7 text-center transition hover:border-caramel"
              >
                <Upload className="size-6 text-caramel" />
                <span className="mt-2 text-sm font-bold text-foreground">
                  Upload location photo
                </span>
                <span className="mt-1 text-xs text-muted-foreground">
                  JPG, PNG, WEBP or AVIF · Max 10MB
                </span>
              </button>
            )}
          </div>
          <label
            htmlFor="loc-pub"
            className="flex items-center justify-between rounded-xl bg-oat p-3 text-sm font-semibold"
          >
            Publish immediately
            <Switch id="loc-pub" checked={publish} onCheckedChange={setPublish} />
          </label>
          <Button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
          >
            {busy ? "Saving…" : "Save location"}
          </Button>
        </form>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <label className="relative min-w-0 flex-1">
              <span className="sr-only">Search listings</span>
              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search listings"
                className="w-full rounded-full border border-border bg-card py-2.5 pl-11 pr-4 text-sm outline-none focus:border-caramel"
              />
            </label>
            <button
              onClick={() => setOnlyHidden((v) => !v)}
              aria-pressed={onlyHidden}
              className={`rounded-full px-4 py-2.5 text-sm font-bold ${onlyHidden ? "bg-mocha text-mocha-foreground" : "bg-card text-muted-foreground ring-1 ring-border"}`}
            >
              Unpublished only ({listings.filter((l) => !l.published).length})
            </button>
          </div>
          <p className="text-sm text-muted-foreground">{shown.length} listings</p>

          {shown.map((l) => (
            <div key={l.id} className="card-cozy flex flex-col gap-4 p-4 sm:flex-row">
              <div className="relative shrink-0">
                <img
                  src={l.image ?? defaultImage(l.id, l.category)}
                  alt={l.name}
                  loading="lazy"
                  className={`h-32 w-full rounded-2xl object-cover sm:w-44 ${l.published ? "" : "opacity-50 grayscale"}`}
                  onError={(e) => {
                    e.currentTarget.src = placePhoto(l.id, l.category, 800);
                  }}
                />
                <div className="absolute bottom-2 left-2 flex gap-1">
                  <button
                    onClick={() => pickImage(l.id)}
                    className="flex items-center gap-1.5 rounded-full bg-black/75 px-3 py-1.5 text-xs font-bold text-white hover:bg-black/90"
                  >
                    <ImageIcon className="size-3.5" /> Change
                  </button>
                  {l.image && (
                    <button
                      onClick={() => {
                        setPlaceOverride(l.id, { image: null });
                        toast.success("Original image restored");
                      }}
                      aria-label="Restore original image"
                      className="rounded-full bg-black/75 p-1.5 text-white hover:bg-black/90"
                    >
                      <RotateCcw className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-col justify-between gap-2 sm:flex-row">
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-foreground">{l.name}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">{l.address}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span
                        className="inline-block rounded-full px-3 py-1 text-xs font-bold"
                        style={categoryBadge(l.category)}
                      >
                        {l.category}
                      </span>
                      {!l.published && <StatusPill tone="muted">Hidden from public</StatusPill>}
                      {l.id.startsWith("place-") && (
                        <StatusPill tone="good">Added by founders</StatusPill>
                      )}
                    </div>
                  </div>
                  <label className="flex shrink-0 items-center gap-2 text-xs font-semibold text-muted-foreground">
                    Published
                    <Switch
                      checked={l.published}
                      onCheckedChange={(v) => {
                        setPlaceOverride(l.id, { published: v });
                        toast.success(
                          v ? `${l.name} is live on the map` : `${l.name} is hidden from the map`,
                        );
                      }}
                    />
                  </label>
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span>{l.conditions.length} pet conditions</span>
                  <span>{l.hours}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
