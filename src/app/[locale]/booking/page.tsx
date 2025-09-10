"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { agencyInfo } from "@/config";

// UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Clock, MapPin, Users, Mail, Phone, CreditCard } from "lucide-react";
import { ArrowLeftToHome } from "@/components";

// Types (ajusta si tu import real difiere)
import { PaymentStatus } from "@/generated/prisma";

type Guests = {
  seniors: number;
  adults: number;
  youths: number;
  children: number;
  babies: number;
};

type BookingLookupOk = {
  ok: true;
  data: {
    no: string;
    activityName: string;
    dateISO: string; // ISO
    schedule: string;
    pickupLocation: string;
    paymentStatus: "PENDING" | "PAID" | "CANCELLED" | string;
    paymentMethod: string;
    totalPrice: number;
    guests: Guests;
    customer: { name: string; email: string; phone: string };
  };
};

type BookingLookupErr = { ok: false; message: string };

const currency = new Intl.NumberFormat("es-DO", { style: "currency", currency: "USD" });

// Normaliza: quita espacios y pone en MAYÚSCULA
const normalizeNo = (s: string) => s.replace(/\s+/g, "").trim().toUpperCase();

function formatDateByLocale(dateISO?: string, locale?: string) {
  if (!dateISO) return "—";
  const d = new Date(dateISO);
  if (Number.isNaN(d.getTime())) return "—";
  const loc = locale || "es-DO";
  const opts: Intl.DateTimeFormatOptions = { day: "2-digit", month: "2-digit", year: "numeric" };
  return d.toLocaleDateString(loc, opts);
}

function statusBadge(status: PaymentStatus | string, t: (key: string, values?: Record<string, any>) => string) {
  const s = String(status).toUpperCase();
  if (s === "PAID" || s === PaymentStatus.PAID) return <Badge className="bg-emerald-600 hover:bg-emerald-700">{t("PaymentStatus.PAID")}</Badge>;
  if (s === "PENDING" || s === PaymentStatus.PENDING) return <Badge className="bg-amber-500 hover:bg-amber-600">{t("PaymentStatus.PENDING")}</Badge>;
  if (s === "CANCELLED" || s === "CANCELED" || s === (PaymentStatus as any).CANCELLED) return <Badge variant="destructive">{t("PaymentStatus.CANCELLED")}</Badge>;
  return <Badge variant="secondary">{t("PaymentStatus.UNKNOWN", { status })}</Badge>;
}

export default function BookingStatusPage() {
  const locale = useLocale();
  const t = useTranslations("BookingPage");

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<BookingLookupOk | BookingLookupErr | null>(null);

  const personRows = useMemo(() => {
    if (!resp || !("ok" in resp) || !resp.ok) return [];
    const g = resp.data.guests || ({} as Guests);
    const rows = [
      { label: t("Guests.Seniors"), value: g.seniors ?? 0 },
      { label: t("Guests.Adults"), value: g.adults ?? 0 },
      { label: t("Guests.Youths"), value: g.youths ?? 0 },
      { label: t("Guests.Children"), value: g.children ?? 0 },
      { label: t("Guests.Babies"), value: g.babies ?? 0 },
    ].filter((r) => r.value > 0);
    return rows;
  }, [resp, t]);

  const totalPeople = useMemo(() => {
    if (!resp || !("ok" in resp) || !resp.ok) return 0;
    const g = resp.data.guests;
    return (g.seniors ?? 0) + (g.adults ?? 0) + (g.youths ?? 0) + (g.children ?? 0) + (g.babies ?? 0);
  }, [resp]);

  const onSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const no = normalizeNo(code);
    if (!no) {
      setResp({ ok: false, message: t("ErrorEnterNumber") });
      return;
    }
    setLoading(true);
    setResp(null);
    try {
      const res = await fetch(`/api/bookings/${encodeURIComponent(no)}`, { cache: "no-store" });
      const json = (await res.json()) as BookingLookupOk | BookingLookupErr;
      setResp(json);
    } catch {
      setResp({ ok: false, message: t("ErrorLookupFailed") });
    } finally {
      setLoading(false);
    }
  };

  const ok = resp && "ok" in resp && resp.ok;

  return (
    <div className="container mx-auto px-4 py-8 md:w-[800px] lg:py-10">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src={agencyInfo.logo} alt={agencyInfo.name} width={40} height={40} className="rounded" unoptimized />
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{t("title")}</h1>
        </div>

        <div>
          <ArrowLeftToHome />
        </div>
      </div>

      {/* Buscador */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t("EnterNumber")}</CardTitle>
          <CardDescription>{t("YouWillFindItIn")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSearch} className="flex flex-col sm:flex-row gap-3">
            <Input
              value={code}
              onChange={(e) => setCode(normalizeNo(e.target.value))} // fuerza MAYÚSCULA y sin espacios
              placeholder={t("PlaceholderBookingNo")}
              className="uppercase"
              autoFocus
              required
              inputMode="text"
              autoCapitalize="characters"
              spellCheck={false}
              pattern="[A-Z0-9\-]+"
              title={t("BookingNoInputTitle")}
            />
            <Button type="submit" disabled={loading} className="gap-2">
              <Search className="h-4 w-4" />
              {loading ? t("Searching") : t("Search")}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Resultado */}
      {resp && !ok && (
        <Alert className="mb-6">
          <AlertDescription>{(resp as BookingLookupErr).message || t("ErrorNotFound")}</AlertDescription>
        </Alert>
      )}

      {ok && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Detalle principal */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="leading-tight">{(resp as BookingLookupOk).data.activityName}</CardTitle>
                    <CardDescription>
                      {t("BookingNoLabel")} <span className="font-semibold">#{(resp as BookingLookupOk).data.no}</span>
                    </CardDescription>
                  </div>
                  <div className="shrink-0">{statusBadge((resp as BookingLookupOk).data.paymentStatus as PaymentStatus, t)}</div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Datos de la reserva */}
                <div className="rounded-lg bg-muted/40 p-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">{t("DateLabel")}</span>
                    <span className="ml-auto">{formatDateByLocale((resp as BookingLookupOk).data.dateISO, locale)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">{t("ScheduleLabel")}</span>
                    <span className="ml-auto">{(resp as BookingLookupOk).data.schedule || t("NotAvailable")}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <MapPin className="h-4 w-4" />
                    <span className="font-medium">{t("PickupLabel")}</span>
                    <span className="ml-auto text-right">{(resp as BookingLookupOk).data.pickupLocation || t("NotAvailable")}</span>
                  </div>
                </div>

                {/* Cliente */}
                <div className="rounded-lg bg-muted/40 p-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">{t("CustomerLabel")}</span>
                  </div>
                  <div className="mt-2 grid sm:grid-cols-3 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{(resp as BookingLookupOk).data.customer.name || t("NotAvailable")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{(resp as BookingLookupOk).data.customer.email || t("NotAvailable")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{(resp as BookingLookupOk).data.customer.phone || t("NotAvailable")}</span>
                    </div>
                  </div>
                </div>

                {/* Personas */}
                <div className="text-sm">
                  <div className="flex items-center">
                    <span className="text-muted-foreground">{t("PeopleLabel")}</span>
                    <span className="ml-auto font-medium">{totalPeople}</span>
                  </div>
                  {personRows.length > 0 && (
                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-1 text-muted-foreground">
                      {personRows.map((row) => (
                        <FragmentRow key={row.label} label={row.label} value={row.value} />
                      ))}
                    </div>
                  )}
                </div>

                <Separator />

                {/* Pago */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CreditCard className="h-4 w-4" />
                    <span>{t("MethodLabel")}</span>
                    <span className="font-medium text-foreground">{(resp as BookingLookupOk).data.paymentMethod || t("NotAvailable")}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{t("TotalLabel")}</p>
                    <p className="text-xl font-extrabold">{currency.format((resp as BookingLookupOk).data.totalPrice || 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tarjeta lateral de ayuda */}
          <div className="lg:col-span-1">
            <Card className="lg:sticky lg:top-6">
              <CardHeader>
                <CardTitle>{t("Help.NeedHelpTitle")}</CardTitle>
                <CardDescription>{t("Help.NeedHelpSubtitle")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full">
                  <a href={`https://wa.me/${agencyInfo.contact.phone.replace(/\D/g, "")}?text=Hola,%20tengo%20dudas%20sobre%20mi%20reserva%20#${ok ? (resp as BookingLookupOk).data.no : ""}`} target="_blank" rel="noopener noreferrer">
                    {t("Help.ContactWhatsApp")}
                  </a>
                </Button>
                <Button asChild variant="secondary" className="w-full">
                  <a href={`mailto:${agencyInfo.contact.email}?subject=Consulta%20reserva%20${ok ? (resp as BookingLookupOk).data.no : ""}`}>{t("Help.ContactEmail")}</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
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
