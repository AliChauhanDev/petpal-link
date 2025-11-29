import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PetCard from "@/components/PetCard";
import FilterBar, { FilterState } from "@/components/FilterBar";
import { PawPrint, Plus, Loader2 } from "lucide-react";

interface Pet {
  id: string;
  name: string;
  pet_type: string;
  breed: string | null;
  age: string | null;
  description: string | null;
  image_url: string | null;
  color: string | null;
  gender: string | null;
  is_lost: boolean;
  created_at: string;
}

export default function MyPets() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    petType: "all",
    sortBy: "newest",
  });

  const fetchPets = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("pets")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPets(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load pets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [user]);

  const handleDelete = async (petId: string) => {
    try {
      const { error } = await supabase.from("pets").delete().eq("id", petId);
      if (error) throw error;

      setPets((prev) => prev.filter((p) => p.id !== petId));
      toast({
        title: "Pet removed",
        description: "Your pet has been removed from the list.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete pet",
        variant: "destructive",
      });
    }
  };

  const filteredPets = useMemo(() => {
    let result = [...pets];

    // Filter by pet type
    if (filters.petType !== "all") {
      result = result.filter((p) => p.pet_type === filters.petType);
    }

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.breed?.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    switch (filters.sortBy) {
      case "oldest":
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case "name_asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name_desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [pets, filters]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center">
              <PawPrint className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">My Pets</h1>
              <p className="text-muted-foreground">
                {pets.length} pet{pets.length !== 1 ? "s" : ""} registered
              </p>
            </div>
          </div>
          <Link to="/add-pet">
            <Button variant="hero">
              <Plus className="w-4 h-4" />
              Add Pet
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : pets.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <PawPrint className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-display font-bold text-foreground mb-2">No pets yet</h2>
            <p className="text-muted-foreground mb-6">Start by adding your first pet to PetLink</p>
            <Link to="/add-pet">
              <Button variant="hero" size="lg">
                <Plus className="w-4 h-4" />
                Add Your First Pet
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <FilterBar onFilterChange={setFilters} />
            
            {filteredPets.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No pets match your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPets.map((pet, index) => (
                  <div key={pet.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <PetCard pet={pet} onDelete={handleDelete} showActions />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
