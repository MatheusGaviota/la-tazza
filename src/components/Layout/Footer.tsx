import Link from 'next/link';
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
} from 'lucide-react';
import Logo from './Logo';
import Input from '../UI/Input';
import Button from '../UI/Button';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const linksSections = [
    {
      title: 'Navegação',
      links: [
        { label: 'Início', href: '/' },
        { label: 'Produtos', href: '/produtos' },
        { label: 'Cursos', href: '/cursos' },
        { label: 'Blog', href: '/blog' },
      ],
    },
    {
      title: 'Institucional',
      links: [
        { label: 'Sobre Nós', href: '/sobre' },
        { label: 'Contato', href: '/contato' },
        { label: 'Trabalhe Conosco', href: '/carreiras' },
        { label: 'FAQ', href: '/faq' },
      ],
    },
    {
      title: 'Políticas',
      links: [
        { label: 'Termos de Uso', href: '/termos' },
        { label: 'Política de Privacidade', href: '/privacidade' },
        { label: 'Política de Cookies', href: '/cookies' },
        { label: 'Trocas e Devoluções', href: '/trocas' },
      ],
    },
  ];

  return (
    <footer className="w-full bg-foreground text-background border-t-4 border-accent">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/" aria-label="La Tazza - Início" className="block">
                <Logo className="h-8 text-background" />
              </Link>
            </div>
            <p className="text-background/80 text-sm leading-relaxed mb-6 max-w-sm">
              Sua conexão com o mundo do café especial. Oferecemos os melhores
              grãos, cursos profissionais e uma experiência única para
              verdadeiros amantes de café.
            </p>

            {/* Social Media */}
            <div className="flex gap-3 mb-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-accent/20 text-background hover:bg-accent hover:text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-accent/20 text-background hover:bg-accent hover:text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-accent/20 text-background hover:bg-accent hover:text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 text-sm text-background/80">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-accent" />
                <a
                  href="mailto:contato@latazza.com.br"
                  className="hover:text-accent transition-colors"
                >
                  contato@latazza.com.br
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-accent" />
                <a
                  href="tel:+551140028922"
                  className="hover:text-accent transition-colors"
                >
                  (11) 4002-8922
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-accent" />
                <span>São Paulo - SP</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          {linksSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-alumni text-xl font-bold text-background mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-background/80 hover:text-accent transition-colors text-sm inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="py-8 border-t border-background/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <h4 className="font-alumni text-xl font-bold text-background mb-2">
                Assine Nossa Newsletter
              </h4>
              <p className="text-background/80 text-sm">
                Receba novidades, promoções e dicas exclusivas sobre café.
              </p>
            </div>

            <form className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Input
                type="email"
                placeholder="Seu e-mail"
                required
                fullWidth={false}
                className="max-sm:w-full sm:min-w-[280px]"
                variant="accent"
              />
              <Button
                type="submit"
                text="Inscrever-se"
                variant="accent"
                className="whitespace-nowrap"
              />
            </form>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-background/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-background/70">
            <p className="text-center sm:text-left">
              © {currentYear} La Tazza. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
