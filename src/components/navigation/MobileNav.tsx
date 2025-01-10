import { Link } from 'react-router-dom';
import { Sheet, SheetContent } from '@/components/ui/sheet';

interface MobileNavProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isAdmin: boolean;
}

export const MobileNav = ({ isOpen, onOpenChange, isAdmin }: MobileNavProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col space-y-4">
          <Link
            to="/"
            className="nav-link"
            onClick={() => onOpenChange(false)}
          >
            Ana Səhifə
          </Link>
          <Link
            to="/products"
            className="nav-link"
            onClick={() => onOpenChange(false)}
          >
            Məhsullar
          </Link>
          <Link
            to="/about"
            className="nav-link"
            onClick={() => onOpenChange(false)}
          >
            Haqqımızda
          </Link>
          <Link
            to="/contact"
            className="nav-link"
            onClick={() => onOpenChange(false)}
          >
            Əlaqə
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className="nav-link"
              onClick={() => onOpenChange(false)}
            >
              Admin Panel
            </Link>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
};