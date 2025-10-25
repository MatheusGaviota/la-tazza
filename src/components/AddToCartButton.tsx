'use client';

import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    category?: string;
  };
  variant?: 'default' | 'icon' | 'compact';
  className?: string;
}

export default function AddToCartButton({
  product,
  variant = 'default',
  className = '',
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleAddToCart}
        className={`p-3 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-accent ${
          added
            ? 'bg-green-500 text-white'
            : 'bg-accent text-background hover:bg-accent/90'
        } ${className}`}
        aria-label={added ? 'Adicionado ao carrinho' : 'Adicionar ao carrinho'}
      >
        {added ? <Check size={20} /> : <ShoppingCart size={20} />}
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={handleAddToCart}
        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-accent ${
          added
            ? 'bg-green-500 text-white'
            : 'bg-accent text-background hover:bg-accent/90'
        } ${className}`}
        aria-label={added ? 'Adicionado ao carrinho' : 'Adicionar ao carrinho'}
      >
        {added ? (
          <>
            <Check size={18} />
            Adicionado
          </>
        ) : (
          <>
            <ShoppingCart size={18} />
            Adicionar
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleAddToCart}
      className={`flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-accent ${
        added
          ? 'bg-green-500 text-white'
          : 'bg-accent text-background hover:bg-accent/90'
      } ${className}`}
      aria-label={added ? 'Adicionado ao carrinho' : 'Adicionar ao carrinho'}
    >
      {added ? (
        <>
          <Check size={20} />
          Adicionado ao Carrinho!
        </>
      ) : (
        <>
          <ShoppingCart size={20} />
          Adicionar ao Carrinho
        </>
      )}
    </button>
  );
}
