/* eslint-disable jsx-a11y/alt-text */
import * as React from "react";
import { Html, Head, Preview, Tailwind, Body, Container, Section, Img, Heading, Text, Link, Hr, Button } from "@react-email/components";

/* ------------ Tipos ------------ */
type Guests = {
  seniors?: number;
  adults?: number;
  youths?: number;
  children?: number;
  babies?: number;
};

export interface EmailCompanyBookingProps {
  // Identificador de reserva
  reservationNo: string;

  // Cliente
  customer: {
    name: string;
    email: string;
    phone: string;
  };

  // Actividad
  activityName: string;
  dateISO: string; // "2025-09-20T00:00:00.000Z"
  schedule: string; // "07:00"
  pickupLocation: string;

  // Importes y detalle
  totalPrice: number; // USD
  paymentMethod?: string; // "cash" | "paypal" | etc.
  guests: Guests;

  // Empresa (branding/links)
  company?: {
    name?: string;
    logoUrl?: string; // URL absoluta PNG/JPG
    web?: string;
    inboxUrl?: string; // enlace interno a panel/admin (opcional)
  };

  // PDF generado (opcional)
  pdfUrl?: string;
}

/* ------------ Utils ------------ */
function formatCurrencyUSD(n: number) {
  try {
    return new Intl.NumberFormat("es-DO", { style: "currency", currency: "USD" }).format(n || 0);
  } catch {
    return `$${(n || 0).toFixed(2)} USD`;
  }
}

function formatDateES(dateISO?: string) {
  if (!dateISO) return "—";
  const d = new Date(dateISO);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("es-DO", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/* ------------ Componente ------------ */
export const EmailCompanyBooking: React.FC<Readonly<EmailCompanyBookingProps>> = (props) => {
  const { reservationNo, customer, activityName, dateISO, schedule, pickupLocation, totalPrice, paymentMethod, guests = {}, company = {}, pdfUrl } = props;

  const comp = {
    name: company.name || "",
    logoUrl: company.logoUrl || "", // usa URL absoluta PNG/JPG
    web: company.web || "",
    inboxUrl: company.inboxUrl, // opcional
  };

  const rows = [
    { label: "Ancianos", value: guests.seniors || 0 },
    { label: "Adultos", value: guests.adults || 0 },
    { label: "Jóvenes", value: guests.youths || 0 },
    { label: "Niños", value: guests.children || 0 },
    { label: "Bebés", value: guests.babies || 0 },
  ].filter((r) => r.value > 0);

  const totalPeople = (guests.seniors || 0) + (guests.adults || 0) + (guests.youths || 0) + (guests.children || 0) + (guests.babies || 0);

  return (
    <Html>
      <Head />
      <Preview>{`Nueva reserva realizada: #${reservationNo}`}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[32px] mx-auto p-[20px] max-w-[560px]">
            {/* Logo */}
            <Section className="mt-[10px] mb-[10px] text-center">
              <Img src={comp.logoUrl} width={80} className="my-0 mx-auto" alt={`${comp.name} logo`} />
            </Section>

            {/* Título */}
            <Heading className="text-black text-[22px] font-semibold text-center my-[8px]">Nueva reserva realizada</Heading>

            {/* No. de reserva */}
            <Text className="text-black text-[14px] leading-[22px] text-center font-bold mb-[8px]">
              Nº de reserva: <span className="text-[#0ea5e9]">#{reservationNo}</span>
            </Text>

            <Text className="text-black text-[14px] leading-[22px] px-[8px] mt-[6px]">Se recibió una nueva reserva. A continuación el detalle resumido para gestión interna.</Text>

            <Hr className="my-[14px] border border-solid border-[#eaeaea]" />

            {/* Cliente */}
            <Section className="px-[8px]">
              <Heading as="h3" className="text-[16px] font-semibold m-0 mb-[6px]">
                Cliente
              </Heading>
              <Text className="text-[13px] leading-[20px] m-0">
                <strong>Nombre:</strong> {customer.name || "—"}
              </Text>
              <Text className="text-[13px] leading-[20px] m-0">
                <strong>Correo:</strong> {customer.email || "—"}
              </Text>
              <Text className="text-[13px] leading-[20px] m-0">
                <strong>Teléfono:</strong> {customer.phone || "—"}
              </Text>
            </Section>

            <Hr className="my-[14px] border border-solid border-[#eaeaea]" />

            {/* Reserva */}
            <Section className="px-[8px]">
              <Heading as="h3" className="text-[16px] font-semibold m-0 mb-[6px]">
                Detalles de la reserva
              </Heading>
              <Text className="text-[13px] leading-[20px] m-0">
                <strong>Actividad:</strong> {activityName || "—"}
              </Text>
              <Text className="text-[13px] leading-[20px] m-0">
                <strong>Fecha:</strong> {formatDateES(dateISO)}
              </Text>
              <Text className="text-[13px] leading-[20px] m-0">
                <strong>Horario:</strong> {schedule || "—"}
              </Text>
              <Text className="text-[13px] leading-[20px] m-0">
                <strong>Recogida:</strong> {pickupLocation || "—"}
              </Text>
              <Text className="text-[13px] leading-[20px] m-0">
                <strong>Método de pago:</strong> {paymentMethod || "—"}
              </Text>

              {/* Personas */}
              <Text className="text-[13px] leading-[20px] mt-[8px]">
                <strong>Personas:</strong> {totalPeople}
              </Text>
              {rows.length > 0 && (
                <table role="presentation" className="w-full mt-[6px]">
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.label}>
                        <td className="text-[12px] text-[#666] py-[2px]">{r.label}</td>
                        <td className="text-[12px] text-right text-[#111] py-[2px] font-medium">{r.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Total */}
              <Text className="text-[14px] leading-[20px] mt-[10px]">
                <strong>Total:</strong> {formatCurrencyUSD(totalPrice)}
              </Text>
            </Section>

            {/* CTA: PDF y/o Panel */}
            {(pdfUrl || comp.inboxUrl) && (
              <>
                <Hr className="my-[14px] border border-solid border-[#eaeaea]" />
                <Section className="text-center">
                  {pdfUrl && (
                    <Button href={pdfUrl} className="bg-[#0ea5e9] text-white text-[14px] px-[16px] py-[10px] rounded-md no-underline">
                      Ver comprobante (PDF)
                    </Button>
                  )}
                  {comp.inboxUrl && (
                    <Button href={comp.inboxUrl} className="bg-[#16a34a] text-white text-[14px] px-[16px] py-[10px] rounded-md no-underline ml-[8px]">
                      Abrir en panel
                    </Button>
                  )}
                </Section>
              </>
            )}

            <Hr className="my-[14px] border border-solid border-[#eaeaea]" />

            {/* Footer */}
            <Section>
              <Text className="text-gray-600 text-[12px] leading-[20px] text-center">Notificación automática de nueva reserva en {comp.name}.</Text>
              <Text className="text-gray-600 text-[12px] leading-[20px] text-center mt-[6px]">
                Sitio web:{" "}
                <Link href={comp.web} className="text-[#0ea5e9] underline">
                  {comp.web.replace(/^https?:\/\//, "")}
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EmailCompanyBooking;
