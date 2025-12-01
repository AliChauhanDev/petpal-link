import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import PetCard from "@/components/PetCard";
import FilterBar, { FilterState } from "@/components/FilterBar";
import ContactModal from "@/components/ContactModal";
import { Heart, Plus, Loader2, Phone } from "lucide-react";
import { format } from "date-fns";

interface FoundReport {
  id: string;
  pet_name: string | null;
  pet_type: string;
  description: string | null;
  found_location: string;
  found_date: string;
  contact_phone: string;
  contact_email: string | null;
  image_url: string | null;
  status: string;
  created_at: string;
  user_id: string;
}

export default function FoundPets() {
  const { user } = useAuth();
  const [reports, setReports] = useState<FoundReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    petType: "all",
    sortBy: "newest",
  });
  const [contactModal, setContactModal] = useState<{
    open: boolean;
    contact: { name: string; phone: string };
    petName: string;
  }>({
    open: false,
    contact: { name: "", phone: "" },
    petName: "",
  });
  const [finderProfiles, setFinderProfiles] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data, error } = await supabase
          .from("found_reports")
          .select("*")
          .eq("status", "active")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setReports(data || []);

        // Fetch finder profiles for names
        if (data && data.length > 0) {
          const userIds = [...new Set(data.map(r => r.user_id))];
          const { data: profiles } = await supabase
            .from("profiles")
            .select("user_id, full_name")
            .in("user_id", userIds);
          
          if (profiles) {
            const profileMap: Record<string, string> = {};
            profiles.forEach(p => {
              profileMap[p.user_id] = p.full_name || "Finder";
            });
            setFinderProfiles(profileMap);
          }
        }
      } catch (error) {
        console.error("Error fetching found reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const filteredReports = useMemo(() => {
    let result = [...reports];

    if (filters.petType !== "all") {
      result = result.filter((r) => r.pet_type === filters.petType);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (r) =>
          r.pet_name?.toLowerCase().includes(searchLower) ||
          r.description?.toLowerCase().includes(searchLower) ||
          r.found_location.toLowerCase().includes(searchLower)
      );
    }

    switch (filters.sortBy) {
      case "oldest":
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case "name_asc":
        result.sort((a, b) => (a.pet_name || "Unknown").localeCompare(b.pet_name || "Unknown"));
        break;
      case "name_desc":
        result.sort((a, b) => (b.pet_name || "Unknown").localeCompare(a.pet_name || "Unknown"));
        break;
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [reports, filters]);

  const handleContact = (report: FoundReport) => {
    setContactModal({
      open: true,
      contact: {
        name: finderProfiles[report.user_id] || "Finder",
        phone: report.contact_phone,
      },
      petName: report.pet_name || "Unknown Pet",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-teal-light rounded-xl flex items-center justify-center">
              <Heart className="w-7 h-7 text-teal" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">Found Pets</h1>
              <p className="text-muted-foreground">
                {reports.length} pet{reports.length !== 1 ? "s" : ""} looking for their owners
              </p>
            </div>
          </div>
          {user && (
            <Link to="/report-found">
              <Button variant="teal">
                <Plus className="w-4 h-4" />
                Report Found Pet
              </Button>
            </Link>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-display font-bold text-foreground mb-2">No found pet reports</h2>
            <p className="text-muted-foreground mb-6">Found a stray pet? Report it to help find the owner!</p>
            {user && (
              <Link to="/report-found">
                <Button variant="teal" size="lg">
                  <Plus className="w-4 h-4" />
                  Report a Found Pet
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <>
            <FilterBar onFilterChange={setFilters} />
            
            {filteredReports.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No reports match your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReports.map((report, index) => (
                  <div key={report.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="bg-card rounded-2xl border-2 border-accent/50 overflow-hidden hover:shadow-lg transition-all">
                      <PetCard
                        pet={{
                          id: report.id,
                          name: report.pet_name || "Unknown",
                          pet_type: report.pet_type,
                          description: report.description,
                          image_url: report.image_url,
                        }}
                        variant="found"
                        extraInfo={{
                          location: report.found_location,
                          date: format(new Date(report.found_date), "MMM d, yyyy"),
                        }}
                      />
                      <div className="px-5 pb-5">
                        <Button 
                          variant="teal" 
                          className="w-full"
                          onClick={() => handleContact(report)}
                        >
                          <Phone className="w-4 h-4" />
                          Contact Finder
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />

      <ContactModal
        open={contactModal.open}
        onOpenChange={(open) => setContactModal((prev) => ({ ...prev, open }))}
        contact={contactModal.contact}
        petName={contactModal.petName}
        variant="found"
      />
    </div>
  );
}
