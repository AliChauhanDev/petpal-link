import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, Copy, Check, User } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: {
    name: string;
    phone?: string;
  };
  petName: string;
  variant?: "lost" | "found" | "default";
}

export default function ContactModal({ 
  open, 
  onOpenChange, 
  contact, 
  petName,
  variant = "default" 
}: ContactModalProps) {
  const { toast } = useToast();
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleCopyPhone = async () => {
    if (contact.phone) {
      await navigator.clipboard.writeText(contact.phone);
      setCopiedPhone(true);
      toast({
        title: "Copied!",
        description: "Phone number copied to clipboard",
      });
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Contact {variant === "found" ? "Finder" : "Owner"}
          </DialogTitle>
          <DialogDescription>
            Get in touch about {petName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Owner Name */}
          <div className="bg-muted/50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Owner Name</p>
                <p className="font-semibold text-foreground text-lg">{contact.name}</p>
              </div>
            </div>
          </div>

          {/* Phone Number with Copy */}
          {contact.phone && (
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone Number</p>
                    <p className="font-semibold text-foreground text-lg">{contact.phone}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleCopyPhone}
                  className="gap-2"
                >
                  {copiedPhone ? (
                    <>
                      <Check className="w-4 h-4 text-teal" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {!contact.phone && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No contact information available</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
