import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Shield,
  Users,
  AlertTriangle,
  Heart,
  PawPrint,
  Loader2,
  Trash2,
  Check,
  X,
  TrendingUp,
} from "lucide-react";
import { format } from "date-fns";

interface Report {
  id: string;
  pet_name: string;
  pet_type: string;
  status: string;
  created_at: string;
  user_id: string;
  type: "lost" | "found";
}

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  created_at: string;
}

export default function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPets: 0,
    totalLost: 0,
    totalFound: 0,
    activeReports: 0,
  });

  useEffect(() => {
    const checkAdminAndFetchData = async () => {
      if (!user) {
        navigate("/auth");
        return;
      }

      // Check if user is admin
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roleData) {
        toast.error("Access denied. Admin privileges required.");
        navigate("/dashboard");
        return;
      }

      setIsAdmin(true);

      // Fetch all data
      const [lostReports, foundReports, profiles, petsCount] = await Promise.all([
        supabase.from("lost_reports").select("*").order("created_at", { ascending: false }),
        supabase.from("found_reports").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("pets").select("id", { count: "exact" }),
      ]);

      const allReports: Report[] = [
        ...(lostReports.data || []).map((r) => ({ ...r, type: "lost" as const })),
        ...(foundReports.data || []).map((r) => ({
          ...r,
          pet_name: r.pet_name || "Unknown",
          type: "found" as const,
        })),
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setReports(allReports);
      setUsers(profiles.data || []);
      setStats({
        totalUsers: profiles.data?.length || 0,
        totalPets: petsCount.count || 0,
        totalLost: lostReports.data?.length || 0,
        totalFound: foundReports.data?.length || 0,
        activeReports:
          (lostReports.data?.filter((r) => r.status === "active").length || 0) +
          (foundReports.data?.filter((r) => r.status === "active").length || 0),
      });

      setLoading(false);
    };

    checkAdminAndFetchData();
  }, [user, navigate]);

  const updateReportStatus = async (id: string, type: "lost" | "found", status: string) => {
    const table = type === "lost" ? "lost_reports" : "found_reports";
    const { error } = await supabase.from(table).update({ status }).eq("id", id);

    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success(`Report marked as ${status}`);
      setReports((prev) =>
        prev.map((r) => (r.id === id && r.type === type ? { ...r, status } : r))
      );
    }
  };

  const deleteReport = async (id: string, type: "lost" | "found") => {
    const table = type === "lost" ? "lost_reports" : "found_reports";
    const { error } = await supabase.from(table).delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete report");
    } else {
      toast.success("Report deleted");
      setReports((prev) => prev.filter((r) => !(r.id === id && r.type === type)));
    }
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

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">Admin Panel</h1>
              <p className="text-muted-foreground">Manage reports, users, and platform settings</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total Users", value: stats.totalUsers, icon: Users, color: "bg-primary" },
            { label: "Total Pets", value: stats.totalPets, icon: PawPrint, color: "bg-accent" },
            { label: "Lost Reports", value: stats.totalLost, icon: AlertTriangle, color: "bg-destructive" },
            { label: "Found Reports", value: stats.totalFound, icon: Heart, color: "bg-teal" },
            { label: "Active Reports", value: stats.activeReports, icon: TrendingUp, color: "bg-amber" },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-4 border border-border animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-2`}>
                <stat.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="reports" className="animate-fade-in">
          <TabsList className="mb-6">
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="reports">
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Pet Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Pet Type</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {reports.map((report) => (
                      <tr key={`${report.type}-${report.id}`} className="hover:bg-muted/50">
                        <td className="px-4 py-3">
                          <Badge
                            variant={report.type === "lost" ? "destructive" : "default"}
                            className={report.type === "found" ? "bg-accent text-accent-foreground" : ""}
                          >
                            {report.type.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 font-medium text-foreground">{report.pet_name}</td>
                        <td className="px-4 py-3 text-muted-foreground capitalize">{report.pet_type}</td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={report.status === "active" ? "default" : "secondary"}
                            className={report.status === "active" ? "bg-accent" : ""}
                          >
                            {report.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {format(new Date(report.created_at), "MMM d, yyyy")}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            {report.status === "active" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateReportStatus(report.id, report.type, "resolved")}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateReportStatus(report.id, report.type, "active")}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteReport(report.id, report.type)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">User ID</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {users.map((profile) => (
                      <tr key={profile.id} className="hover:bg-muted/50">
                        <td className="px-4 py-3 font-medium text-foreground">
                          {profile.full_name || "Unnamed User"}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground font-mono text-sm">
                          {profile.user_id.substring(0, 8)}...
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {format(new Date(profile.created_at), "MMM d, yyyy")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
