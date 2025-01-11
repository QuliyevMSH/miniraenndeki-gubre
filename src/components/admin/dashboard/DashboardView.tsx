import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Product } from "@/types";

interface DashboardViewProps {
  filteredProducts: Product[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const DashboardView = ({
  filteredProducts,
  searchQuery,
  setSearchQuery,
}: DashboardViewProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "məhsul" : "məhsul"} tapıldı
          </p>
        </div>

        <div className="relative w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Məhsulları axtar..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoComplete="off"
            autoFocus={false}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-4">Şəkil</th>
                <th className="text-left p-4">Ad</th>
                <th className="text-left p-4">Kateqoriya</th>
                <th className="text-left p-4">Qiymət</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};