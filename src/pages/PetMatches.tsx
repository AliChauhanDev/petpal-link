import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PetMatchCard from "@/components/PetMatchCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Sparkles, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Match {
  id: string;
  match_score: number;
  status: string;
  lost_report: {
    id: string;
    pet_name: string;
    pet_type: string;
    last_seen_location: string;
    last_seen_date: string;
    image_url: string | null;
    user_id: string;
  };
  found_report: {
    id: string;
    pet_name: string | null;
    pet_type: string;
    found_location: string;
    found_date: string;
    image_url: string | null;
    user_id: string;
  };
}

export default function PetMatches() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      // Fetch all matches with related data
      const { data: matchData } = await supabase
        .from("pet_matches")
        .select("*")
        .order("match_score", { ascending: false });

      if (!matchData || matchData.length === 0) {
        setLoading(false);
        return;
      }

      // Fetch related reports
      const lostIds = [...new Set(matchData.map((m) => m.lost_report_id))];
      const foundIds = [...new Set(matchData.map((m) => m.found_report_id))];

      const [lostReports, foundReports] = await Promise.all([
        supabase.from("lost_reports").select("*").in("id", lostIds),
        supabase.from("found_reports").select("*").in("id", foundIds),
      ]);

      const lostMap = new Map(lostReports.data?.map((r) => [r.id, r]) || []);
      const foundMap = new Map(foundReports.data?.map((r) => [r.id, r]) || []);

      const enrichedMatches: Match[] = matchData
        .map((m) => {
          const lost = lostMap.get(m.lost_report_id);
          const found = foundMap.get(m.found_report_id);
          if (!lost || !found) return null;
          return {
            id: m.id,
            match_score: m.match_score,
            status: m.status,
            lost_report: {
              id: lost.id,
              pet_name: lost.pet_name,
              pet_type: lost.pet_type as any,
              last_seen_location: lost.last_seen_location,
              last_seen_date: lost.last_seen_date,
              image_url: lost.image_url,
              user_id: lost.user_id,
            },
            found_report: {
              id: found.id,
              pet_name: found.pet_name,
              pet_type: found.pet_type as any,
              found_location: found.found_location,
              found_date: found.found_date,
              image_url: found.image_url,
              user_id: found.user_id,
            },
          };
        })
        .filter((m): m is Match => m !== null);

      // Filter to show user's matches if logged in
      if (user) {
        const userMatches = enrichedMatches.filter(
          (m) => m.lost_report.user_id === user.id || m.found_report.user_id === user.id
        );
        setMatches(userMatches.length > 0 ? userMatches : enrichedMatches.slice(0, 10));
      } else {
        setMatches(enrichedMatches.slice(0, 10));
      }

      setLoading(false);
    };

    fetchMatches();
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Pet Matches</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Our AI automatically matches lost pets with found reports based on type, location, and timing
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-display font-bold text-foreground mb-2">
              No Matches Found Yet
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              When lost pets match with found reports, they'll appear here. Report a lost or found pet
              to start matching!
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/report-lost">
                <Button variant="outline">Report Lost Pet</Button>
              </Link>
              <Link to="/report-found">
                <Button variant="hero">Report Found Pet</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matches.map((match, index) => (
              <div
                key={match.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <PetMatchCard match={match} />
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
