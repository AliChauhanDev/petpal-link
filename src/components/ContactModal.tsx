import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Copy, MessageCircle, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: {
    name: string;
    phone?: string;
    email?: string;
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
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Contact info copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCall = () => {
    if (contact.phone) {
      window.location.href = `tel:${contact.phone}`;
    }
  };

  const handleWhatsApp = () => {
    if (contact.phone) {
      const message = variant === "lost" 
        ? `Hi! I'm contacting you about ${petName}. I might have information about your lost pet.`
        : variant === "found"
        ? `Hi! I'm contacting you about ${petName}. I believe this might be my pet.`
        : `Hi! I'm contacting you about ${petName}.`;
      const url = `https://wa.me/${contact.phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank");
    }
  };

  const handleEmail = () => {
    if (contact.email) {
      const subject = variant === "lost" 
        ? `Information about your lost pet: ${petName}`
        : variant === "found"
        ? `Inquiry about found pet: ${petName}`
        : `About ${petName}`;
      window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}`;
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
          <div className="bg-muted/50 rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">Contact Person</p>
            <p className="font-semibold text-foreground text-lg">{contact.name}</p>
          </div>

          {contact.phone && (
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium text-foreground">{contact.phone}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleCopy(contact.phone!)}
                >
                  {copied ? <Check className="w-4 h-4 text-teal" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={handleCall}>
                  <Phone className="w-4 h-4" />
                  Call
                </Button>
                <Button variant="hero" className="flex-1" onClick={handleWhatsApp}>
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </Button>
              </div>
            </div>
          )}

          {contact.email && (
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{contact.email}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full" onClick={handleEmail}>
                <Mail className="w-4 h-4" />
                Send Email
              </Button>
            </div>
          )}

          {!contact.phone && !contact.email && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No contact information available</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
