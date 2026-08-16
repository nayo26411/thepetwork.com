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
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.google?.maps?.Map) return Promise.resolve(window.google);

  return new Promise((resolve, reject) => {
    const existing = document.getElementById("petwork-gmaps") as HTMLScriptElement | null;
    const prev = window[CALLBACK];
    window[CALLBACK] = () => {
      prev?.();
      resolve(window.google);
    };
    if (existing) return;

    const key = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY"];
    const channel = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID"] ?? "";
    if (!key) {
      reject(new Error("Google Maps key missing"));
      return;
    }
    const script = document.createElement("script");
    script.id = "petwork-gmaps";
    script.async = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&callback=${CALLBACK}&channel=${channel}`;
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });
}

function pinIcon(color: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="46" viewBox="0 0 36 46">
    <path d="M18 1C9.7 1 3 7.7 3 16c0 10.9 13 27 14.1 28.3a1.2 1.2 0 0 0 1.8 0C20 43 33 26.9 33 16 33 7.7 26.3 1 18 1z" fill="${color}" stroke="#FFF7EC" stroke-width="2.5"/>
    <circle cx="18" cy="15.5" r="5.4" fill="#FFF7EC"/>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function PetMap({
  places,
  onSelect,
  selectedId,
}: {
  places: PetPlace[];
  onSelect: (place: PetPlace) => void;
  selectedId?: string | undefined;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const selectRef = useRef(onSelect);
  selectRef.current = onSelect;
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    window.gm_authFailure = () => {
      setError(
        `This map isn't authorised for ${typeof window === "undefined" ? "this domain" : window.location.hostname} yet.`,
      );
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps()
      .then((google) => {
        if (cancelled || !containerRef.current) return;
        mapRef.current = new google.maps.Map(containerRef.current, {
          center: { lat: 28.5665, lng: 77.2431 },
          zoom: 11,
          disableDefaultUI: false,
          streetViewControl: false,
          mapTypeControl: false,
          styles: [
            { elementType: "geometry", stylers: [{ color: "#f4ece0" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#6b533d" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#fdf8f0" }] },
            { featureType: "water", stylers: [{ color: "#cfdcd2" }] },
            { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#dfe6d3" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#fbf3e6" }] },
            { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#f2e2ca" }] },
            { featureType: "poi.business", stylers: [{ visibility: "off" }] },
          ],
        });
        setReady(true);
      })
      .catch((e: Error) => setError(e.message));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready || !mapRef.current || !window.google) return;
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = places.map((place) => {
      const marker = new window.google.maps.Marker({
        position: { lat: place.lat, lng: place.lng },
        map: mapRef.current,
        title: place.name,
        icon: {
          url: pinIcon(CATEGORY_COLORS[place.category]),
          scaledSize: new window.google.maps.Size(32, 41),
        },
        animation: selectedId === place.id ? window.google.maps.Animation.BOUNCE : null,
      });
      marker.addListener("click", () => {
        selectRef.current(place);
        mapRef.current.panTo({ lat: place.lat, lng: place.lng });
      });
      return marker;
    });
  }, [places, ready, selectedId]);

  if (error) {
    return (
      <div className="grid h-full min-h-[420px] place-items-center rounded-2xl border border-border bg-oat p-8 text-center">
        <div>
          <p className="text-sm font-bold text-foreground">The map couldn&apos;t load right now.</p>
          <p className="mt-1.5 text-sm text-muted-foreground">{error}</p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Every listing, address and pet rule is still right here in the list beside the map.
          </p>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} className="h-full min-h-[420px] w-full rounded-2xl" />;
}
