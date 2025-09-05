"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Rate from "@/components/ui/rate";

export const Hero = () => {
  return (
    <section
      className="
        relative flex items-center
        bg-gradient-to-b from-white via-[#fbfbfb] to-emerald-50
      "
    >
      <div className="container mx-auto px-4 py-8 md:py-10 lg:py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* texto */}
          <div className="max-w-xl">
            <Badge className="mb-4 rounded-full px-3 py-1" variant="secondary">
              ⭐ Top Venta 2025
            </Badge>

            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-neutral-900">
              TOUR GUIADO <span className="text-emerald-700">VAMOS AL CAMPO</span>
              <br /> DESDE PUNTA CANA
            </h1>

            <p className="mt-4 text-neutral-600 text-base md:text-lg">Disfruta de un día de aventura y cultura dominicana: salto de agua, basílica, finca de cacao y almuerzo típico. Grupo reducido y guía local.</p>

            <div className="mt-3 flex items-center gap-2">
              <Rate value={5} />
              <span className="text-sm text-neutral-500">4.9 (1,245 reseñas)</span>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button asChild className="rounded-full bg-amber-500 hover:bg-amber-600 px-6 py-5 h-auto text-base">
                <Link href="/booking?tour=campo">Booking Now</Link>
              </Button>

              <Button asChild variant="outline" className="rounded-full px-6 py-5 h-auto text-base">
                <Link href="/activities">Otras actividades</Link>
              </Button>

              <Button asChild variant="outline" className="rounded-full px-4 py-5 h-auto text-base flex items-center gap-2">
                <a href="https://wa.me/0000000000" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" /> Consultar por WhatsApp
                </a>
              </Button>
            </div>

            <ul className="mt-6 text-sm text-neutral-500 grid grid-cols-2 gap-y-1 max-w-sm">
              <li>• Cancelación gratuita</li>
              <li>• Recogida en hotel</li>
              <li>• Duración 7–8 h</li>
              <li>• Idiomas: ES / EN</li>
            </ul>
          </div>

          {/* collage imágenes */}
          <div className="relative">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {/* grande izquierda */}
              <div className="col-span-2 sm:col-span-2">
                <div className="rounded-3xl overflow-hidden shadow-lg">
                  <Image src="/images/waterfall.jpg" alt="Cascada" width={900} height={600} className="h-64 md:h-80 w-full object-cover" priority />
                </div>
              </div>

              {/* tarjeta */}
              <div className="rounded-3xl overflow-hidden shadow-lg">
                <Image src="/images/basilica.jpeg" alt="Basílica" width={600} height={400} className="h-40 md:h-full w-full object-cover" />
              </div>

              <div className="rounded-3xl overflow-hidden shadow-lg">
                <Image src="/images/tabaco.jpg" alt="Finca bananos" width={600} height={400} className="h-40 md:h-48 w-full object-cover" />
              </div>

              <div className="rounded-3xl overflow-hidden shadow-lg">
                <Image src="/images/caballo.jpg" alt="Experiencia local" width={600} height={400} className="h-40 md:h-48 w-full object-cover" />
              </div>
            </div>

            {/* badge precio */}
            <div className="absolute -bottom-4 left-4 bg-white/90 backdrop-blur rounded-2xl shadow-md px-4 py-3">
              <p className="text-xs text-neutral-500">Desde</p>
              <p className="text-2xl font-bold text-neutral-900">
                $59 <span className="text-sm font-medium text-neutral-500">/persona</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
