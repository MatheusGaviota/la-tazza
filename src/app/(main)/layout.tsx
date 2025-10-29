import type { Metadata } from 'next';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import { CartProvider } from '@/contexts/CartContext';

export const metadata: Metadata = {
  title: {
    default: 'La Tazza - Cafés Especiais, Cursos e Workshops',
    template: '%s | La Tazza',
  },
  description:
    'Descubra cafés especiais de alta qualidade, cursos profissionais de barista e workshops exclusivos. A La Tazza oferece uma experiência completa no universo do café.',
  keywords: [
    'café especial',
    'cafés premium',
    'curso de barista',
    'latte art',
    'cafeteria',
    'grãos de café',
    'café gourmet',
    'workshop de café',
  ],
  authors: [{ name: 'La Tazza' }],
  creator: 'La Tazza',
  publisher: 'La Tazza',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'La Tazza',
    title: 'La Tazza - Cafés Especiais, Cursos e Workshops',
    description:
      'Descubra cafés especiais de alta qualidade, cursos profissionais de barista e workshops exclusivos.',
  },
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <CartProvider>
        <Navbar />
        <main id="main-content">
          <div className="h-[104px] bg-foreground" />
          {children}
        </main>
        <Footer />
      </CartProvider>
    </>
  );
}
