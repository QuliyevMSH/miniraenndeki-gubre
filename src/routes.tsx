import { Routes as RouterRoutes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Auth from '@/pages/Auth';
import Profile from '@/pages/Profile';
import Payment from '@/pages/Payment';
import ProductDetail from '@/pages/ProductDetail';
import AdminPanel from '@/pages/AdminPanel';
import { AdminRoute } from '@/components/AdminRoute';

export function Routes() {
  return (
    <RouterRoutes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route
        path="/admin/*"
        element={
          <AdminRoute>
            <AdminPanel />
          </AdminRoute>
        }
      />
    </RouterRoutes>
  );
}