import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { Pencil, Trash2 } from "lucide-react";

interface ProductsTableProps {
  products: Product[];
  setEditingProduct: (product: Product) => void;
  handleDeleteProduct: (id: number) => void;
}

export const ProductsTable = ({
  products,
  setEditingProduct,
  handleDeleteProduct,
}: ProductsTableProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Məhsullar</h1>
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-4">Şəkil</th>
                <th className="text-left p-4">Ad</th>
                <th className="text-left p-4">Kateqoriya</th>
                <th className="text-left p-4">Qiymət</th>
                <th className="text-left p-4">Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="p-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="p-4">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-500">
                      {product.description}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-4">{product.price} AZN</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setEditingProduct(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};