import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'La Tazza - Autenticação',
  description: 'Login e registro de usuários',
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full min-h-screen">
      {children}
    </div>
  );
}
