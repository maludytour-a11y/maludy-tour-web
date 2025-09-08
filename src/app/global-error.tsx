"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="es">
      <body>
        <div className="min-h-dvh grid place-items-center p-6">
          <div className="w-full max-w-md text-center space-y-4">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-rose-100 text-rose-700">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold">Error crítico</h1>
            <p className="text-sm text-muted-foreground">Hubo un problema cargando la aplicación.</p>
            {error?.digest && (
              <p className="text-xs text-muted-foreground">
                ID de error: <code className="font-mono">{error.digest}</code>
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
              <Button onClick={reset} className="gap-2">
                <RefreshCcw className="h-4 w-4" />
                Reintentar
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <Link href="/">
                  <Home className="h-4 w-4" />
                  Ir al inicio
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
