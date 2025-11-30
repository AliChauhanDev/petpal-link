import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MapView from "@/components/MapView";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Loader2, AlertTriangle, Heart, Filter } from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  type: "lost" | "found" | "pet";
  description?: string;
  imageUrl?: string;
}

interface ReportDetails {
  id: string;
  pet_name: string;
  pet_type: string;
  location: string;
  date: string;
  description: string | null;
  image_url: string | null;
  type: "lost" | "found";
}

// Geocode locations (mock - in production use a real geocoding API)
const mockGeocode = (location: string): { lat: number; lng: number } | null => {
  // Simple mock based on common city names
  const locations: Record<string, { lat: number; lng: number }> = {
    "new york": { lat: 40.7128, lng: -74.006 },
    "los angeles": { lat: 34.0522, lng: -118.2437 },
    "chicago": { lat: 41.8781, lng: -87.6298 },
    "houston": { lat: 29.7604, lng: -95.3698 },
    "phoenix": { lat: 33.4484, lng: -112.074 },
    "philadelphia": { lat: 39.9526, lng: -75.1652 },
    "san antonio": { lat: 29.4241, lng: -98.4936 },
    "san diego": { lat: 32.7157, lng: -117.1611 },
    "dallas": { lat: 32.7767, lng: -96.797 },
    "san jose": { lat: 37.3382, lng: -121.8863 },
  };

  const lowerLocation = location.toLowerCase();
  for (const [city, coords] of Object.entries(locations)) {
    if (lowerLocation.includes(city)) {
      return coords;
    }
  }

  // Return random coordinates around US if no match
  return {
    lat: 37 + Math.random() * 10,
    lng: -100 + Math.random() * 30,
  };
};

export default function MapSearch() {
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ReportDetails | null>(null);
  const [filterType, setFilterType] = useState<"all" | "lost" | "found">("all");

  useEffect(() => {
    const fetchReports = async () => {
      const [lostResult, foundResult] = await Promise.all([
        supabase.from("lost_reports").select("*").eq("status", "active"),
        supabase.from("found_reports").select("*").eq("status", "active"),
      ]);

      const newMarkers: MapMarker[] = [];

      lostResult.data?.forEach((report) => {
        const coords = mockGeocode(report.last_seen_location);
        if (coords) {
          newMarkers.push({
            id: report.id,
            lat: coords.lat + (Math.random() - 0.5) * 0.02,
            lng: coords.lng + (Math.random() - 0.5) * 0.02,
            title: report.pet_name,
            type: "lost",
            description: report.last_seen_location,
            imageUrl: report.image_url || undefined,
          });
        }
      });

      foundResult.data?.forEach((report) => {
        const coords = mockGeocode(report.found_location);
        if (coords) {
          newMarkers.push({
            id: report.id,
            lat: coords.lat + (Math.random() - 0.5) * 0.02,
            lng: coords.lng + (Math.random() - 0.5) * 0.02,
            title: report.pet_name || "Found Pet",
            type: "found",
            description: report.found_location,
            imageUrl: report.image_url || undefined,
          });
        }
      });

      setMarkers(newMarkers);
      setLoading(false);
    };

    fetchReports();
  }, []);

  const filteredMarkers =
    filterType === "all" ? markers : markers.filter((m) => m.type === filterType);

  const handleMarkerClick = async (marker: MapMarker) => {
    const table = marker.type === "lost" ? "lost_reports" : "found_reports";
    const { data } = await supabase.from(table).select("*").eq("id", marker.id).single();

    if (data) {
      const location = marker.type === "lost" 
        ? (data as any).last_seen_location 
        : (data as any).found_location;
      const date = marker.type === "lost" 
        ? (data as any).last_seen_date 
        : (data as any).found_date;
      setSelectedReport({
        id: data.id,
        pet_name: data.pet_name || "Found Pet",
        pet_type: data.pet_type,
        location,
        date,
        description: data.description,
        image_url: data.image_url,
        type: marker.type as "lost" | "found",
      });
    }
  };

  const petTypeEmojis: Record<string, string> = {
    dog: "🐕",
    cat: "🐱",
    bird: "🐦",
    rabbit: "🐰",
    fish: "🐟",
    hamster: "🐹",
    other: "🐾",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Map Search</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            View lost and found pet reports on an interactive map
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <Select
              value={filterType}
              onValueChange={(v) => setFilterType(v as "all" | "lost" | "found")}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reports</SelectItem>
                <SelectItem value="lost">Lost Pets</SelectItem>
                <SelectItem value="found">Found Pets</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-destructive rounded-full" />
              <span className="text-muted-foreground">Lost ({markers.filter((m) => m.type === "lost").length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-accent rounded-full" />
              <span className="text-muted-foreground">Found ({markers.filter((m) => m.type === "found").length})</span>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {loading ? (
              <div
                className="bg-muted rounded-xl flex items-center justify-center"
                style={{ height: "500px" }}
              >
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
              </div>
            ) : (
              <MapView
                markers={filteredMarkers}
                onMarkerClick={handleMarkerClick}
                height="500px"
              />
            )}
          </div>

          {/* Report Details Panel */}
          <div className="bg-card rounded-2xl border border-border p-6">
            {selectedReport ? (
              <div className="animate-fade-in">
                <Badge
                  className={`mb-4 ${
                    selectedReport.type === "lost"
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-accent text-accent-foreground"
                  }`}
                >
                  {selectedReport.type === "lost" ? (
                    <AlertTriangle className="w-3 h-3 mr-1" />
                  ) : (
                    <Heart className="w-3 h-3 mr-1" />
                  )}
                  {selectedReport.type.toUpperCase()}
                </Badge>

                {selectedReport.image_url ? (
                  <img
                    src={selectedReport.image_url}
                    alt={selectedReport.pet_name}
                    className="w-full h-48 object-cover rounded-xl mb-4"
                  />
                ) : (
                  <div className="w-full h-48 bg-muted rounded-xl mb-4 flex items-center justify-center text-6xl">
                    {petTypeEmojis[selectedReport.pet_type] || "🐾"}
                  </div>
                )}

                <h3 className="font-display font-bold text-xl text-foreground mb-2">
                  {selectedReport.pet_name}
                </h3>

                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground capitalize">
                    <strong>Type:</strong> {selectedReport.pet_type}
                  </p>
                  <p className="text-muted-foreground flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {selectedReport.location}
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Date:</strong> {format(new Date(selectedReport.date), "MMMM d, yyyy")}
                  </p>
                  {selectedReport.description && (
                    <p className="text-muted-foreground">
                      <strong>Description:</strong> {selectedReport.description}
                    </p>
                  )}
                </div>

                <Button
                  className="w-full mt-4"
                  variant="hero"
                  onClick={() =>
                    window.location.href =
                      selectedReport.type === "lost" ? "/lost-pets" : "/found-pets"
                  }
                >
                  View Full Report
                </Button>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Click on a marker to view details</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
