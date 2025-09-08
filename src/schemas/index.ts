import { BadgeType, ImageType, Languages, PaymentMethod, PaymentStatus } from "@/generated/prisma";
import { z } from "zod";

function isTodayOrFuture(date: Date) {
  const d = new Date(date);
  const today = new Date();
  d.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return d.getTime() >= today.getTime();
}

export const ActivitieSchema = z.object({
  title: z.string().min(1).max(75),
  descripcion: z.string().min(1).max(3000),
  shortDescription: z.string().min(1).max(200),
  location: z.string().min(1),
  duration: z.string().min(1),
  rating: z.coerce.number().min(0).max(5).nonnegative(),
  reviews: z.coerce.number().int().nonnegative(),
  badge: z.enum(BadgeType),
  languages: z.enum(Languages),

  schedules: z.array(z.string().min(1)).min(1, "Agrega al menos un horario"),
  SlugWhatYouDo: z.array(z.string().min(1)).default([]),
  includes: z.array(z.string().min(1)).default([]),
  notSuitable: z.array(z.string().min(1)).default([]),
});

export const CreateBookingSchema = z
  .object({
    activityId: z.string().min(1, "Falta el ID de la actividad"),
    customerName: z.string().min(2, "Nombre del cliente demasiado corto").max(120, "Nombre demasiado largo"),
    customerEmail: z.string().email("Correo inválido"),
    customerPhone: z.string().min(7, "Teléfono demasiado corto"),

    date: z.coerce.date("La fecha es requerida"),
    name: z.string().min(2, "Nombre demasiado corto").max(120, "Nombre demasiado largo"),
    seniors: z.coerce.number().int().min(0).default(0),
    adults: z.coerce.number().int().min(0).default(0),
    youths: z.coerce.number().int().min(0).default(0),
    children: z.coerce.number().int().min(0).default(0),
    babies: z.coerce.number().int().min(0).default(0),
    schedule: z.string().min(1, "Selecciona un horario"),
    pickupLocation: z.string().min(2, "Indica lugar de recogida"),
    totalPrice: z.coerce.number().int().min(0, "Total inválido"),
    paymentMethod: z.enum(PaymentMethod, "Selecciona un método de pago"),
    paymentStatus: z.enum(PaymentStatus, "Selecciona un método de pago"),
    no: z.string(),
  })
  .superRefine((data, ctx) => {
    // Fecha debe ser hoy o posterior
    if (!isTodayOrFuture(data.date)) {
      ctx.addIssue({
        code: "custom",
        message: "La fecha debe ser hoy o posterior",
        path: ["date"],
      });
    }

    // Debe haber al menos 1 persona en total
    const totalPeople = data.seniors + data.adults + data.youths + data.children + data.babies;
    if (totalPeople <= 0) {
      ctx.addIssue({
        code: "custom",
        message: "Debes seleccionar al menos 1 persona",
        path: ["adults"],
      });
    }

    // Si hay menores/bebés, debe haber al menos 1 adulto o anciano
    const hasMinors = data.youths > 0 || data.children > 0 || data.babies > 0;
    const hasAdultCompanion = data.adults > 0 || data.seniors > 0;
    if (hasMinors && !hasAdultCompanion) {
      ctx.addIssue({
        code: "custom",
        message: "Se requiere al menos 1 adulto o anciano si hay menores/bebés",
        path: ["adults"],
      });
    }
  });

export const ImageSchema = z.object({
  image: z.string(), // base64
  mimeType: z.string().regex(/^image\//),
  activityId: z.string().uuid(),
  width: z.coerce.number().nonnegative(),
  height: z.coerce.number().nonnegative(),
});

export const PriceSchema = z.object({
  seniorPrice: z.number().int().nonnegative(),
  adultPrice: z.number().int().nonnegative(),
  youthsPrice: z.number().int().nonnegative(),
  childrenPrice: z.number().int().nonnegative(),
  babiesPrice: z.number().int().nonnegative(),

  seniorAge: z.tuple([z.number().int().nonnegative(), z.number().int().nonnegative()]),
  adultAge: z.tuple([z.number().int().nonnegative(), z.number().int().nonnegative()]),
  youthsAge: z.tuple([z.number().int().nonnegative(), z.number().int().nonnegative()]),
  childrenAge: z.tuple([z.number().int().nonnegative(), z.number().int().nonnegative()]),
  babiesAge: z.tuple([z.number().int().nonnegative(), z.number().int().nonnegative()]),

  activityId: z.string().uuid(),
});

export const QuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(10),
  page: z.coerce.number().int().min(1).default(1),
});

export const QueryParams = z.object({
  activityId: z.string().uuid(),
});

export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;
