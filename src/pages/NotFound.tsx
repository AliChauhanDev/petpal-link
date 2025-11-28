import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PawPrint, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-hero paw-pattern flex items-center justify-center p-4">
      <div className="text-center animate-bounce-in">
        <div className="w-32 h-32 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-8 animate-float">
          <PawPrint className="w-16 h-16 text-primary-foreground" />
        </div>
        
        <h1 className="text-8xl font-display font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Oops! This page ran away
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Looks like this page got lost like a curious puppy. Don't worry, let's get you back home!
        </p>
        
        <Link to="/">
          <Button variant="hero" size="xl">
            <Home className="w-5 h-5" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
