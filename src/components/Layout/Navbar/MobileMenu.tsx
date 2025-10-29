import Link from 'next/link';
import Button from '../../UI/Button';
import Skeleton from '../../UI/Skeleton';
import { UserCircle, LogOut, User } from 'lucide-react';
import { navItems } from './constants';

interface User {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

interface MobileMenuProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  totalItems: number;
  setCartOpen: (open: boolean) => void;
  isAuthenticated: boolean;
  user: User | null;
  isLoadingPhoto: boolean;
  hasPhoto: boolean;
  imageError: boolean;
  handleImageError: () => void;
  handleLogout: () => void;
  isAdmin: boolean;
}

export default function MobileMenu({
  open,
  setOpen,
  totalItems,
  setCartOpen,
  isAuthenticated,
  user,
  isLoadingPhoto,
  hasPhoto,
  imageError,
  handleImageError,
  handleLogout,
  isAdmin,
}: MobileMenuProps) {
  const menuItems = isAdmin
    ? [...navItems, { label: 'Admin', href: '/admin' }]
    : navItems;
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!open) return null;

  return (
    <div id="mobile-menu" className="md:hidden mt-2 pb-4 px-4">
      <ul className="flex flex-col space-y-2 text-background">
        {menuItems.map((item) => (
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
                      loading="lazy"
                      alt={user?.displayName || 'Foto de perfil'}
                      className="w-10 h-10 rounded-full object-cover border-2 border-accent group-hover:border-accent/80 transition-colors flex-shrink-0"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-background border-2 border-accent group-hover:border-accent/80 transition-colors flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-accent">
                        {user?.displayName ? (
                          getInitials(user.displayName)
                        ) : (
                          <User size={20} className="text-accent" />
                        )}
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
  );
}
