import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  Users,
} from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const AdminSidebar = () => {
  const location = useLocation();
  
  return (
    <div className="fixed left-0 top-0 h-screen w-[240px] bg-blue-600 text-white p-6 flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">eProduct</h2>
      </div>
      
      <nav className="space-y-2 flex-1">
        <SidebarLink 
          icon={<LayoutDashboard />} 
          href="/admin" 
          label="Dashboard" 
          isActive={location.pathname === '/admin'}
        />
        <Drawer>
          <DrawerTrigger asChild>
            <button className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left
              ${location.pathname === '/admin/add' 
                ? 'bg-white/20 text-white' 
                : 'text-white/80 hover:text-white hover:bg-white/10'}`}>
              <PlusCircle className="h-4 w-4" />
              <span>Əlavə et</span>
            </button>
          </DrawerTrigger>
          <DrawerContent side="right" className="w-[400px]">
            <DrawerHeader>
              <DrawerTitle>Yeni məhsul əlavə et</DrawerTitle>
            </DrawerHeader>
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Ad</Label>
                <Input id="name" placeholder="Məhsulun adı" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Qiymət</Label>
                <Input id="price" type="number" placeholder="Qiymət" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Təsvir</Label>
                <Textarea id="description" placeholder="Məhsul haqqında məlumat" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Şəkil URL</Label>
                <Input id="image" placeholder="Şəklin linki" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Kateqoriya</Label>
                <Input id="category" placeholder="Kateqoriya" />
              </div>
              <Button className="w-full">Əlavə et</Button>
            </div>
          </DrawerContent>
        </Drawer>
        <SidebarLink 
          icon={<Package />} 
          href="/admin/products" 
          label="Məhsullar" 
          isActive={location.pathname === '/admin/products'}
        />
        <SidebarLink 
          icon={<Users />} 
          href="/admin/users" 
          label="İstifadəçilər" 
          isActive={location.pathname === '/admin/users'}
        />
      </nav>

      <div className="pt-4 border-t border-white/20 mt-auto">
        <div className="flex gap-4">
          <Link to="#" className="text-white/60 hover:text-white">Facebook</Link>
          <Link to="#" className="text-white/60 hover:text-white">Twitter</Link>
          <Link to="#" className="text-white/60 hover:text-white">Google</Link>
        </div>
      </div>
    </div>
  );
};

const SidebarLink = ({ 
  icon, 
  href, 
  label, 
  isActive 
}: { 
  icon: React.ReactNode; 
  href: string; 
  label: string;
  isActive: boolean;
}) => {
  return (
    <Link
      to={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isActive 
          ? 'bg-white/20 text-white' 
          : 'text-white/80 hover:text-white hover:bg-white/10'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};