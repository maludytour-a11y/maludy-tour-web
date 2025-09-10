import { NextResponse } from "next/server";
import React from "react";
import { Resend } from "resend";
import { z } from "zod";
import { db } from "@/lib/prisma";
import { EmailBookingConfirmation, EmailCompanyBooking } from "@/components/Templates/email";
import { BookingReceiptData } from "@/components/InvoicePDF";
import { CreateBookingSchema } from "@/schemas";
import { generateReservationCode } from "@/utils/functions";
import { agencyInfo } from "@/config";
import { PaymentStatus } from "@/generated/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    //---------------------------------------------
    // 1) - Convertir la req a Json
    //---------------------------------------------
    const json = await req.json();

    //---------------------------------------------
    // 2) - Validar la req.json con schemas de zod
    //---------------------------------------------
    const parsed = CreateBookingSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.format() }, { status: 400 });
    }

    const data = parsed.data;

    //---------------------------------------------
    // 3) - 🔎 Buscar y validar la actividad
    //---------------------------------------------
    const activity = await db.activitie.findUnique({ where: { id: parsed.data.activityId }, select: { id: true, title: true } });

    if (!activity) {
      return NextResponse.json({ errors: "Actividad no existe" }, { status: 404 });
    }

    //---------------------------------------------
    // 4) - 🔢 Generar numero unico de reserva
    //---------------------------------------------
    const bookingNo = generateReservationCode();

    //---------------------------------------------
    // 5) - 💾 Guardar la reserva en base de datos
    //---------------------------------------------
    const created = await db.booking.create({
      data: {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,

        no: bookingNo,
        date: data.date,
        name: data.customerName,

        seniors: data.seniors,
        adults: data.adults,
        youths: data.youths,
        children: data.children,
        babies: data.babies,

        paymentMethod: data.paymentMethod,
        paymentStatus: PaymentStatus.PENDING,
        totalPrice: data.totalPrice,

        pickupLocation: data.pickupLocation,
        pickupTime: data.schedule,
        schedule: data.schedule,

        activityId: data.activityId,
      },
      select: { id: true, no: true },
    });

    //-----------------------------------------------------------
    // 6) - 📄 Generar el pdf de la reserva y subirlo al storage
    //-----------------------------------------------------------
    const pdfPayload: BookingReceiptData = {
      reservationNo: created.no,
      activityName: activity.title,
      date: data.date.toISOString(),
      schedule: data.schedule,
      pickupLocation: data.pickupLocation,
      paymentMethod: data.paymentMethod,
      totalPrice: data.totalPrice,
      guests: {
        seniors: data.seniors,
        adults: data.adults,
        youths: data.youths,
        children: data.children,
        babies: data.babies,
      },
      customer: {
        name: data.customerName,
        email: data.customerEmail,
        phone: data.customerPhone,
      },
      company: {
        name: agencyInfo.name,
        email: agencyInfo.contact.email,
        phone: agencyInfo.contact.phone,
        address: agencyInfo.contact.address,
        website: agencyInfo.contact.web,
        logoUrl: agencyInfo.logo,
      },
    };

    const pdfRes = await fetch(`${process.env.ORIGIN_URL}/api/pdf`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pdfPayload),
      cache: "no-store",
    });

    if (!pdfRes.ok) {
      let msg = "Error generando el PDF.";
      try {
        const j = await pdfRes.json();
        if (j?.message) msg = j.message;
      } catch {}
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    const { url: pdfUrl } = (await pdfRes.json()) as { url: string; downloadUrl?: string };

    //-----------------------------------------------------------
    // 7) - 📩 Ennviar los emails al cliente y a la compañia
    //-----------------------------------------------------------

    const resend = new Resend(agencyInfo.providers.resend.apikkey); // Cambiar por variable de ambiente

    // 7.1) - Preparacion de plantilla para el cliente
    const customerEmailElement = React.createElement(EmailBookingConfirmation, {
      reservationNo: bookingNo,
      customer: {
        name: data.customerName,
        email: data.customerEmail,
        phone: data.customerPhone,
      },
      activityName: activity.title,
      dateISO: new Date(data.date).toISOString(),
      schedule: data.schedule,
      pickupLocation: data.pickupLocation,

      totalPrice: data.totalPrice,
      guests: {
        seniors: data.seniors,
        adults: data.adults,
        youths: data.youths,
        children: data.children,
        babies: data.babies,
      },

      company: {
        name: agencyInfo.name,
        logoUrl: agencyInfo.logo,
        web: agencyInfo.contact.web,
        contactEmail: agencyInfo.contact.email,
        contactPhone: agencyInfo.contact.phone,
        // si tienes redes sociales, colócalas aquí:
        facebookUrl: undefined,
        instagramUrl: undefined,
        whatsappUrl: undefined,
      },

      pdfUrl,
    });

    // 7.2) - Envio del email con resend a la empresa
    await resend.emails.send({
      from: `${agencyInfo.name} ${agencyInfo.providers.resend.domain}`,
      to: [data.customerEmail],
      subject: `Confirmación de reserva #${bookingNo}`,
      react: customerEmailElement,
      attachments: [{ filename: `${bookingNo}.pdf`, path: pdfUrl }],
    });

    // 7.3) Preparacion de plantilla para la compañia
    const companyEmailElement = React.createElement(EmailCompanyBooking, {
      reservationNo: bookingNo,
      customer: {
        name: data.customerName,
        email: data.customerEmail,
        phone: data.customerPhone,
      },
      activityName: activity.title,
      dateISO: new Date(data.date).toISOString(),
      schedule: data.schedule,
      pickupLocation: data.pickupLocation,
      totalPrice: data.totalPrice,
      paymentMethod: data.paymentMethod,
      guests: {
        seniors: data.seniors,
        adults: data.adults,
        youths: data.youths,
        children: data.children,
        babies: data.babies,
      },
      company: {
        name: agencyInfo.name,
        logoUrl: agencyInfo.logo,
        web: agencyInfo.contact.web,
        // si tienes un enlace a panel interno, colócalo aquí:
        inboxUrl: undefined,
      },

      pdfUrl,
    });

    // 7.4) Envio del correo a la compañia
    await resend.emails.send({
      from: `${agencyInfo.name} ${agencyInfo.providers.resend.domain}`,
      to: [agencyInfo.contact.email], // o tu buzón de reservas
      subject: `Nueva reserva: #${bookingNo}`,
      react: companyEmailElement,
      attachments: [{ filename: `${bookingNo}.pdf`, path: pdfUrl }],
    });
    //-----------------------------------------------------------
    // 8) - 👍 Repuesta
    //-----------------------------------------------------------
    return NextResponse.json({ no: created.no, pdfUrl }, { status: 201 });
  } catch (err) {
    //-----------------------------------------------------------
    //  ⚠️ Manejo de errores 💥💥💥
    //-----------------------------------------------------------
    console.error(err);
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validación fallida", details: err.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
