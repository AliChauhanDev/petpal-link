import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LoadingPage } from "@/components/ui/loading";
import { User, Mail, Phone, MapPin, Loader2, Save, Camera, Store, AlertTriangle, Heart } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ lostReports: 0, foundReports: 0, orders: 0 });
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    avatar_url: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const [profileResult, lostResult, foundResult, ordersResult] = await Promise.all([
          supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
          supabase.from("lost_reports").select("id", { count: "exact" }).eq("user_id", user.id),
          supabase.from("found_reports").select("id", { count: "exact" }).eq("user_id", user.id),
          supabase.from("orders").select("id", { count: "exact" }).eq("user_id", user.id),
        ]);

        if (profileResult.data) {
          setFormData({
            full_name: profileResult.data.full_name || "",
            phone: profileResult.data.phone || "",
            address: profileResult.data.address || "",
            city: profileResult.data.city || "",
            avatar_url: profileResult.data.avatar_url || "",
          });
        }

        setStats({
          lostReports: lostResult.count || 0,
          foundReports: foundResult.count || 0,
          orders: ordersResult.count || 0,
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name || null,
          phone: formData.phone || null,
          address: formData.address || null,
          city: formData.city || null,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingPage message="Loading profile..." />;
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="relative inline-block">
              <div className="w-28 h-28 gradient-primary rounded-full flex items-center justify-center mx-auto">
                {formData.avatar_url ? (
                  <img 
                    src={formData.avatar_url} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-14 h-14 text-white" />
                )}
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-card border border-border rounded-full flex items-center justify-center hover:bg-muted transition-colors">
                <Camera className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <h1 className="text-3xl font-heading font-bold text-foreground mt-4">
              My Profile
            </h1>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-6 space-y-6 animate-fade-in">
            <div className="space-y-2">
              <Label htmlFor="full_name" className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                Full Name
              </Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                Email
              </Label>
              <Input
                id="email"
                value={user?.email || ""}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                Phone Number
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+1 234 567 8900"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  City
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Your city"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  Address
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Street address"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Profile
                </>
              )}
            </Button>
          </form>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-3 gap-4 animate-fade-in">
            <div className="bg-card rounded-xl border border-border p-4 text-center hover-lift">
              <Store className="w-6 h-6 text-store-primary mx-auto mb-2" />
              <p className="text-2xl font-heading font-bold text-foreground">{stats.orders}</p>
              <p className="text-sm text-muted-foreground">Orders</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 text-center hover-lift">
              <AlertTriangle className="w-6 h-6 text-amber mx-auto mb-2" />
              <p className="text-2xl font-heading font-bold text-foreground">{stats.lostReports}</p>
              <p className="text-sm text-muted-foreground">Lost Reports</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 text-center hover-lift">
              <Heart className="w-6 h-6 text-care-primary mx-auto mb-2" />
              <p className="text-2xl font-heading font-bold text-foreground">{stats.foundReports}</p>
              <p className="text-sm text-muted-foreground">Found Reports</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
