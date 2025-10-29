import type { Metadata } from 'next';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import { CartProvider } from '@/contexts/CartContext';

export const metadata: Metadata = {
  title: 'La Tazza',
  description: 'PLACEHOLDER',
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
