import Link from 'next/link';
import { Coffee, Home } from 'lucide-react';
import Button from '@/components/UI/Button';
import BackButton from '@/components/UI/BackButton';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Página Não Encontrada - 404',
  description: 'A página que você procura não foi encontrada.',
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl text-center">
        {/* Decorative Coffee Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <Coffee
              size={120}
              className="text-accent/20"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="font-alumni text-6xl font-bold text-accent"
                aria-label="Erro 404"
              >
                404
              </span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="font-alumni text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4">
          Ops! Página Não Encontrada
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg text-foreground/70 mb-8 max-w-md mx-auto">
          Parece que você se perdeu no universo do café. A página que você está
          procurando não existe ou foi movida.
        </p>

        {/* Suggestions */}
        <div className="bg-accent/5 border-2 border-accent/20 rounded-xl p-6 mb-8">
          <h2 className="font-alumni text-xl font-semibold text-foreground mb-4">
            O que você pode fazer:
          </h2>
          <ul className="text-left space-y-2 text-foreground/70 max-w-md mx-auto">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1">•</span>
              <span>Verifique se o endereço foi digitado corretamente</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1">•</span>
              <span>Volte para a página anterior</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1">•</span>
              <span>Visite nossa página inicial</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1">•</span>
              <span>Entre em contato conosco se precisar de ajuda</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <BackButton variant="ghost-fore" className="w-full sm:w-auto" />
          <Button
            href="/"
            variant="accent"
            className="w-full sm:w-auto"
            aria-label="Ir para a página inicial"
          >
            <Home size={20} />
            <span>Ir para o Início</span>
          </Button>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t-2 border-accent/20">
          <p className="text-sm text-foreground/60 mb-4">
            Links rápidos que podem te interessar:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/produtos"
              className="text-accent hover:text-accent/80 hover:underline font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent rounded px-2 py-1"
            >
              Produtos
            </Link>
            <Link
              href="/cursos"
              className="text-accent hover:text-accent/80 hover:underline font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent rounded px-2 py-1"
            >
              Cursos
            </Link>
            <Link
              href="/planos"
              className="text-accent hover:text-accent/80 hover:underline font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent rounded px-2 py-1"
            >
              Tazza Club
            </Link>
            <Link
              href="/blog"
              className="text-accent hover:text-accent/80 hover:underline font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent rounded px-2 py-1"
            >
              Blog
            </Link>
            <Link
              href="/contato"
              className="text-accent hover:text-accent/80 hover:underline font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent rounded px-2 py-1"
            >
              Contato
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
