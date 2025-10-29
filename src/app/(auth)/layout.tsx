import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login e Cadastro',
  description:
    'Acesse sua conta La Tazza ou crie uma nova conta para aproveitar todos os benefícios: compras, cursos e conteúdo exclusivo.',
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="w-full min-h-screen bg-foreground">{children}</div>
    </>
  );
}
