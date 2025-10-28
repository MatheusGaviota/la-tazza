'use client';

import Link from 'next/link';
import Button from '../UI/Button';
import CartDrawer from '../Cart/CartDrawer';
import Skeleton from '../UI/Skeleton';
import Logo from './Logo';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { ShoppingCart, User, LogOut, UserCircle } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { totalItems } = useCart();
  const { isAuthenticated, user, signOut } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [isLoadingPhoto, setIsLoadingPhoto] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (user) {
      setImageError(false);
      setIsLoadingPhoto(false);
    } else {
      setImageError(false);
      setIsLoadingPhoto(false);
    }
  }, [user]);

  // Resetar erro quando photoURL mudar
  useEffect(() => {
    console.log('🔔 Navbar: photoURL mudou para:', user?.photoURL);
    setImageError(false);
  }, [user?.photoURL]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // Limpar timeout ao desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 200);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setDropdownOpen(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleImageError = () => {
    setImageError(true);
    setIsLoadingPhoto(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const hasPhoto = user?.photoURL && user.photoURL.trim() !== '';

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
            <Link href="/" aria-label="La Tazza - Início" className="block">
              <Logo className="h-8 text-background" />
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

              {isAuthenticated ? (
                <div
                  ref={dropdownRef}
                  className="relative"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href="/perfil"
                    className="relative rounded-full hover:ring-2 hover:ring-accent/50 transition-all focus:outline-none focus:ring-2 focus:ring-accent block"
                    aria-label="Ir para perfil"
                  >
                    {isLoadingPhoto ? (
                      <Skeleton
                        variant="circular"
                        width={40}
                        height={40}
                        animation="pulse"
                      />
                    ) : hasPhoto && !imageError ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={user?.photoURL}
                        src={user?.photoURL || ''}
                        alt={user?.displayName || 'Foto de perfil'}
                        className="w-10 h-10 rounded-full object-cover border-2 border-accent"
                        onError={handleImageError}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-background border-2 border-accent flex items-center justify-center">
                        <span className="text-sm font-bold text-accent">
                          {user?.displayName ? getInitials(user.displayName) : <User size={20} className="text-accent" />}
                        </span>
                      </div>
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-background rounded-lg border border-accent/20 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu"
                    >
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-accent/10">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {user?.displayName || 'Usuário'}
                        </p>
                        <p className="text-xs text-foreground/60 truncate mt-0.5">
                          {user?.email}
                        </p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <Link
                          href="/perfil"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-accent/10 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent"
                          role="menuitem"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <UserCircle size={18} className="text-accent" />
                          <span>Meu Perfil</span>
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-red-50 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent"
                          role="menuitem"
                        >
                          <LogOut size={18} className="text-current" />
                          <span>Sair da conta</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  text="Login"
                  href="/login"
                  variant="accent"
                  className="text-base px-6"
                />
              )}
            </div>

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
                {isAuthenticated ? (
                  <div className="space-y-2">
                    {/* Profile Card */}
                    <div className="bg-accent/10 rounded-lg p-3 border-2 border-accent/20">
                      <Link
                        href="/perfil"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-accent rounded"
                      >
                        {isLoadingPhoto ? (
                          <Skeleton
                            variant="circular"
                            width={40}
                            height={40}
                            animation="pulse"
                          />
                        ) : hasPhoto && !imageError ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={user?.photoURL}
                            src={user?.photoURL || ''}
                            alt={user?.displayName || 'Foto de perfil'}
                            className="w-10 h-10 rounded-full object-cover border-2 border-accent group-hover:border-accent/80 transition-colors flex-shrink-0"
                            onError={handleImageError}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-background border-2 border-accent group-hover:border-accent/80 transition-colors flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-accent">
                              {user?.displayName ? getInitials(user.displayName) : <User size={20} className="text-accent" />}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-background truncate group-hover:underline">
                            {user?.displayName || 'Usuário'}
                          </p>
                          <p className="text-xs text-background/70 truncate">
                            Ver perfil
                          </p>
                        </div>
                        <UserCircle size={18} className="text-accent flex-shrink-0" />
                      </Link>
                    </div>
                    
                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-background/10 hover:bg-red-500/20 text-background hover:text-red-300 transition-colors border-2 border-background/20 hover:border-red-500/30 focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <LogOut size={18} />
                      <span className="text-sm font-medium">Sair da conta</span>
                    </button>
                  </div>
                ) : (
                  <Button
                    text="Login"
                    href="/login"
                    variant="accent"
                    className="w-full text-center"
                  />
                )}
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
