import { useTranslations } from "next-intl";

interface SlugDetailProps {
  details: string;
}

export const SlugDetail = ({ details }: SlugDetailProps) => {
  const t = useTranslations("ActivityDetailPage.Detail");
  const hasText = typeof details === "string" && details.trim().length > 0;

  return (
    <section className="mt-6" aria-labelledby="detail-title" aria-label={t("Aria")}>
      <h2 id="detail-title" className="text-xl font-bold mb-2">
        {t("Title")}
      </h2>

      {hasText ? <p className="text-neutral-700 text-justify">{details}</p> : <p className="text-sm text-neutral-500">{t("Empty")}</p>}
    </section>
  );
};
