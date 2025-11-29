import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  PawPrint, ArrowLeft, Loader2, Edit, Trash2, AlertTriangle, 
  Calendar, MapPin, Phone, Mail, User
} from "lucide-react";
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
import ContactModal from "@/components/ContactModal";
import { format } from "date-fns";

interface Pet {
  id: string;
  name: string;
  pet_type: string;
  breed: string | null;
  age: string | null;
  description: string | null;
  image_url: string | null;
  color: string | null;
  gender: string | null;
  is_lost: boolean;
  created_at: string;
  user_id: string;
}

interface Profile {
  full_name: string | null;
  phone: string | null;
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

export default function PetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [pet, setPet] = useState<Pet | null>(null);
  const [owner, setOwner] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    const fetchPet = async () => {
      if (!id) return;

      try {
        const { data: petData, error: petError } = await supabase
          .from("pets")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (petError) throw petError;
        if (!petData) {
          navigate("/not-found");
          return;
        }

        setPet(petData);

        // Fetch owner info
        const { data: profileData } = await supabase
          .from("profiles")
          .select("full_name, phone")
          .eq("user_id", petData.user_id)
          .maybeSingle();

        setOwner(profileData);
      } catch (error) {
        console.error("Error fetching pet:", error);
        toast({
          title: "Error",
          description: "Failed to load pet details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id, navigate, toast]);

  const handleDelete = async () => {
    if (!pet) return;

    try {
      const { error } = await supabase.from("pets").delete().eq("id", pet.id);
      if (error) throw error;

      toast({
        title: "Pet deleted",
        description: "Your pet has been removed successfully.",
      });
      navigate("/my-pets");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete pet",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!pet) {
    return null;
  }

  const isOwner = user?.id === pet.user_id;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="animate-fade-in">
            <div className="relative rounded-2xl overflow-hidden bg-muted aspect-square">
              {pet.image_url ? (
                <img
                  src={pet.image_url}
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <PawPrint className="w-32 h-32 text-muted-foreground" />
                </div>
              )}
              
              {pet.is_lost && (
                <div className="absolute top-4 left-4">
                  <Badge variant="destructive" className="text-lg px-4 py-2">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    LOST
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="animate-slide-in-right">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-display font-bold text-foreground flex items-center gap-3">
                  {petTypeEmojis[pet.pet_type] || "🐾"} {pet.name}
                </h1>
                <p className="text-lg text-muted-foreground capitalize mt-1">
                  {pet.pet_type}
                </p>
              </div>
              
              {isOwner && (
                <div className="flex gap-2">
                  <Link to={`/edit-pet/${pet.id}`}>
                    <Button variant="outline" size="icon">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon" className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete {pet.name}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>

            <div className="bg-card rounded-2xl border border-border p-6 mb-6">
              <h2 className="font-display font-bold text-foreground mb-4">Details</h2>
              <div className="grid grid-cols-2 gap-4">
                {pet.breed && (
                  <div>
                    <p className="text-sm text-muted-foreground">Breed</p>
                    <p className="font-medium text-foreground">{pet.breed}</p>
                  </div>
                )}
                {pet.age && (
                  <div>
                    <p className="text-sm text-muted-foreground">Age</p>
                    <p className="font-medium text-foreground">{pet.age}</p>
                  </div>
                )}
                {pet.gender && (
                  <div>
                    <p className="text-sm text-muted-foreground">Gender</p>
                    <p className="font-medium text-foreground capitalize">{pet.gender}</p>
                  </div>
                )}
                {pet.color && (
                  <div>
                    <p className="text-sm text-muted-foreground">Color</p>
                    <p className="font-medium text-foreground">{pet.color}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Registered</p>
                  <p className="font-medium text-foreground">
                    {format(new Date(pet.created_at), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
            </div>

            {pet.description && (
              <div className="bg-card rounded-2xl border border-border p-6 mb-6">
                <h2 className="font-display font-bold text-foreground mb-2">Description</h2>
                <p className="text-muted-foreground">{pet.description}</p>
              </div>
            )}

            {/* Owner Info */}
            {owner && !isOwner && (
              <div className="bg-card rounded-2xl border border-border p-6 mb-6">
                <h2 className="font-display font-bold text-foreground mb-4">Owner</h2>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{owner.full_name || "Pet Owner"}</p>
                    <p className="text-sm text-muted-foreground">Pet Owner</p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            {!isOwner && (
              <Button variant="hero" size="lg" className="w-full" onClick={() => setContactOpen(true)}>
                <Phone className="w-5 h-5" />
                Contact Owner
              </Button>
            )}
          </div>
        </div>
      </main>

      <Footer />

      <ContactModal
        open={contactOpen}
        onOpenChange={setContactOpen}
        contact={{
          name: owner?.full_name || "Pet Owner",
          phone: owner?.phone || "Not available",
        }}
        petName={pet.name}
      />
    </div>
  );
}
