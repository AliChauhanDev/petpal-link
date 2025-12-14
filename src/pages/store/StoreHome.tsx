import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, Store, Package, ShoppingCart, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const StoreHome = () => {
  const { user, isSeller } = useAuth();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-3xl gradient-store flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-heading font-bold text-foreground mb-4">Pet Store</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Shop premium pet products from trusted sellers or start your own store.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="hover-lift">
            <CardContent className="p-8 text-center">
              <ShoppingCart className="w-12 h-12 text-store-primary mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">I'm a Buyer</h2>
              <p className="text-muted-foreground mb-6">Browse and shop pet products</p>
              <Button asChild className="w-full">
                <Link to="/store/products">
                  Browse Products <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-8 text-center">
              <Store className="w-12 h-12 text-store-primary mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">I'm a Seller</h2>
              <p className="text-muted-foreground mb-6">Manage your store and products</p>
              {isSeller ? (
                <Button asChild className="w-full">
                  <Link to="/store/seller">
                    Seller Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              ) : (
                <Button asChild className="w-full" variant={user ? "default" : "outline"}>
                  <Link to={user ? "/store/create-store" : "/auth"}>
                    {user ? "Create Store" : "Sign In to Sell"} <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default StoreHome;
