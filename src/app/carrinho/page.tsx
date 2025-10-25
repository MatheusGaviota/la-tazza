'use client';

import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight, ShoppingBag, Tag, Truck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function CarrinhoPage() {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
  const [cupomCode, setCupomCode] = useState('');
  const [cupomAplicado, setCupomAplicado] = useState(false);

  const frete = totalPrice > 150 ? 0 : 15.90;
  const desconto = cupomAplicado ? totalPrice * 0.1 : 0;
  const total = totalPrice + frete - desconto;

  const aplicarCupom = () => {
    if (cupomCode.toLowerCase() === 'latazza10') {
      setCupomAplicado(true);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="w-full bg-foreground text-background py-12 sm:py-16">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center gap-3 mb-3">
            <ShoppingCart size={40} className="text-accent" />
            <h1 className="font-alumni text-4xl sm:text-5xl md:text-6xl font-bold">
              Meu Carrinho
            </h1>
          </div>
          <p className="text-lg text-background/80">
            Revise seus itens antes de finalizar a compra
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full max-w-[1400px] mx-auto px-4 py-8 sm:py-12">
        {items.length === 0 ? (
          /* Empty Cart */
          <div className="flex flex-col items-center justify-center text-center py-16">
            <ShoppingBag size={80} className="text-foreground/20 mb-6" />
            <h2 className="font-alumni text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Seu carrinho está vazio
            </h2>
            <p className="text-foreground/60 text-lg mb-8 max-w-md">
              Explore nossos produtos e adicione os itens que você deseja ao
              carrinho
            </p>
            <Link
              href="/produtos"
              className="px-8 py-3 bg-accent text-background rounded-lg font-medium hover:bg-accent/90 transition-all focus:outline-none focus:ring-2 focus:ring-accent inline-flex items-center gap-2"
            >
              <ShoppingBag size={20} />
              Ir para Produtos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items - 2 columns */}
            <div className="lg:col-span-2 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-alumni text-2xl sm:text-3xl font-bold text-foreground">
                  Itens no Carrinho ({items.length})
                </h2>
                <button
                  onClick={clearCart}
                  className="text-sm text-red-600 hover:text-red-700 font-medium hover:underline focus:outline-none"
                >
                  Limpar tudo
                </button>
              </div>

              {/* Items List */}
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6 bg-background border-2 border-accent/20 rounded-lg hover:border-accent/40 transition-all"
                >
                  {/* Product Image */}
                  <div className="relative w-full sm:w-32 h-48 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-accent/10">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <div>
                        <h3 className="font-alumni text-xl font-bold text-foreground mb-1">
                          {item.name}
                        </h3>
                        {item.category && (
                          <span className="text-sm text-foreground/60">
                            {item.category}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 rounded-full hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label="Remover item"
                      >
                        <Trash2 size={20} className="text-red-600" />
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mt-auto pt-4 border-t border-accent/20">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-foreground/70">
                          Quantidade:
                        </span>
                        <div className="flex items-center gap-2 border-2 border-accent/20 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-accent/10 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent"
                            aria-label="Diminuir quantidade"
                          >
                            <Minus size={18} className="text-foreground" />
                          </button>
                          <span className="w-12 text-center font-semibold text-foreground">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-accent/10 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent"
                            aria-label="Aumentar quantidade"
                          >
                            <Plus size={18} className="text-foreground" />
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-sm text-foreground/60 mb-1">
                          R$ {item.price.toFixed(2)} cada
                        </p>
                        <p className="font-alumni text-2xl font-bold text-accent">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary - 1 column */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-6">
                {/* Coupon */}
                <div className="bg-background border-2 border-accent/20 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Tag size={20} className="text-accent" />
                    <h3 className="font-alumni text-xl font-bold text-foreground">
                      Cupom de Desconto
                    </h3>
                  </div>

                  {!cupomAplicado ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Digite seu cupom"
                        value={cupomCode}
                        onChange={(e) => setCupomCode(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border-2 border-accent/20 bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                      />
                      <button
                        onClick={aplicarCupom}
                        className="w-full py-2.5 bg-accent/10 border-2 border-accent/20 text-accent rounded-lg font-medium hover:bg-accent hover:text-background transition-all focus:outline-none focus:ring-2 focus:ring-accent"
                      >
                        Aplicar Cupom
                      </button>
                      <p className="text-xs text-foreground/60">
                        Experimente: <code className="bg-accent/10 px-1.5 py-0.5 rounded">LATAZZA10</code>
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 bg-green-50 border-2 border-green-200 rounded-lg">
                      <p className="text-green-800 font-medium text-sm">
                        ✓ Cupom aplicado! 10% de desconto
                      </p>
                    </div>
                  )}
                </div>

                {/* Shipping Info */}
                <div className="bg-accent/5 border-2 border-accent/20 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Truck size={20} className="text-accent" />
                    <h3 className="font-semibold text-foreground">Frete</h3>
                  </div>
                  {frete === 0 ? (
                    <p className="text-sm text-green-700 font-medium">
                      🎉 Frete grátis em compras acima de R$ 150!
                    </p>
                  ) : (
                    <p className="text-sm text-foreground/70">
                      Faltam R$ {(150 - totalPrice).toFixed(2)} para frete
                      grátis!
                    </p>
                  )}
                </div>

                {/* Order Summary */}
                <div className="bg-background border-2 border-accent/20 rounded-lg p-6">
                  <h3 className="font-alumni text-xl font-bold text-foreground mb-4">
                    Resumo do Pedido
                  </h3>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-foreground/70">
                      <span>Subtotal:</span>
                      <span>R$ {totalPrice.toFixed(2)}</span>
                    </div>

                    {cupomAplicado && (
                      <div className="flex justify-between text-green-700">
                        <span>Desconto (10%):</span>
                        <span>- R$ {desconto.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-foreground/70">
                      <span>Frete:</span>
                      <span>
                        {frete === 0 ? (
                          <span className="text-green-700 font-medium">
                            Grátis
                          </span>
                        ) : (
                          `R$ ${frete.toFixed(2)}`
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t-2 border-accent/20 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="font-alumni text-xl font-bold text-foreground">
                        Total:
                      </span>
                      <span className="font-alumni text-3xl font-bold text-accent">
                        R$ {total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-accent text-background rounded-lg font-medium hover:bg-accent/90 transition-all focus:outline-none focus:ring-2 focus:ring-accent mb-3"
                  >
                    Finalizar Compra
                    <ArrowRight size={20} />
                  </Link>

                  <Link
                    href="/produtos"
                    className="block text-center py-3 border-2 border-accent/20 text-foreground rounded-lg font-medium hover:border-accent hover:bg-accent/5 transition-all focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    Continuar Comprando
                  </Link>
                </div>

                {/* Security Badge */}
                <div className="text-center text-sm text-foreground/60 space-y-2">
                  <p>🔒 Compra 100% segura e protegida</p>
                  <p>📦 Entrega rastreável</p>
                  <p>↩️ Troca grátis em 30 dias</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
