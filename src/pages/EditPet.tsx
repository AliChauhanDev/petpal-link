import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PawPrint, ArrowLeft, Loader2, Upload, X } from "lucide-react";

const petTypes = [
  { value: "dog", label: "🐕 Dog" },
  { value: "cat", label: "🐱 Cat" },
  { value: "bird", label: "🐦 Bird" },
  { value: "rabbit", label: "🐰 Rabbit" },
  { value: "fish", label: "🐟 Fish" },
  { value: "hamster", label: "🐹 Hamster" },
  { value: "other", label: "🐾 Other" },
];

type PetType = "dog" | "cat" | "bird" | "rabbit" | "fish" | "hamster" | "other";

export default function EditPet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    pet_type: "dog" as PetType,
    breed: "",
    age: "",
    gender: "",
    color: "",
    description: "",
    image_url: "",
    is_lost: false,
  });

  useEffect(() => {
    const fetchPet = async () => {
      if (!id || !user) return;

      try {
        const { data, error } = await supabase
          .from("pets")
          .select("*")
          .eq("id", id)
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;
        if (!data) {
          toast({
            title: "Not found",
            description: "Pet not found or you don't have permission to edit it.",
            variant: "destructive",
          });
          navigate("/my-pets");
          return;
        }

        setFormData({
          name: data.name,
          pet_type: data.pet_type as PetType,
          breed: data.breed || "",
          age: data.age || "",
          gender: data.gender || "",
          color: data.color || "",
          description: data.description || "",
          image_url: data.image_url || "",
          is_lost: data.is_lost || false,
        });
        setOriginalIsLost(data.is_lost || false);
        setImagePreview(data.image_url);
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
  }, [id, user, navigate, toast]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file",
          description: "Please upload an image file (JPEG, PNG, etc.)",
          variant: "destructive",
        });
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image_url: "" }));
  };

  const [originalIsLost, setOriginalIsLost] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;

    setSubmitting(true);

    try {
      let imageUrl = formData.image_url;

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${user.id}/${id}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("pet-images")
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("pet-images")
          .getPublicUrl(fileName);

        imageUrl = urlData.publicUrl;
      }

      const { error } = await supabase
        .from("pets")
        .update({
          name: formData.name,
          pet_type: formData.pet_type,
          breed: formData.breed || null,
          age: formData.age || null,
          gender: formData.gender || null,
          color: formData.color || null,
          description: formData.description || null,
          image_url: imageUrl || null,
          is_lost: formData.is_lost,
        })
        .eq("id", id);

      if (error) throw error;

      // Auto-create lost report if pet was just marked as lost
      if (formData.is_lost && !originalIsLost) {
        // Get user profile for contact info
        const { data: profile } = await supabase
          .from("profiles")
          .select("phone, full_name")
          .eq("user_id", user.id)
          .single();

        const { error: reportError } = await supabase
          .from("lost_reports")
          .insert({
            user_id: user.id,
            pet_id: id,
            pet_name: formData.name,
            pet_type: formData.pet_type,
            description: formData.description || `Lost ${formData.pet_type}: ${formData.name}`,
            last_seen_location: "Please update location",
            last_seen_date: new Date().toISOString().split("T")[0],
            contact_phone: profile?.phone || "No phone provided",
            image_url: imageUrl || null,
            status: "active",
          });

        if (reportError) {
          console.error("Error creating lost report:", reportError);
        } else {
          toast({
            title: "Lost Report Created",
            description: `A lost report for ${formData.name} has been automatically created. Please update the location details.`,
          });
        }
      }

      toast({
        title: "Success!",
        description: "Pet updated successfully.",
      });
      navigate(`/pet/${id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update pet",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center">
              <PawPrint className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">Edit Pet</h1>
              <p className="text-muted-foreground">Update {formData.name}'s information</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-6 space-y-6">
            {/* Image Upload */}
            <div>
              <Label>Pet Photo</Label>
              <div className="mt-2">
                {imagePreview ? (
                  <div className="relative w-full h-48 rounded-xl overflow-hidden">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Click to upload photo</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Pet Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pet_type">Pet Type *</Label>
                <Select value={formData.pet_type} onValueChange={(v) => setFormData(prev => ({ ...prev, pet_type: v as PetType }))}>
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
                <Label htmlFor="breed">Breed</Label>
                <Input
                  id="breed"
                  value={formData.breed}
                  onChange={(e) => setFormData(prev => ({ ...prev, breed: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                  placeholder="e.g., 2 years"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(v) => setFormData(prev => ({ ...prev, gender: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                placeholder="Tell us about your pet..."
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
              <div>
                <Label htmlFor="is_lost" className="text-base font-semibold">Mark as Lost</Label>
                <p className="text-sm text-muted-foreground">Enable if your pet is currently missing</p>
              </div>
              <Switch
                id="is_lost"
                checked={formData.is_lost}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_lost: checked }))}
              />
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" variant="hero" className="flex-1" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
