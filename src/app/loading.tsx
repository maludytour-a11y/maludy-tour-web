export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 lg:py-10">
      {/* Barra de progreso simple arriba */}
      <div className="fixed inset-x-0 top-0 z-50 h-1">
        <div className="h-full w-full bg-gradient-to-r from-amber-500/0 via-amber-500/70 to-amber-500/0 animate-pulse" />
      </div>

      {/* Header skeleton (logo + título) */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded bg-muted animate-pulse" />
          <div className="h-6 w-56 rounded bg-muted animate-pulse" />
        </div>
        <div className="hidden sm:block h-9 w-24 rounded-full bg-muted animate-pulse" />
      </div>

      {/* Buscador skeleton */}
      <div className="mb-6 flex flex-col items-center">
        <div className="w-full sm:w-[420px]">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 rounded bg-muted animate-pulse" />
            <div className="h-11 w-full rounded-xl bg-muted pl-10 animate-pulse" />
          </div>
          <div className="mt-3 mx-auto h-4 w-40 rounded bg-muted animate-pulse" />
        </div>
      </div>

      {/* Grid de cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <article key={i} className="rounded-2xl border bg-card shadow-sm overflow-hidden">
            {/* Cover */}
            <div className="relative aspect-[16/9] bg-muted animate-pulse" />

            {/* Body */}
            <div className="p-4 space-y-3">
              <div className="h-5 w-3/4 rounded bg-muted animate-pulse" />
              <div className="h-4 w-1/2 rounded bg-muted animate-pulse" />
              <div className="h-4 w-2/5 rounded bg-muted animate-pulse" />

              <div className="mt-2 flex items-center gap-2">
                <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                <div className="h-3 w-20 rounded bg-muted animate-pulse" />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-3 w-14 rounded bg-muted animate-pulse" />
                  <div className="h-6 w-24 rounded bg-muted animate-pulse" />
                  <div className="h-3 w-16 rounded bg-muted animate-pulse" />
                </div>
                <div className="h-9 w-28 rounded-full bg-muted animate-pulse" />
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Pie pequeño skeleton */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="h-4 w-48 rounded bg-muted animate-pulse" />
        <div className="h-4 w-36 rounded bg-muted animate-pulse" />
      </div>

      {/* Para accesibilidad */}
      <span className="sr-only">Cargando actividades…</span>
    </div>
  );
}
