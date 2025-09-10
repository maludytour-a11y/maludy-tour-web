"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Rate from "@/components/ui/rate";
import { agencyInfo } from "@/config";
import { useTranslations } from "next-intl";

export const Hero = () => {
  const t = useTranslations("Badges");
  const h = useTranslations("Hero");
  const g = useTranslations("General");
  const b = useTranslations("Btn");

  return (
    <section
      className="
        relative flex items-center
        bg-gradient-to-b from-white via-[#fbfbfb] to-emerald-50
      "
    >
      <div className="container mx-auto px-4 py-8 md:py-10 lg:py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* texto */}
          <div className="max-w-xl">
            <Badge className="mb-4 rounded-full px-3 py-1" variant="secondary">
              {`⭐ ${t("TopSelling")} 2025`}
            </Badge>

            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-neutral-900">
              {h("FrontPage.TextTitle1")} <span className="text-emerald-700">{h("FrontPage.TextTitle2")}</span>
              <br /> {h("FrontPage.TextTitle3")}
            </h1>

            <p className="mt-4 text-neutral-600 text-base md:text-lg">{h("FrontPage.ShortDescription")}</p>

            <div className="mt-3 flex items-center gap-2">
              <Rate value={5} />
              <span className="text-sm text-neutral-500">
                {agencyInfo.mainActivity.rating} ({agencyInfo.mainActivity.reviews} {g("Reviews")})
              </span>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button asChild className="rounded-full bg-amber-500 hover:bg-amber-600 px-4 py-5 h-auto text-base">
                <Link href={`activities/${agencyInfo.mainActivity.id}`}>{b("BookingNow")}</Link>
              </Button>

              <Button asChild variant="outline" className="rounded-full px-4 py-5 h-auto text-base">
                <Link href="/activities">{b("OtherActivities")}</Link>
              </Button>

              <Button asChild variant="outline" className="rounded-full px-3 py-5 h-auto text-base flex items-center gap-2">
                <a href={`https://wa.me/${agencyInfo.contact.phone}`} target="_blank" rel="noopener noreferrer">
                  <Image className="w-7 h-auto" src={"/whatsapp.svg"} alt={`${agencyInfo.name}-WhatsApp`} width={16} height={16} />
                  {b("ConsultByWhatsApp")}
                </a>
              </Button>
            </div>

            <ul className="mt-6 text-sm text-neutral-500 grid grid-cols-2 gap-y-1 max-w-sm">
              <li>• {h("FrontPage.FreeCancellation")}</li>
              <li>• {h("FrontPage.TransportationIncluded")}</li>
              <li>• {`${h("FrontPage.Duration")}: ${agencyInfo.mainActivity.duration}`}</li>
              <li>• {`${h("FrontPage.Languages")}: ${agencyInfo.mainActivity.languages}`}</li>
            </ul>
          </div>

          {/* collage imágenes */}
          <div className="relative">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {/* grande izquierda */}
              <div className="col-span-2 sm:col-span-2">
                <div className="rounded-3xl overflow-hidden shadow-lg">
                  <Image src={agencyInfo.mainActivity.img1} alt="Cascada" width={900} height={600} className="h-64 md:h-80 w-full object-cover" priority />
                </div>
              </div>

              {/* tarjeta */}
              <div className="rounded-3xl overflow-hidden shadow-lg">
                <Image src={agencyInfo.mainActivity.img2} alt="Basílica" width={600} height={400} className="h-40 md:h-full w-full object-cover" />
              </div>

              <div className="rounded-3xl overflow-hidden shadow-lg">
                <Image src={agencyInfo.mainActivity.img3} alt="Finca bananos" width={600} height={400} className="h-40 md:h-48 w-full object-cover" />
              </div>

              <div className="rounded-3xl overflow-hidden shadow-lg">
                <Image src={agencyInfo.mainActivity.img4} alt="Experiencia local" width={600} height={400} className="h-40 md:h-48 w-full object-cover" />
              </div>
            </div>

            {/* badge precio */}
            <div className="absolute -bottom-4 left-4 bg-white/90 backdrop-blur rounded-2xl shadow-md px-4 py-3">
              <p className="text-xs text-neutral-500">{g("From")}</p>
              <p className="text-2xl font-bold text-neutral-900">
                ${agencyInfo.mainActivity.price} <span className="text-sm font-medium text-neutral-500">{`/${g("People")}`}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
