import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PawPrint, Plus, AlertTriangle, Heart, Search, User, Loader2 } from "lucide-react";

interface Stats {
  totalPets: number;
  lostReports: number;
  foundReports: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({ totalPets: 0, lostReports: 0, foundReports: 0 });
  const [profile, setProfile] = useState<{ full_name: string | null } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const [petsResult, lostResult, foundResult, profileResult] = await Promise.all([
          supabase.from("pets").select("id", { count: "exact" }).eq("user_id", user.id),
          supabase.from("lost_reports").select("id", { count: "exact" }).eq("user_id", user.id),
          supabase.from("found_reports").select("id", { count: "exact" }).eq("user_id", user.id),
          supabase.from("profiles").select("full_name").eq("user_id", user.id).maybeSingle(),
        ]);

        setStats({
          totalPets: petsResult.count || 0,
          lostReports: lostResult.count || 0,
          foundReports: foundResult.count || 0,
        });

        setProfile(profileResult.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const quickActions = [
    { href: "/add-pet", icon: Plus, label: "Add New Pet", color: "bg-coral-light text-coral", variant: "coral" as const },
    { href: "/report-lost", icon: AlertTriangle, label: "Report Lost Pet", color: "bg-amber-light text-amber", variant: "default" as const },
    { href: "/report-found", icon: Heart, label: "Report Found Pet", color: "bg-teal-light text-teal", variant: "teal" as const },
    { href: "/search", icon: Search, label: "Search Pets", color: "bg-lavender-light text-lavender", variant: "secondary" as const },
  ];

  const statCards = [
    { label: "My Pets", value: stats.totalPets, icon: PawPrint, color: "from-coral to-primary" },
    { label: "Lost Reports", value: stats.lostReports, icon: AlertTriangle, color: "from-amber to-amber-dark" },
    { label: "Found Reports", value: stats.foundReports, icon: Heart, color: "from-teal to-accent" },
  ];

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
            <div
              key={index}
              className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-all animate-fade-in"
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
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-display font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.href}>
                <div className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}>
                  <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <p className="font-semibold text-foreground">{action.label}</p>
                </div>
              </Link>
            ))}
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
              Add Your First Pet
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
