import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingPage } from "@/components/ui/loading";
import { EmptyState } from "@/components/ui/empty-state";
import { AlertTriangle, Plus, MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";

const LostPet = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("lost_reports").select("*").eq("status", "active").order("created_at", { ascending: false });
      setReports(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <LoadingPage message="Loading reports..." />;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-heading font-bold">Lost Pets</h1>
          <Button asChild>
            <Link to="/report/create-lost"><Plus className="mr-2 w-4 h-4" /> Report Lost Pet</Link>
          </Button>
        </div>

        {reports.length === 0 ? (
          <EmptyState icon={<AlertTriangle className="w-16 h-16" />} title="No Lost Pet Reports" description="Hopefully all pets are safe at home!" />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Card key={report.id} className="hover-lift overflow-hidden">
                <div className="h-48 bg-muted flex items-center justify-center">
                  {report.images?.[0] ? <img src={report.images[0]} alt={report.pet_name} className="w-full h-full object-cover" /> : <AlertTriangle className="w-12 h-12 text-muted-foreground" />}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg">{report.pet_name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{report.pet_type} {report.breed && `• ${report.breed}`}</p>
                  <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {report.last_seen_location}</p>
                    <p className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {format(new Date(report.last_seen_date), "PPP")}</p>
                  </div>
                  {report.reward && <p className="mt-2 text-sm font-medium text-success">Reward: {report.reward}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default LostPet;
