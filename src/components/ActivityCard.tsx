"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Clock, MapPin, Flame } from "lucide-react";
import Rate from "@/components/ui/rate";
import { useTranslations } from "next-intl";

export type Activity = {
  id: string;
  image: string;
  price: number;
  title: string;
  location: string;
  duration: string;
  rating: number;
  reviews: number;
  badge?: "NEW" | "POPULAR" | "SEASON";
};

const currency = new Intl.NumberFormat("es-DO", { style: "currency", currency: "USD" });

export function ActivityCard({ activity }: { activity: Activity }) {
  const g = useTranslations("General");
  const b = useTranslations("Btn");
  const ratingNum = Number(activity.rating ?? 0);
  const reviewsNum = Number(activity.reviews ?? 0);

  return (
    <article className="group rounded-2xl border bg-white shadow-sm hover:shadow-md transition overflow-hidden">
      {/* COVER: sin espacio arriba */}
      <div
        className="relative aspect-[16/9] bg-neutral-200 -mb-px"
        style={{ WebkitMaskImage: "radial-gradient(#000,#000)" }} // anti-hairline Safari
      >
        <Image src={activity.image} alt={activity.title} fill sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" className="absolute inset-0 block h-full w-full object-cover [transform:translateZ(0)] will-change-transform" draggable={false} priority={false} />

        {activity.badge && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 text-neutral-900 backdrop-blur px-2 py-1 text-xs font-medium shadow">
            <Flame className="h-3.5 w-3.5" />
            {activity.badge}
          </span>
        )}
      </div>

      {/* BODY */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          {/* Info */}
          <div className="min-w-0">
            <h3 className="text-lg font-semibold leading-snug line-clamp-2">{activity.title}</h3>

            <p className="mt-1 text-sm text-neutral-500 flex items-center gap-1">
              <MapPin className="h-4 w-4 shrink-0" /> {activity.location}
            </p>
            <p className="text-sm text-neutral-500 flex items-center gap-1">
              <Clock className="h-4 w-4 shrink-0" /> {activity.duration}
            </p>

            <div className="mt-2 flex items-center gap-2">
              {/* ✅ tu componente Rate */}
              <Rate value={ratingNum} />
              <span className="text-xs text-neutral-500">
                {ratingNum.toFixed(1)} · {reviewsNum.toLocaleString()} {g("Reviews")}
              </span>
            </div>
          </div>

          {/* Precio */}
          <div className="text-right shrink-0">
            <p className="text-xs text-neutral-500">{g("From")}</p>
            <p className="text-xl font-bold">{currency.format(Number(activity.price ?? 0))}</p>
            <p className="text-xs text-neutral-500">{`/${g("People")}`}</p>
          </div>
        </div>

        <div className="mt-4">
          <Link href={`/activities/${activity.id}`} className="inline-flex items-center justify-center rounded-full bg-amber-500 px-4 py-2 text-white font-medium hover:bg-amber-600 transition">
            {b("Book")}
          </Link>
        </div>
      </div>
    </article>
  );
}
