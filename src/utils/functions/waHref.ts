import { agencyInfo } from "@/config";

export function waHref() {
  const digits = agencyInfo.contact.phone.replace(/\D/g, "");
  const text = encodeURIComponent(agencyInfo.contact.WhatsAppTextAbout || "");
  return `https://wa.me/${digits}?text=${text}`;
}
