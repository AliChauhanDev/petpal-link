import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingPage } from "@/components/ui/loading";
import { Heart, Utensils, Activity, Home } from "lucide-react";

const iconMap: Record<string, any> = { food: Utensils, activity: Activity, emotional: Heart, environment: Home };

const PetLove = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("pet_love").select("*");
      setItems(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <LoadingPage message="Loading..." />;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-heading font-bold mb-8">What Pets Love</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const Icon = iconMap[item.category] || Heart;
            return (
              <Card key={item.id} className="hover-lift">
                <CardContent className="p-6">
                  <Icon className="w-10 h-10 text-pink-500 mb-4" />
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                  <span className="text-xs px-2 py-1 rounded-full bg-muted mt-4 inline-block">{item.pet_type}</span>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
};

export default PetLove;
