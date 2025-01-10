import { Link } from 'react-router-dom';

interface MainNavProps {
  isAdmin: boolean;
  className?: string;
}

export const MainNav = ({ isAdmin, className = "" }: MainNavProps) => {
  return (
    <nav className={`hidden md:flex items-center space-x-8 ${className}`}>
      <Link to="/" className="nav-link">
        Ana Səhifə
      </Link>
      <Link to="/products" className="nav-link">
        Məhsullar
      </Link>
      <Link to="/about" className="nav-link">
        Haqqımızda
      </Link>
      <Link to="/contact" className="nav-link">
        Əlaqə
      </Link>
      {isAdmin && (
        <Link to="/admin" className="nav-link">
          Admin Panel
        </Link>
      )}
    </nav>
  );
};