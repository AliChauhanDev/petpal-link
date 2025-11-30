import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QrCode, Download, Printer } from "lucide-react";
import { useRef } from "react";

interface PetQRCodeProps {
  petId: string;
  petName: string;
}

export default function PetQRCode({ petId, petName }: PetQRCodeProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const petUrl = `${window.location.origin}/pet/${petId}`;

  const downloadQRCode = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = 300;
      canvas.height = 350;
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 25, 25, 250, 250);
        ctx.fillStyle = "#000000";
        ctx.font = "bold 16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(petName, 150, 310);
        ctx.font = "12px sans-serif";
        ctx.fillText("Scan to view pet details", 150, 330);
      }

      const link = document.createElement("a");
      link.download = `${petName}-qr-code.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const printQRCode = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code - ${petName}</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              font-family: system-ui, sans-serif;
            }
            .qr-container {
              text-align: center;
              padding: 40px;
              border: 2px dashed #ccc;
              border-radius: 16px;
            }
            h1 { margin: 20px 0 8px; font-size: 24px; }
            p { color: #666; margin: 0; }
            @media print {
              .qr-container { border: none; }
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            ${svgData}
            <h1>${petName}</h1>
            <p>Scan to view pet details</p>
          </div>
          <script>window.print(); window.close();</script>
        </body>
      </html>
    `);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <QrCode className="w-4 h-4" />
          QR Code
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Pet QR Code</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center py-6">
          <div
            ref={qrRef}
            className="bg-card p-6 rounded-2xl border border-border shadow-md"
          >
            <QRCodeSVG
              value={petUrl}
              size={200}
              level="H"
              includeMargin={true}
              bgColor="transparent"
              fgColor="currentColor"
              className="text-foreground"
            />
          </div>
          <h3 className="font-display font-bold text-lg mt-4">{petName}</h3>
          <p className="text-muted-foreground text-sm">Scan to view pet details</p>

          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={downloadQRCode} className="gap-2">
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Button variant="outline" onClick={printQRCode} className="gap-2">
              <Printer className="w-4 h-4" />
              Print
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-4 text-center max-w-xs">
            Print this QR code and attach it to your pet's collar for quick identification
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
