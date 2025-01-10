import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const handleClick = () => {
    console.log('Navigating to product:', product.id);
  };

  return (
    <div className="product-card">
      <div className="aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="mt-1 text-lg font-medium text-primary">
          {formatPrice(product.price)}
        </p>
        <Button
          asChild
          className="mt-4 w-full"
          onClick={handleClick}
        >
          <Link to={`/product/${product.id}`}>
            Ətraflı
          </Link>
        </Button>
      </div>
    </div>
  );
};
