import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, ArrowRight, Percent } from "lucide-react";
import { format } from "date-fns";

interface PetMatchCardProps {
  match: {
    id: string;
    match_score: number;
    lost_report: {
      id: string;
      pet_name: string;
      pet_type: string;
      last_seen_location: string;
      last_seen_date: string;
      image_url: string | null;
    };
    found_report: {
      id: string;
      pet_name: string | null;
      pet_type: string;
      found_location: string;
      found_date: string;
      image_url: string | null;
    };
  };
}

const petTypeEmojis: Record<string, string> = {
  dog: "🐕",
  cat: "🐱",
  bird: "🐦",
  rabbit: "🐰",
  fish: "🐟",
  hamster: "🐹",
  other: "🐾",
};

export default function PetMatchCard({ match }: PetMatchCardProps) {
  const getMatchColor = (score: number) => {
    if (score >= 80) return "bg-accent text-accent-foreground";
    if (score >= 50) return "bg-amber-500 text-white";
    return "bg-muted text-muted-foreground";
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-4">
        <Badge className={getMatchColor(match.match_score)}>
          <Percent className="w-3 h-3 mr-1" />
          {match.match_score}% Match
        </Badge>
        <span className="text-2xl">{petTypeEmojis[match.lost_report.pet_type] || "🐾"}</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Lost Pet */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-destructive uppercase tracking-wide">
            Lost Pet
          </div>
          <div className="aspect-square bg-muted rounded-xl overflow-hidden">
            {match.lost_report.image_url ? (
              <img
                src={match.lost_report.image_url}
                alt={match.lost_report.pet_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">
                {petTypeEmojis[match.lost_report.pet_type] || "🐾"}
              </div>
            )}
          </div>
          <div>
            <h4 className="font-semibold text-foreground">{match.lost_report.pet_name}</h4>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {match.lost_report.last_seen_location}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <Calendar className="w-3 h-3" />
              {format(new Date(match.lost_report.last_seen_date), "MMM d, yyyy")}
            </p>
          </div>
        </div>

        {/* Found Pet */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-accent uppercase tracking-wide">
            Found Pet
          </div>
          <div className="aspect-square bg-muted rounded-xl overflow-hidden">
            {match.found_report.image_url ? (
              <img
                src={match.found_report.image_url}
                alt={match.found_report.pet_name || "Found pet"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">
                {petTypeEmojis[match.found_report.pet_type] || "🐾"}
              </div>
            )}
          </div>
          <div>
            <h4 className="font-semibold text-foreground">
              {match.found_report.pet_name || "Unknown"}
            </h4>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {match.found_report.found_location}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <Calendar className="w-3 h-3" />
              {format(new Date(match.found_report.found_date), "MMM d, yyyy")}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-4 pt-4 border-t border-border">
        <Link to={`/lost-pets`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            View Lost Report
          </Button>
        </Link>
        <Link to={`/found-pets`} className="flex-1">
          <Button variant="hero" size="sm" className="w-full">
            View Found Report
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
