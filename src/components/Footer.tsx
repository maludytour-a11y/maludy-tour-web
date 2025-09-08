import Image from "next/image";
import Link from "next/link";
import { agencyInfo } from "@/config";
import { Mail, Phone, MapPin, Lock, ExternalLink } from "lucide-react";

function whatsappHref(phone: string) {
  const digits = (phone || "").replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "#";
}

export default function Footer() {
  return (
    <footer className="mt-14">
      {/* CTA superior */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
          <div className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
            <div className="flex-1">
              <p className="text-sm/6 opacity-90">¿Necesitas ayuda con tu reserva?</p>
              <h3 className="text-xl md:text-2xl font-extrabold tracking-tight">Nuestro equipo está listo para ayudarte</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={whatsappHref(agencyInfo.contact.phone)} className="inline-flex items-center gap-2 rounded-full bg-white text-emerald-700 px-4 py-2 font-medium shadow hover:bg-emerald-50 transition">
                <Image className="w-7 h-auto" src={"/whatsapp.svg"} alt={`${agencyInfo.name}-WhatsApp`} width={16} height={16} />
                WhatsApp
              </Link>
              <Link href={`mailto:${agencyInfo.contact.email}`} className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-transparent px-4 py-2 font-medium hover:bg-white/10 transition">
                <Mail className="h-4 w-4" />
                Email
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer principal */}
      <div className="mt-10 border-t bg-gradient-to-b from-emerald-50/40 to-white dark:from-zinc-900 dark:to-zinc-950">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8">
            {/* Brand */}
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3">
                <Image src={agencyInfo.logo} alt={agencyInfo.name} width={44} height={44} className="rounded-lg" unoptimized />
                <div>
                  <p className="text-lg font-extrabold tracking-tight">{agencyInfo.name}</p>
                  <p className="text-xs text-neutral-500">{agencyInfo.metadata.home.description}</p>
                </div>
              </div>

              <div className="mt-4 text-sm text-neutral-600 dark:text-neutral-400 space-y-1.5">
                <p className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{agencyInfo.contact.address}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0" />
                  <a className="hover:underline" href={`tel:${agencyInfo.contact.phone}`}>
                    {agencyInfo.contact.phone}
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0" />
                  <a className="hover:underline" href={`mailto:${agencyInfo.contact.email}`}>
                    {agencyInfo.contact.email}
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 shrink-0" />
                  <a className="hover:underline" href={agencyInfo.contact.web} target="_blank" rel="noopener noreferrer">
                    {agencyInfo.contact.web.replace(/^https?:\/\//, "")}
                  </a>
                </p>
              </div>

              {/* Confianza */}
              <div className="mt-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-neutral-600 dark:text-neutral-300">
                <Lock className="h-3.5 w-3.5" />
                Pago seguro · PayPal y tarjeta
              </div>
            </div>

            {/* Enlaces rápidos */}
            <div className="lg:col-span-3">
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Explorar</p>
              <ul className="mt-3 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li>
                  <Link className="hover:text-emerald-600" href="/activities">
                    Actividades
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-emerald-600" href="/about">
                    Acerca de
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-emerald-600" href="/booking">
                    Tu reserva
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-emerald-600" href="/contact">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>

            {/* Ayuda */}
            <div className="lg:col-span-3">
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Soporte</p>
              <ul className="mt-3 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li>
                  <Link className="hover:text-emerald-600" href="/faq">
                    Preguntas frecuentes
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-emerald-600" href="/policies/cancellations">
                    Política de cancelación
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-emerald-600" href="/terms">
                    Términos y condiciones
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-emerald-600" href="/privacy">
                    Privacidad
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter (opcional, sin lógica) */}
            <div className="lg:col-span-2">
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Boletín</p>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                Ofertas y novedades de <span className="font-medium">{agencyInfo.name}</span>.
              </p>
              <form className="mt-3 flex items-center gap-2" action="/api/subscribe" method="POST">
                <input name="email" type="email" placeholder="tu@email.com" required className="w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-zinc-900" />
                <button type="submit" className="shrink-0 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition">
                  Suscribirme
                </button>
              </form>
              <p className="mt-2 text-xs text-neutral-500">Nos tomamos en serio tu privacidad.</p>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-neutral-500">
            <p>
              © {new Date().getFullYear()} {agencyInfo.name}. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4">
              <Link className="hover:text-emerald-600" href="/privacy">
                Privacidad
              </Link>
              <Link className="hover:text-emerald-600" href="/cookies">
                Cookies
              </Link>
              <Link className="hover:text-emerald-600" href="/terms">
                Términos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
