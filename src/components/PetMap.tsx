import { useEffect, useRef, useState } from "react";
import { CATEGORY_COLORS, type PetPlace } from "@/data/locations";

declare global {
  interface Window {
    google?: any;
    __petworkMapReady?: () => void;
    gm_authFailure?: () => void;
  }
}

const CALLBACK = "__petworkMapReady";

function loadGoogleMaps(): Promise<any> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("No window"));
  }

  if (window.google?.maps?.Map) {
    return Promise.resolve(window.google);
  }

  return new Promise((resolve, reject) => {
    const existing = document.getElementById(
      "petwork-gmaps",
    ) as HTMLScriptElement | null;

    const previousCallback = window[CALLBACK];

    window[CALLBACK] = () => {
      previousCallback?.();

      if (window.google?.maps?.Map) {
        resolve(window.google);
      } else {
        reject(new Error("Google Maps failed to initialise."));
      }
    };

    if (existing) {
      return;
    }

    const key =
      import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY"];

    if (!key) {
      reject(new Error("Google Maps key missing."));
      return;
    }

    const script = document.createElement("script");

    script.id = "petwork-gmaps";
    script.async = true;
    script.defer = true;

    script.src =
      `https://maps.googleapis.com/maps/api/js` +
      `?key=${key}` +
      `&loading=async` +
      `&callback=${CALLBACK}`;

    script.onerror = () => {
      reject(new Error("Failed to load Google Maps."));
    };

    document.head.appendChild(script);
  });
}

function pinIcon(color: string) {
  const svg = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="46"
      viewBox="0 0 36 46"
    >
      <path
        d="M18 1C9.7 1 3 7.7 3 16c0 10.9 13 27 14.1 28.3a1.2 1.2 0 0 0 1.8 0C20 43 33 26.9 33 16 33 7.7 26.3 1 18 1z"
        fill="${color}"
        stroke="#FFF7EC"
        stroke-width="2.5"
      />
      <circle
        cx="18"
        cy="15.5"
        r="5.4"
        fill="#FFF7EC"
      />
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function PetMap({
  places,
  onSelect,
  selectedId,
}: {
  places: PetPlace[];
  onSelect: (place: PetPlace) => void;
  selectedId?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const selectRef = useRef(onSelect);

  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  selectRef.current = onSelect;

  /* ---------------------------------------------
     GOOGLE MAPS AUTH ERROR
  --------------------------------------------- */

  useEffect(() => {
    window.gm_authFailure = () => {
      setError(
        `Google Maps isn't authorised for ${
          typeof window !== "undefined"
            ? window.location.hostname
            : "this domain"
        }.`,
      );
    };

    return () => {
      window.gm_authFailure = undefined;
    };
  }, []);

  /* ---------------------------------------------
     LOAD MAP ONCE
  --------------------------------------------- */

  useEffect(() => {
    let cancelled = false;

    loadGoogleMaps()
      .then((google) => {
        if (cancelled || !containerRef.current) {
          return;
        }

        mapRef.current = new google.maps.Map(containerRef.current, {
          center: {
            lat: 28.5665,
            lng: 77.2431,
          },

          zoom: 11,

          /*
           * IMPORTANT:
           * Keep Google's controls from taking over
           * the entire map.
           */
          disableDefaultUI: true,

          /*
           * Keep only the controls that are actually
           * useful to users.
           */
          zoomControl: true,
          fullscreenControl: true,

          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM,
          },

          fullscreenControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP,
          },

          streetViewControl: false,
          mapTypeControl: false,
          rotateControl: false,
          scaleControl: false,

          gestureHandling: "greedy",

          /*
           * Prevent Google's map from looking oversized
           * compared with the listing panel.
           */
          minZoom: 9,
          maxZoom: 18,

          styles: [
            {
              elementType: "geometry",
              stylers: [{ color: "#f4ece0" }],
            },
            {
              elementType: "labels.text.fill",
              stylers: [{ color: "#6b533d" }],
            },
            {
              elementType: "labels.text.stroke",
              stylers: [{ color: "#fdf8f0" }],
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#cfdcd2" }],
            },
            {
              featureType: "poi.park",
              elementType: "geometry",
              stylers: [{ color: "#dfe6d3" }],
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ color: "#fbf3e6" }],
            },
            {
              featureType: "road.arterial",
              elementType: "geometry",
              stylers: [{ color: "#f2e2ca" }],
            },
            {
              featureType: "poi.business",
              stylers: [{ visibility: "off" }],
            },
          ],
        });

        setReady(true);
      })
      .catch((e: Error) => {
        if (!cancelled) {
          setError(e.message);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /* ---------------------------------------------
     UPDATE MARKERS
  --------------------------------------------- */

  useEffect(() => {
    if (!ready || !mapRef.current || !window.google) {
      return;
    }

    /*
     * Remove old markers.
     */
    markersRef.current.forEach((marker) => {
      marker.setMap(null);
    });

    markersRef.current = [];

    /*
     * Add current markers.
     */
    markersRef.current = places.map((place) => {
      const isSelected = selectedId === place.id;

      const marker = new window.google.maps.Marker({
        position: {
          lat: place.lat,
          lng: place.lng,
        },

        map: mapRef.current,

        title: place.name,

        icon: {
          url: pinIcon(CATEGORY_COLORS[place.category]),

          scaledSize: new window.google.maps.Size(
            isSelected ? 38 : 30,
            isSelected ? 49 : 38,
          ),

          anchor: new window.google.maps.Point(
            isSelected ? 19 : 15,
            isSelected ? 49 : 38,
          ),
        },

        zIndex: isSelected ? 1000 : 1,

        animation: isSelected
          ? window.google.maps.Animation.BOUNCE
          : undefined,
      });

      marker.addListener("click", () => {
        selectRef.current(place);

        mapRef.current?.panTo({
          lat: place.lat,
          lng: place.lng,
        });
      });

      return marker;
    });

    return () => {
      markersRef.current.forEach((marker) => {
        marker.setMap(null);
      });

      markersRef.current = [];
    };
  }, [places, ready, selectedId]);

  /* ---------------------------------------------
     ERROR STATE
  --------------------------------------------- */

  if (error) {
    return (
      <div className="grid h-full min-h-[420px] place-items-center rounded-2xl border border-border bg-oat p-8 text-center">
        <div className="max-w-md">
          <p className="text-sm font-bold text-foreground">
            The map couldn&apos;t load right now.
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            {error}
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            Every listing, address and pet rule is still available
            in the list beside the map.
          </p>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------
     MAP
  --------------------------------------------- */

  return (
    <div className="relative h-full min-h-[420px] w-full overflow-hidden rounded-2xl">
      <div
        ref={containerRef}
        className="absolute inset-0 h-full w-full"
      />

      {!ready && (
        <div className="absolute inset-0 grid place-items-center bg-oat">
          <div className="text-center">
            <div className="mx-auto size-8 animate-spin rounded-full border-2 border-caramel/30 border-t-caramel" />

            <p className="mt-3 text-sm font-semibold text-muted-foreground">
              Loading map…
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
