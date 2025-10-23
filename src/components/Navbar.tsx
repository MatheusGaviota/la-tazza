'use client';

import Link from 'next/link';
import Button from './Button';
import { useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: 'Início', href: '/' },
    { label: 'Produtos', href: '/produtos' },
    { label: 'Cursos', href: '/cursos' },
    { label: 'Lojas', href: '/lojas' },
    { label: 'Clube', href: '/clube' },
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
            <div className="hidden md:block">
              <Button
                text="Login"
                href="/login"
                variant="accent"
                className="text-base px-6"
              />
            </div>
            <div className="hidden md:block">
              <Button
                text="Registro"
                href="/registro"
                variant="ghost-accent"
                className="text-base px-6"
              />
            </div>
            {/* TODO: Adicionar ícones de carrinho e perfil quando usuário estiver logado */}

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
                <Button
                  text="Login"
                  href="/login"
                  variant="accent"
                  className="w-full text-center"
                />
              </li>
              <li>
                <Button
                  text="Registro"
                  href="/register"
                  variant="ghost-accent"
                  className="w-full text-center"
                />
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
