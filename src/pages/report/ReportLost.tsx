import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const ReportLost = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ pet_name: "", pet_type: "dog", breed: "", color: "", description: "", last_seen_location: "", last_seen_date: "", contact_phone: "", reward: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const { error } = await supabase.from("lost_reports").insert({ ...form, user_id: user.id, pet_type: form.pet_type as any });
    
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "Report Submitted", description: "We hope you find your pet soon!" });
      navigate("/report/lost");
    }
    setLoading(false);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader><CardTitle>Report Lost Pet</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Pet Name *</Label><Input required value={form.pet_name} onChange={(e) => setForm({ ...form, pet_name: e.target.value })} /></div>
                <div><Label>Pet Type *</Label>
                  <Select value={form.pet_type} onValueChange={(v) => setForm({ ...form, pet_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dog">Dog</SelectItem>
                      <SelectItem value="cat">Cat</SelectItem>
                      <SelectItem value="bird">Bird</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Breed</Label><Input value={form.breed} onChange={(e) => setForm({ ...form, breed: e.target.value })} /></div>
                <div><Label>Color</Label><Input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} /></div>
              </div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div><Label>Last Seen Location *</Label><Input required value={form.last_seen_location} onChange={(e) => setForm({ ...form, last_seen_location: e.target.value })} /></div>
              <div><Label>Last Seen Date *</Label><Input type="date" required value={form.last_seen_date} onChange={(e) => setForm({ ...form, last_seen_date: e.target.value })} /></div>
              <div><Label>Contact Phone *</Label><Input required value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} /></div>
              <div><Label>Reward (optional)</Label><Input value={form.reward} onChange={(e) => setForm({ ...form, reward: e.target.value })} placeholder="e.g., $100" /></div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" /> Submitting...</> : "Submit Report"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ReportLost;
