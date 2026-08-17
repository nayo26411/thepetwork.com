import { useEffect, useRef, useState } from "react";
import { CATEGORY_COLORS, type PetPlace } from "@/data/locations";

declare global {
  interface Window {
    google?: any;
    __petworkGoogleMapsReady?: () => void;
    gm_authFailure?: () => void;
  }
}

const GOOGLE_MAPS_CALLBACK = "__petworkGoogleMapsReady";

let googleMapsPromise: Promise<any> | null = null;

function loadGoogleMaps(): Promise<any> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps can only load in the browser."));
  }

  if (window.google?.maps?.Map) {
    return Promise.resolve(window.google);
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(
      "petwork-google-maps",
    ) as HTMLScriptElement | null;

    if (existingScript) {
      const check = window.setInterval(() => {
        if (window.google?.maps?.Map) {
          window.clearInterval(check);
          resolve(window.google);
        }
      }, 100);

      window.setTimeout(() => {
        window.clearInterval(check);

        if (!window.google?.maps?.Map) {
          googleMapsPromise = null;
          reject(
            new Error(
              "Google Maps loaded, but the Maps JavaScript API did not initialise.",
            ),
          );
        }
      }, 15000);

      return;
    }

    /*
     * IMPORTANT:
     *
     * This is now a normal Vite environment variable.
     *
     * Add this to your .env file:
     *
     * VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_BROWSER_KEY
     *
     * Do NOT use the old Lovable connector variables here.
     */
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      googleMapsPromise = null;

      reject(
        new Error(
          "Google Maps API key is missing. Add VITE_GOOGLE_MAPS_API_KEY to your .env file.",
        ),
      );

      return;
    }

    window[GOOGLE_MAPS_CALLBACK] = () => {
      if (window.google?.maps?.Map) {
        resolve(window.google);
      } else {
        googleMapsPromise = null;

        reject(
          new Error(
            "Google Maps loaded but the Maps JavaScript API is unavailable.",
          ),
        );
      }
    };

    window.gm_authFailure = () => {
      googleMapsPromise = null;

      reject(
        new Error(
          "Google Maps rejected the API key. Check that the Maps JavaScript API is enabled and that your API key allows this website.",
        ),
      );
    };

    const script = document.createElement("script");

    script.id = "petwork-google-maps";
    script.async = true;
    script.defer = true;

    script.src =
      "https://maps.googleapis.com/maps/api/js" +
      `?key=${encodeURIComponent(apiKey)}` +
      `&loading=async` +
      `&callback=${GOOGLE_MAPS_CALLBACK}`;

    script.onerror = () => {
      googleMapsPromise = null;

      reject(
        new Error(
          "Google Maps could not be loaded. Check your internet connection and Google Maps API key.",
        ),
      );
    };

    document.head.appendChild(script);
  });

  return googleMapsPromise;
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

  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  selectRef.current = onSelect;

  /*
   * Load Google Maps once.
   */
  useEffect(() => {
    let cancelled = false;

    loadGoogleMaps()
      .then((google) => {
        if (cancelled || !containerRef.current) {
          return;
        }

        mapRef.current = new google.maps.Map(
          containerRef.current,
          {
            center: {
              lat: 28.5665,
              lng: 77.2431,
            },

            zoom: 11,

            minZoom: 9,
            maxZoom: 18,

            gestureHandling: "greedy",

            disableDefaultUI: true,

            zoomControl: true,
            fullscreenControl: true,

            zoomControlOptions: {
              position:
                google.maps.ControlPosition.RIGHT_BOTTOM,
            },

            fullscreenControlOptions: {
              position:
                google.maps.ControlPosition.RIGHT_TOP,
            },

            streetViewControl: false,
            mapTypeControl: false,
            rotateControl: false,
            scaleControl: false,

            styles: [
              {
                elementType: "geometry",
                stylers: [
                  {
                    color: "#f4ece0",
                  },
                ],
              },

              {
                elementType: "labels.text.fill",
                stylers: [
                  {
                    color: "#6b533d",
                  },
                ],
              },

              {
                elementType: "labels.text.stroke",
                stylers: [
                  {
                    color: "#fdf8f0",
                  },
                ],
              },

              {
                featureType: "water",
                elementType: "geometry",
                stylers: [
                  {
                    color: "#cfdcd2",
                  },
                ],
              },

              {
                featureType: "poi.park",
                elementType: "geometry",
                stylers: [
                  {
                    color: "#dfe6d3",
                  },
                ],
              },

              {
                featureType: "road",
                elementType: "geometry",
                stylers: [
                  {
                    color: "#fbf3e6",
                  },
                ],
              },

              {
                featureType: "road.arterial",
                elementType: "geometry",
                stylers: [
                  {
                    color: "#f2e2ca",
                  },
                ],
              },

              {
                featureType: "poi.business",
                stylers: [
                  {
                    visibility: "off",
                  },
                ],
              },
            ],
          },
        );

        setReady(true);
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * Create / refresh markers.
   */
  useEffect(() => {
    if (
      !ready ||
      !mapRef.current ||
      !window.google?.maps
    ) {
      return;
    }

    /*
     * Remove old markers first.
     */
    markersRef.current.forEach((marker) => {
      marker.setMap(null);
    });

    markersRef.current = [];

    /*
     * Add current markers.
     */
    markersRef.current = places.map((place) => {
      const isSelected =
        selectedId === place.id;

      const marker =
        new window.google.maps.Marker({
          position: {
            lat: place.lat,
            lng: place.lng,
          },

          map: mapRef.current,

          title: place.name,

          icon: {
            url: pinIcon(
              CATEGORY_COLORS[place.category],
            ),

            scaledSize:
              new window.google.maps.Size(
                isSelected ? 38 : 30,
                isSelected ? 49 : 38,
              ),

            anchor:
              new window.google.maps.Point(
                isSelected ? 19 : 15,
                isSelected ? 49 : 38,
              ),
          },

          zIndex: isSelected ? 1000 : 1,

          animation: isSelected
            ? window.google.maps.Animation.BOUNCE
            : null,
        });

      marker.addListener(
        "click",
        () => {
          selectRef.current(place);

          mapRef.current?.panTo({
            lat: place.lat,
            lng: place.lng,
          });
        },
      );

      return marker;
    });

    return () => {
      markersRef.current.forEach((marker) => {
        marker.setMap(null);
      });

      markersRef.current = [];
    };
  }, [places, ready, selectedId]);

  /*
   * Error state.
   */
  if (error) {
    return (
      <div className="grid h-full min-h-[420px] place-items-center rounded-2xl border border-border bg-oat p-8 text-center">
        <div className="max-w-md">
          <p className="text-base font-bold text-foreground">
            The map couldn&apos;t load.
          </p>

          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {error}
          </p>

          <p className="mt-3 text-xs text-muted-foreground">
            Your locations are still available in the list beside the map.
          </p>
        </div>
      </div>
    );
  }

  /*
   * Map.
   */
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
