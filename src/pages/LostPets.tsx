import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import PetCard from "@/components/PetCard";
import { AlertTriangle, Plus, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface LostReport {
  id: string;
  pet_name: string;
  pet_type: string;
  description: string | null;
  last_seen_location: string;
  last_seen_date: string;
  contact_phone: string;
  contact_email: string | null;
  image_url: string | null;
  status: string;
  reward: string | null;
  created_at: string;
}

export default function LostPets() {
  const { user } = useAuth();
  const [reports, setReports] = useState<LostReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data, error } = await supabase
          .from("lost_reports")
          .select("*")
          .eq("status", "active")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setReports(data || []);
      } catch (error) {
        console.error("Error fetching lost reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-amber-light rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-amber" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">Lost Pets</h1>
              <p className="text-muted-foreground">Help reunite lost pets with their owners</p>
            </div>
          </div>
          {user && (
            <Link to="/report-lost">
              <Button variant="hero">
                <Plus className="w-4 h-4" />
                Report Lost Pet
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
              <AlertTriangle className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-display font-bold text-foreground mb-2">No lost pet reports</h2>
            <p className="text-muted-foreground mb-6">That's great news! All pets seem to be safe.</p>
            {user && (
              <Link to="/report-lost">
                <Button variant="hero" size="lg">
                  <Plus className="w-4 h-4" />
                  Report a Lost Pet
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report, index) => (
              <div key={report.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <PetCard
                  pet={{
                    id: report.id,
                    name: report.pet_name,
                    pet_type: report.pet_type,
                    description: report.description,
                    image_url: report.image_url,
                  }}
                  variant="lost"
                  extraInfo={{
                    location: report.last_seen_location,
                    contact: report.contact_phone,
                    date: format(new Date(report.last_seen_date), "MMM d, yyyy"),
                    reward: report.reward || undefined,
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
