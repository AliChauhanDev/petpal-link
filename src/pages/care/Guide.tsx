import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingPage } from "@/components/ui/loading";
import { EmptyState } from "@/components/ui/empty-state";
import { BookOpen } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type PetType = Database["public"]["Enums"]["pet_type"];

const Guide = () => {
  const [guides, setGuides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [petType, setPetType] = useState<string>("all");

  useEffect(() => {
    fetchGuides();
  }, [petType]);

  const fetchGuides = async () => {
    setLoading(true);
    let query = supabase.from("pet_guides").select("*");
    if (petType !== "all") {
      query = query.eq("pet_type", petType as PetType);
    }
    
    const { data } = await query;
    setGuides(data || []);
    setLoading(false);
  };

  if (loading) return <LoadingPage message="Loading guides..." />;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-heading font-bold">Pet Care Guides</h1>
          <Select value={petType} onValueChange={setPetType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by pet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Pets</SelectItem>
              <SelectItem value="dog">Dogs</SelectItem>
              <SelectItem value="cat">Cats</SelectItem>
              <SelectItem value="bird">Birds</SelectItem>
              <SelectItem value="rabbit">Rabbits</SelectItem>
              <SelectItem value="fish">Fish</SelectItem>
              <SelectItem value="hamster">Hamsters</SelectItem>
              <SelectItem value="reptile">Reptiles</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {guides.length === 0 ? (
          <EmptyState icon={<BookOpen className="w-16 h-16" />} title="No Guides Found" description="Check back later for helpful pet care guides." />
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {guides.map((guide) => (
              <Card key={guide.id} className="hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-care-primary" />
                    {guide.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">{guide.content}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-muted capitalize">{guide.pet_type}</span>
                    {guide.category && <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{guide.category}</span>}
                    {guide.age_group && <span className="text-xs px-2 py-1 rounded-full bg-muted">{guide.age_group}</span>}
                    {guide.gender && <span className="text-xs px-2 py-1 rounded-full bg-muted capitalize">{guide.gender}</span>}
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

export default Guide;
