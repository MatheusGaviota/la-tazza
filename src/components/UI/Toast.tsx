'use client';

import { useEffect, useState } from 'react';
import { X, ShoppingCart } from 'lucide-react';

interface ToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
}

export default function Toast({ message, show, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show && !isVisible) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[60] transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <div className="flex items-center gap-3 bg-foreground text-background px-6 py-4 rounded-lg border-2 border-accent">
        <ShoppingCart size={24} className="text-accent flex-shrink-0" />
        <p className="font-medium">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="p-1 hover:bg-background/10 rounded transition-colors ml-2"
          aria-label="Fechar notificação"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
