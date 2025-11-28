import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import PetCard from "@/components/PetCard";
import { Search, Loader2, PawPrint } from "lucide-react";

const petTypes = [
  { value: "all", label: "All Types" },
  { value: "dog", label: "🐕 Dog" },
  { value: "cat", label: "🐱 Cat" },
  { value: "bird", label: "🐦 Bird" },
  { value: "rabbit", label: "🐰 Rabbit" },
  { value: "fish", label: "🐟 Fish" },
  { value: "hamster", label: "🐹 Hamster" },
  { value: "other", label: "🐾 Other" },
];

interface SearchResult {
  id: string;
  name: string;
  pet_type: string;
  breed?: string | null;
  description?: string | null;
  image_url?: string | null;
  color?: string | null;
  source: "pet" | "lost" | "found";
}

export default function SearchPets() {
  const [query, setQuery] = useState("");
  const [petType, setPetType] = useState("all");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);
    
    try {
      const searchResults: SearchResult[] = [];

      // Search registered pets
      let petsQuery = supabase.from("pets").select("id, name, pet_type, breed, description, image_url, color");
      if (petType !== "all") {
        petsQuery = petsQuery.eq("pet_type", petType as "dog" | "cat" | "bird" | "rabbit" | "fish" | "hamster" | "other");
      }
      if (query) {
        petsQuery = petsQuery.or(`name.ilike.%${query}%,breed.ilike.%${query}%,description.ilike.%${query}%`);
      }
      const { data: pets } = await petsQuery;
      pets?.forEach((p) => searchResults.push({ ...p, source: "pet" }));

      // Search lost reports
      let lostQuery = supabase.from("lost_reports").select("id, pet_name, pet_type, description, image_url").eq("status", "active");
      if (petType !== "all") {
        lostQuery = lostQuery.eq("pet_type", petType as "dog" | "cat" | "bird" | "rabbit" | "fish" | "hamster" | "other");
      }
      if (query) {
        lostQuery = lostQuery.or(`pet_name.ilike.%${query}%,description.ilike.%${query}%`);
      }
      const { data: lost } = await lostQuery;
      lost?.forEach((l) => searchResults.push({ id: l.id, name: l.pet_name, pet_type: l.pet_type, description: l.description, image_url: l.image_url, source: "lost" }));

      // Search found reports
      let foundQuery = supabase.from("found_reports").select("id, pet_name, pet_type, description, image_url").eq("status", "active");
      if (petType !== "all") {
        foundQuery = foundQuery.eq("pet_type", petType as "dog" | "cat" | "bird" | "rabbit" | "fish" | "hamster" | "other");
      }
      if (query) {
        foundQuery = foundQuery.or(`pet_name.ilike.%${query}%,description.ilike.%${query}%`);
      }
      const { data: found } = await foundQuery;
      found?.forEach((f) => searchResults.push({ id: f.id, name: f.pet_name || "Unknown", pet_type: f.pet_type, description: f.description, image_url: f.image_url, source: "found" }));

      setResults(searchResults);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 animate-fade-in">
          <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Search Pets</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Search through registered pets, lost reports, and found reports to find matching pets
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-2xl mx-auto mb-12 animate-fade-in">
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by name, breed, description..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="h-12"
                />
              </div>
              <Select value={petType} onValueChange={setPetType}>
                <SelectTrigger className="w-full md:w-40 h-12">
                  <SelectValue placeholder="Pet Type" />
                </SelectTrigger>
                <SelectContent>
                  {petTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="hero" size="lg" onClick={handleSearch} disabled={loading}>
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Search
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[30vh]">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : searched && results.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <PawPrint className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-display font-bold text-foreground mb-2">No results found</h2>
            <p className="text-muted-foreground">Try different search terms or filters</p>
          </div>
        ) : results.length > 0 ? (
          <div>
            <p className="text-muted-foreground mb-6">{results.length} result(s) found</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((result, index) => (
                <div key={`${result.source}-${result.id}`} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                  <PetCard
                    pet={{
                      id: result.id,
                      name: result.name,
                      pet_type: result.pet_type,
                      breed: result.breed,
                      description: result.description,
                      image_url: result.image_url,
                      color: result.color,
                    }}
                    variant={result.source === "lost" ? "lost" : result.source === "found" ? "found" : "default"}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 animate-fade-in">
            <p className="text-muted-foreground">Enter a search term to find pets</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
