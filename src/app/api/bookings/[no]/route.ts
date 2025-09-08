// app/api/bookings/[no]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const normalizeNo = (s: string) => s.replace(/\s+/g, "").toUpperCase();

export async function GET(_req: NextRequest, ctx: { params: Promise<{ no: string }> }) {
  try {
    // ✅ En Next 15 el checker espera Promise aquí
    const { no: raw } = await ctx.params;
    const no = normalizeNo(raw || "");

    console.log("GET /api/bookings/[no] →", { raw, normalizado: no });

    if (!no) {
      return NextResponse.json({ ok: false, message: "Número de reserva inválido." }, { status: 400 });
    }

    const select = {
      id: true,
      no: true,
      date: true,
      schedule: true,
      pickupLocation: true,
      totalPrice: true,
      paymentStatus: true,
      paymentMethod: true,
      seniors: true,
      adults: true,
      youths: true,
      children: true,
      babies: true,
      customerName: true,
      customerEmail: true,
      customerPhone: true,
      activitie: { select: { title: true } },
    } as const;

    let booking = null;

    // Si 'no' es @unique, esto basta
    try {
      booking = await db.booking.findUnique({ where: { no }, select });
    } catch {
      // Si no es unique, caemos a findFirst
    }

    if (!booking) {
      booking = await db.booking.findFirst({ where: { no }, select });
    }

    if (!booking) {
      return NextResponse.json({ ok: false, message: "No encontramos esa reserva." }, { status: 404 });
    }

    return NextResponse.json(
      {
        ok: true,
        data: {
          no: booking.no,
          activityName: booking.activitie?.title ?? "Actividad",
          dateISO: booking.date.toISOString(),
          schedule: booking.schedule,
          pickupLocation: booking.pickupLocation,
          paymentStatus: booking.paymentStatus,
          paymentMethod: booking.paymentMethod,
          totalPrice: booking.totalPrice,
          guests: {
            seniors: booking.seniors,
            adults: booking.adults,
            youths: booking.youths,
            children: booking.children,
            babies: booking.babies,
          },
          customer: {
            name: booking.customerName,
            email: booking.customerEmail,
            phone: booking.customerPhone,
          },
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/bookings/[no] error:", err);
    return NextResponse.json({ ok: false, message: "Error interno." }, { status: 500 });
  }
}
