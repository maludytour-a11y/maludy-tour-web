"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { ActivityCard, Activity } from "@/components/ActivityCard";
import { NavBar } from "@/components";
import { useTranslations } from "next-intl";

// Carga MagicMotion solo en el cliente (y evitamos warning de React 19 con wrapper)
const MagicMotion = dynamic(() => import("react-magic-motion").then((m) => m.MagicMotion), { ssr: false });

function MaybeMagic({ children }: { children: React.ReactNode }) {
  const isReact19 = typeof React !== "undefined" && !!React.version && parseInt(React.version.split(".")[0] || "0", 10) >= 19;
  return isReact19 ? <>{children}</> : <MagicMotion>{children}</MagicMotion>;
}

function norm(s: string) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

export default function ActivitiesClient({ initialItems }: { initialItems: Activity[] }) {
  const [q, setQ] = useState("");
  const act = useTranslations("ActivitiesPage");

  const filtered = useMemo(() => {
    const nq = norm(q);
    if (!nq) return initialItems;
    return initialItems.filter((a) => norm(a.title).includes(nq));
  }, [q, initialItems]);

  return (
    <div className="container mx-auto px-4 py-8 lg:py-10 flex flex-col">
      {/* Nav */}
      <NavBar />

      {/* Buscador centrado */}
      <div className="mt-4 mb-6 flex flex-col items-center">
        <form onSubmit={(e) => e.preventDefault()} role="search" aria-label="Buscar actividades" className="w-full max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={act("SearchPlaceholder")} className="pl-9 pr-10" autoFocus />
            {!!q && (
              <button type="button" onClick={() => setQ("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Limpiar búsqueda" title="Limpiar">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>

        {/* Título + resultados (debajo del buscador, pequeño) */}
        <div className="mt-3 text-center">
          <p className="text-base md:text-lg font-semibold leading-tight">{act("Activities")}</p>
          <p className="text-xs text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? act("Result") : act("Results")}
          </p>
        </div>
      </div>

      {/* Grid */}
      <MaybeMagic>
        {filtered.length === 0 ? (
          <div className="rounded-xl border p-10 text-center text-muted-foreground">
            {act("NotFoundActivities")} {q ? `${act("For")} “${q}”` : ""}.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((a) => (
              <ActivityCard key={a.id} activity={a} />
            ))}
          </div>
        )}
      </MaybeMagic>
    </div>
  );
}
