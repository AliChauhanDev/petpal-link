import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingPage } from "@/components/ui/loading";
import { EmptyState } from "@/components/ui/empty-state";
import { Eye, Plus, MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";

const FoundPet = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("found_reports").select("*").eq("status", "active").order("created_at", { ascending: false });
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
          <h1 className="text-3xl font-heading font-bold">Found Pets</h1>
          <Button asChild>
            <Link to="/report/create-found"><Plus className="mr-2 w-4 h-4" /> Report Found Pet</Link>
          </Button>
        </div>

        {reports.length === 0 ? (
          <EmptyState icon={<Eye className="w-16 h-16" />} title="No Found Pet Reports" />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Card key={report.id} className="hover-lift overflow-hidden">
                <div className="h-48 bg-muted flex items-center justify-center">
                  {report.images?.[0] ? <img src={report.images[0]} alt="Found pet" className="w-full h-full object-cover" /> : <Eye className="w-12 h-12 text-muted-foreground" />}
                </div>
                <CardContent className="p-4">
                  <p className="font-semibold capitalize">{report.pet_type} {report.breed && `• ${report.breed}`}</p>
                  <p className="text-sm text-muted-foreground">{report.color}</p>
                  <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {report.found_location}</p>
                    <p className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {format(new Date(report.found_date), "PPP")}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default FoundPet;
