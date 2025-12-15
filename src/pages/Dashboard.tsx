import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Store, Heart, Search, ArrowRight } from "lucide-react";

const modules = [
  {
    title: "Pet Store",
    description: "Browse and shop for pet products, or become a seller",
    icon: Store,
    href: "/store",
    gradient: "gradient-store",
    color: "text-store-primary",
  },
  {
    title: "Pet Care",
    description: "Guides, health info, and AI-powered pet doctor",
    icon: Heart,
    href: "/care",
    gradient: "gradient-care",
    color: "text-care-primary",
  },
  {
    title: "Pet Report",
    description: "Report lost or found pets, share experiences",
    icon: Search,
    href: "/report",
    gradient: "gradient-report",
    color: "text-report-primary",
  },
];

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Welcome to Pet Ecosystem
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your all-in-one platform for pet shopping, care guidance, and community support
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {modules.map((module, index) => (
            <Link key={module.title} to={module.href} className="group">
              <Card 
                className="h-full hover-lift border-2 border-transparent hover:border-primary/20 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-8 text-center">
                  <div className={`w-20 h-20 rounded-3xl ${module.gradient} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <module.icon className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-heading font-bold text-foreground mb-3">
                    {module.title}
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {module.description}
                  </p>
                  <div className={`flex items-center justify-center gap-2 ${module.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                    <span className="font-medium">Explore</span>
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
}
