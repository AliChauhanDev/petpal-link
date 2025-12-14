import { MainLayout } from "@/components/layout/MainLayout";
import { EmptyState } from "@/components/ui/empty-state";
import { Search } from "lucide-react";

const Matches = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-heading font-bold mb-8">Pet Matches</h1>
        <EmptyState icon={<Search className="w-16 h-16" />} title="No Matches Yet" description="When lost pets match found reports, they'll appear here." />
      </div>
    </MainLayout>
  );
};

export default Matches;
