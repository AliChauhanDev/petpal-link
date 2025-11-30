import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  type: "lost" | "found" | "pet";
  description?: string;
  imageUrl?: string;
}

interface MapViewProps {
  markers?: MapMarker[];
  onMarkerClick?: (marker: MapMarker) => void;
  center?: [number, number];
  zoom?: number;
  height?: string;
  interactive?: boolean;
  onLocationSelect?: (lat: number, lng: number, address: string) => void;
}

export default function MapView({
  markers = [],
  onMarkerClick,
  center = [-73.985, 40.748],
  zoom = 11,
  height = "400px",
  interactive = true,
  onLocationSelect,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapboxToken, setMapboxToken] = useState("");
  const [tokenSubmitted, setTokenSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    setLoading(true);
    mapboxgl.accessToken = mapboxToken;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center,
        zoom,
        interactive,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      if (onLocationSelect) {
        map.current.on("click", async (e) => {
          const { lng, lat } = e.lngLat;
          try {
            const response = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxToken}`
            );
            const data = await response.json();
            const address = data.features[0]?.place_name || "Unknown location";
            onLocationSelect(lat, lng, address);
          } catch (error) {
            onLocationSelect(lat, lng, `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
          }
        });
      }

      map.current.on("load", () => {
        setLoading(false);
        setTokenSubmitted(true);
        addMarkers();
      });

      map.current.on("error", () => {
        setLoading(false);
        setTokenSubmitted(false);
      });
    } catch (error) {
      setLoading(false);
      setTokenSubmitted(false);
    }
  };

  const addMarkers = () => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    markers.forEach((markerData) => {
      const el = document.createElement("div");
      el.className = "custom-marker";
      el.innerHTML = `
        <div class="w-10 h-10 rounded-full flex items-center justify-center shadow-lg cursor-pointer transform hover:scale-110 transition-transform ${
          markerData.type === "lost"
            ? "bg-destructive"
            : markerData.type === "found"
            ? "bg-accent"
            : "bg-primary"
        }">
          <span class="text-white text-lg">${
            markerData.type === "lost" ? "❗" : markerData.type === "found" ? "✓" : "🐾"
          }</span>
        </div>
      `;

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2">
          ${
            markerData.imageUrl
              ? `<img src="${markerData.imageUrl}" alt="${markerData.title}" class="w-full h-24 object-cover rounded-lg mb-2" />`
              : ""
          }
          <h3 class="font-bold text-sm">${markerData.title}</h3>
          <p class="text-xs text-gray-600 capitalize">${markerData.type}</p>
          ${markerData.description ? `<p class="text-xs mt-1">${markerData.description}</p>` : ""}
        </div>
      `);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([markerData.lng, markerData.lat])
        .setPopup(popup)
        .addTo(map.current!);

      if (onMarkerClick) {
        el.addEventListener("click", () => onMarkerClick(markerData));
      }

      markersRef.current.push(marker);
    });

    // Fit bounds to markers if there are any
    if (markers.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      markers.forEach((m) => bounds.extend([m.lng, m.lat]));
      map.current.fitBounds(bounds, { padding: 50 });
    }
  };

  useEffect(() => {
    if (tokenSubmitted && map.current) {
      addMarkers();
    }
  }, [markers, tokenSubmitted]);

  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  if (!tokenSubmitted) {
    return (
      <div
        className="bg-muted rounded-xl flex flex-col items-center justify-center p-8"
        style={{ height }}
      >
        <MapPin className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="font-display font-bold text-foreground mb-2">Map Integration</h3>
        <p className="text-muted-foreground text-sm text-center mb-4 max-w-sm">
          Enter your Mapbox public token to enable the map. Get one free at{" "}
          <a
            href="https://mapbox.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            mapbox.com
          </a>
        </p>
        <div className="flex gap-2 w-full max-w-sm">
          <Input
            type="text"
            placeholder="Enter Mapbox public token"
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
          />
          <Button onClick={initializeMap} disabled={!mapboxToken || loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Load Map"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden" style={{ height }}>
      <div ref={mapContainer} className="absolute inset-0" />
      {loading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
}
