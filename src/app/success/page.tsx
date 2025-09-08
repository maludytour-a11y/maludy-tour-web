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

const currency = new Intl.NumberFormat("es-DO", { style: "currency", currency: "USD" });

export default function SuccessPage() {
  // Lee { customer, booking } del slice
  const { booking, customer } = useAppSelector((s) => s.bookingReducer);

  const totalPeople = useMemo(() => (booking.seniors ?? 0) + (booking.adults ?? 0) + (booking.youths ?? 0) + (booking.children ?? 0) + (booking.babies ?? 0), [booking]);

  const dateLabel = useMemo(() => {
    if (!booking.date) return "—";
    try {
      const d = new Date(booking.date);
      if (Number.isNaN(d.getTime())) return "—";
      return d.toLocaleDateString("es-DO", { day: "2-digit", month: "2-digit", year: "numeric" });
    } catch {
      return "—";
    }
  }, [booking.date]);

  // Referencia de reserva simple (legible)
  const reference = booking.no;

  // Oculta categorías con 0
  const personRows: Array<{ label: string; value: number }> = [
    { label: "Ancianos", value: booking.seniors ?? 0 },
    { label: "Adultos", value: booking.adults ?? 0 },
    { label: "Jóvenes", value: booking.youths ?? 0 },
    { label: "Niños", value: booking.children ?? 0 },
    { label: "Bebés", value: booking.babies ?? 0 },
  ].filter((r) => r.value > 0);

  const isMissingCore = !booking.activityId || !booking.activityName || !booking.date || !booking.schedule || totalPeople === 0 || booking.totalPrice <= 0;

  return (
    <div className="container mx-auto px-4 py-8 lg:py-10">
      {/* Encabezado con logo */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/logo-transparent.svg" alt="Maludy Tour" width={40} height={40} className="rounded" priority />
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">¡Reserva confirmada!</h1>
        </div>

        <Button asChild variant="ghost" className="gap-2">
          <Link href="/">
            <Home className="h-4 w-4" />
            Inicio
          </Link>
        </Button>
      </div>

      {isMissingCore && (
        <Alert className="mb-6">
          <AlertDescription>No encontramos los datos completos de tu reserva. Si ya realizaste el pago, por favor vuelve a la actividad o ponte en contacto con nosotros.</AlertDescription>
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
                <CardTitle className="leading-tight">¡Gracias! Tu reserva se ha completado correctamente</CardTitle>
              </div>
              <CardDescription>Te enviamos un correo con la confirmación {customer.email ? `a ${customer.email}` : ""}. Presenta este comprobante el día de la actividad.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Referencia y total (destacado) */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground">Referencia</p>
                  <p className="font-semibold leading-tight">{reference}</p>
                </div>
                <div className="rounded-lg bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground">Total pagado</p>
                  <p className="font-semibold leading-tight">{currency.format(booking.totalPrice || 0)}</p>
                </div>
              </div>

              <Separator />

              {/* Datos del cliente */}
              <section className="grid md:grid-cols-3 gap-3">
                <InfoRow icon={<UserIcon className="h-4 w-4" />} label="Nombre" value={customer.name || "—"} />
                <InfoRow icon={<Mail className="h-4 w-4" />} label="Correo" value={customer.email || "—"} />
                <InfoRow icon={<Phone className="h-4 w-4" />} label="Teléfono" value={customer.phone || "—"} />
              </section>

              {/* Detalles de la reserva */}
              <section className="grid md:grid-cols-3 gap-3">
                <InfoRow icon={<Calendar className="h-4 w-4" />} label="Fecha" value={dateLabel} />
                <InfoRow icon={<Clock className="h-4 w-4" />} label="Horario" value={booking.schedule || "—"} />
                <InfoRow icon={<MapPin className="h-4 w-4" />} label="Recogida" value={booking.pickupLocation || "—"} />
              </section>

              {/* Personas */}
              <section className="rounded-lg bg-muted/40 p-3">
                <div className="flex items-center">
                  <span className="text-muted-foreground text-sm flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Personas
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
                Imprimir comprobante
              </Button>
              <Button asChild variant="secondary">
                <Link href="/activities">Explorar más actividades</Link>
              </Button>
              <Button asChild>
                <Link href="/">Ir al inicio</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Columna derecha: resumen compacto/pegajoso en desktop */}
        <div className="lg:col-span-1">
          <Card className="lg:sticky lg:top-6">
            <CardHeader className="space-y-1">
              <CardTitle className="leading-tight">{String(booking.activityName || "Actividad")}</CardTitle>
              <CardDescription>Resumen de tu compra</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="rounded-lg bg-muted/40 p-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Fecha:</span>
                  <span className="ml-auto">{dateLabel}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Horario:</span>
                  <span className="ml-auto">{booking.schedule || "—"}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium">Recogida:</span>
                  <span className="ml-auto text-right">{booking.pickupLocation || "—"}</span>
                </div>
              </div>

              <div className="text-sm space-y-1">
                <div className="flex items-center">
                  <span className="text-muted-foreground">Personas</span>
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
                <span className="font-semibold">Total</span>
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
