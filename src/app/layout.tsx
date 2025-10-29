import { Poppins, Alumni_Sans } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';
import './high-contrast.css';
import { AuthProvider } from '@/contexts/AuthContext';
import AccessibilityTray from '@/components/UI/AccessibilityTray';

export const metadata: Metadata = {
  metadataBase: new URL('https://latazza.com.br'),
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
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://latazza.com.br',
    siteName: 'La Tazza',
    title: 'La Tazza - Cafés Especiais, Cursos e Workshops',
    description:
      'Descubra cafés especiais de alta qualidade, cursos profissionais de barista e workshops exclusivos.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'La Tazza - Cafés Especiais, Cursos e Workshops',
    description:
      'Descubra cafés especiais de alta qualidade, cursos profissionais de barista e workshops exclusivos.',
  },
};

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
        <AuthProvider>
          <div
            id="grayscale-overlay"
            className="hidden fixed inset-0 pointer-events-none z-[9999]"
            style={{
              backdropFilter: 'grayscale(100%)',
              WebkitBackdropFilter: 'grayscale(100%)',
            }}
            aria-hidden="true"
          />
          <AccessibilityTray />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
