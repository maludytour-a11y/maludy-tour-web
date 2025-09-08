import ClientCrash from "./client-crash";

export default function DebugErrorPage({ searchParams }: { searchParams?: { server?: string } }) {
  // Error del lado servidor (captura app/error.tsx)
  if (searchParams?.server === "1") {
    throw new Error("SSR crash test");
  }

  return (
    <main className="min-h-dvh grid place-items-center p-8">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-bold">Debug: Error boundary</h1>
        <p className="text-muted-foreground">Usa los botones para disparar errores controlados.</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a className="rounded-lg border px-4 py-2" href="/_debug/error?server=1">
            Error SSR (server)
          </a>
          <ClientCrash />
        </div>
      </div>
    </main>
  );
}
