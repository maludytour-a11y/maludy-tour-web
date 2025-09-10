"use client";
import { Button } from "@/components/ui/button";
import { agencyInfo } from "@/config";
import { waHref } from "@/utils/functions";
import { HomeIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const AboutHero = () => {
  const route = useRouter();

  return (
    <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-b from-amber-50 to-white dark:from-zinc-900 dark:to-background">
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-amber-300/30 blur-3xl" />

      <div className="relative z-10 grid gap-8 p-6 sm:p-8 lg:grid-cols-[auto,1fr] lg:items-center lg:gap-10 lg:p-12">
        <div className="flex items-center gap-4">
          <Image src={agencyInfo.logo} alt={agencyInfo.name} width={80} height={80} className="rounded-xl ring-1 ring-black/5 dark:ring-white/10" unoptimized />
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Acerca de {agencyInfo.name}</h1>
            <p className="text-muted-foreground text-sm md:text-base">Experiencias auténticas, servicio cercano y atención a los detalles.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button className="rounded-full">
            <a href={waHref()} target="_blank" rel="noopener noreferrer" className="cursor-pointer flex items-center">
              <Image className="w-7 h-auto mr-1" src={"/whatsapp.svg"} alt={`${agencyInfo.name}-WhatsApp`} width={16} height={16} />
              Escríbenos por WhatsApp
            </a>
          </Button>
          <Button variant="secondary" className="rounded-full">
            <a href={`mailto:${agencyInfo.contact.email}`} className="cursor-pointer">
              Contáctanos por email
            </a>
          </Button>
          <Button variant="secondary" className="rounded-full cursor-pointer" onClick={() => route.push("/")}>
            <HomeIcon /> Home
          </Button>
        </div>
      </div>
    </section>
  );
};
