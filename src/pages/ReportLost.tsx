import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Upload, Loader2, ArrowLeft } from "lucide-react";

const petTypes = [
  { value: "dog", label: "🐕 Dog" },
  { value: "cat", label: "🐱 Cat" },
  { value: "bird", label: "🐦 Bird" },
  { value: "rabbit", label: "🐰 Rabbit" },
  { value: "fish", label: "🐟 Fish" },
  { value: "hamster", label: "🐹 Hamster" },
  { value: "other", label: "🐾 Other" },
];

interface Pet {
  id: string;
  name: string;
  pet_type: string;
  image_url: string | null;
}

export default function ReportLost() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [myPets, setMyPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    pet_name: "",
    pet_type: "dog",
    description: "",
    last_seen_location: "",
    last_seen_date: "",
    contact_phone: "",
    contact_email: "",
    reward: "",
  });

  useEffect(() => {
    const fetchMyPets = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("pets")
        .select("id, name, pet_type, image_url")
        .eq("user_id", user.id);
      setMyPets(data || []);
    };
    fetchMyPets();
  }, [user]);

  const handlePetSelect = (petId: string) => {
    setSelectedPet(petId);
    const pet = myPets.find((p) => p.id === petId);
    if (pet) {
      setFormData((prev) => ({
        ...prev,
        pet_name: pet.name,
        pet_type: pet.pet_type,
      }));
      if (pet.image_url) {
        setImagePreview(pet.image_url);
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          variant: "destructive",
        });
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.pet_name || !formData.last_seen_location || !formData.last_seen_date || !formData.contact_phone) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      let imageUrl = imagePreview;

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `lost/${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("pet-images")
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("pet-images")
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      const { error } = await supabase.from("lost_reports").insert({
        user_id: user.id,
        pet_id: selectedPet || null,
        pet_name: formData.pet_name.trim(),
        pet_type: formData.pet_type as any,
        description: formData.description.trim() || null,
        last_seen_location: formData.last_seen_location.trim(),
        last_seen_date: formData.last_seen_date,
        contact_phone: formData.contact_phone.trim(),
        contact_email: formData.contact_email.trim() || null,
        image_url: imageUrl,
        reward: formData.reward.trim() || null,
      });

      if (error) throw error;

      toast({
        title: "Report submitted!",
        description: "We hope you find your pet soon.",
      });
      navigate("/lost-pets");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit report",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="bg-card rounded-2xl p-8 border border-border animate-fade-in">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-amber-light rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-amber" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">Report Lost Pet</h1>
              <p className="text-muted-foreground">We'll help spread the word</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Select from my pets */}
            {myPets.length > 0 && (
              <div className="space-y-2">
                <Label>Select from your registered pets (optional)</Label>
                <Select value={selectedPet} onValueChange={handlePetSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a pet" />
                  </SelectTrigger>
                  <SelectContent>
                    {myPets.map((pet) => (
                      <SelectItem key={pet.id} value={pet.id}>
                        {pet.name} ({pet.pet_type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Pet Photo</Label>
              <div className="flex items-center gap-4">
                <div className="w-32 h-32 rounded-2xl bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <Input type="file" accept="image/*" onChange={handleImageChange} className="max-w-xs" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pet_name">Pet Name *</Label>
                <Input
                  id="pet_name"
                  name="pet_name"
                  value={formData.pet_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pet_type">Pet Type *</Label>
                <Select
                  value={formData.pet_type}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, pet_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {petTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_seen_location">Last Seen Location *</Label>
                <Input
                  id="last_seen_location"
                  name="last_seen_location"
                  placeholder="e.g., Central Park, NYC"
                  value={formData.last_seen_location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_seen_date">Last Seen Date *</Label>
                <Input
                  id="last_seen_date"
                  name="last_seen_date"
                  type="date"
                  value={formData.last_seen_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_phone">Contact Phone *</Label>
                <Input
                  id="contact_phone"
                  name="contact_phone"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={formData.contact_phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                  id="contact_email"
                  name="contact_email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.contact_email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your pet, any distinctive features, circumstances of going missing..."
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reward">Reward (optional)</Label>
              <Input
                id="reward"
                name="reward"
                placeholder="e.g., $100"
                value={formData.reward}
                onChange={handleChange}
              />
            </div>

            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4" />
                  Submit Report
                </>
              )}
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
