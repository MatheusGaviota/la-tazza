'use client';

export default function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Breadcrumb Skeleton */}
      <div className="max-w-[1400px] mx-auto px-4 py-4">
        <div className="flex gap-2">
          <div className="h-4 w-16 bg-foreground/10 rounded animate-pulse" />
          <div className="h-4 w-4 bg-foreground/10 rounded" />
          <div className="h-4 w-20 bg-foreground/10 rounded animate-pulse" />
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-[1400px] mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Galeria Skeleton */}
          <div className="flex flex-col gap-4">
            <div className="w-full aspect-square rounded-xl bg-foreground/10 animate-pulse" />
            <div className="flex gap-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-20 h-20 rounded-lg bg-foreground/10 animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Info Skeleton */}
          <div className="flex flex-col gap-6">
            {/* Categoria */}
            <div>
              <div className="h-8 w-32 bg-foreground/10 rounded-full animate-pulse mb-4" />
              <div className="h-4 w-24 bg-foreground/10 rounded animate-pulse" />
            </div>

            {/* Título */}
            <div className="space-y-2">
              <div className="h-10 w-full bg-foreground/10 rounded animate-pulse" />
              <div className="h-6 w-3/4 bg-foreground/10 rounded animate-pulse" />
            </div>

            {/* Rating */}
            <div className="flex gap-2 pb-4 border-b-2 border-foreground/10">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-5 h-5 bg-foreground/10 rounded animate-pulse"
                />
              ))}
              <div className="h-5 w-20 bg-foreground/10 rounded animate-pulse" />
            </div>

            {/* Preço */}
            <div className="space-y-4">
              <div className="h-12 w-40 bg-foreground/10 rounded animate-pulse" />
              <div className="flex gap-4">
                <div className="h-12 w-32 bg-foreground/10 rounded animate-pulse" />
                <div className="flex-1 h-12 bg-foreground/10 rounded animate-pulse" />
              </div>
            </div>

            {/* Info Boxes */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y-2 border-foreground/10">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-foreground/10 rounded-lg animate-pulse"
                />
              ))}
            </div>

            {/* Características */}
            <div className="space-y-3">
              <div className="h-6 w-32 bg-foreground/10 rounded animate-pulse" />
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 w-full bg-foreground/10 rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Descrição Skeleton */}
        <div className="mt-16 border-t-2 border-foreground/10 pt-12 space-y-6">
          <div className="h-8 w-40 bg-foreground/10 rounded animate-pulse" />
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-4 w-full bg-foreground/10 rounded animate-pulse"
            />
          ))}
        </div>

        {/* Produtos Relacionados Skeleton */}
        <div className="mt-20 pt-12 border-t-2 border-foreground/10">
          <div className="h-8 w-48 bg-foreground/10 rounded animate-pulse mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border-2 border-foreground/10 rounded-xl overflow-hidden">
                <div className="w-full aspect-square bg-foreground/10 animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-6 bg-foreground/10 rounded animate-pulse" />
                  <div className="h-4 bg-foreground/10 rounded animate-pulse" />
                  <div className="h-8 bg-foreground/10 rounded animate-pulse mt-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
