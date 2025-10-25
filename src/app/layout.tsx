import type { Metadata } from 'next';
import { Poppins, Alumni_Sans } from 'next/font/google';
import './globals.css';
import './high-contrast.css';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import AccessibilityTray from '@/components/UI/AccessibilityTray';
import { CartProvider } from '@/contexts/CartContext';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const alumniSans = Alumni_Sans({
  variable: '--font-alumni',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'La Tazza',
  description: 'PLACEHOLDER',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${poppins.variable} ${alumniSans.variable} antialiased`}
      >
        <CartProvider>
          <div
            id="grayscale-overlay"
            className="hidden fixed inset-0 pointer-events-none z-[9999]"
            style={{
              backdropFilter: 'grayscale(100%)',
              WebkitBackdropFilter: 'grayscale(100%)',
            }}
            aria-hidden="true"
          />
          <Navbar />
          <AccessibilityTray />
          <main id="main-content" className="pt-[92px]">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
