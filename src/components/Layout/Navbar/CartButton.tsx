import { ShoppingCart } from 'lucide-react';

interface CartButtonProps {
  totalItems: number;
  onClick: () => void;
}

export default function CartButton({ totalItems, onClick }: CartButtonProps) {
  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-full hover:bg-accent/20 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
      aria-label={`Carrinho com ${totalItems} ${totalItems === 1 ? 'item' : 'itens'}`}
    >
      <ShoppingCart size={24} className="text-background" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-background text-xs font-bold rounded-full flex items-center justify-center">
          {totalItems > 9 ? '9+' : totalItems}
        </span>
      )}
    </button>
  );
}
