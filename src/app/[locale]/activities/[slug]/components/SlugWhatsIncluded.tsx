import { useTranslations } from "next-intl";

interface SlugWhatsIncludedProps {
  includes: string[];
  notSuitable: string[];
}

export const SlugWhatsIncluded = ({ includes, notSuitable }: SlugWhatsIncludedProps) => {
  const t = useTranslations("ActivityDetailPage.WhatsIncluded");

  const hasIncludes = Array.isArray(includes) && includes.length > 0;
  const hasNotSuitable = Array.isArray(notSuitable) && notSuitable.length > 0;

  return (
    <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div aria-labelledby="wi-title" aria-label={t("IncludesAria")}>
        <h3 id="wi-title" className="text-lg font-semibold mb-2">
          {t("IncludesTitle")}
        </h3>
        {hasIncludes ? (
          <ul className="list-disc pl-5 text-neutral-700 space-y-1">
            {includes.map((inc, i) => (
              <li key={i}>{inc}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-neutral-500">{t("EmptyIncludes")}</p>
        )}
      </div>

      <div aria-labelledby="ns-title" aria-label={t("NotSuitableAria")}>
        <h3 id="ns-title" className="text-lg font-semibold mb-2">
          {t("NotSuitableTitle")}
        </h3>
        {hasNotSuitable ? (
          <ul className="list-disc pl-5 text-neutral-700 space-y-1">
            {notSuitable.map((ns, i) => (
              <li key={i}>{ns}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-neutral-500">{t("EmptyNotSuitable")}</p>
        )}
      </div>
    </section>
  );
};
