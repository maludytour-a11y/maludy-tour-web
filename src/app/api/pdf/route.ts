import { NextResponse } from "next/server";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { put } from "@vercel/blob";

// 👇 Usa el PDF que creamos antes
import BookingReceiptPDF, { BookingReceiptData } from "@/components/InvoicePDF";
import { agencyInfo } from "@/config";

export const runtime = "nodejs"; // MUY IMPORTANTE para usar Buffer/Node APIs

export async function POST(req: Request) {
  try {
    const data = (await req.json()) as BookingReceiptData;

    if (!data?.reservationNo) {
      return NextResponse.json({ message: "reservationNo es requerido" }, { status: 400 });
    }

    // Logo absoluto por si no viene
    if (!data.company?.logoUrl) {
      const origin = process.env.NEXT_PUBLIC_SITE_URL || req.headers.get("origin");

      data.company = {
        ...data.company,
        name: data.company?.name ?? "Company Name",
        logoUrl: `${origin}${agencyInfo.logo}`,
      };
    }

    // 👉 Igual que tu ejemplo: renderToBuffer devuelve un Buffer de Node
    const element = React.createElement(BookingReceiptPDF, { data });
    const pdfBuffer = await renderToBuffer(element);

    // Nombre de archivo seguro
    const safeNo = String(data.reservationNo).replace(/[^a-zA-Z0-9-_]+/g, "_");

    // 👉 put recibe Buffer sin problema en runtime Node
    const saved = await put(`receipts/${safeNo}.pdf`, pdfBuffer, {
      access: "public",
      contentType: "application/pdf",
      addRandomSuffix: false,
    });

    return NextResponse.json({ url: saved.url, downloadUrl: saved.downloadUrl }, { status: 200 });
  } catch (err) {
    console.error("Error generating PDF:", err);
    return NextResponse.json({ success: false, message: "Error generating PDF" }, { status: 500 });
  }
}
