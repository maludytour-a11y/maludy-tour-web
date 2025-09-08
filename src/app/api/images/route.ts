import { db } from "@/lib/prisma";

import { ImageSchema } from "@/schemas";
import { ImageType } from "@/generated/prisma";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import z from "zod";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = ImageSchema.parse(json);

    let mimeType: string;
    let base64Data: string;

    // Caso 1: viene con prefijo data:image/...
    const matches = parsed.image.match(/^data:(.+);base64,(.+)$/);
    if (matches) {
      mimeType = matches[1]; // ej: image/jpeg
      base64Data = matches[2];
    } else {
      // Caso 2: viene sin prefijo → mimeType debe venir aparte
      if (!parsed.mimeType) {
        return NextResponse.json({ error: "Falta mimeType si no usas el prefijo en la imagen" }, { status: 400 });
      }
      mimeType = parsed.mimeType;
      base64Data = parsed.image;
    }

    // Convertir base64 → buffer
    const buffer = Buffer.from(base64Data, "base64");

    // Obtener extensión desde el mimeType
    const extension = mimeType.split("/")[1];

    // Subir al storage Vercel
    const blob = await put(`${parsed.activityId}-${Date.now()}.${extension}`, new Blob([buffer], { type: mimeType }), { access: "public" });

    const activity = await db.activitie.findUnique({ where: { id: parsed.activityId } });

    if (!activity) {
      return NextResponse.json({ error: "Actividad no encontrada" }, { status: 404 });
    }

    const registerDb = await db.image.create({
      data: {
        url: blob.url,
        type: ImageType.ACTIVITY,
        alt: activity.title,
        storage: "vercel-blob",
        activityId: activity.id,
        width: parsed.width,
        height: parsed.height,
      },
    });

    return NextResponse.json({
      success: true,
      url: registerDb.url,
      activitieId: parsed.activityId,
      mimeType,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validación fallida", details: err.flatten() }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

interface ISaveImage {
  url: string;
  type: ImageType;
  alt: string;
  width: number;
  height: number;
  storage: string;
  activitieId: string;
}
