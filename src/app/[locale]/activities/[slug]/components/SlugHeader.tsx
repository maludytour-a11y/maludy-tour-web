"use client";

import { NavBar } from "@/components";
import Rate from "@/components/ui/rate";
import { agencyInfo } from "@/config";
import { useLocale, useTranslations } from "next-intl";

export function SlugHeader({ title, rating, reviews }: { title: string; rating: number | string; reviews: number | string }) {
  const t = useTranslations("ActivityDetailPage.Header");
  const locale = useLocale();

  const ratingNum = Number(rating ?? 0);
  const reviewsNum = Number(reviews ?? 0);

  // Formateo según el locale actual (4.8 vs 4,8)
  const ratingText = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(ratingNum);

  return (
    <header className="mb-6">
      <NavBar />
      <h1 className="text-2xl md:text-3xl font-extrabold leading-tight">{title}</h1>

      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-neutral-600">
        <span className="flex items-center gap-2">
          <Rate value={ratingNum} />
          <span className="text-neutral-500">
            {ratingText} · {t("Reviews", { count: reviewsNum })}
          </span>
        </span>

        <span>
          · {t("ProviderLabel")}: <strong>{agencyInfo.name}</strong>
        </span>
      </div>
    </header>
  );
}
