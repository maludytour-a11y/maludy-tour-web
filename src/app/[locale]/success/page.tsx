"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppSelector } from "@/context/redux/hooks";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Calendar, Clock, MapPin, Users, Phone, Mail, User as UserIcon, ReceiptText, Home } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export default function SuccessPage() {
  const t = useTranslations("Success");
  const locale = useLocale();

  // Lee { customer, booking } del slice
  const { booking, customer } = useAppSelector((s) => s.bookingReducer);

  const currency = useMemo(
    () =>
      new Intl.NumberFormat(locale || "es-DO", {
        style: "currency",
        currency: "USD",
      }),
    [locale]
  );

  const totalPeople = useMemo(() => (booking.seniors ?? 0) + (booking.adults ?? 0) + (booking.youths ?? 0) + (booking.children ?? 0) + (booking.babies ?? 0), [booking]);

  const dateLabel = useMemo(() => {
    if (!booking.date) return "—";
    try {
      const d = new Date(booking.date);
      if (Number.isNaN(d.getTime())) return "—";
      return d.toLocaleDateString(locale || "es-DO", { day: "2-digit", month: "2-digit", year: "numeric" });
    } catch {
      return "—";
    }
  }, [booking.date, locale]);

  // Referencia de reserva simple (legible)
  const reference = booking.no;

  // Etiquetas de personas traducidas
  const gl = {
    seniors: t("GuestsLabels.Seniors"),
    adults: t("GuestsLabels.Adults"),
    youths: t("GuestsLabels.Youths"),
    children: t("GuestsLabels.Children"),
    babies: t("GuestsLabels.Babies"),
  };

  // Oculta categorías con 0
  const personRows: Array<{ label: string; value: number }> = [
    { label: gl.seniors, value: booking.seniors ?? 0 },
    { label: gl.adults, value: booking.adults ?? 0 },
    { label: gl.youths, value: booking.youths ?? 0 },
    { label: gl.children, value: booking.children ?? 0 },
    { label: gl.babies, value: booking.babies ?? 0 },
  ].filter((r) => r.value > 0);

  const isMissingCore = !booking.activityId || !booking.activityName || !booking.date || !booking.schedule || totalPeople === 0 || booking.totalPrice <= 0;

  const descText = customer.email ? t("Card.DescriptionWithEmail", { email: customer.email }) : t("Card.DescriptionNoEmail");

  return (
    <div className="container mx-auto px-4 py-8 lg:py-10">
      {/* Encabezado con logo */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/logo-transparent.svg" alt="Maludy Tour" width={40} height={40} className="rounded" priority />
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{t("Header.Title")}</h1>
        </div>

        <Button asChild variant="ghost" className="gap-2">
          <Link href="/">
            <Home className="h-4 w-4" />
            {t("Header.Home")}
          </Link>
        </Button>
      </div>

      {isMissingCore && (
        <Alert className="mb-6">
          <AlertDescription>{t("Alert.Missing")}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tarjeta de éxito */}
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                <CardTitle className="leading-tight">{t("Card.Title")}</CardTitle>
              </div>
              <CardDescription>{descText}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Referencia y total (destacado) */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground">{t("Card.Reference")}</p>
                  <p className="font-semibold leading-tight">{reference}</p>
                </div>
                <div className="rounded-lg bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground">{t("Card.TotalPaid")}</p>
                  <p className="font-semibold leading-tight">{currency.format(booking.totalPrice || 0)}</p>
                </div>
              </div>

              <Separator />

              {/* Datos del cliente */}
              <section className="grid md:grid-cols-3 gap-3">
                <InfoRow icon={<UserIcon className="h-4 w-4" />} label={t("Info.Name")} value={customer.name || "—"} />
                <InfoRow icon={<Mail className="h-4 w-4" />} label={t("Info.Email")} value={customer.email || "—"} />
                <InfoRow icon={<Phone className="h-4 w-4" />} label={t("Info.Phone")} value={customer.phone || "—"} />
              </section>

              {/* Detalles de la reserva */}
              <section className="grid md:grid-cols-3 gap-3">
                <InfoRow icon={<Calendar className="h-4 w-4" />} label={t("Info.Date")} value={dateLabel} />
                <InfoRow icon={<Clock className="h-4 w-4" />} label={t("Info.Schedule")} value={booking.schedule || "—"} />
                <InfoRow icon={<MapPin className="h-4 w-4" />} label={t("Info.Pickup")} value={booking.pickupLocation || "—"} />
              </section>

              {/* Personas */}
              <section className="rounded-lg bg-muted/40 p-3">
                <div className="flex items-center">
                  <span className="text-muted-foreground text-sm flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {t("People.Title")}
                  </span>
                  <span className="ml-auto font-medium">{totalPeople}</span>
                </div>

                {personRows.length > 0 && (
                  <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-1 text-sm text-muted-foreground">
                    {personRows.map((row) => (
                      <FragmentRow key={row.label} label={row.label} value={row.value} />
                    ))}
                  </div>
                )}
              </section>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <Button variant="outline" className="gap-2" onClick={() => window.print()}>
                <ReceiptText className="h-4 w-4" />
                {t("Actions.PrintReceipt")}
              </Button>
              <Button asChild variant="secondary">
                <Link href="/activities">{t("Actions.ExploreMore")}</Link>
              </Button>
              <Button asChild>
                <Link href="/">{t("Actions.GoHome")}</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Columna derecha: resumen compacto/pegajoso en desktop */}
        <div className="lg:col-span-1">
          <Card className="lg:sticky lg:top-6">
            <CardHeader className="space-y-1">
              <CardTitle className="leading-tight">{String(booking.activityName || t("Side.ActivityFallback"))}</CardTitle>
              <CardDescription>{t("Side.SummaryTitle")}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="rounded-lg bg-muted/40 p-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">{t("Info.Date")}:</span>
                  <span className="ml-auto">{dateLabel}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">{t("Info.Schedule")}:</span>
                  <span className="ml-auto">{booking.schedule || "—"}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium">{t("Info.Pickup")}:</span>
                  <span className="ml-auto text-right">{booking.pickupLocation || "—"}</span>
                </div>
              </div>

              <div className="text-sm space-y-1">
                <div className="flex items-center">
                  <span className="text-muted-foreground">{t("People.Title")}</span>
                  <span className="ml-auto font-medium">{totalPeople}</span>
                </div>
                {personRows.length > 0 && (
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-muted-foreground">
                    {personRows.map((row) => (
                      <FragmentRow key={row.label} label={row.label} value={row.value} />
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex items-center text-base">
                <span className="font-semibold">{t("Side.Total")}</span>
                <span className="ml-auto text-xl font-extrabold">{currency.format(booking.totalPrice || 0)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ---------- Pequeños helpers UI ---------- */
function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/40 p-3 text-sm flex items-center gap-2">
      {icon}
      <span className="font-medium">{label}:</span>
      <span className="ml-auto text-right truncate">{value}</span>
    </div>
  );
}

function FragmentRow({ label, value }: { label: string; value: number }) {
  return (
    <>
      <span>{label}</span>
      <span className="text-right">{value}</span>
    </>
  );
}
