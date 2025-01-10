import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";
import { Pencil, Search, Trash2 } from "lucide-react";
import { UserManagement } from "@/components/admin/UserManagement";

export default function AdminPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    category: "",
  });
  const location = useLocation();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;
      setProducts(data || []);
      setFilteredProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Məhsulları yükləyərkən xəta baş verdi",
      });
    }
  };

  const handleAddProduct = async () => {
    try {
      const { error } = await supabase.from("products").insert([
        {
          name: newProduct.name,
          price: parseFloat(newProduct.price),
          description: newProduct.description,
          image: newProduct.image,
          category: newProduct.category,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Uğurlu",
        description: "Məhsul əlavə edildi",
      });

      setNewProduct({
        name: "",
        price: "",
        description: "",
        image: "",
        category: "",
      });

      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Məhsul əlavə edilmədi",
      });
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    try {
      const { error } = await supabase
        .from("products")
        .update({
          name: editingProduct.name,
          price: editingProduct.price,
          description: editingProduct.description,
          image: editingProduct.image,
          category: editingProduct.category,
        })
        .eq("id", editingProduct.id);

      if (error) throw error;

      toast({
        title: "Uğurlu",
        description: "Məhsul yeniləndi",
      });

      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Məhsul yenilənmədi",
      });
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      // First, delete all basket items referencing this product
      const { error: basketError } = await supabase
        .from('basket')
        .delete()
        .eq('product_id', id);

      if (basketError) throw basketError;

      // Then delete the product itself
      const { error: productError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (productError) throw productError;

      toast({
        title: "Uğurlu",
        description: "Məhsul silindi",
      });

      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Məhsul silinmədi",
      });
    }
  };

  const DashboardView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'məhsul' : 'məhsul'} tapıldı
          </p>
        </div>
        
        <div className="relative w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Məhsulları axtar..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
                <tr key={product.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="p-4">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.description}</div>
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

  const AddProductView = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Məhsul Əlavə Et</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ad</Label>
            <Input 
              id="name" 
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              placeholder="Məhsulun adı" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Qiymət</Label>
            <Input 
              id="price" 
              type="number" 
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              placeholder="Qiymət" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Təsvir</Label>
            <Textarea 
              id="description" 
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              placeholder="Məhsul haqqında məlumat" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Şəkil URL</Label>
            <Input 
              id="image" 
              value={newProduct.image}
              onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
              placeholder="Şəklin linki" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Kateqoriya</Label>
            <Input 
              id="category" 
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              placeholder="Kateqoriya" 
            />
          </div>
          <Button onClick={handleAddProduct} className="w-full">Əlavə et</Button>
        </div>
      </div>
    </div>
  );

  const ProductsView = () => (
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
                <tr key={product.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="p-4">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.description}</div>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <main className="pl-[240px] p-8">
        <div className="max-w-[1200px] mx-auto">
          <Routes>
            <Route path="/" element={<DashboardView />} />
            <Route path="/admin/add" element={<AddProductView />} />
            <Route path="/admin/products" element={<ProductsView />} />
            <Route path="/admin/users" element={<UserManagement />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
