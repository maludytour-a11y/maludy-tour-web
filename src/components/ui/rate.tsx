"use client";

import * as React from "react";
import { Star as StarIcon } from "lucide-react";

type RateProps = {
  /** Valor de 0..max (puede tener decimales) */
  value: number | string | null | undefined;
  /** Nº de estrellas totales */
  max?: number;
  /** Tamaño en px de cada estrella */
  size?: number;
  /** Clase para la estrella vacía */
  emptyClassName?: string;
  /** Clase para la estrella llena */
  filledClassName?: string;
  /** Clases extra para el contenedor */
  className?: string;
  /** Etiqueta accesible personalizada */
  ariaLabel?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function Rate({ value, max = 5, size = 18, emptyClassName = "text-neutral-300", filledClassName = "text-yellow-400", className, ariaLabel }: RateProps) {
  const v = clamp(Number(value ?? 0) || 0, 0, max);

  return (
    <span className={["inline-flex items-center gap-0.5", className].filter(Boolean).join(" ")} role="img" aria-label={ariaLabel ?? `Valoración ${v.toFixed(1)} sobre ${max}`}>
      {Array.from({ length: max }).map((_, i) => {
        const fill = clamp(v - i, 0, 1); // 0..1 cuánto se llena esta estrella
        return (
          <span key={i} className="relative inline-block align-middle" style={{ width: size, height: size }} aria-hidden>
            {/* base vacía */}
            <StarIcon className={emptyClassName} style={{ width: size, height: size }} />
            {/* capa llena recortada por ancho */}
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <StarIcon
                className={filledClassName}
                style={{ width: size, height: size }}
                // lucide viene sin relleno; forzamos fill
                fill="currentColor"
              />
            </span>
          </span>
        );
      })}
    </span>
  );
}

export default Rate;
