import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Search, AlertTriangle, Eye, MessageSquare, ArrowRight } from "lucide-react";

const ReportHome = () => {
  const sections = [
    { title: "Lost Pet", description: "Report a missing pet", icon: AlertTriangle, href: "/report/lost", color: "text-destructive" },
    { title: "Found Pet", description: "Report a found pet", icon: Eye, href: "/report/found", color: "text-success" },
    { title: "Share Experience", description: "Share your pet stories", icon: MessageSquare, href: "/report/experiences", color: "text-info" },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-3xl gradient-report flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-heading font-bold text-foreground mb-4">Pet Report</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Help lost pets find their way home. Report lost or found pets and share experiences.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {sections.map((section) => (
            <Link key={section.title} to={section.href} className="group">
              <Card className="h-full hover-lift">
                <CardContent className="p-6 text-center">
                  <section.icon className={`w-12 h-12 ${section.color} mx-auto mb-4 group-hover:scale-110 transition-transform`} />
                  <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
                  <p className="text-muted-foreground mb-4">{section.description}</p>
                  <div className="flex items-center justify-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium">View</span>
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

export default ReportHome;
