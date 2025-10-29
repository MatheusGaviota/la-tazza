import { Instagram, Facebook, Twitter } from 'lucide-react';
import { socials } from './constants';

interface SocialBarProps {
  compactSocial: boolean;
}

export default function SocialBar({ compactSocial }: SocialBarProps) {
  return (
    <div className="bg-accent border-b border-accent/20">
      <div
        className={`max-w-[1400px] mx-auto px-4 flex items-center justify-center lg:justify-between transition-all duration-300 ${compactSocial ? 'h-2' : 'h-10'}`}
      >
        {/* Social Links */}
        <div
          className={`flex items-center gap-4 transform transition-all duration-300 ${compactSocial ? 'opacity-0 pointer-events-none -translate-y-1' : 'opacity-100 translate-y-0'}`}
        >
          <span className="text-xs font-semibold text-background/80 uppercase tracking-wide">
            Conecte-se
          </span>
          <nav className="flex items-center gap-3" aria-label="Redes sociais">
            {socials.map(({ label, href, username, icon }) => {
              let Icon;
              switch (icon) {
                case 'Instagram':
                  Icon = Instagram;
                  break;
                case 'Facebook':
                  Icon = Facebook;
                  break;
                case 'Twitter':
                  Icon = Twitter;
                  break;
                default:
                  Icon = Instagram;
              }
              return (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Seguir ${username} no ${label}`}
                  className="flex items-center gap-1.5 px-1 py-1 text-background/70 hover:text-background hover:bg-background/10 rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-background/50"
                >
                  <Icon size={18} aria-hidden />
                  {/* esconder username em telas menores para evitar overflow; mostrar a partir de lg */}
                  <span className="hidden lg:inline text-xs font-medium">
                    {username}
                  </span>
                </a>
              );
            })}
          </nav>
        </div>

        {/* Info Text */}
        <div
          className={`hidden lg:flex items-center text-xs text-background/70 transition-opacity duration-300 ${compactSocial ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <span>Frete grátis acima de R$ 100</span>
        </div>
      </div>
    </div>
  );
}
