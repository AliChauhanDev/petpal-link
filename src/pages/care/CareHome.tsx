import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, BookOpen, Sparkles, AlertTriangle, Stethoscope, Info, ArrowRight } from "lucide-react";

const CareHome = () => {
  const sections = [
    { title: "Guide", description: "Step-by-step pet care guides", icon: BookOpen, href: "/care/guide", color: "text-care-primary" },
    { title: "Pet Love", description: "What your pets love and need", icon: Sparkles, href: "/care/pet-love", color: "text-pink-500" },
    { title: "Diseases", description: "Common diseases and prevention", icon: AlertTriangle, href: "/care/diseases", color: "text-warning" },
    { title: "Pet Doctor", description: "AI health consultation", icon: Stethoscope, href: "/care/pet-doctor", color: "text-info" },
    { title: "Pets Info", description: "Which pets to keep", icon: Info, href: "/care/pets-info", color: "text-accent" },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-3xl gradient-care flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-heading font-bold text-foreground mb-4">Pet Care</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Expert guides, health information, and AI-powered consultation for your pets.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {sections.map((section) => (
            <Link key={section.title} to={section.href} className="group">
              <Card className="h-full hover-lift">
                <CardContent className="p-6 text-center">
                  <section.icon className={`w-12 h-12 ${section.color} mx-auto mb-4 group-hover:scale-110 transition-transform`} />
                  <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
                  <p className="text-muted-foreground mb-4">{section.description}</p>
                  <div className="flex items-center justify-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium">Explore</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default CareHome;
