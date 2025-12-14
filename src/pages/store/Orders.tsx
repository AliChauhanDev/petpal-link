import { MainLayout } from "@/components/layout/MainLayout";
import { EmptyState } from "@/components/ui/empty-state";
import { Package } from "lucide-react";

const Orders = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-heading font-bold mb-8">My Orders</h1>
        <EmptyState
          icon={<Package className="w-16 h-16" />}
          title="No Orders Yet"
          description="You haven't placed any orders yet."
          action={{ label: "Start Shopping", href: "/store/products" }}
        />
      </div>
    </MainLayout>
  );
};

export default Orders;
