'use client';

import Link from 'next/link';
import Button from './Button';
import CartDrawer from './CartDrawer';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { totalItems } = useCart();

  const navItems = [
    { label: 'Início', href: '/' },
    { label: 'Produtos', href: '/produtos' },
    { label: 'Cursos', href: '/cursos' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contato', href: '/contato' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 w-full border-b bg-foreground z-50">
      {/* barra superior pequena */}
      {/* TODO: Adicionar links das redes sociais nesta barra superior */}
      {/* TODO: Fazer barra superior diminuir de tamanho quando scroll ir para baixo */}
      <div className="bg-accent h-7" aria-hidden />

      <nav
        className="max-w-[1400px] mx-auto px-4"
        aria-label="Navegação principal"
      >
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-background text-xl font-semibold">
              La Tazza
            </Link>
          </div>

          <div className="flex items-center gap-6">
            {/* desktop menu */}
            <ul className="hidden md:flex items-center space-x-6 text-background">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-base hover:underline focus:outline-none focus:ring-2 focus:ring-accent rounded"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="hidden md:flex items-center gap-3">
              {/* Cart Icon */}
              <button
                onClick={() => setCartOpen(true)}
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

              <Button
                text="Login"
                href="/login"
                variant="accent"
                className="text-base px-6"
              />
            </div>
            {/* TODO: Adicionar ícone de perfil quando usuário estiver logado */}

            {/* mobile menu button */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-background hover:bg-accent/20 border-2 border-accent"
              aria-controls="mobile-menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="sr-only">Abrir menu</span>
              {/* ícone simples: 3 linhas */}
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden
              >
                {open ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* mobile menu */}
        {open && (
          <div id="mobile-menu" className="md:hidden mt-2 pb-4">
            <ul className="flex flex-col space-y-2 text-background">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block px-2 py-2 rounded hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <button
                  onClick={() => setCartOpen(true)}
                  className="w-full flex items-center justify-between px-2 py-2 rounded hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <span>Carrinho</span>
                  {totalItems > 0 && (
                    <span className="px-2 py-0.5 bg-accent text-background text-xs font-bold rounded-full">
                      {totalItems}
                    </span>
                  )}
                </button>
              </li>
              <li className="pt-2">
                <Button
                  text="Login"
                  href="/login"
                  variant="accent"
                  className="w-full text-center"
                />
              </li>
            </ul>
          </div>
        )}
      </nav>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
