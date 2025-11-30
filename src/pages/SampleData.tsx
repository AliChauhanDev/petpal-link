import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { insertSampleData, clearSampleData } from "@/utils/sampleData";
import { toast } from "sonner";
import { Database, Loader2, Trash2, Check, AlertCircle } from "lucide-react";

export default function SampleData() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);

  const handleInsert = async () => {
    if (!user) {
      toast.error("Please login first");
      navigate("/auth");
      return;
    }

    setLoading(true);
    const result = await insertSampleData(user.id);
    setLoading(false);

    if (result.success) {
      toast.success(
        `Added ${result.inserted.pets} pets, ${result.inserted.lostReports} lost reports, ${result.inserted.foundReports} found reports`
      );
    } else {
      toast.warning(`Partial success. Errors: ${result.errors.length}`);
      console.error(result.errors);
    }
  };

  const handleClear = async () => {
    if (!user) {
      toast.error("Please login first");
      return;
    }

    setClearing(true);
    await clearSampleData(user.id);
    setClearing(false);
    toast.success("All your data has been cleared");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12 animate-fade-in">
            <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Database className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">
              Sample Data Manager
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Add sample pets and reports to test the platform, or clear your data to start fresh
            </p>
          </div>

          {/* Actions */}
          <div className="bg-card rounded-2xl border border-border p-8 space-y-8 animate-fade-in">
            {/* Insert Sample Data */}
            <div className="text-left">
              <h2 className="font-display font-bold text-foreground mb-2 flex items-center gap-2">
                <Check className="w-5 h-5 text-accent" />
                Insert Sample Data
              </h2>
              <p className="text-muted-foreground text-sm mb-4">
                This will add 6 sample pets, 3 lost pet reports, and 3 found pet reports to your
                account. Great for testing and demo purposes.
              </p>
              <div className="bg-muted rounded-lg p-4 mb-4">
                <p className="text-sm text-foreground font-medium mb-2">Includes:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 6 pets (dogs, cats, bird, rabbit) with images</li>
                  <li>• 3 lost pet reports in different locations</li>
                  <li>• 3 found pet reports with descriptions</li>
                </ul>
              </div>
              <Button onClick={handleInsert} disabled={loading || !user} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Inserting Data...
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4" />
                    Insert Sample Data
                  </>
                )}
              </Button>
            </div>

            <div className="border-t border-border" />

            {/* Clear Data */}
            <div className="text-left">
              <h2 className="font-display font-bold text-foreground mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-destructive" />
                Clear All Data
              </h2>
              <p className="text-muted-foreground text-sm mb-4">
                This will permanently delete all your pets and reports. This action cannot be
                undone.
              </p>
              <Button
                variant="destructive"
                onClick={handleClear}
                disabled={clearing || !user}
                className="w-full"
              >
                {clearing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Clearing Data...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Clear All My Data
                  </>
                )}
              </Button>
            </div>

            {!user && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <p className="text-amber-600 text-sm">
                  Please{" "}
                  <button
                    onClick={() => navigate("/auth")}
                    className="underline font-semibold"
                  >
                    login
                  </button>{" "}
                  to use the sample data manager.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
