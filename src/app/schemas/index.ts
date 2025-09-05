import { BadgeType, ImageType, Languages } from "@/generated/prisma";
import { z } from "zod";

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
