import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingPage } from "@/components/ui/loading";
import { Users, Package, AlertTriangle, Store } from "lucide-react";

const AdminPanel = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({ users: 0, products: 0, lostReports: 0, stores: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;
    const fetchStats = async () => {
      const [users, products, lost, stores] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("lost_reports").select("id", { count: "exact", head: true }),
        supabase.from("seller_stores").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        users: users.count || 0,
        products: products.count || 0,
        lostReports: lost.count || 0,
        stores: stores.count || 0,
      });
      setLoading(false);
    };
    fetchStats();
  }, [isAdmin]);

  if (authLoading || loading) return <LoadingPage message="Loading admin panel..." />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const statCards = [
    { title: "Total Users", value: stats.users, icon: Users, color: "text-info" },
    { title: "Products", value: stats.products, icon: Package, color: "text-store-primary" },
    { title: "Lost Reports", value: stats.lostReports, icon: AlertTriangle, color: "text-destructive" },
    { title: "Stores", value: stats.stores, icon: Store, color: "text-success" },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-heading font-bold mb-8">Admin Panel</h1>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <stat.icon className={`w-10 h-10 ${stat.color}`} />
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="users">
            <Card><CardHeader><CardTitle>User Management</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">User management coming soon.</p></CardContent></Card>
          </TabsContent>
          <TabsContent value="products">
            <Card><CardHeader><CardTitle>Product Management</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">Product approval coming soon.</p></CardContent></Card>
          </TabsContent>
          <TabsContent value="reports">
            <Card><CardHeader><CardTitle>Report Management</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">Report moderation coming soon.</p></CardContent></Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AdminPanel;
