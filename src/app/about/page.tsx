import type { Metadata } from "next";
import { agencyInfo } from "@/config";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, MapPin, Clock, Users, Star, Handshake, Phone, Mail, Globe, ArrowRight } from "lucide-react";
import { AboutHero } from "./AboutHero";
import { waHref } from "@/utils/functions";

export const metadata: Metadata = {
  title: `Acerca de ${agencyInfo.name} — Quiénes somos`,
  description: agencyInfo.metadata.about.description,
  openGraph: {
    title: `Acerca de ${agencyInfo.name}`,
    description: agencyInfo.metadata.about.openGraph.description,
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-10 lg:py-14">
      {/* QUIÉNES SOMOS */}

      <AboutHero />

      <section className="mt-10 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>¿Quiénes somos?</CardTitle>
            <CardDescription>{agencyInfo.texts.about.sloganText}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 leading-relaxed text-sm md:text-base">
            <p>
              En <strong>{agencyInfo.name}</strong> {agencyInfo.texts.about.text1}
            </p>
            <p>{agencyInfo.texts.about.text2}</p>
            <p>{agencyInfo.texts.about.text3}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nuestro enfoque</CardTitle>
            <CardDescription>Lo que guía cada experiencia</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <FeatureItem icon={<ShieldCheck className="h-4 w-4" />} title="Confianza y seguridad" />
            <FeatureItem icon={<Users className="h-4 w-4" />} title="Grupos cómodos" />
            <FeatureItem icon={<Clock className="h-4 w-4" />} title="Puntualidad y claridad" />
            <FeatureItem icon={<MapPin className="h-4 w-4" />} title="Experiencia local" />
            <FeatureItem icon={<Star className="h-4 w-4" />} title="Calidad verificada" />
            <FeatureItem icon={<Handshake className="h-4 w-4" />} title="Atención personalizada" />
          </CardContent>
        </Card>
      </section>

      {/* POR QUÉ ELEGIRNOS */}
      <section className="mt-10">
        <Card>
          <CardHeader>
            <CardTitle>¿Por qué elegirnos?</CardTitle>
            <CardDescription>Beneficios claros y centrados en ti</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <ReasonItem title="Soporte cercano" desc="Acompañamiento antes, durante y después del tour." icon={<Phone className="h-5 w-5" />} />
              <ReasonItem title="Guías bilingües" desc="Comunicación fluida en Español e Inglés." icon={<Users className="h-5 w-5" />} />
              <ReasonItem title="Horarios confiables" desc="Itinerarios claros y coordinaciones puntuales." icon={<Clock className="h-5 w-5" />} />
              <ReasonItem title="Rutas curadas" desc="Seleccionamos experiencias con la mejor relación calidad-precio." icon={<MapPin className="h-5 w-5" />} />
              <ReasonItem title="Reservas seguras" desc="Confirmaciones por email y comprobante en PDF." icon={<ShieldCheck className="h-5 w-5" />} />
              <ReasonItem title="Transparencia total" desc="Lo que ves es lo que obtienes. Sin sorpresas." icon={<Star className="h-5 w-5" />} />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* COBERTURA */}
      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cobertura</CardTitle>
            <CardDescription>Operamos en Punta Cana y alrededores</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm md:text-base">
            <p>
              Estamos ubicados en <strong>{agencyInfo.contact.address || "Punta Cana"}</strong>. {agencyInfo.texts.about.coverageText}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="secondary" className="rounded-full">
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(agencyInfo.contact.address || "Punta Cana")}`} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                  Ver en Google Maps
                </a>
              </Button>
              <Button asChild variant="ghost" className="rounded-full">
                <a href={agencyInfo.contact.web} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                  <Globe className="mr-2 h-4 w-4" />
                  {new URL(agencyInfo.contact.web).host}
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* CONTACTO RÁPIDO */}
        <Card>
          <CardHeader>
            <CardTitle>Contacto rápido</CardTitle>
            <CardDescription>Estamos listos para ayudarte</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                Teléfono
              </div>
              <a href={waHref()} target="_blank" rel="noopener noreferrer" className="font-medium">
                {agencyInfo.contact.phone}
              </a>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                Correo
              </div>
              <a href={`mailto:${agencyInfo.contact.email}`} className="font-medium">
                {agencyInfo.contact.email}
              </a>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Globe className="h-4 w-4" />
                Sitio web
              </div>
              <a href={agencyInfo.contact.web} target="_blank" rel="noopener noreferrer" className="font-medium">
                {new URL(agencyInfo.contact.web).host}
              </a>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

/* ---------- Pequeños componentes ---------- */

function FeatureItem({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-muted/40 px-3 py-2">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">{icon}</span>
      <span className="text-sm font-medium">{title}</span>
    </div>
  );
}

function ReasonItem({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-xl border p-4 transition hover:shadow-sm">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">{icon}</span>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
