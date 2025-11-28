import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PawPrint, Search, AlertTriangle, Heart, Shield, Users, MapPin, CheckCircle } from "lucide-react";

export default function Index() {
  const features = [
    {
      icon: PawPrint,
      title: "Pet Registration",
      description: "Register your pets with complete details, photos, and medical records in one secure place.",
      color: "bg-coral-light text-coral",
    },
    {
      icon: AlertTriangle,
      title: "Lost Pet Reports",
      description: "Quickly report your lost pet with all details to alert the community and increase chances of finding them.",
      color: "bg-amber-light text-amber",
    },
    {
      icon: Heart,
      title: "Found Pet Reports",
      description: "Found a lost pet? Report it here and help reunite them with their worried owners.",
      color: "bg-teal-light text-teal",
    },
    {
      icon: Search,
      title: "Smart Search",
      description: "Search through registered pets and lost/found reports to find matching pets quickly.",
      color: "bg-lavender-light text-lavender",
    },
  ];

  const stats = [
    { value: "10K+", label: "Pets Registered" },
    { value: "2.5K+", label: "Pets Reunited" },
    { value: "50K+", label: "Active Users" },
    { value: "100+", label: "Cities Covered" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero paw-pattern">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-full">
                <PawPrint className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-secondary-foreground">
                  #1 Pet Management Platform
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground leading-tight">
                Keep Your Pets{" "}
                <span className="text-gradient-primary">Safe & Connected</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-lg">
                PetLink helps you manage your pets, report lost or found animals, and connect with a community of pet lovers dedicated to keeping every pet safe.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/auth">
                  <Button variant="hero" size="xl">
                    <PawPrint className="w-5 h-5" />
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/search">
                  <Button variant="outline" size="xl">
                    <Search className="w-5 h-5" />
                    Search Pets
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-primary border-2 border-card"
                    />
                  ))}
                </div>
                <div>
                  <p className="font-semibold text-foreground">50,000+ Happy Pet Owners</p>
                  <p className="text-sm text-muted-foreground">Trusted by pet lovers worldwide</p>
                </div>
              </div>
            </div>

            <div className="relative animate-slide-in-right hidden md:block">
              <div className="relative z-10">
                <div className="w-80 h-80 mx-auto bg-gradient-primary rounded-full flex items-center justify-center animate-float">
                  <PawPrint className="w-40 h-40 text-primary-foreground" />
                </div>
              </div>
              <div className="absolute top-10 left-0 w-20 h-20 bg-coral rounded-2xl flex items-center justify-center animate-bounce-slow">
                <Heart className="w-10 h-10 text-primary-foreground" />
              </div>
              <div className="absolute bottom-20 right-0 w-24 h-24 bg-teal rounded-2xl flex items-center justify-center animate-bounce-slow delay-300">
                <Shield className="w-12 h-12 text-primary-foreground" />
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="hsl(var(--card))"
            />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <p className="text-3xl md:text-4xl font-display font-bold text-primary">
                  {stat.value}
                </p>
                <p className="text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Everything You Need for Your{" "}
              <span className="text-gradient-primary">Furry Friends</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From registration to reunification, PetLink provides all the tools you need to keep your pets safe and connected.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-card rounded-2xl p-6 border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-display font-bold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-hero paw-pattern">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              How PetLink Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple steps to protect your beloved pets
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Create Account", desc: "Sign up for free and set up your profile" },
              { step: "02", title: "Register Your Pets", desc: "Add your pets with photos and details" },
              { step: "03", title: "Stay Connected", desc: "Report lost/found pets & help the community" },
            ].map((item, index) => (
              <div key={index} className="relative animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="bg-card rounded-2xl p-8 text-center border border-border hover:shadow-lg transition-all">
                  <div className="text-6xl font-display font-bold text-primary/20 mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-display font-bold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-primary">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-primary rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">
                Ready to Protect Your Pets?
              </h2>
              <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
                Join thousands of pet owners who trust PetLink to keep their furry friends safe and connected.
              </p>
              <Link to="/auth">
                <Button variant="secondary" size="xl" className="shadow-lg">
                  <PawPrint className="w-5 h-5" />
                  Get Started Now
                </Button>
              </Link>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-4 left-4 w-20 h-20 bg-primary-foreground/10 rounded-full" />
            <div className="absolute bottom-4 right-4 w-32 h-32 bg-primary-foreground/10 rounded-full" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
