/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { Document, Page, Text, View, Image, StyleSheet, DocumentProps } from "@react-pdf/renderer";
import { PaymentMethod } from "@/generated/prisma";

/** ------------ Tipos ------------- */
export type BookingReceiptData = {
  reservationNo: string; // booking.no
  activityName: string; // nombre de la actividad
  date: string; // ISO date (ej. 2025-09-05T00:00:00.000Z)
  schedule: string; // horario (ej. "7:00")
  pickupLocation: string;
  paymentMethod: PaymentMethod;
  totalPrice: number;
  guests: {
    seniors: number;
    adults: number;
    youths: number;
    children: number;
    babies: number;
  };
  customer: {
    name: string;
    email?: string;
    phone?: string;
  };
  company: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    website?: string;
    logoUrl?: string; // Usa URL absoluta o base64 (React-PDF no soporta paths relativos del public/ de Next)
  };
};

/** ------------ Utils ------------- */
const currency = new Intl.NumberFormat("es-DO", { style: "currency", currency: "USD" });

function formatDateShort(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("es-DO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function nowPrintDate() {
  const d = new Date();
  return d.toLocaleString("es-DO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** ------------ Componente PDF ------------- */
export interface BookingReceiptPDFProps extends DocumentProps {
  data: BookingReceiptData;
}

export const BookingReceiptPDF: React.FC<Readonly<BookingReceiptPDFProps>> = ({ data }) => {
  const { reservationNo, activityName, date, schedule, pickupLocation, paymentMethod, totalPrice, guests, customer, company } = data;

  const totalPeople = (guests.seniors ?? 0) + (guests.adults ?? 0) + (guests.youths ?? 0) + (guests.children ?? 0) + (guests.babies ?? 0);

  const personRows = [
    { label: "Ancianos", value: guests.seniors ?? 0 },
    { label: "Adultos", value: guests.adults ?? 0 },
    { label: "Jóvenes", value: guests.youths ?? 0 },
    { label: "Niños", value: guests.children ?? 0 },
    { label: "Bebés", value: guests.babies ?? 0 },
  ].filter((r) => r.value > 0);

  const printedAt = nowPrintDate();

  return (
    <Document>
      <Page style={styles.page}>
        {/* Header */}
        <View style={styles.headerContainer}>
          {company.logoUrl ? <Image src={company.logoUrl} style={styles.logo} /> : <View />}
          <View style={styles.headerInfo}>
            <Text style={styles.title}>Reserva #{reservationNo || "—"}</Text>
            <Text style={styles.contactInfo}>{company.name}</Text>
            {company.email ? <Text style={styles.contactInfo}>{company.email}</Text> : null}
            {company.phone ? <Text style={styles.contactInfo}>{company.phone}</Text> : null}
            {company.website ? <Text style={styles.contactInfo}>{company.website}</Text> : null}
            <Text style={styles.contactInfo}>Fecha de impresión: {printedAt}</Text>
          </View>
        </View>

        {/* Resumen principal */}
        <View style={styles.summary}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Actividad</Text>
            <Text style={styles.summaryValue}>{activityName}</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Total</Text>
            <Text style={styles.summaryValue}>{currency.format(totalPrice || 0)}</Text>
          </View>
        </View>

        {/* Secciones dobles */}
        <View style={styles.sectionContainer}>
          {/* Cliente */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Datos del cliente</Text>
            <Row label="Nombre" value={customer.name || "—"} />
            {customer.email ? <Row label="Correo" value={customer.email} /> : null}
            {customer.phone ? <Row label="Teléfono" value={customer.phone} /> : null}
          </View>

          {/* Reserva */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detalles de la reserva</Text>
            <Row label="Fecha" value={formatDateShort(date)} />
            <Row label="Horario" value={schedule || "—"} />
            <Row label="Recogida" value={pickupLocation || "—"} />
            <Row label="Método de pago" value={paymentMethod === PaymentMethod.PAYPAL ? "PayPal / Tarjeta" : "Efectivo"} />
            <Row label="Personas" value={String(totalPeople)} />
          </View>
        </View>

        {/* Personas */}
        {personRows.length > 0 && (
          <View style={styles.singleSection}>
            <Text style={styles.sectionTitle}>Desglose de personas</Text>
            {personRows.map((r, idx) => (
              <Row key={idx} label={r.label} value={String(r.value)} />
            ))}
          </View>
        )}

        {/* Total grande */}
        <View style={styles.totalSection}>
          <Text style={styles.totalPrice}>Total: {currency.format(totalPrice || 0)} USD</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Gracias por reservar con {company.name}.</Text>
          <Text>Presenta este comprobante el día de la actividad.</Text>
        </View>
      </Page>
    </Document>
  );
};

/** ------------ Subcomponentes ------------- */
function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

/** ------------ Estilos ------------- */
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: "Helvetica",
    fontSize: 11,
    backgroundColor: "#ffffff",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  headerInfo: {
    width: "68%",
    textAlign: "right",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  logo: {
    width: 80,
    height: 80,
    objectFit: "contain",
  },
  title: {
    fontSize: 18,
    fontWeight: 700 as any,
    color: "#111",
    marginBottom: 6,
  },
  contactInfo: {
    fontSize: 10,
    color: "#555",
    marginBottom: 2,
  },
  summary: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  summaryBox: {
    flexGrow: 1,
    padding: 10,
    border: "1px solid #e5e5e5",
    borderRadius: 4,
    backgroundColor: "#f9f9f9",
  },
  summaryLabel: {
    fontSize: 10,
    color: "#666",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: 700 as any,
    color: "#111",
  },
  sectionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 12,
  },
  section: {
    width: "50%",
    padding: 10,
    border: "1px solid #e5e5e5",
    borderRadius: 4,
  },
  singleSection: {
    width: "100%",
    padding: 10,
    border: "1px solid #e5e5e5",
    borderRadius: 4,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700 as any,
    backgroundColor: "#EBEBEB",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 4,
    color: "#111",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: {
    fontWeight: 700 as any,
    color: "#333",
  },
  value: {
    color: "#333",
  },
  totalSection: {
    marginTop: 16,
    padding: 10,
    border: "0.5px solid #333",
    borderRadius: 4,
    backgroundColor: "#f4f4f4",
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 700 as any,
    color: "#000",
    textAlign: "center",
  },
  footer: {
    marginTop: 22,
    fontSize: 10,
    textAlign: "center",
    color: "#777",
  },
});

export default BookingReceiptPDF;
