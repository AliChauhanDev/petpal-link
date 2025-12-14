import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingPage } from "@/components/ui/loading";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Info } from "lucide-react";

const Diseases = () => {
  const [diseases, setDiseases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("pet_diseases").select("*");
      setDiseases(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <LoadingPage message="Loading..." />;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-heading font-bold mb-4">Pet Diseases</h1>
        
        <Alert className="mb-8">
          <Info className="w-4 h-4" />
          <AlertDescription>
            <strong>Medical Disclaimer:</strong> This information is for educational purposes only and is not a substitute for professional veterinary care.
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 gap-6">
          {diseases.map((disease) => (
            <Card key={disease.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  {disease.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Symptoms</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {disease.symptoms?.map((s: string, i: number) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Prevention</h4>
                  <p className="text-sm text-muted-foreground">{disease.prevention}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">When to Seek Help</h4>
                  <p className="text-sm text-destructive">{disease.when_to_seek_help}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Diseases;
