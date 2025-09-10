"use client";

import { useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { format } from "date-fns";
import { es as esDF, enUS as enUSDF } from "date-fns/locale";
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

import { useLocale, useTranslations } from "next-intl";

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
  schedule: string;
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
function Counter({ value, onChange, disabled, minError, maxError }: { value: number; onChange: (n: number) => void; disabled?: boolean; minError?: string; maxError?: string }) {
  return (
    <div className="flex items-center gap-2">
      <Button type="button" size="icon" variant="outline" onClick={() => onChange(Math.max(0, (value ?? 0) - 1))} disabled={disabled || (value ?? 0) <= 0} aria-label={minError}>
        <Minus className="h-4 w-4" />
      </Button>
      <Input type="number" inputMode="numeric" className="w-16 text-center" value={String(value ?? 0)} onChange={(e) => onChange(Math.max(0, Number(e.target.value || 0)))} disabled={disabled} />
      <Button type="button" size="icon" variant="outline" onClick={() => onChange(Math.min(99, (value ?? 0) + 1))} disabled={disabled} aria-label={maxError}>
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

  const locale = useLocale();
  const t = useTranslations("BookingForm");
  const currency = useMemo(
    () =>
      new Intl.NumberFormat(locale || "es-DO", {
        style: "currency",
        currency: "USD",
      }),
    [locale]
  );
  const dfLocale = locale?.startsWith("en") ? enUSDF : esDF;

  // Tabla de categorías desde props (sin labels; los labels vienen de i18n)
  const categories = useMemo(
    () =>
      [
        { key: "seniors", price: Number(prices?.seniorPrice ?? 0), ages: prices?.seniorAge ?? [], requiresAdult: false },
        { key: "adults", price: Number(prices?.adultPrice ?? 0), ages: prices?.adultAge ?? [], requiresAdult: false },
        { key: "youths", price: Number(prices?.youthsPrice ?? 0), ages: prices?.youthsAge ?? [], requiresAdult: true },
        { key: "children", price: Number(prices?.childrenPrice ?? 0), ages: prices?.childrenAge ?? [], requiresAdult: true },
        { key: "babies", price: Number(prices?.babiesPrice ?? 0), ages: prices?.babiesAge ?? [], requiresAdult: true },
      ] as const,
    [prices]
  );

  const labelFor = (key: keyof Guests) => {
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
      default:
        return key;
    }
  };

  const fromPrice = useMemo(() => minPositive(...categories.map((c) => c.price)), [categories]);

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
      schedule: "",
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
    (categories as readonly { key: keyof Guests }[]).forEach(({ key }) => {
      const qty = guests?.[key] ?? 0;
      if (qty > 0) parts.push(`${qty} ${labelFor(key)}`);
    });
    return parts.length ? parts.join(", ") : t("Summary.None");
  }, [guests, categories, t]);

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
        date: isoDate,
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
        date: isoDate,
        seniors: data.guests.seniors,
        adults: data.guests.adults,
        youths: data.guests.youths,
        children: data.guests.children,
        babies: data.guests.babies,
        totalPrice,
        pickupLocation: data.pickup,
        schedule: data.schedule,
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
        <span>{t("GuestsOverlay.SelectByAgeRanges")}</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-sm space-y-1">
                {categories.map((c) => (
                  <div key={c.key}>
                    <strong>{labelFor(c.key)}:</strong> {formatAgeRange(c.ages) || t("GuestsOverlay.AgeRangeUnknown")}
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
                  {labelFor(row.key)} {rangeTxt ? `(${rangeTxt})` : ""}
                </span>
                <span className="text-xs text-muted-foreground">{row.price > 0 ? t("GuestsOverlay.PerEach", { price: currency.format(row.price) }) : t("GuestsOverlay.Free")}</span>
              </div>
              <Controller
                name={name}
                control={control}
                rules={{
                  min: { value: 0, message: t("Validation.MinZero") },
                  max: { value: 99, message: t("Validation.Max99") },
                }}
                render={({ field }) => <Counter value={field.value ?? 0} onChange={field.onChange} disabled={disabled} minError={t("Validation.MinZero")} maxError={t("Validation.Max99")} />}
              />
            </div>
          );
        })}
      </div>

      {adultCompanions === 0 && (
        <p className="text-destructive text-xs mt-3">
          {t("GuestsOverlay.NeedsAdult", {
            adult: t("GuestsLabels.Adults"),
            senior: t("GuestsLabels.Seniors"),
          })}
        </p>
      )}

      <Separator className="my-3" />

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{t("GuestsOverlay.Total", { count: totalPeople })}</span>
        <span className="font-semibold">{currency.format(totalPrice)}</span>
      </div>

      <div className="mt-3 flex justify-end">
        <Button type="button" variant="secondary" onClick={() => setOpenGuests(false)}>
          {t("GuestsOverlay.Done")}
        </Button>
      </div>
    </div>
  );

  return (
    <aside className="lg:col-span-1">
      <div className="lg:sticky lg:top-6 rounded-2xl bg-slate-100 dark:bg-zinc-900 p-5 border relative">
        <div className="mb-3 flex items-center justify-between">
          <Badge variant="destructive">{t("Badge.MaySellOut")}</Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>{t("Badge.AvailabilityNote")}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Encabezado de precio */}
        <p className="text-2xl font-extrabold leading-tight">
          {t("PriceHeader.FromLabel")} {currency.format(fromPrice)}
        </p>
        <p className="text-muted-foreground -mt-1 text-sm">{t("PriceHeader.PerPersonNote")}</p>

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
            <span className="text-muted-foreground">{t("Summary.SelectQty")}</span>
          )}
        </div>

        <Separator className="my-4" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {/* Nombre */}
          <div className="grid gap-1.5">
            <Label htmlFor="name">{t("Fields.Name.Label")}</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                placeholder={t("Fields.Name.Placeholder")}
                className="pl-9"
                {...register("name", {
                  required: t("Fields.Name.Required"),
                  minLength: { value: 2, message: t("Fields.Name.Min") },
                })}
              />
            </div>
            {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
          </div>

          {/* Correo y Teléfono */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="email">{t("Fields.Email.Label")}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  placeholder={t("Fields.Email.Placeholder")}
                  className="pl-9"
                  {...register("email", {
                    required: t("Fields.Email.Required"),
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: t("Fields.Email.Invalid"),
                    },
                  })}
                />
              </div>
              {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="phone">{t("Fields.Phone.Label")}</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  placeholder={t("Fields.Phone.Placeholder")}
                  className="pl-9"
                  {...register("phone", {
                    required: t("Fields.Phone.Required"),
                    minLength: { value: 7, message: t("Fields.Phone.Min") },
                  })}
                />
              </div>
              {errors.phone && <p className="text-destructive text-xs">{errors.phone.message}</p>}
            </div>
          </div>

          {/* Lugar de recogida */}
          <div className="grid gap-1.5">
            <Label htmlFor="pickup">{t("Fields.Pickup.Label")}</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="pickup" placeholder={t("Fields.Pickup.Placeholder")} className="pl-9" {...register("pickup", { required: t("Fields.Pickup.Required") })} />
            </div>
            {errors.pickup && <p className="text-destructive text-xs">{errors.pickup.message}</p>}
          </div>

          {/* Fecha (Popover + Calendar) */}
          <div className="grid gap-1.5">
            <Label>{t("Fields.Date.Label")}</Label>
            <Controller
              name="date"
              control={control}
              rules={{
                required: t("Fields.Date.Required"),
                validate: (v) => !!v || t("Fields.Date.Required"),
              }}
              render={({ field }) => (
                <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start cursor-pointer">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "dd/MM/yyyy", { locale: dfLocale }) : t("Fields.Date.Placeholder")}
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
                      locale={dfLocale}
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
            <Label>{t("Fields.Schedule.Label")}</Label>
            <Controller
              name="schedule"
              control={control}
              rules={{ required: t("Fields.Schedule.Required") }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled={!schedules || schedules.length === 0}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={schedules && schedules.length > 0 ? t("Fields.Schedule.Placeholder") : t("Fields.Schedule.Empty")} />
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
            <Label>{t("Fields.People.Label")}</Label>
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
            {payingCount === 0 && <p className="text-destructive text-xs">{t("Fields.People.PayingRequired")}</p>}
          </div>

          {/* Idioma (Select) */}
          <div className="grid gap-1.5">
            <Label>{t("Fields.Language.Label")}</Label>
            <Controller
              name="language"
              control={control}
              rules={{ required: t("Fields.Language.Required") }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("Fields.Language.Placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ES">{t("Fields.Language.Options.ES")}</SelectItem>
                    <SelectItem value="EN">{t("Fields.Language.Options.EN")}</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.language && <p className="text-destructive text-xs">{errors.language.message as string}</p>}
          </div>

          {/* Notas opcionales (si las activas, añade i18n también) */}
          {/* <div className="grid gap-1.5">
            <Label htmlFor="notes">{t("Fields.Notes.Label")}</Label>
            <Textarea id="notes" placeholder={t("Fields.Notes.Placeholder")} {...register("notes")} />
          </div> */}

          <Button type="submit" className="w-full cursor-pointer" disabled={!isValid || payingCount === 0}>
            {payingCount > 0 ? t("Buttons.PayNowWithTotal", { total: currency.format(totalPrice) }) : t("Buttons.PayNow")}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            {/* Mensaje opcional podría ir a i18n si deseas */}
            {locale?.startsWith("en") ? "No charges will be made now. We will confirm availability before charging." : "No se realizará ningún cargo ahora. Confirmaremos disponibilidad antes de cobrar."}
          </p>
        </form>
      </div>
    </aside>
  );
}
