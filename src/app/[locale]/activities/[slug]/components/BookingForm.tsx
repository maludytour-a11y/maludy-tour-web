"use client";

import { useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Users, Calendar as CalendarIcon, MapPin, Mail, Phone, Info, User, Minus, Plus } from "lucide-react";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAppDispatch, useAppSelector } from "@/context/redux/hooks";
import { setBooking, setCustomer } from "@/context/redux/features/bookingSlice";
import { useRouter } from "next/navigation";

/* ---------------- Tipos ---------------- */

type Guests = {
  seniors: number; // 65+
  adults: number; // 18–64
  youths: number; // 13–17
  children: number; // 3–12
  babies: number; // 0–2
};

type FormValues = {
  name: string;
  email: string;
  phone: string;
  pickup: string;
  date: Date | null;
  schedule: string; // 👈 nuevo campo controlado por Select
  language: "ES" | "EN";
  notes?: string;
  guests: Guests;
};

export type PricesDTO = {
  seniorPrice: number;
  adultPrice: number;
  youthsPrice: number;
  childrenPrice: number;
  babiesPrice: number;
  seniorAge: number[];
  adultAge: number[];
  youthsAge: number[];
  childrenAge: number[];
  babiesAge: number[];
};

interface BookingFormProps {
  id: string;
  prices: PricesDTO;
  schedules: string[];
  activityName: string;
}

/* ---------------- Utils ---------------- */

const currency = new Intl.NumberFormat("es-DO", { style: "currency", currency: "USD" });

function formatAgeRange(range?: number[]) {
  if (!range || range.length === 0) return "";
  const min = Math.min(...range);
  const max = Math.max(...range);
  if (!Number.isFinite(min)) return "";
  if (!Number.isFinite(max) || max === Infinity) return `${min}+`;
  if (min === max) return `${min}+`;
  return `${min}–${max}`;
}

function minPositive(...nums: number[]) {
  const positives = nums.filter((n) => typeof n === "number" && n > 0);
  return positives.length ? Math.min(...positives) : 0;
}

// Componente contador reutilizable
function Counter({ value, onChange, disabled }: { value: number; onChange: (n: number) => void; disabled?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <Button type="button" size="icon" variant="outline" onClick={() => onChange(Math.max(0, (value ?? 0) - 1))} disabled={disabled || (value ?? 0) <= 0}>
        <Minus className="h-4 w-4" />
      </Button>
      <Input type="number" inputMode="numeric" className="w-16 text-center" value={String(value ?? 0)} onChange={(e) => onChange(Math.max(0, Number(e.target.value || 0)))} disabled={disabled} />
      <Button type="button" size="icon" variant="outline" onClick={() => onChange(Math.min(99, (value ?? 0) + 1))} disabled={disabled}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}

/* ---------------- Componente ---------------- */

export function BookingForm({ id, prices, schedules, activityName }: BookingFormProps) {
  const dispatch = useAppDispatch();
  const bookingData = useAppSelector((state) => state.bookingReducer.booking);
  const route = useRouter();

  // Tabla de categorías desde props
  const categories = useMemo(
    () =>
      [
        { key: "seniors", label: "Ancianos", price: Number(prices?.seniorPrice ?? 0), ages: prices?.seniorAge ?? [], requiresAdult: false },
        { key: "adults", label: "Adultos", price: Number(prices?.adultPrice ?? 0), ages: prices?.adultAge ?? [], requiresAdult: false },
        { key: "youths", label: "Jóvenes", price: Number(prices?.youthsPrice ?? 0), ages: prices?.youthsAge ?? [], requiresAdult: true },
        { key: "children", label: "Niños", price: Number(prices?.childrenPrice ?? 0), ages: prices?.childrenAge ?? [], requiresAdult: true },
        { key: "babies", label: "Bebés", price: Number(prices?.babiesPrice ?? 0), ages: prices?.babiesAge ?? [], requiresAdult: true },
      ] as const,
    [prices]
  );

  const fromPrice = useMemo(() => minPositive(categories[0].price, categories[1].price, categories[2].price, categories[3].price, categories[4].price), [categories]);

  // UI state
  const [openGuests, setOpenGuests] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);

  // RHF
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      pickup: "",
      date: null,
      schedule: "", // 👈 sin valor inicial, forzamos selección
      language: "ES",
      notes: "",
      guests: { seniors: 0, adults: 2, youths: 0, children: 0, babies: 0 },
    },
  });

  const guests = useWatch({ control, name: "guests" }) as Guests | undefined;

  const adultCompanions = (guests?.adults ?? 0) + (guests?.seniors ?? 0);
  const payingCount = (["seniors", "adults", "youths", "children"] as (keyof Guests)[]).map((k) => guests?.[k] ?? 0).reduce((a, b) => a + b, 0);
  const totalPeople = payingCount + (guests?.babies ?? 0);
  const totalPrice = (categories as readonly { key: keyof Guests; price: number }[]).map((c) => (guests?.[c.key] ?? 0) * (c.price ?? 0)).reduce((a, b) => a + b, 0);

  const summaryText = useMemo(() => {
    const parts: string[] = [];
    (categories as readonly { key: keyof Guests; label: string }[]).forEach(({ key, label }) => {
      const qty = guests?.[key] ?? 0;
      if (qty > 0) parts.push(`${qty} ${label.toLowerCase()}`);
    });
    return parts.length ? parts.join(", ") : "Selecciona personas";
  }, [guests, categories]);

  const onSubmit = async (data: FormValues) => {
    const { adults, seniors, children, babies, youths } = data.guests;
    const isoDate = data.date ? data.date.toISOString() : null;

    const payload = {
      customer: {
        name: data.name,
        email: data.email,
        phone: data.phone,
      },
      booking: {
        no: "pendding",
        date: isoDate, // serializable
        activityId: id,
        activityName,
        seniors,
        adults,
        youths,
        children,
        babies,
        totalPrice,
        pickupLocation: data.pickup,
        schedule: data.schedule,
      },
    };

    dispatch(
      setCustomer({
        name: data.name,
        email: data.email,
        phone: data.phone,
      })
    );

    dispatch(
      setBooking({
        activityId: id,
        activityName: activityName,
        date: isoDate, // <-- string
        seniors: data.guests.seniors,
        adults: data.guests.adults,
        youths: data.guests.youths,
        children: data.guests.children,
        babies: data.guests.babies,
        totalPrice, // tu cálculo
        pickupLocation: data.pickup,
        schedule: data.schedule, // del Select
      })
    );

    reset();
    route.push("/checkout");
  };

  // Overlay de personas (Popover)
  const GuestsOverlay = (
    <div className="w-[340px]">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Users className="h-4 w-4" />
        <span>Selecciona por rangos de edad</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-sm space-y-1">
                {categories.map((c) => (
                  <div key={c.key}>
                    <strong>{c.label}:</strong> {formatAgeRange(c.ages) || "—"}
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-3">
        {categories.map((row) => {
          const name = `guests.${row.key}` as const;
          const disabled = !!row.requiresAdult && adultCompanions === 0;
          const rangeTxt = formatAgeRange(row.ages);
          return (
            <div key={row.key} className="flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-sm">
                  {row.label} {rangeTxt ? `(${rangeTxt})` : ""}
                </span>
                <span className="text-xs text-muted-foreground">{row.price > 0 ? `${currency.format(row.price)} c/u` : "Gratis"}</span>
              </div>
              <Controller name={name} control={control} rules={{ min: { value: 0, message: "No puede ser negativo" }, max: { value: 99, message: "Máx. 99" } }} render={({ field }) => <Counter value={field.value ?? 0} onChange={field.onChange} disabled={disabled} />} />
            </div>
          );
        })}
      </div>

      {adultCompanions === 0 && (
        <p className="text-destructive text-xs mt-3">
          Necesitas al menos 1 <strong>Adulto</strong> o <strong>Anciano</strong> para añadir menores o bebés.
        </p>
      )}

      <Separator className="my-3" />

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Total: <strong>{totalPeople}</strong> {totalPeople === 1 ? "persona" : "personas"}
        </span>
        <span className="font-semibold">{currency.format(totalPrice)}</span>
      </div>

      <div className="mt-3 flex justify-end">
        <Button type="button" variant="secondary" onClick={() => setOpenGuests(false)}>
          Hecho
        </Button>
      </div>
    </div>
  );

  return (
    <aside className="lg:col-span-1">
      <div className="lg:sticky lg:top-6 rounded-2xl bg-slate-100 dark:bg-zinc-900 p-5 border relative">
        <div className="mb-3 flex items-center justify-between">
          <Badge variant="destructive">Podría agotarse</Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>La disponibilidad puede variar por fecha y tamaño del grupo.</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Encabezado de precio */}
        <p className="text-2xl font-extrabold leading-tight">Desde {currency.format(fromPrice)}</p>
        <p className="text-muted-foreground -mt-1 text-sm">por persona (según categoría)</p>

        {/* Resumen dinámico */}
        <div className="mt-2 text-sm">
          {totalPeople > 0 ? (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4" /> {summaryText}
              </span>
              <span className="font-semibold">{currency.format(totalPrice)}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">Selecciona la cantidad de personas</span>
          )}
        </div>

        <Separator className="my-4" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {/* Nombre */}
          <div className="grid gap-1.5">
            <Label htmlFor="name">Nombre</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                placeholder="Jhon Doe"
                className="pl-9"
                {...register("name", {
                  required: "Tu nombre es requerido",
                  minLength: { value: 2, message: "Mínimo 2 caracteres" },
                })}
              />
            </div>
            {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
          </div>

          {/* Correo y Teléfono */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="email">Correo</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  placeholder="example@mail.com"
                  className="pl-9"
                  {...register("email", {
                    required: "El correo es requerido",
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Correo inválido" },
                  })}
                />
              </div>
              {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="phone">Teléfono</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  placeholder="+1 (809) 555-1234"
                  className="pl-9"
                  {...register("phone", {
                    required: "El teléfono es requerido",
                    minLength: { value: 7, message: "Teléfono muy corto" },
                  })}
                />
              </div>
              {errors.phone && <p className="text-destructive text-xs">{errors.phone.message}</p>}
            </div>
          </div>

          {/* Lugar de recogida */}
          <div className="grid gap-1.5">
            <Label htmlFor="pickup">Lugar de recogida</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="pickup" placeholder="Hotel Barceló, lobby principal" className="pl-9" {...register("pickup", { required: "Indica tu lugar de recogida" })} />
            </div>
            {errors.pickup && <p className="text-destructive text-xs">{errors.pickup.message}</p>}
          </div>

          {/* Fecha (Popover + Calendar) */}
          <div className="grid gap-1.5">
            <Label>Fecha</Label>
            <Controller
              name="date"
              control={control}
              rules={{
                required: "Selecciona la fecha",
                validate: (v) => !!v || "Selecciona la fecha",
              }}
              render={({ field }) => (
                <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start cursor-pointer">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "dd/MM/yyyy", { locale: es }) : "Selecciona fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ?? undefined}
                      onSelect={(d) => {
                        field.onChange(d ?? null);
                        setOpenCalendar(false);
                      }}
                      locale={es}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.date && <p className="text-destructive text-xs">{errors.date.message as string}</p>}
          </div>

          {/* Horario (Select) */}
          <div className="grid gap-1.5">
            <Label>Horario</Label>
            <Controller
              name="schedule"
              control={control}
              rules={{ required: "Selecciona un horario" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled={!schedules || schedules.length === 0}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={schedules && schedules.length > 0 ? "Selecciona un horario" : "No hay horarios disponibles"} />
                  </SelectTrigger>
                  <SelectContent>
                    {schedules?.map((h) => (
                      <SelectItem key={h} value={h}>
                        {h}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.schedule && <p className="text-destructive text-xs">{errors.schedule.message as string}</p>}
          </div>

          {/* Selector de personas (Popover) */}
          <div className="grid gap-1.5">
            <Label>Personas</Label>
            <Popover open={openGuests} onOpenChange={setOpenGuests}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4" /> {summaryText}
                  </span>
                  <span className="font-semibold">{currency.format(totalPrice)}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[360px]">{GuestsOverlay}</PopoverContent>
            </Popover>
            {payingCount === 0 && <p className="text-destructive text-xs">Debes seleccionar al menos 1 persona (pagante).</p>}
          </div>

          {/* Idioma (Select) */}
          <div className="grid gap-1.5">
            <Label>Idioma</Label>
            <Controller
              name="language"
              control={control}
              rules={{ required: "Selecciona idioma" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ES">Español</SelectItem>
                    <SelectItem value="EN">English</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.language && <p className="text-destructive text-xs">{errors.language.message as string}</p>}
          </div>

          {/* Notas opcionales */}
          {/* <div className="grid gap-1.5">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea id="notes" placeholder="Alergias, horario preferido, etc." {...register("notes")} />
          </div> */}

          <Button type="submit" className="w-full cursor-pointer" disabled={!isValid || payingCount === 0}>
            {payingCount > 0 ? `Pagar ahora · ${currency.format(totalPrice)}` : "Pagar ahora"}
          </Button>

          <p className="text-xs text-muted-foreground text-center">No se realizará ningún cargo ahora. Confirmaremos disponibilidad antes de cobrar.</p>
        </form>
      </div>
    </aside>
  );
}
