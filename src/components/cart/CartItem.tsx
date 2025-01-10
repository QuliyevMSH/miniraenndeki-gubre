import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';

interface CartItemProps {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
  };
  onUpdateQuantity: (itemId: number, newQuantity: number) => Promise<void>;
  onRemove: (itemId: number) => Promise<void>;
}

export const CartItem = ({ 
  id, 
  quantity, 
  product, 
  onUpdateQuantity, 
  onRemove 
}: CartItemProps) => {
  return (
    <li className="flex py-6">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium">
            <div className="flex flex-col">
              <Link 
                to={`/product/${product.id}`}
                className="hover:text-primary transition-colors"
              >
                <h3>{product.name}</h3>
              </Link>
              <span className="text-sm text-muted-foreground">{product.category}</span>
            </div>
            <p className="ml-4">{formatPrice(product.price * quantity)}</p>
          </div>
        </div>
        <div className="flex flex-1 items-end justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={async () => await onUpdateQuantity(id, quantity - 1)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="min-w-[2rem] text-center">
              {quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={async () => await onUpdateQuantity(id, quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={async () => await onRemove(id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </li>
  );
};