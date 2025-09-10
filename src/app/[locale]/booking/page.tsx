"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { agencyInfo } from "@/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Clock, MapPin, Users, Mail, Phone, CreditCard, ArrowLeft } from "lucide-react";
import { PaymentStatus } from "@/generated/prisma";
import { ArrowLeftToHome } from "@/components";

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

function formatDateES(dateISO?: string) {
  if (!dateISO) return "—";
  const d = new Date(dateISO);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("es-DO", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function statusBadge(status: PaymentStatus) {
  const s = String(status).toUpperCase();
  if (s === PaymentStatus.PAID) return <Badge className="bg-emerald-600 hover:bg-emerald-700">Pagada</Badge>;
  if (s === PaymentStatus.PENDING) return <Badge className="bg-amber-500 hover:bg-amber-600">Pendiente</Badge>;
  if (s === "CANCELLED" || s === "CANCELED") return <Badge variant="destructive">Cancelada</Badge>;
  return <Badge variant="secondary">{status}</Badge>;
}

export default function BookingStatusPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<BookingLookupOk | BookingLookupErr | null>(null);

  const personRows = useMemo(() => {
    if (!resp || !("ok" in resp) || !resp.ok) return [];
    const g = resp.data.guests || ({} as Guests);
    const rows = [
      { label: "Ancianos", value: g.seniors ?? 0 },
      { label: "Adultos", value: g.adults ?? 0 },
      { label: "Jóvenes", value: g.youths ?? 0 },
      { label: "Niños", value: g.children ?? 0 },
      { label: "Bebés", value: g.babies ?? 0 },
    ].filter((r) => r.value > 0);
    return rows;
  }, [resp]);

  const totalPeople = useMemo(() => {
    if (!resp || !("ok" in resp) || !resp.ok) return 0;
    const g = resp.data.guests;
    return (g.seniors ?? 0) + (g.adults ?? 0) + (g.youths ?? 0) + (g.children ?? 0) + (g.babies ?? 0);
  }, [resp]);

  const onSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const no = normalizeNo(code);
    if (!no) {
      setResp({ ok: false, message: "Introduce tu número de reserva." });
      return;
    }
    setLoading(true);
    setResp(null);
    try {
      const res = await fetch(`/api/bookings/${encodeURIComponent(no)}`, { cache: "no-store" });
      const json = (await res.json()) as BookingLookupOk | BookingLookupErr;
      setResp(json);
    } catch {
      setResp({ ok: false, message: "No se pudo consultar la reserva. Inténtalo nuevamente." });
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
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Consulta tu reserva</h1>
        </div>

        <div>
          <ArrowLeftToHome />
        </div>
      </div>

      {/* Buscador */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Introduce tu número de reserva</CardTitle>
          <CardDescription>Lo encontrarás en el correo de confirmación (ej: MT-ABC123)</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSearch} className="flex flex-col sm:flex-row gap-3">
            <Input
              value={code}
              onChange={(e) => setCode(normalizeNo(e.target.value))} // <<— fuerza MAYÚSCULA y sin espacios
              placeholder="Ej: MT-ABC123"
              className="uppercase"
              autoFocus
              required
              inputMode="text"
              autoCapitalize="characters"
              spellCheck={false}
              pattern="[A-Z0-9\-]+"
              title="Usa solo letras, números y guiones (sin espacios)"
            />
            <Button type="submit" disabled={loading} className="gap-2">
              <Search className="h-4 w-4" />
              {loading ? "Buscando..." : "Buscar"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Resultado */}
      {resp && !ok && (
        <Alert className="mb-6">
          <AlertDescription>{(resp as BookingLookupErr).message || "No encontramos una reserva con ese número."}</AlertDescription>
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
                    <CardTitle className="leading-tight">{resp.data.activityName}</CardTitle>
                    <CardDescription>
                      N.º de reserva: <span className="font-semibold">#{resp.data.no}</span>
                    </CardDescription>
                  </div>
                  <div className="shrink-0">{statusBadge(resp.data.paymentStatus as PaymentStatus)}</div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Datos de la reserva */}
                <div className="rounded-lg bg-muted/40 p-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">Fecha:</span>
                    <span className="ml-auto">{formatDateES(resp.data.dateISO)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">Horario:</span>
                    <span className="ml-auto">{resp.data.schedule || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <MapPin className="h-4 w-4" />
                    <span className="font-medium">Recogida:</span>
                    <span className="ml-auto text-right">{resp.data.pickupLocation || "—"}</span>
                  </div>
                </div>

                {/* Cliente */}
                <div className="rounded-lg bg-muted/40 p-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">Cliente</span>
                  </div>
                  <div className="mt-2 grid sm:grid-cols-3 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{resp.data.customer.name || "—"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{resp.data.customer.email || "—"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{resp.data.customer.phone || "—"}</span>
                    </div>
                  </div>
                </div>

                {/* Personas */}
                <div className="text-sm">
                  <div className="flex items-center">
                    <span className="text-muted-foreground">Personas</span>
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
                    <span>Método:</span>
                    <span className="font-medium text-foreground">{resp.data.paymentMethod || "—"}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-xl font-extrabold">{currency.format(resp.data.totalPrice || 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tarjeta lateral de ayuda */}
          <div className="lg:col-span-1">
            <Card className="lg:sticky lg:top-6">
              <CardHeader>
                <CardTitle>¿Necesitas ayuda?</CardTitle>
                <CardDescription>Estamos aquí para ti.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full">
                  <a href={`https://wa.me/${agencyInfo.contact.phone.replace(/\D/g, "")}?text=Hola,%20tengo%20dudas%20sobre%20mi%20reserva%20#${ok ? (resp as BookingLookupOk).data.no : ""}`} target="_blank" rel="noopener noreferrer">
                    WhatsApp
                  </a>
                </Button>
                <Button asChild variant="secondary" className="w-full">
                  <a href={`mailto:${agencyInfo.contact.email}?subject=Consulta%20reserva%20${ok ? (resp as BookingLookupOk).data.no : ""}`}>Escríbenos por email</a>
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
