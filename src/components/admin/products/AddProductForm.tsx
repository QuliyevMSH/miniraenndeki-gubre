import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AddProductFormProps {
  newProduct: {
    name: string;
    price: string;
    description: string;
    image: string;
    category: string;
  };
  setNewProduct: (product: {
    name: string;
    price: string;
    description: string;
    image: string;
    category: string;
  }) => void;
  handleAddProduct: () => void;
}

export const AddProductForm = ({
  newProduct,
  setNewProduct,
  handleAddProduct,
}: AddProductFormProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Məhsul Əlavə Et</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ad</Label>
            <Input
              id="name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              placeholder="Məhsulun adı"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Qiymət</Label>
            <Input
              id="price"
              type="number"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
              placeholder="Qiymət"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Təsvir</Label>
            <Textarea
              id="description"
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
              placeholder="Məhsul haqqında məlumat"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Şəkil URL</Label>
            <Input
              id="image"
              value={newProduct.image}
              onChange={(e) =>
                setNewProduct({ ...newProduct, image: e.target.value })
              }
              placeholder="Şəklin linki"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Kateqoriya</Label>
            <Input
              id="category"
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
              placeholder="Kateqoriya"
            />
          </div>
          <Button onClick={handleAddProduct} className="w-full">
            Əlavə et
          </Button>
        </div>
      </div>
    </div>
  );
};