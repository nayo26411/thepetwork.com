// Replace your current MapManagement() function in /founder.tsx with this.
// This lets you upload an image directly from your computer.

function MapManagement() {
  const [listings, setListings] = useState(
    PET_PLACES.map((p) => ({
      ...p,
      published: true,
      image: placePhoto(p.id, p.category, 800),
    }))
  );

  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [previewImages, setPreviewImages] = useState<Record<string, string>>(
    {}
  );

  const handleImageUpload = (
    id: string,
    file: File | undefined
  ) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be smaller than 10MB");
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setPreviewImages((prev) => ({
      ...prev,
      [id]: imageUrl,
    }));

    setListings((prev) =>
      prev.map((listing) =>
        listing.id === id
          ? {
              ...listing,
              image: imageUrl,
            }
          : listing
      )
    );

    setEditingImage(null);

    toast.success("Location image updated");
  };

  const resetImage = (id: string) => {
    const listing = PET_PLACES.find((p) => p.id === id);

    if (!listing) return;

    setListings((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              image: placePhoto(
                item.id,
                item.category,
                800
              ),
            }
          : item
      )
    );

    setPreviewImages((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });

    toast.success("Original image restored");
  };

  return (
    <>
      <SectionHead
        title="Map Management"
        sub="Add, edit, publish and manage every location on The Neighbourhood Watch."
      />

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">

        {/* ADD NEW LOCATION */}

        <form
          className="card-cozy h-fit space-y-4 p-6"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("New location queued for publishing");
          }}
        >
          <h2 className="flex items-center gap-2 text-lg text-foreground">
            <Plus className="size-5 text-caramel" />
            Add New Location
          </h2>

          <div>
            <Label htmlFor="loc-name">Place name</Label>
            <Input
              id="loc-name"
              maxLength={90}
              className="mt-1.5 rounded-xl"
              required
            />
          </div>

          <div>
            <Label htmlFor="loc-address">Address</Label>
            <Input
              id="loc-address"
              maxLength={160}
              className="mt-1.5 rounded-xl"
              required
            />
          </div>

          <div>
            <Label htmlFor="loc-cat">Category</Label>
            <select
              id="loc-cat"
              className="mt-1.5 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm"
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
              rows={4}
              maxLength={600}
              placeholder={"Dogs allowed on leash\nOutdoor seating only"}
              className="mt-1.5 rounded-xl"
            />
          </div>

          <div>
            <Label htmlFor="loc-image-upload">
              Location image
            </Label>

            <label
              htmlFor="loc-image-upload"
              className="mt-1.5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-oat/50 px-4 py-8 text-center transition hover:border-caramel hover:bg-accent"
            >
              <ImageIcon className="size-8 text-caramel" />

              <span className="mt-2 text-sm font-bold text-foreground">
                Choose an image
              </span>

              <span className="mt-1 text-xs text-muted-foreground">
                JPG, PNG or WEBP · max 10MB
              </span>

              <input
                id="loc-image-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
              />
            </label>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-oat p-3">
            <Label htmlFor="loc-pub" className="text-sm">
              Publish immediately
            </Label>

            <Switch id="loc-pub" defaultChecked />
          </div>

          <Button
            type="submit"
            className="w-full rounded-full bg-caramel text-caramel-foreground hover:bg-caramel/90"
          >
            Save location
          </Button>
        </form>

        {/* LOCATION LIST */}

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
                      e.currentTarget.src = placePhoto(
                        l.id,
                        l.category,
                        800
                      );
                    }}
                  />

                  <label
                    htmlFor={`upload-${l.id}`}
                    className="absolute bottom-2 left-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-black/75 px-3 py-1.5 text-xs font-bold text-white backdrop-blur transition hover:bg-black/90"
                  >
                    <ImageIcon className="size-3.5" />
                    Change Image
                  </label>

                  <input
                    id={`upload-${l.id}`}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) =>
                      handleImageUpload(
                        l.id,
                        e.target.files?.[0]
                      )
                    }
                  />
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
                            CATEGORY_COLORS[l.category],
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
                                : x
                            )
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span>
                      {l.conditions.length} pet conditions
                    </span>

                    <span>{l.hours}</span>
                  </div>

                  {previewImages[l.id] && (
                    <div className="mt-3 flex items-center gap-2">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                        Custom image uploaded
                      </span>

                      <button
                        type="button"
                        onClick={() => resetImage(l.id)}
                        className="text-xs font-bold text-muted-foreground underline hover:text-foreground"
                      >
                        Restore original
                      </button>
                    </div>
                  )}
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
    </>
  );
}
