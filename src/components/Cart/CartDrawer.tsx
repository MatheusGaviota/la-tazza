'use client';

import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const {
    items,
    updateQuantity,
    removeItem,
    totalItems,
    totalPrice,
    clearCart,
  } = useCart();
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  if (!isOpen && !isClosing) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-background z-50 flex flex-col transition-transform duration-300 ${
          isClosing ? 'translate-x-full' : 'translate-x-0'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-accent/20 bg-background sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <ShoppingCart size={24} className="text-accent" />
            <h2
              id="cart-drawer-title"
              className="font-alumni text-2xl font-bold text-foreground"
            >
              Carrinho
            </h2>
            {totalItems > 0 && (
              <span className="px-2 py-0.5 bg-accent text-background text-sm font-semibold rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-accent/10 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="Fechar carrinho"
          >
            <X size={24} className="text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingCart size={64} className="text-foreground/20 mb-4" />
              <h3 className="font-alumni text-2xl font-bold text-foreground mb-2">
                Carrinho Vazio
              </h3>
              <p className="text-foreground/60 mb-6">
                Adicione produtos ao seu carrinho para começar
              </p>
              <button
                onClick={handleClose}
                className="px-6 py-2.5 bg-accent text-background rounded-lg font-medium hover:bg-accent/90 transition-all focus:outline-none focus:ring-2 focus:ring-accent"
              >
                Continuar Comprando
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4 mb-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 bg-accent/5 border-2 border-accent/20 rounded-lg"
                  >
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-accent/10">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col">
                      <h3 className="font-semibold text-foreground text-sm line-clamp-2 mb-1">
                        {item.name}
                      </h3>
                      {item.category && (
                        <span className="text-xs text-foreground/60 mb-2">
                          {item.category}
                        </span>
                      )}

                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-1 rounded hover:bg-accent/20 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                            aria-label="Diminuir quantidade"
                          >
                            <Minus size={16} className="text-foreground" />
                          </button>
                          <span className="w-8 text-center font-medium text-foreground">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-1 rounded hover:bg-accent/20 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                            aria-label="Aumentar quantidade"
                          >
                            <Plus size={16} className="text-foreground" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-alumni text-lg font-bold text-foreground">
                            R$ {(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 rounded hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                            aria-label="Remover item"
                          >
                            <Trash2 size={16} className="text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Clear Cart Button */}
              <button
                onClick={clearCart}
                className="w-full py-2 text-sm text-red-600 hover:text-red-700 font-medium border-2 border-red-200 rounded-lg hover:bg-red-50 transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Limpar Carrinho
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t-2 border-accent/20 p-4 bg-background sticky bottom-0">
            <div className="space-y-3">
              {/* Subtotal */}
              <div className="flex justify-between items-center">
                <span className="text-foreground/70">Subtotal:</span>
                <span className="font-alumni text-xl font-bold text-foreground">
                  R$ {totalPrice.toFixed(2)}
                </span>
              </div>

              {/* Info */}
              <p className="text-xs text-foreground/60 text-center">
                Frete e descontos calculados no checkout
              </p>

              {/* Actions */}
              <div className="space-y-2">
                <Link
                  href="/carrinho"
                  onClick={handleClose}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-accent text-background rounded-lg font-medium hover:bg-accent/90 transition-all focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  Ver Carrinho Completo
                  <ArrowRight size={18} />
                </Link>
                <button
                  onClick={handleClose}
                  className="w-full py-3 bg-transparent border-2 border-accent/20 text-foreground rounded-lg font-medium hover:border-accent hover:bg-accent/5 transition-all focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  Continuar Comprando
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
