import type { Metadata } from 'next';
import AccessibilityTray from '@/components/UI/AccessibilityTray';

export const metadata: Metadata = {
  title: 'Autenticação - La Tazza',
  description: 'Login e registro de usuários',
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AccessibilityTray />
      <div className="w-full min-h-screen">{children}</div>
    </>
  );
}
