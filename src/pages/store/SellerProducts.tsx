import { MainLayout } from "@/components/layout/MainLayout";
import { EmptyState } from "@/components/ui/empty-state";
import { Package } from "lucide-react";

const SellerProducts = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-heading font-bold mb-8">My Products</h1>
        <EmptyState
          icon={<Package className="w-16 h-16" />}
          title="No Products Yet"
          description="Start adding products to your store."
          action={{ label: "Add Product", href: "/store/seller/add-product" }}
        />
      </div>
    </MainLayout>
  );
};

export default SellerProducts;
