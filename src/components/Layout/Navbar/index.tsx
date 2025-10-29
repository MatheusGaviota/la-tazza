'use client';

import CartDrawer from '../../Cart/CartDrawer';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import SocialBar from './SocialBar';
import MainNavbar from './MainNavbar';
import MobileMenu from './MobileMenu';
import { useAdmin } from '@/hooks/useAdmin';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { totalItems } = useCart();
  const { isAuthenticated, user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const [imageError, setImageError] = useState(false);
  const [isLoadingPhoto, setIsLoadingPhoto] = useState(true);
  const [compactSocial, setCompactSocial] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const pathname = usePathname();

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

  // Fechar dropdown ao clicar fora (mas não ao passar o mouse)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target || !target.closest('[data-dropdown]')) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      // Usar 'mousedown' apenas, remover outros eventos que possam interferir
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const onScroll = useCallback(() => {
    const current = window.scrollY;
    const isHomePage = pathname === '/';

    // Se estiver na página inicial e perto do topo, sempre descompacta (independente de pequenos movimentos)
    const NEAR_TOP_THRESHOLD = 40; // px

    if (isHomePage && current <= NEAR_TOP_THRESHOLD) {
      // se já estiver false, evita setState desnecessário
      setCompactSocial(false);
      lastScrollY.current = current;
      return;
    }

    // evita excesso de updates, usa RAF
    if (!ticking.current) {
      ticking.current = true;
      requestAnimationFrame(() => {
        const delta = current - lastScrollY.current;
        // só reage a movimentos maiores que 10px para evitar flicker
        if (Math.abs(delta) > 10) {
          if (delta > 0) {
            // rolando pra baixo: só compacta se estivermos além do threshold (só na home)
            if (!isHomePage || current > NEAR_TOP_THRESHOLD) {
              setCompactSocial(true);
            }
          } else {
            // rolando pra cima
            setCompactSocial(false);
          }
          lastScrollY.current = current;
        }
        ticking.current = false;
      });
    }
  }, [pathname]);

  // Compactar a barra social ao rolar: descer -> compacta; subir -> descompacta
  useEffect(() => {
    // inicializa posição
    if (typeof window !== 'undefined') lastScrollY.current = window.scrollY;

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [onScroll]);

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

  const hasPhoto = !!(user?.photoURL && user.photoURL.trim() !== '');

  return (
    <header className="fixed top-0 left-0 right-0 w-full bg-foreground z-50 border-b-2 border-accent">
      <SocialBar compactSocial={compactSocial} />
      <MainNavbar
        totalItems={totalItems}
        setCartOpen={setCartOpen}
        isAuthenticated={isAuthenticated}
        user={user}
        isLoadingPhoto={isLoadingPhoto}
        hasPhoto={hasPhoto}
        imageError={imageError}
        handleImageError={handleImageError}
        dropdownOpen={dropdownOpen}
        setDropdownOpen={setDropdownOpen}
        handleLogout={handleLogout}
        open={open}
        setOpen={setOpen}
        isAdmin={isAdmin}
      />
      <MobileMenu
        open={open}
        setOpen={setOpen}
        totalItems={totalItems}
        setCartOpen={setCartOpen}
        isAuthenticated={isAuthenticated}
        user={user}
        isLoadingPhoto={isLoadingPhoto}
        hasPhoto={hasPhoto}
        imageError={imageError}
        handleImageError={handleImageError}
        handleLogout={handleLogout}
        isAdmin={isAdmin}
      />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
