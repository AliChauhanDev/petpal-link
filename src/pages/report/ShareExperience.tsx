import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingPage } from "@/components/ui/loading";
import { EmptyState } from "@/components/ui/empty-state";
import { MessageSquare, Plus, Heart } from "lucide-react";
import { format } from "date-fns";

const ShareExperience = () => {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("shared_experiences").select("*, profiles(full_name)").order("created_at", { ascending: false });
      setExperiences(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <LoadingPage message="Loading experiences..." />;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-heading font-bold">Pet Experiences</h1>
          <Button asChild>
            <Link to="/report/create-experience"><Plus className="mr-2 w-4 h-4" /> Share Story</Link>
          </Button>
        </div>

        {experiences.length === 0 ? (
          <EmptyState icon={<MessageSquare className="w-16 h-16" />} title="No Experiences Shared" description="Be the first to share your pet story!" action={{ label: "Share Experience", href: "/report/create-experience" }} />
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {experiences.map((exp) => (
              <Card key={exp.id} className="hover-lift">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{exp.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{exp.content}</p>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>{exp.profiles?.full_name || "Anonymous"}</span>
                    <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> {exp.likes_count}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{format(new Date(exp.created_at), "PPP")}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ShareExperience;
