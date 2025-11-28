import { useState } from "react";
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
import { Heart, Upload, Loader2, ArrowLeft } from "lucide-react";

const petTypes = [
  { value: "dog", label: "🐕 Dog" },
  { value: "cat", label: "🐱 Cat" },
  { value: "bird", label: "🐦 Bird" },
  { value: "rabbit", label: "🐰 Rabbit" },
  { value: "fish", label: "🐟 Fish" },
  { value: "hamster", label: "🐹 Hamster" },
  { value: "other", label: "🐾 Other" },
];

export default function ReportFound() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    pet_name: "",
    pet_type: "dog",
    description: "",
    found_location: "",
    found_date: "",
    contact_phone: "",
    contact_email: "",
  });

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

    if (!formData.found_location || !formData.found_date || !formData.contact_phone) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      let imageUrl = null;

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `found/${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("pet-images")
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("pet-images")
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      const { error } = await supabase.from("found_reports").insert({
        user_id: user.id,
        pet_name: formData.pet_name.trim() || null,
        pet_type: formData.pet_type as any,
        description: formData.description.trim() || null,
        found_location: formData.found_location.trim(),
        found_date: formData.found_date,
        contact_phone: formData.contact_phone.trim(),
        contact_email: formData.contact_email.trim() || null,
        image_url: imageUrl,
      });

      if (error) throw error;

      toast({
        title: "Report submitted!",
        description: "Thank you for helping reunite pets with their owners.",
      });
      navigate("/found-pets");
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
            <div className="w-14 h-14 bg-teal-light rounded-xl flex items-center justify-center">
              <Heart className="w-7 h-7 text-teal" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">Report Found Pet</h1>
              <p className="text-muted-foreground">Help reunite this pet with its owner</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Pet Photo (recommended)</Label>
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
                <Label htmlFor="pet_name">Pet Name (if known)</Label>
                <Input
                  id="pet_name"
                  name="pet_name"
                  placeholder="e.g., tag name"
                  value={formData.pet_name}
                  onChange={handleChange}
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
                <Label htmlFor="found_location">Found Location *</Label>
                <Input
                  id="found_location"
                  name="found_location"
                  placeholder="e.g., Downtown Street, LA"
                  value={formData.found_location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="found_date">Found Date *</Label>
                <Input
                  id="found_date"
                  name="found_date"
                  type="date"
                  value={formData.found_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_phone">Your Phone *</Label>
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
                <Label htmlFor="contact_email">Your Email</Label>
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
                placeholder="Describe the pet - color, size, any tags or collars, behavior, where exactly you found them..."
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <Button type="submit" variant="teal" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4" />
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
