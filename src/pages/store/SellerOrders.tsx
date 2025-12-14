import { MainLayout } from "@/components/layout/MainLayout";
import { EmptyState } from "@/components/ui/empty-state";
import { ShoppingCart } from "lucide-react";

const SellerOrders = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-heading font-bold mb-8">Store Orders</h1>
        <EmptyState
          icon={<ShoppingCart className="w-16 h-16" />}
          title="No Orders Yet"
          description="You'll see orders here when customers purchase your products."
        />
      </div>
    </MainLayout>
  );
};

export default SellerOrders;
