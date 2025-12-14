import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";

const Checkout = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-heading font-bold mb-8">Checkout</h1>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Checkout functionality coming soon.</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Checkout;
