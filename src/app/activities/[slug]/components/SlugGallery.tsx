// components/SlugGallery.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

type ImageItem = { url: string };

interface SlugGalleryProps {
  images: ImageItem[];
  title: string;
}

export const SlugGallery = ({ images, title }: SlugGalleryProps) => {
  const safeImages = useMemo(() => (Array.isArray(images) ? images.filter(Boolean) : []), [images]);
  const [idx, setIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const total = safeImages.length || 1;
  const current = Math.min(Math.max(idx, 0), total - 1);

  const go = (n: number) => setIdx((p) => (n + total) % total);
  const prev = () => go(current - 1);
  const next = () => go(current + 1);
  const open = () => setLightbox(true);
  const close = () => setLightbox(false);

  // Teclado (← → y Esc en lightbox)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, total]);

  // Swipe en móvil
  const startX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0]?.clientX ?? null;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const dx = (e.changedTouches[0]?.clientX ?? 0) - startX.current;
    if (Math.abs(dx) > 40) {
      dx > 0 ? prev() : next();
    }
    startX.current = null;
  };

  if (safeImages.length === 0) {
    // Fallback simple si no hay imágenes
    return (
      <div className="mb-5">
        <div className="relative aspect-[16/9] w-full rounded-2xl bg-neutral-200 ring-1 ring-black/5" />
      </div>
    );
  }

  return (
    <div className="mb-6">
      {/* Imagen principal */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-neutral-200 ring-1 ring-black/5" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} role="group" aria-label={`Galería de imágenes: ${title}`}>
        <Image key={safeImages[current].url} src={safeImages[current].url} alt={`${title} (${current + 1}/${total})`} fill sizes="(min-width:1024px) 66vw, 100vw" className="object-cover select-none will-change-transform [transform:translateZ(0)]" priority={current === 0} draggable={false} />

        {/* Gradiente sutil arriba para legibilidad */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/20 to-transparent" />

        {/* Controles: anterior / siguiente */}
        {total > 1 && (
          <>
            <button type="button" onClick={prev} aria-label="Anterior" className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/60">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" onClick={next} aria-label="Siguiente" className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/60">
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Indicador + maximizar */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <span className="rounded-full bg-black/60 px-2 py-1 text-xs text-white">
            {current + 1} / {total}
          </span>
          <button type="button" onClick={open} aria-label="Ver en pantalla completa" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/60">
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Thumbnails */}
      {total > 1 && (
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
          {safeImages.map((img, i) => {
            const active = i === current;
            return (
              <button key={img.url + i} type="button" aria-label={`Ver imagen ${i + 1}`} aria-pressed={active} onClick={() => setIdx(i)} className={["relative h-16 w-24 shrink-0 overflow-hidden rounded-lg ring-1 transition", active ? "ring-amber-500" : "ring-black/10 hover:ring-amber-300"].join(" ")}>
                <Image src={img.url} alt={`${title} miniatura ${i + 1}`} fill className="object-cover select-none" draggable={false} />
                {active && <div className="absolute inset-0 ring-2 ring-inset ring-amber-500/70" />}
              </button>
            );
          })}
        </div>
      )}

      {/* Lightbox fullscreen */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90" role="dialog" aria-label="Visor de imágenes a pantalla completa" onClick={close}>
          <div className="absolute inset-0 flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full max-w-6xl aspect-[16/9]">
              <Image src={safeImages[current].url} alt={`${title} (ampliada ${current + 1}/${total})`} fill className="object-contain" sizes="100vw" priority />
            </div>

            {total > 1 && (
              <>
                <button type="button" onClick={prev} aria-label="Anterior" className="absolute left-5 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25">
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button type="button" onClick={next} aria-label="Siguiente" className="absolute right-5 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25">
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            <button type="button" onClick={close} aria-label="Cerrar" className="absolute right-4 top-4 rounded-full bg-white/15 px-3 py-1 text-sm text-white hover:bg-white/25">
              Cerrar
            </button>

            <div className="pointer-events-none absolute bottom-4 left-0 right-0 text-center text-xs text-white/80">
              {current + 1} / {total}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlugGallery;
