import { useTranslations } from "next-intl";

interface SlugWhatYouDoProps {
  whatYouDo: string[];
}

export const SlugWhatYouDo = ({ whatYouDo }: SlugWhatYouDoProps) => {
  const t = useTranslations("ActivityDetailPage.WhatYouDo");

  const hasItems = Array.isArray(whatYouDo) && whatYouDo.length > 0;

  return (
    <section className="mt-6" aria-labelledby="wyd-title">
      <h2 id="wyd-title" className="text-xl font-bold mb-2">
        {t("Title")}
      </h2>

      {hasItems ? (
        <ul className="list-disc pl-5 text-neutral-700 space-y-1" aria-label={t("AriaList")}>
          {whatYouDo.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-neutral-500">{t("Empty")}</p>
      )}
    </section>
  );
};
