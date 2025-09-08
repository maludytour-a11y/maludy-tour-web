"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw, Home, Clipboard } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Logea para depurar en consola/observabilidad
    console.error(error);
  }, [error]);

  const copyDigest = async () => {
    try {
      await navigator.clipboard.writeText(error?.digest ?? error.message ?? "");
    } catch {}
  };

  return (
    <div className="min-h-dvh grid place-items-center p-6">
      <div className="w-full max-w-md text-center space-y-4">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-amber-100 text-amber-700">
          <AlertTriangle className="h-6 w-6" />
        </div>

        <h1 className="text-2xl font-bold">Algo salió mal</h1>
        <p className="text-sm text-muted-foreground">Ocurrió un error inesperado. Puedes intentar recargar esta sección.</p>

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
          <Button variant="secondary" className="gap-2" onClick={copyDigest}>
            <Clipboard className="h-4 w-4" />
            Copiar ID
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
  );
}
