import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const AddProduct = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Product Name</Label>
              <Input placeholder="Enter product name" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea placeholder="Enter product description" />
            </div>
            <div>
              <Label>Price</Label>
              <Input type="number" placeholder="0.00" />
            </div>
            <Button className="w-full">Add Product</Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AddProduct;
