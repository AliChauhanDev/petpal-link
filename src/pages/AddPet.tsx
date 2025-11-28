import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { PawPrint, Upload, Loader2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const petTypes = [
  { value: "dog", label: "🐕 Dog" },
  { value: "cat", label: "🐱 Cat" },
  { value: "bird", label: "🐦 Bird" },
  { value: "rabbit", label: "🐰 Rabbit" },
  { value: "fish", label: "🐟 Fish" },
  { value: "hamster", label: "🐹 Hamster" },
  { value: "other", label: "🐾 Other" },
];

export default function AddPet() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    pet_type: "dog",
    breed: "",
    age: "",
    gender: "",
    color: "",
    description: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPEG, PNG, etc.)",
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

    if (!formData.name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your pet's name",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      let imageUrl = null;

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("pet-images")
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("pet-images")
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      const { error } = await supabase.from("pets").insert({
        user_id: user.id,
        name: formData.name.trim(),
        pet_type: formData.pet_type as any,
        breed: formData.breed.trim() || null,
        age: formData.age.trim() || null,
        gender: formData.gender || null,
        color: formData.color.trim() || null,
        description: formData.description.trim() || null,
        image_url: imageUrl,
      });

      if (error) throw error;

      toast({
        title: "Pet added!",
        description: `${formData.name} has been registered successfully.`,
      });
      navigate("/my-pets");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add pet. Please try again.",
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
            <div className="w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center">
              <PawPrint className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">Add New Pet</h1>
              <p className="text-muted-foreground">Register your furry friend</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="max-w-xs"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    JPEG, PNG (Max 5MB)
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pet Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Pet Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Buddy"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Pet Type */}
              <div className="space-y-2">
                <Label htmlFor="pet_type">Pet Type *</Label>
                <Select
                  value={formData.pet_type}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, pet_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select pet type" />
                  </SelectTrigger>
                  <SelectContent>
                    {petTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Breed */}
              <div className="space-y-2">
                <Label htmlFor="breed">Breed</Label>
                <Input
                  id="breed"
                  name="breed"
                  placeholder="e.g., Golden Retriever"
                  value={formData.breed}
                  onChange={handleChange}
                />
              </div>

              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  placeholder="e.g., 2 years"
                  value={formData.age}
                  onChange={handleChange}
                />
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Color */}
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  name="color"
                  placeholder="e.g., Golden, Brown"
                  value={formData.color}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Tell us more about your pet..."
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding Pet...
                </>
              ) : (
                <>
                  <PawPrint className="w-4 h-4" />
                  Add Pet
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
