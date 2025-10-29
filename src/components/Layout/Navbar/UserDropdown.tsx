import Link from 'next/link';
import { useRef, useEffect } from 'react';
import Skeleton from '../../UI/Skeleton';
import { UserCircle, LogOut, User } from 'lucide-react';

interface User {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

interface UserDropdownProps {
  user: User | null;
  isLoadingPhoto: boolean;
  hasPhoto: boolean;
  imageError: boolean;
  handleImageError: () => void;
  dropdownOpen: boolean;
  setDropdownOpen: (open: boolean) => void;
  handleLogout: () => void;
}

export default function UserDropdown({
  user,
  isLoadingPhoto,
  hasPhoto,
  imageError,
  handleImageError,
  dropdownOpen,
  setDropdownOpen,
  handleLogout,
}: UserDropdownProps) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      timeoutRef.current = null;
    }
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 200);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      data-dropdown
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
            loading="lazy"
            alt={user?.displayName || 'Foto de perfil'}
            className="w-10 h-10 rounded-full object-cover border-2 border-accent"
            onError={handleImageError}
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-background border-2 border-accent flex items-center justify-center">
            <span className="text-sm font-bold text-accent">
              {user?.displayName ? (
                getInitials(user.displayName)
              ) : (
                <User size={20} className="text-accent" />
              )}
            </span>
          </div>
        )}
      </Link>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div
          className="absolute right-0 mt-1 w-56 bg-background rounded-lg border border-accent/20 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
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
  );
}
