import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const ProductDetail = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/store/products"><ArrowLeft className="mr-2 w-4 h-4" /> Back to Products</Link>
        </Button>
        <Card>
          <CardContent className="p-8 text-center">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-heading font-bold mb-2">Product Detail</h1>
            <p className="text-muted-foreground">Product details coming soon.</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ProductDetail;
