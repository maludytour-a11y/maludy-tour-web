import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { agencyInfo } from "@/config";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, MapPin, Clock, Users, Star, Handshake, Phone, Mail, Globe } from "lucide-react";
import { AboutHero } from "./AboutHero";
import { waHref } from "@/utils/functions";

/** Metadata localizada con next-intl (Next 15: params es Promise) */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AboutPage.Meta" });

  return {
    title: t("Title", { agencyName: agencyInfo.name }),
    description: t("Description", { agencyName: agencyInfo.name }),
    openGraph: {
      title: t("OGTitle", { agencyName: agencyInfo.name }),
      description: t("OGDescription", { agencyName: agencyInfo.name }),
      type: "website",
    },
  };
}

/** Página About como Server Component usando getTranslations */
export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AboutPage" });

  return (
    <div className="container mx-auto px-4 py-10 lg:py-14">
      {/* HERO */}
      <AboutHero />

      {/* QUIÉNES SOMOS */}
      <section className="mt-10 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("WhoWeAreTitle")}</CardTitle>
            <CardDescription>{t("SloganText")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 leading-relaxed text-sm md:text-base">
            <p>
              {t.rich("Text1", {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
            <p>{t("Text2")}</p>
            <p>{t("Text3")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("ApproachTitle")}</CardTitle>
            <CardDescription>{t("ApproachSubtitle")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <FeatureItem icon={<ShieldCheck className="h-4 w-4" />} title={t("Features.TrustSafety")} />
            <FeatureItem icon={<Users className="h-4 w-4" />} title={t("Features.ComfortableGroups")} />
            <FeatureItem icon={<Clock className="h-4 w-4" />} title={t("Features.PunctualClarity")} />
            <FeatureItem icon={<MapPin className="h-4 w-4" />} title={t("Features.LocalExpertise")} />
            <FeatureItem icon={<Star className="h-4 w-4" />} title={t("Features.VerifiedQuality")} />
            <FeatureItem icon={<Handshake className="h-4 w-4" />} title={t("Features.PersonalizedService")} />
          </CardContent>
        </Card>
      </section>

      {/* POR QUÉ ELEGIRNOS */}
      <section className="mt-10">
        <Card>
          <CardHeader>
            <CardTitle>{t("WhyChooseUsTitle")}</CardTitle>
            <CardDescription>{t("WhyChooseUsSubtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <ReasonItem title={t("Reasons.CloseSupportTitle")} desc={t("Reasons.CloseSupportDesc")} icon={<Phone className="h-5 w-5" />} />
              <ReasonItem title={t("Reasons.BilingualGuidesTitle")} desc={t("Reasons.BilingualGuidesDesc")} icon={<Users className="h-5 w-5" />} />
              <ReasonItem title={t("Reasons.ReliableSchedulesTitle")} desc={t("Reasons.ReliableSchedulesDesc")} icon={<Clock className="h-5 w-5" />} />
              <ReasonItem title={t("Reasons.CuratedRoutesTitle")} desc={t("Reasons.CuratedRoutesDesc")} icon={<MapPin className="h-5 w-5" />} />
              <ReasonItem title={t("Reasons.SecureBookingsTitle")} desc={t("Reasons.SecureBookingsDesc")} icon={<ShieldCheck className="h-5 w-5" />} />
              <ReasonItem title={t("Reasons.TotalTransparencyTitle")} desc={t("Reasons.TotalTransparencyDesc")} icon={<Star className="h-5 w-5" />} />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* COBERTURA + CONTACTO */}
      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        {/* Cobertura */}
        <Card>
          <CardHeader>
            <CardTitle>{t("CoverageTitle")}</CardTitle>
            <CardDescription>{t("CoverageSubtitle")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm md:text-base">
            <p>
              {t("LocatedAtPrefix")} <strong>{agencyInfo.contact.address || "Punta Cana"}</strong>. {t("CoverageText")}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="secondary" className="rounded-full">
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(agencyInfo.contact.address || "Punta Cana")}`} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                  {t("ViewOnGoogleMaps")}
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

        {/* Contacto rápido */}
        <Card>
          <CardHeader>
            <CardTitle>{t("QuickContactTitle")}</CardTitle>
            <CardDescription>{t("QuickContactSubtitle")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                {t("PhoneLabel")}
              </div>
              <a href={waHref()} target="_blank" rel="noopener noreferrer" className="font-medium">
                {agencyInfo.contact.phone}
              </a>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                {t("EmailLabel")}
              </div>
              <a href={`mailto:${agencyInfo.contact.email}`} className="font-medium">
                {agencyInfo.contact.email}
              </a>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Globe className="h-4 w-4" />
                {t("WebsiteLabel")}
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
