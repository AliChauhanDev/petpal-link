import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingPage } from "@/components/ui/loading";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

const PetsInfo = () => {
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("pets_info").select("*");
      setPets(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <LoadingPage message="Loading..." />;

  const canKeep = pets.filter(p => p.can_keep);
  const cannotKeep = pets.filter(p => !p.can_keep);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-heading font-bold mb-8">Pets Information</h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-success mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" /> Animals You Can Keep as Pets
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {canKeep.map((pet) => (
                <Card key={pet.id} className="border-success/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {pet.animal_name}
                      <Badge variant="outline" className="text-success border-success">Safe</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>{pet.reason}</p>
                    {pet.ethical_notes && <p><strong>Note:</strong> {pet.ethical_notes}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-destructive mb-4 flex items-center gap-2">
              <XCircle className="w-5 h-5" /> Animals NOT Suitable as Pets
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {cannotKeep.map((pet) => (
                <Card key={pet.id} className="border-destructive/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {pet.animal_name}
                      <Badge variant="destructive">Not Recommended</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>{pet.reason}</p>
                    {pet.legal_notes && <p><strong>Legal:</strong> {pet.legal_notes}</p>}
                    {pet.ethical_notes && <p><strong>Ethical:</strong> {pet.ethical_notes}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default PetsInfo;
