import { Link } from "react-router-dom";
import { PawPrint, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <PawPrint className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold">
                Pet<span className="text-primary">Link</span>
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm">
              Connecting pet lovers, helping lost pets find their way home, and building a caring community for all animals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/lost-pets" className="text-muted-foreground hover:text-primary transition-colors">Lost Pets</Link></li>
              <li><Link to="/found-pets" className="text-muted-foreground hover:text-primary transition-colors">Found Pets</Link></li>
              <li><Link to="/search" className="text-muted-foreground hover:text-primary transition-colors">Search Pets</Link></li>
              <li><Link to="/auth" className="text-muted-foreground hover:text-primary transition-colors">Register</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-bold text-foreground mb-4">Support</h4>
            <ul className="space-y-2">
              <li><span className="text-muted-foreground">Help Center</span></li>
              <li><span className="text-muted-foreground">Contact Us</span></li>
              <li><span className="text-muted-foreground">Privacy Policy</span></li>
              <li><span className="text-muted-foreground">Terms of Service</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 PetLink. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-coral fill-coral" /> for pets everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
