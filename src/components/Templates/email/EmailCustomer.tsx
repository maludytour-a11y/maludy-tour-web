/* eslint-disable jsx-a11y/alt-text */
import * as React from "react";
import { Html, Head, Preview, Tailwind, Body, Container, Section, Img, Heading, Text, Link, Hr, Button } from "@react-email/components";

type Guests = {
  seniors?: number;
  adults?: number;
  youths?: number;
  children?: number;
  babies?: number;
};

export interface EmailBookingProps {
  // Identificador
  reservationNo: string;

  // Cliente
  customer: {
    name: string;
    email: string;
    phone: string;
  };

  // Actividad
  activityName: string;
  dateISO: string; // p.ej. "2025-09-20T00:00:00.000Z"
  schedule: string; // p.ej. "07:00"
  pickupLocation: string;

  // Importes
  totalPrice: number; // USD
  guests: Guests;

  // Empresa
  company?: {
    name?: string;
    logoUrl?: string; // URL absoluta PNG/JPG (no SVG)
    web?: string;
    contactEmail?: string;
    contactPhone?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    whatsappUrl?: string;
  };

  // Comprobante PDF
  pdfUrl?: string;
}

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

export const EmailBookingConfirmation: React.FC<Readonly<EmailBookingProps>> = (props) => {
  const { reservationNo, customer, activityName, dateISO, schedule, pickupLocation, totalPrice, guests = {}, company = {}, pdfUrl } = props;

  const comp = {
    name: company.name || "",
    logoUrl: company.logoUrl || "", // URL absoluta PNG/JPG
    web: company.web || "",
    contactEmail: company.contactEmail || "",
    contactPhone: company.contactPhone || "",
    facebookUrl: company.facebookUrl,
    instagramUrl: company.instagramUrl,
    whatsappUrl: company.whatsappUrl,
  };

  const peopleRows = [
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
      <Preview>{`Confirmación de reserva para ${activityName}`}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[32px] mx-auto p-[20px] max-w-[560px]">
            {/* Logo */}
            <Section className="mt-[10px] mb-[10px] text-center">
              <Img src={comp.logoUrl} width={80} className="my-0 mx-auto" alt={`${comp.name} logo`} />
            </Section>

            {/* Título */}
            <Heading className="text-black text-[24px] font-semibold text-center my-[10px]">Confirmación de reserva</Heading>

            {/* Número de reserva */}
            <Text className="text-black text-[14px] leading-[24px] text-center font-bold mb-[10px]">
              N.º de reserva: <span className="text-[#0ea5e9]">#{reservationNo}</span>
            </Text>

            {/* Saludo e introducción */}
            <Section className="px-[8px]">
              <Text className="text-black text-[15px] leading-[24px]">Hola {customer.name || ""},</Text>
              <Text className="text-black text-[14px] leading-[22px] mt-[4px]">¡Gracias por elegirnos! Hemos recibido tu solicitud de reserva.</Text>
              <Text className="text-black text-[14px] leading-[22px] mt-[8px]">A continuación, encontrarás el resumen de tu actividad. Presenta este correo o el comprobante PDF el día de la excursión.</Text>
            </Section>

            {/* CTA al PDF */}
            {pdfUrl && (
              <Section className="text-center mt-[12px]">
                <Button href={pdfUrl} className="bg-[#16a34a] text-white text-[14px] px-[16px] py-[10px] rounded-md no-underline">
                  Ver comprobante (PDF)
                </Button>
              </Section>
            )}

            <Hr className="my-[16px] border border-solid border-[#eaeaea]" />

            {/* Datos del cliente */}
            <Section className="px-[8px]">
              <Heading as="h3" className="text-[16px] font-semibold m-0 mb-[6px]">
                Datos del cliente
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

            <Hr className="my-[16px] border border-solid border-[#eaeaea]" />

            {/* Detalles de la reserva */}
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

              {/* Personas */}
              <Text className="text-[13px] leading-[20px] mt-[8px]">
                <strong>Personas:</strong> {totalPeople}
              </Text>
              {peopleRows.length > 0 && (
                <table role="presentation" className="w-full mt-[6px]">
                  <tbody>
                    {peopleRows.map((r) => (
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

            <Hr className="my-[16px] border border-solid border-[#eaeaea]" />

            {/* Redes / footer */}
            <Section className="text-center">
              <Text className="text-gray-600 text-[13px] leading-[20px]">¡Síguenos!</Text>
              <table role="presentation" className="mt-[8px]" align="center">
                <tbody>
                  <tr>
                    {comp.facebookUrl && (
                      <td align="center" className="px-2">
                        <Link href={comp.facebookUrl}>
                          <Img src="https://u4iso7gv40.ufs.sh/f/irndY4gBQZgp1MpUujxeD9FmVgyBCKlqORv04XWuiSkjdH7G" width={28} height={28} alt="Facebook" />
                        </Link>
                      </td>
                    )}
                    {comp.instagramUrl && (
                      <td align="center" className="px-2">
                        <Link href={comp.instagramUrl}>
                          <Img src="https://u4iso7gv40.ufs.sh/f/irndY4gBQZgp2k8qG3LLjyuX9InfYAm4680Cosd13bBiQzZx" width={28} height={28} alt="Instagram" />
                        </Link>
                      </td>
                    )}
                    {comp.whatsappUrl && (
                      <td align="center" className="px-2">
                        <Link href={comp.whatsappUrl}>
                          <Img src="https://u4iso7gv40.ufs.sh/f/irndY4gBQZgpCeybkMHPiUkfryhR1mA7TFjxodpSBCa925OI" width={28} height={28} alt="WhatsApp" />
                        </Link>
                      </td>
                    )}
                  </tr>
                </tbody>
              </table>
            </Section>

            <Hr className="my-[16px] border border-solid border-[#eaeaea]" />

            <Section>
              <Text className="text-gray-600 text-[12px] leading-[20px] text-center">
                Este mensaje fue enviado a: <span className="text-black">{customer.email}</span>
              </Text>
              <Text className="text-gray-600 text-[12px] leading-[20px] text-center mt-[6px]">
                Visita nuestro sitio:{" "}
                <Link href={comp.web} className="text-[#0ea5e9] underline">
                  {comp.web.replace(/^https?:\/\//, "")}
                </Link>
              </Text>
              <Text className="text-gray-600 text-[12px] leading-[20px] text-center mt-[6px]">
                {comp.name} • {comp.contactEmail} • {comp.contactPhone}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EmailBookingConfirmation;
