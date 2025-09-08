import { db } from "@/lib/prisma";
import { PriceSchema, QueryParams, QuerySchema } from "@/schemas";
import { NextResponse } from "next/server";
import z from "zod";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = PriceSchema.parse(json);

    const activity = await db.activitie.findUnique({ where: { id: parsed.activityId } });

    if (!activity) {
      return NextResponse.json({ error: "Actividad no encontrada" }, { status: 404 });
    }

    const response = await db.prices.create({ data: parsed });

    return NextResponse.json({
      success: true,
      activitieId: activity.id,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validación fallida", details: err.flatten() }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parsed = QueryParams.safeParse({
    activityId: searchParams.get("activityId") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Parámetros inválidos", details: parsed.error.flatten() }, { status: 400 });
  }

  const { activityId } = parsed.data;

  const prices = await db.prices.findUnique({
    where: { activityId },
  });

  if (!prices) {
    return NextResponse.json({ error: "Tabla de precios no encontrada" }, { status: 404 });
  }

  return NextResponse.json({
    prices,
  });
}
