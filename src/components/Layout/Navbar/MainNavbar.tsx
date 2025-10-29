import Link from 'next/link';
import Button from '../../UI/Button';
import Logo from '../Logo';
import CartButton from './CartButton';
import UserDropdown from './UserDropdown';
import { navItems } from './constants';

interface User {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

interface MainNavbarProps {
  totalItems: number;
  setCartOpen: (open: boolean) => void;
  isAuthenticated: boolean;
  user: User | null;
  isLoadingPhoto: boolean;
  hasPhoto: boolean;
  imageError: boolean;
  handleImageError: () => void;
  dropdownOpen: boolean;
  setDropdownOpen: (open: boolean) => void;
  handleLogout: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function MainNavbar({
  totalItems,
  setCartOpen,
  isAuthenticated,
  user,
  isLoadingPhoto,
  hasPhoto,
  imageError,
  handleImageError,
  dropdownOpen,
  setDropdownOpen,
  handleLogout,
  open,
  setOpen,
}: MainNavbarProps) {
  return (
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
            <CartButton
              totalItems={totalItems}
              onClick={() => setCartOpen(true)}
            />

            {isAuthenticated ? (
              <UserDropdown
                user={user}
                isLoadingPhoto={isLoadingPhoto}
                hasPhoto={hasPhoto}
                imageError={imageError}
                handleImageError={handleImageError}
                dropdownOpen={dropdownOpen}
                setDropdownOpen={setDropdownOpen}
                handleLogout={handleLogout}
              />
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
            onClick={() => setOpen(!open)}
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
    </nav>
  );
}
