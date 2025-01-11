import { CartItem } from './CartItem';

interface CartListProps {
  items: Array<{
    id: number;
    quantity: number;
    products: {
      id: number;
      name: string;
      price: number;
      image: string;
      category: string;
    };
  }>;
  onUpdateQuantity: (itemId: number, newQuantity: number) => Promise<void>;
  onRemove: (itemId: number) => Promise<void>;
}

export const CartList = ({ items, onUpdateQuantity, onRemove }: CartListProps) => {
  if (items.length === 0) {
    return <p className="text-center text-muted-foreground">Səbət boşdur</p>;
  }

  return (
    <ul className="divide-y">
      {items.map((item) => (
        <CartItem
          key={item.id}
          id={item.id}
          quantity={item.quantity}
          product={item.products}
          onUpdateQuantity={onUpdateQuantity}
          onRemove={onRemove}
        />
      ))}
    </ul>
  );
};