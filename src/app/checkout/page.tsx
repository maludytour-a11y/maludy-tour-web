"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/context/redux/hooks";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, Clock, MapPin, Users, CreditCard, Banknote, ShieldCheck, Lock, ArrowLeft, Phone, Mail, User } from "lucide-react";
import { CreateBookingSchema } from "../../schemas";
import { PaymentMethod, PaymentStatus } from "@/generated/prisma";
import { setBookingNo } from "../../context/redux/features/bookingSlice";

// 👇 importa el schema cliente

const currency = new Intl.NumberFormat("es-DO", { style: "currency", currency: "USD" });

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const { booking, customer } = useAppSelector((s) => s.bookingReducer);
  const route = useRouter();

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

  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [isSending, setIsSending] = useState(false);

  const isMissingCore = !booking.activityId || !booking.activityName || !booking.date || !booking.schedule || totalPeople === 0 || booking.totalPrice <= 0 || !customer.name;

  const personRows: Array<{ label: string; value: number }> = [
    { label: "Ancianos", value: booking.seniors ?? 0 },
    { label: "Adultos", value: booking.adults ?? 0 },
    { label: "Jóvenes", value: booking.youths ?? 0 },
    { label: "Niños", value: booking.children ?? 0 },
    { label: "Bebés", value: booking.babies ?? 0 },
  ].filter((r) => r.value > 0);

  // 👇 Enviar a /api/bookings validando con Zod antes
  const cashPayment = async () => {
    try {
      if (isMissingCore) {
        alert("Faltan datos para completar la reserva. Verifica fecha, horario, personas y datos del cliente.");
        return;
      }

      // Construye el payload esperado por el backend
      const payload = {
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        activityId: booking.activityId,
        date: booking.date ?? "", // ISO string -> z.coerce.date lo parsea
        name: customer.name || "",
        no: "pendding",
        seniors: booking.seniors ?? 0,
        adults: booking.adults ?? 0,
        youths: booking.youths ?? 0,
        children: booking.children ?? 0,
        babies: booking.babies ?? 0,

        schedule: booking.schedule || "",
        pickupLocation: booking.pickupLocation || "",
        // si no tienes pickupTime, usa schedule de momento
        pickupTime: booking.schedule || "",

        totalPrice: Math.round(booking.totalPrice || 0),
        // solo CASH por ahora
        paymentMethod: method,
        paymentStatus: PaymentStatus.PENDING,
      };

      // Valida con Zod antes de enviar
      const parsed = CreateBookingSchema.safeParse(payload);
      if (!parsed.success) {
        const issues = parsed.error.issues.map((i) => `• ${i.path.join(".")}: ${i.message}`).join("\n");
        alert(`Revisa los campos:\n${issues}`);
        return;
      }

      setIsSending(true);

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!res.ok) {
        let msg = "Error al crear la reserva.";
        try {
          const j = await res.json();
          if (j?.errors) msg = "Errores de validación en el servidor.";
          if (j?.message) msg = j.message;
        } catch {}
        alert(msg);
        return;
      }

      const { no } = await res.json();

      dispatch(setBookingNo(no));

      // OK → redirige al comprobante
      route.push("/success");
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error inesperado al procesar la reserva.");
    } finally {
      setIsSending(false);
    }
  };

  const PrimaryCta = (
    <>
      {method === PaymentMethod.PAYPAL ? (
        <Button className="rounded-full px-6 cursor-pointer" disabled={isMissingCore || isSending} onClick={cashPayment}>
          Continuar con PayPal
        </Button>
      ) : (
        <Button className="rounded-full px-6 cursor-pointer" variant="default" disabled={isMissingCore || isSending} onClick={cashPayment}>
          Confirmar reserva (pago en efectivo)
        </Button>
      )}
    </>
  );

  return (
    <div className="container mx-auto px-4 py-8 lg:py-10 pb-24 sm:pb-10">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex flex-col gap-3">
          <Image src="/logo-transparent.svg" alt="Maludy Tour" width={40} height={40} className="rounded" priority />
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Finaliza tu reserva</h1>
        </div>

        <Button variant="ghost" className="gap-2" onClick={() => route.back()}>
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
      </div>

      {isMissingCore && (
        <Alert className="mb-6">
          <AlertDescription>Falta información para completar el pago. Vuelve a la actividad y completa fecha, horario y cantidad de personas.</AlertDescription>
        </Alert>
      )}

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resumen */}
        <div className="order-1 lg:order-2 lg:col-span-1">
          <Card className="lg:sticky lg:top-6">
            <CardHeader className="space-y-1">
              <CardTitle className="leading-tight">{String(booking.activityName || "Actividad")}</CardTitle>
              <CardDescription>Revisa los detalles antes de pagar.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Cliente */}
              <div className="rounded-lg bg-muted/40 p-3 text-sm">
                <Row icon={<User className="h-4 w-4" />} label="Nombre" value={customer.name || "—"} />
                <Row icon={<Mail className="h-4 w-4" />} label="Correo" value={customer.email || "—"} />
                <Row icon={<Phone className="h-4 w-4" />} label="Teléfono" value={customer.phone || "—"} />
              </div>

              {/* Reserva */}
              <div className="rounded-lg bg-muted/40 p-3 text-sm">
                <Row icon={<Calendar className="h-4 w-4" />} label="Fecha" value={dateLabel} />
                <Row icon={<Clock className="h-4 w-4" />} label="Horario" value={booking.schedule || "—"} />
                <Row icon={<MapPin className="h-4 w-4" />} label="Recogida" value={booking.pickupLocation || "—"} />
              </div>

              {/* Personas */}
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

              {/* Total */}
              <div className="flex items-center text-base">
                <span className="font-semibold">Total</span>
                <span className="ml-auto text-xl font-extrabold">{currency.format(booking.totalPrice || 0)}</span>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground text-center">Al continuar aceptas nuestras condiciones de servicio y política de cancelación.</p>
            </CardFooter>
          </Card>
        </div>

        {/* Método de pago */}
        <div className="order-2 lg:order-1 lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Método de pago</CardTitle>
              <CardDescription>Elige cómo deseas pagar tu experiencia.</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={method} onValueChange={(v) => setMethod(v as PaymentMethod)} className="grid gap-3">
                <div className="flex items-start gap-3 rounded-xl border p-4 opacity-60 pointer-events-none">
                  <RadioGroupItem id={PaymentMethod.PAYPAL} value={PaymentMethod.PAYPAL} className="mt-1" disabled />
                  <Label htmlFor="paypal" className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        <span className="font-medium">PayPal / Tarjeta</span>
                      </div>
                      <Badge variant="secondary">Próximamente</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Paga con PayPal o con tarjeta (sin cuenta). No disponible aún.</p>
                  </Label>
                </div>

                <div className="flex items-start gap-3 rounded-xl border p-4">
                  <RadioGroupItem id={PaymentMethod.CASH} value={PaymentMethod.CASH} className="mt-1 cursor-pointer" />
                  <Label htmlFor="cash" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Banknote className="h-5 w-5" />
                      <span className="font-medium">Pago en efectivo</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Pagarás en efectivo al momento de la recogida o al inicio de la actividad.</p>
                  </Label>
                </div>
              </RadioGroup>

              <Separator className="my-6" />

              <div className="grid sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4" />
                  Pago seguro
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4" />
                  Protección de compra
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  Atención personalizada
                </div>
              </div>
            </CardContent>

            <CardFooter className="hidden sm:flex justify-end">{PrimaryCta}</CardFooter>
          </Card>
        </div>
      </div>

      {/* Barra inferior fija (móvil) */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:hidden">
        <div className="mx-auto max-w-screen-xl px-4 py-3 flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground leading-none">Total</p>
            <p className="text-lg font-extrabold leading-tight">{currency.format(booking.totalPrice || 0)}</p>
          </div>
          <div className="shrink-0">{PrimaryCta}</div>
        </div>
      </div>
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span className="font-medium">{label}:</span>
      <span className="ml-auto text-right truncate">{value}</span>
    </div>
  );
}

/** Item de persona en el grid (etiqueta + valor a la derecha) */
function FragmentRow({ label, value }: { label: string; value: number }) {
  return (
    <>
      <span>{label}</span>
      <span className="text-right">{value}</span>
    </>
  );
}
