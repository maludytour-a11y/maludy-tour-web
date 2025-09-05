import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/app/libs/prisma";
import { BadgeType, Languages, Prisma } from "@/generated/prisma";
import { ActivitieSchema, QuerySchema } from "@/app/schemas";

export interface IActivityItemResponse {
  id: string;
  image: string;
  title: string;
  location: string;
  price: number;
  duration: string;
  rating: number;
  reviews: number;
  badge: string;
}

interface ICreateActivitie {
  title: string;
  descripcion: string;
  shortDescription: string;
  location: string;
  duration: string;
  rating: number;
  reviews: number;
  badge: BadgeType;
  languages: Languages;
}

export async function POST(req: Request) {
  try {
    const json: ICreateActivitie = await req.json();
    const parsed = ActivitieSchema.parse(json);
    const data = { ...parsed, rating: new Prisma.Decimal(String(parsed.rating)) };
    const { id } = await db.activitie.create({ data: data });
    return NextResponse.json({ activitieId: id, created: true }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validación fallida", details: err.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const parsed = QuerySchema.safeParse({
      limit: searchParams.get("limit") ?? undefined,
      page: searchParams.get("page") ?? undefined,
    });
    if (!parsed.success) {
      return NextResponse.json({ error: "Parámetros inválidos", details: parsed.error.flatten() }, { status: 400 });
    }

    const { limit, page } = parsed.data;
    const skip = (page - 1) * limit;

    // Trae solo los campos que usas y cuenta total en paralelo
    const [rows, total] = await Promise.all([
      db.activitie.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" }, // ajusta si prefieres otro orden
        select: {
          id: true,
          title: true,
          location: true,
          duration: true,
          rating: true, // Decimal en Prisma → convertir a number abajo
          reviews: true,
          badge: true,
          prices: { select: { adultPrice: true } },
          images: { select: { url: true } },
        },
      }),
      db.activitie.count(),
    ]);

    const activities: IActivityItemResponse[] = rows.map((i) => ({
      id: i.id,
      image: i.images[0].url || "", // tu placeholder
      price: i.prices?.adultPrice || 0, // tu placeholder
      title: i.title,
      location: i.location,
      duration: i.duration,
      rating: Number(i.rating), // importante: Decimal → number
      reviews: i.reviews,
      badge: i.badge,
    }));

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      activities,
      length: activities.length, // elementos en esta página
      meta: {
        total, // total de registros
        totalPages, // total de páginas
        page, // página actual
        limit, // tamaño de página
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (err) {
    console.error("[GET /activities]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
