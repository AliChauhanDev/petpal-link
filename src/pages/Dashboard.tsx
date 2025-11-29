import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PawPrint, Plus, AlertTriangle, Heart, Search, User, Loader2, TrendingUp, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";

interface Stats {
  totalPets: number;
  lostReports: number;
  foundReports: number;
  totalCommunityPets: number;
  totalLostActive: number;
  totalFoundActive: number;
}

interface RecentPet {
  id: string;
  name: string;
  pet_type: string;
  image_url: string | null;
  created_at: string;
}

interface RecentReport {
  id: string;
  pet_name: string;
  pet_type: string;
  location: string;
  created_at: string;
  type: "lost" | "found";
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({ 
    totalPets: 0, 
    lostReports: 0, 
    foundReports: 0,
    totalCommunityPets: 0,
    totalLostActive: 0,
    totalFoundActive: 0,
  });
  const [profile, setProfile] = useState<{ full_name: string | null } | null>(null);
  const [recentPets, setRecentPets] = useState<RecentPet[]>([]);
  const [recentReports, setRecentReports] = useState<RecentReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const [
          petsResult, 
          lostResult, 
          foundResult, 
          profileResult,
          communityPetsResult,
          communityLostResult,
          communityFoundResult,
          recentPetsResult,
          recentLostResult,
          recentFoundResult,
        ] = await Promise.all([
          supabase.from("pets").select("id", { count: "exact" }).eq("user_id", user.id),
          supabase.from("lost_reports").select("id", { count: "exact" }).eq("user_id", user.id),
          supabase.from("found_reports").select("id", { count: "exact" }).eq("user_id", user.id),
          supabase.from("profiles").select("full_name").eq("user_id", user.id).maybeSingle(),
          supabase.from("pets").select("id", { count: "exact" }),
          supabase.from("lost_reports").select("id", { count: "exact" }).eq("status", "active"),
          supabase.from("found_reports").select("id", { count: "exact" }).eq("status", "active"),
          supabase.from("pets").select("id, name, pet_type, image_url, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(3),
          supabase.from("lost_reports").select("id, pet_name, pet_type, last_seen_location, created_at").eq("status", "active").order("created_at", { ascending: false }).limit(3),
          supabase.from("found_reports").select("id, pet_name, pet_type, found_location, created_at").eq("status", "active").order("created_at", { ascending: false }).limit(3),
        ]);

        setStats({
          totalPets: petsResult.count || 0,
          lostReports: lostResult.count || 0,
          foundReports: foundResult.count || 0,
          totalCommunityPets: communityPetsResult.count || 0,
          totalLostActive: communityLostResult.count || 0,
          totalFoundActive: communityFoundResult.count || 0,
        });

        setProfile(profileResult.data);
        setRecentPets(recentPetsResult.data || []);

        // Combine and sort recent reports
        const combinedReports: RecentReport[] = [
          ...(recentLostResult.data || []).map((r) => ({
            id: r.id,
            pet_name: r.pet_name,
            pet_type: r.pet_type,
            location: r.last_seen_location,
            created_at: r.created_at,
            type: "lost" as const,
          })),
          ...(recentFoundResult.data || []).map((r) => ({
            id: r.id,
            pet_name: r.pet_name || "Unknown",
            pet_type: r.pet_type,
            location: r.found_location,
            created_at: r.created_at,
            type: "found" as const,
          })),
        ];
        combinedReports.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setRecentReports(combinedReports.slice(0, 5));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const quickActions = [
    { href: "/add-pet", icon: Plus, label: "Add New Pet", color: "bg-coral-light text-coral" },
    { href: "/report-lost", icon: AlertTriangle, label: "Report Lost Pet", color: "bg-amber-light text-amber" },
    { href: "/report-found", icon: Heart, label: "Report Found Pet", color: "bg-teal-light text-teal" },
    { href: "/search", icon: Search, label: "Search Pets", color: "bg-lavender-light text-lavender" },
  ];

  const statCards = [
    { label: "My Pets", value: stats.totalPets, icon: PawPrint, color: "from-coral to-primary", href: "/my-pets" },
    { label: "My Lost Reports", value: stats.lostReports, icon: AlertTriangle, color: "from-amber to-amber-dark", href: "/lost-pets" },
    { label: "My Found Reports", value: stats.foundReports, icon: Heart, color: "from-teal to-accent", href: "/found-pets" },
  ];

  const communityStats = [
    { label: "Total Pets", value: stats.totalCommunityPets, icon: PawPrint },
    { label: "Lost Pets", value: stats.totalLostActive, icon: AlertTriangle },
    { label: "Found Pets", value: stats.totalFoundActive, icon: Heart },
  ];

  const petTypeEmojis: Record<string, string> = {
    dog: "🐕", cat: "🐱", bird: "🐦", rabbit: "🐰", fish: "🐟", hamster: "🐹", other: "🐾",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center">
              <User className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">
                Welcome back, {profile?.full_name || "Pet Lover"}! 👋
              </h1>
              <p className="text-muted-foreground">Here's what's happening with your pets</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Link key={index} to={stat.href}>
              <div
                className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg hover:-translate-y-1 transition-all animate-fade-in cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">{stat.label}</p>
                    <p className="text-4xl font-display font-bold text-foreground mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-display font-bold text-foreground mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link key={index} to={action.href}>
                  <div className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}>
                    <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-6 h-6" />
                    </div>
                    <p className="font-semibold text-foreground text-sm">{action.label}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Community Stats */}
          <div>
            <h2 className="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Community
            </h2>
            <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
              {communityStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <stat.icon className="w-5 h-5 text-muted-foreground" />
                    <span className="text-foreground">{stat.label}</span>
                  </div>
                  <span className="font-bold text-foreground">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Pets */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-bold text-foreground">My Recent Pets</h2>
              <Link to="/my-pets">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
            {recentPets.length === 0 ? (
              <div className="bg-card rounded-2xl border border-border p-8 text-center">
                <PawPrint className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-4">No pets registered yet</p>
                <Link to="/add-pet">
                  <Button variant="hero" size="sm">
                    <Plus className="w-4 h-4" />
                    Add Your First Pet
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentPets.map((pet, index) => (
                  <Link key={pet.id} to={`/pet/${pet.id}`}>
                    <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4 hover:shadow-md transition-all animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="w-14 h-14 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                        {pet.image_url ? (
                          <img src={pet.image_url} alt={pet.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">
                            {petTypeEmojis[pet.pet_type] || "🐾"}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate">{pet.name}</p>
                        <p className="text-sm text-muted-foreground capitalize">{pet.pet_type}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(pet.created_at), "MMM d")}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recent Reports */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                Recent Reports
              </h2>
            </div>
            {recentReports.length === 0 ? (
              <div className="bg-card rounded-2xl border border-border p-8 text-center">
                <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No recent reports in the community</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentReports.map((report, index) => (
                  <Link key={`${report.type}-${report.id}`} to={report.type === "lost" ? "/lost-pets" : "/found-pets"}>
                    <div className={`bg-card rounded-xl border ${report.type === "lost" ? "border-destructive/30" : "border-accent/30"} p-4 flex items-center gap-4 hover:shadow-md transition-all animate-fade-in`}
                      style={{ animationDelay: `${index * 100}ms` }}>
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${report.type === "lost" ? "bg-destructive/10" : "bg-accent/10"}`}>
                        {report.type === "lost" ? (
                          <AlertTriangle className="w-5 h-5 text-destructive" />
                        ) : (
                          <Heart className="w-5 h-5 text-accent" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{petTypeEmojis[report.pet_type] || "🐾"}</span>
                          <p className="font-semibold text-foreground truncate">{report.pet_name}</p>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3" />
                          {report.location}
                        </p>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${report.type === "lost" ? "bg-destructive/10 text-destructive" : "bg-accent/10 text-accent"}`}>
                        {report.type.toUpperCase()}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-primary rounded-2xl p-8 text-center animate-fade-in">
          <h2 className="text-2xl font-display font-bold text-primary-foreground mb-2">
            Keep Your Pets Safe
          </h2>
          <p className="text-primary-foreground/80 mb-4">
            Register all your pets to ensure they can be identified if they ever get lost.
          </p>
          <Link to="/add-pet">
            <Button variant="secondary" size="lg">
              <Plus className="w-4 h-4" />
              Add Your Pet
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
