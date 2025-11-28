import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PawPrint, Trash2, MapPin, Phone, Calendar, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PetCardProps {
  pet: {
    id: string;
    name: string;
    pet_type: string;
    breed?: string | null;
    age?: string | null;
    description?: string | null;
    image_url?: string | null;
    color?: string | null;
    gender?: string | null;
    is_lost?: boolean;
  };
  onDelete?: (id: string) => void;
  showActions?: boolean;
  variant?: "default" | "lost" | "found";
  extraInfo?: {
    location?: string;
    contact?: string;
    date?: string;
    reward?: string;
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

export default function PetCard({ pet, onDelete, showActions, variant = "default", extraInfo }: PetCardProps) {
  const borderColor = variant === "lost" ? "border-destructive/50" : variant === "found" ? "border-accent/50" : "border-border";
  const badgeVariant = variant === "lost" ? "destructive" : variant === "found" ? "secondary" : "outline";

  return (
    <div className={`bg-card rounded-2xl border-2 ${borderColor} overflow-hidden hover:shadow-lg transition-all group`}>
      {/* Image */}
      <div className="relative h-48 bg-muted">
        {pet.image_url ? (
          <img
            src={pet.image_url}
            alt={pet.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <PawPrint className="w-16 h-16 text-muted-foreground" />
          </div>
        )}
        
        {variant !== "default" && (
          <div className="absolute top-3 left-3">
            <Badge variant={badgeVariant} className="font-semibold">
              {variant === "lost" ? (
                <>
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  LOST
                </>
              ) : (
                "FOUND"
              )}
            </Badge>
          </div>
        )}

        {pet.is_lost && variant === "default" && (
          <div className="absolute top-3 left-3">
            <Badge variant="destructive" className="font-semibold">
              <AlertTriangle className="w-3 h-3 mr-1" />
              LOST
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
              {petTypeEmojis[pet.pet_type] || "🐾"} {pet.name}
            </h3>
            <p className="text-sm text-muted-foreground capitalize">{pet.pet_type}</p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {pet.breed && (
            <p className="text-sm text-foreground">
              <span className="text-muted-foreground">Breed:</span> {pet.breed}
            </p>
          )}
          {pet.age && (
            <p className="text-sm text-foreground">
              <span className="text-muted-foreground">Age:</span> {pet.age}
            </p>
          )}
          {pet.color && (
            <p className="text-sm text-foreground">
              <span className="text-muted-foreground">Color:</span> {pet.color}
            </p>
          )}
          {pet.gender && (
            <p className="text-sm text-foreground">
              <span className="text-muted-foreground">Gender:</span> {pet.gender}
            </p>
          )}
        </div>

        {pet.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{pet.description}</p>
        )}

        {/* Extra Info for Lost/Found */}
        {extraInfo && (
          <div className="space-y-2 pt-3 border-t border-border">
            {extraInfo.location && (
              <p className="text-sm flex items-center gap-2 text-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                {extraInfo.location}
              </p>
            )}
            {extraInfo.contact && (
              <p className="text-sm flex items-center gap-2 text-foreground">
                <Phone className="w-4 h-4 text-primary" />
                {extraInfo.contact}
              </p>
            )}
            {extraInfo.date && (
              <p className="text-sm flex items-center gap-2 text-foreground">
                <Calendar className="w-4 h-4 text-primary" />
                {extraInfo.date}
              </p>
            )}
            {extraInfo.reward && (
              <Badge variant="secondary" className="mt-2">
                💰 Reward: {extraInfo.reward}
              </Badge>
            )}
          </div>
        )}

        {/* Actions */}
        {showActions && onDelete && (
          <div className="flex gap-2 mt-4 pt-4 border-t border-border">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete {pet.name}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently remove your pet from the system.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(pet.id)} className="bg-destructive hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </div>
  );
}
