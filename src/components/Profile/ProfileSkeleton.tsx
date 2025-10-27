import Skeleton from '../UI/Skeleton';

export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen py-12 px-4" aria-busy="true" role="region" aria-label="Carregando perfil">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-8">
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>

        {/* Card de Foto de Perfil */}
        <section className="rounded-lg border-2 border-foreground/10 p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Skeleton variant="circular" className="w-32 h-32" />
            <div className="flex-1 w-full space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-20 w-full" />
              <div className="flex gap-3">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>
        </section>

        {/* Card de Informações Pessoais */}
        <section className="rounded-lg border-2 border-foreground/10 p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-6 w-full" />
              </div>
            ))}
          </div>
        </section>

        {/* Card de Segurança */}
        <section className="rounded-lg border-2 border-foreground/10 p-6 mb-6">
          <Skeleton className="h-8 w-40 mb-6" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-40 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
          <Skeleton className="h-10 w-full mt-6" />
        </section>

        {/* Card de Preferências */}
        <section className="rounded-lg border-2 border-foreground/10 p-6 mb-6">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-6 w-6 mt-0.5" />
                <div className="flex-1">
                  <Skeleton className="h-6 w-48 mb-1" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Card de Ações da Conta */}
        <section className="rounded-lg border-2 border-foreground/10 p-6">
          <Skeleton className="h-8 w-40 mb-6" />
          <div className="flex flex-col sm:flex-row gap-3">
            <Skeleton className="h-10 w-full sm:w-32" />
            <Skeleton className="h-10 w-full sm:w-40" />
          </div>
        </section>
      </div>
    </div>
  );
}
