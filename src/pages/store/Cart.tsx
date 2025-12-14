import { MainLayout } from "@/components/layout/MainLayout";
import { EmptyState } from "@/components/ui/empty-state";
import { ShoppingCart } from "lucide-react";

const Cart = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-heading font-bold mb-8">Shopping Cart</h1>
        <EmptyState
          icon={<ShoppingCart className="w-16 h-16" />}
          title="Your Cart is Empty"
          description="Start shopping to add items to your cart."
          action={{ label: "Browse Products", href: "/store/products" }}
        />
      </div>
    </MainLayout>
  );
};

export default Cart;
