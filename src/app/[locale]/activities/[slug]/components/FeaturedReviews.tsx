"use client";

import Rate from "@/components/ui/rate";
import { useLocale, useTranslations } from "next-intl";

type Review = {
  rating: number;
  author: string;
  /** Fecha en ISO, p. ej. "2025-05-01" */
  dateISO: string;
};

export const FeaturedReviews = ({ reviews = [] as Review[] }) => {
  const t = useTranslations("ActivityDetailPage.Reviews");
  const locale = useLocale();

  const hasReviews = Array.isArray(reviews) && reviews.length > 0;

  return (
    <section className="mt-2" aria-labelledby="featured-reviews-title">
      <h2 id="featured-reviews-title" className="text-xl font-bold mb-3">
        {t("Title")}
      </h2>

      {hasReviews ? (
        <div className="grid sm:grid-cols-2 gap-4" aria-label={t("AriaList")}>
          {reviews.map((r, i) => {
            const d = new Date(r.dateISO);
            const dateText = isNaN(d.getTime()) ? r.dateISO : d.toLocaleDateString(locale, { month: "long", year: "numeric" });

            return (
              <article key={i} className="rounded-2xl border p-4 shadow-sm">
                <Rate value={r.rating} />
                {/* Omitimos el comentario del cliente a propósito */}
                <p className="text-sm text-neutral-500 mt-2">{t("ReviewerMeta", { name: r.author, date: dateText })}</p>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-neutral-500">{t("Empty")}</p>
      )}
    </section>
  );
};
