"use client";

import { useMemo, useState, useEffect } from "react";
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
import { CreateBookingSchema } from "../../../schemas";
import { PaymentMethod, PaymentStatus } from "@/generated/prisma";
import { setBookingNo } from "../../../context/redux/features/bookingSlice";

import { useLocale, useTranslations } from "next-intl";
import PaypalButton from "@/components/PaypalButton";

const FALLBACK_CURRENCY_LOCALE = "es-DO";

export default function CheckoutPage() {
  const t = useTranslations("Checkout");
  const locale = useLocale();

  const dispatch = useAppDispatch();
  const { booking, customer } = useAppSelector((s) => s.bookingReducer);
  const route = useRouter();

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale || FALLBACK_CURRENCY_LOCALE, {
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
      return d.toLocaleDateString(locale || FALLBACK_CURRENCY_LOCALE, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  }, [booking.date, locale]);

  // Estado para el método
  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [isSending, setIsSending] = useState(false);

  const isMissingCore = !booking.activityId || !booking.activityName || !booking.date || !booking.schedule || totalPeople === 0 || booking.totalPrice <= 0 || !customer.name;

  const guestsLabelsT = (key: "seniors" | "adults" | "youths" | "children" | "babies") => {
    switch (key) {
      case "seniors":
        return t("GuestsLabels.Seniors");
      case "adults":
        return t("GuestsLabels.Adults");
      case "youths":
        return t("GuestsLabels.Youths");
      case "children":
        return t("GuestsLabels.Children");
      case "babies":
        return t("GuestsLabels.Babies");
    }
  };

  const personRows: Array<{ label: string; value: number }> = [
    { label: guestsLabelsT("seniors"), value: booking.seniors ?? 0 },
    { label: guestsLabelsT("adults"), value: booking.adults ?? 0 },
    { label: guestsLabelsT("youths"), value: booking.youths ?? 0 },
    { label: guestsLabelsT("children"), value: booking.children ?? 0 },
    { label: guestsLabelsT("babies"), value: booking.babies ?? 0 },
  ].filter((r) => r.value > 0);

  const cashPayment = async () => {
    try {
      if (isMissingCore) {
        alert(t("Alerts.MissingCore"));
        return;
      }

      const payload = {
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        activityId: booking.activityId,
        date: booking.date ?? "",
        name: customer.name || "",
        no: "pendding", // ojo: typo "pending"
        seniors: booking.seniors ?? 0,
        adults: booking.adults ?? 0,
        youths: booking.youths ?? 0,
        children: booking.children ?? 0,
        babies: booking.babies ?? 0,
        schedule: booking.schedule || "",
        pickupLocation: booking.pickupLocation || "",
        pickupTime: booking.schedule || "",
        totalPrice: Math.round(booking.totalPrice || 0),
        paymentMethod: method,
        paymentStatus: PaymentStatus.PENDING,
      };

      const parsed = CreateBookingSchema.safeParse(payload);
      if (!parsed.success) {
        const issues = parsed.error.issues.map((i) => `• ${i.path.join(".")}: ${i.message}`).join("\n");
        alert(`${t("Alerts.ZodIssuesPrefix")}\n${issues}`);
        return;
      }

      setIsSending(true);

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!res.ok) {
        let msg = t("Alerts.CreateBookingError");
        try {
          const j = await res.json();
          if (j?.errors) msg = t("Alerts.ServerValidationErrors");
          if (j?.message) msg = j.message;
        } catch {}
        alert(msg);
        return;
      }

      const { no } = await res.json();
      dispatch(setBookingNo(no));
      route.push("/success");
    } catch (err) {
      console.error(err);
      alert(t("Alerts.Unexpected"));
    } finally {
      setIsSending(false);
    }
  };

  const PrimaryCta = (
    <>
      {method === PaymentMethod.PAYPAL ? (
        <Button className="rounded-full px-6 cursor-pointer" hidden disabled={method === PaymentMethod.PAYPAL} onClick={cashPayment}>
          {t("Buttons.ContinueWithPayPal")}
        </Button>
      ) : (
        <Button className="rounded-full px-6 cursor-pointer" variant="default" disabled={isMissingCore || isSending} onClick={cashPayment}>
          {t("Buttons.ConfirmCash")}
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
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{t("Header.Title")}</h1>
        </div>

        <Button variant="ghost" className="gap-2" onClick={() => route.back()}>
          <ArrowLeft className="h-4 w-4" />
          {t("Header.Back")}
        </Button>
      </div>

      {isMissingCore && (
        <Alert className="mb-6">
          <AlertDescription>{t("Alerts.MissingCore")}</AlertDescription>
        </Alert>
      )}

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resumen */}
        <div className="order-1 lg:order-2 lg:col-span-1">
          <Card className="lg:sticky lg:top-6">
            <CardHeader className="space-y-1">
              <CardTitle className="leading-tight">{String(booking.activityName || t("SummaryCard.ActivityFallback"))}</CardTitle>
              <CardDescription>{t("SummaryCard.Description")}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted/40 p-3 text-sm">
                <Row icon={<User className="h-4 w-4" />} label={t("SummaryCard.Rows.Name")} value={customer.name || "—"} />
                <Row icon={<Mail className="h-4 w-4" />} label={t("SummaryCard.Rows.Email")} value={customer.email || "—"} />
                <Row icon={<Phone className="h-4 w-4" />} label={t("SummaryCard.Rows.Phone")} value={customer.phone || "—"} />
              </div>

              <div className="rounded-lg bg-muted/40 p-3 text-sm">
                <Row icon={<Calendar className="h-4 w-4" />} label={t("SummaryCard.Rows.Date")} value={dateLabel} />
                <Row icon={<Clock className="h-4 w-4" />} label={t("SummaryCard.Rows.Schedule")} value={booking.schedule || "—"} />
                <Row icon={<MapPin className="h-4 w-4" />} label={t("SummaryCard.Rows.Pickup")} value={booking.pickupLocation || "—"} />
              </div>

              <div className="text-sm space-y-1">
                <div className="flex items-center">
                  <span className="text-muted-foreground">{t("SummaryCard.Rows.People")}</span>
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
                <span className="font-semibold">{t("SummaryCard.Rows.Total")}</span>
                <span className="ml-auto text-xl font-extrabold">{currencyFormatter.format(booking.totalPrice || 0)}</span>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground text-center">{t("SummaryCard.Conditions")}</p>
            </CardFooter>
          </Card>
        </div>

        {/* Método de pago */}
        <div className="order-2 lg:order-1 lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("PaymentCard.Title")}</CardTitle>
              <CardDescription>{t("PaymentCard.Description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={method} onValueChange={(v) => setMethod(v as PaymentMethod)} className="grid gap-3">
                <div className="flex items-start gap-3 rounded-xl border p-4">
                  <RadioGroupItem id={PaymentMethod.PAYPAL} value={PaymentMethod.PAYPAL} className="mt-1 cursor-pointer" />
                  <Label htmlFor={PaymentMethod.PAYPAL} className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        <span className="font-medium">{t("PaymentCard.PaypalTitle")}</span>
                      </div>
                      {/* <Badge variant="secondary">{t("PaymentCard.PaypalBadge")}</Badge> */}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{t("PaymentCard.PaypalDesc")}</p>
                  </Label>
                </div>

                <div className="flex items-start gap-3 rounded-xl border p-4">
                  <RadioGroupItem id={PaymentMethod.CASH} value={PaymentMethod.CASH} className="mt-1 cursor-pointer" />
                  <Label htmlFor={PaymentMethod.CASH} className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Banknote className="h-5 w-5" />
                      <span className="font-medium">{t("PaymentCard.CashTitle")}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{t("PaymentCard.CashDesc")}</p>
                  </Label>
                </div>
              </RadioGroup>

              <Separator className="my-6" />

              {/* Aquí condicional: solo cuando el usuario selecciona PayPal */}
              {method === PaymentMethod.PAYPAL && (
                <div className="paypal-button-container mb-6">
                  <PaypalButton price={(booking.totalPrice || 0).toFixed(2)} description={`Reserva: ${booking.activityName}`} currency="USD" />
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-end">{PrimaryCta}</CardFooter>
          </Card>
        </div>
      </div>

      {/* ... resto de layout móvil fijo etc. */}
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

function FragmentRow({ label, value }: { label: string; value: number }) {
  return (
    <>
      <span>{label}</span>
      <span className="text-right">{value}</span>
    </>
  );
}
