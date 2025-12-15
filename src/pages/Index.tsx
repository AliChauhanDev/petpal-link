import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Store, Heart, Search, Shield, Users, Star, ArrowRight, CheckCircle } from "lucide-react";

export default function Index() {
  const modules = [
    {
      title: "Pet Store",
      description: "Shop for pet products, create your own store, and manage orders with ease.",
      icon: Store,
      href: "/store",
      gradient: "gradient-store",
      features: ["Browse products", "Become a seller", "Manage orders"],
    },
    {
      title: "Pet Care",
      description: "Expert guides, health information, and AI-powered pet doctor at your fingertips.",
      icon: Heart,
      href: "/care",
      gradient: "gradient-care",
      features: ["Care guides", "Disease info", "AI Pet Doctor"],
    },
    {
      title: "Pet Report",
      description: "Report lost or found pets and connect with the community to help reunite families.",
      icon: Search,
      href: "/report",
      gradient: "gradient-report",
      features: ["Lost pet reports", "Found pet alerts", "Share experiences"],
    },
  ];

  const stats = [
    { value: "10K+", label: "Happy Pet Owners" },
    { value: "5K+", label: "Pets Reunited" },
    { value: "1K+", label: "Products Available" },
    { value: "24/7", label: "AI Support" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <span className="text-xl">🐾</span>
              </div>
              <span className="text-xl font-heading font-bold text-foreground">PetVerse</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link to="/store" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                Pet Store
              </Link>
              <Link to="/care" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                Pet Care
              </Link>
              <Link to="/report" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                Pet Report
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/auth">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link to="/auth">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero paw-pattern py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-full mb-6">
              <Star className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-secondary-foreground">
                Your Complete Pet Ecosystem
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-heading font-bold text-foreground leading-tight mb-6">
              Everything Your Pet Needs,{" "}
              <span className="text-gradient-primary">All in One Place</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Shop for products, get expert care advice, and help lost pets find their way home. 
              Join thousands of pet lovers in building a caring community.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/auth">
                <Button size="lg" className="gap-2">
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/store">
                <Button variant="outline" size="lg">
                  Explore Store
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-card py-12 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <p className="text-3xl md:text-4xl font-heading font-bold text-primary">
                  {stat.value}
                </p>
                <p className="text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Three Powerful Modules
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our comprehensive pet ecosystem designed to meet all your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {modules.map((module, index) => (
              <Link key={module.title} to={module.href} className="group">
                <Card 
                  className="h-full hover-lift border-2 border-transparent hover:border-primary/20 animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 rounded-2xl ${module.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <module.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-foreground mb-3">
                      {module.title}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {module.description}
                    </p>
                    <ul className="space-y-2">
                      {module.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-accent" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="font-medium">Explore</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-hero paw-pattern">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Why Choose PetVerse?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're building the most comprehensive pet platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Shield, title: "Trusted & Secure", desc: "Your data and transactions are always protected" },
              { icon: Users, title: "Community Driven", desc: "Join thousands of pet lovers helping each other" },
              { icon: Heart, title: "Pet First", desc: "Everything we build is designed with pets in mind" },
            ].map((item, index) => (
              <div 
                key={index} 
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="gradient-primary rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                Ready to Join PetVerse?
              </h2>
              <p className="text-white/80 max-w-xl mx-auto mb-8">
                Create your free account and start exploring everything we have to offer for you and your furry friends.
              </p>
              <Link to="/auth">
                <Button variant="secondary" size="lg" className="shadow-lg">
                  Get Started Now
                </Button>
              </Link>
            </div>
            
            <div className="absolute top-4 left-4 w-20 h-20 bg-white/10 rounded-full" />
            <div className="absolute bottom-4 right-4 w-32 h-32 bg-white/10 rounded-full" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐾</span>
              <span className="font-heading font-bold text-foreground">PetVerse</span>
            </div>
            <div className="flex gap-6">
              <Link to="/store" className="text-muted-foreground hover:text-foreground transition-colors">
                Pet Store
              </Link>
              <Link to="/care" className="text-muted-foreground hover:text-foreground transition-colors">
                Pet Care
              </Link>
              <Link to="/report" className="text-muted-foreground hover:text-foreground transition-colors">
                Pet Report
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 PetVerse. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
