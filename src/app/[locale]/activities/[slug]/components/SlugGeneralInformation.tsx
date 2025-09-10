import { useTranslations } from "next-intl";

interface SlugGeneralInformationProps {
  highlights: string[];
}

export const SlugGeneralInformation = ({ highlights }: SlugGeneralInformationProps) => {
  const t = useTranslations("ActivityDetailPage.GeneralInformation");

  return (
    <section className="mt-6" aria-labelledby="gi-title">
      <h2 id="gi-title" className="text-xl font-bold mb-3">
        {t("Title")}
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2" aria-label={t("AriaList")}>
        {highlights.map((h, i) => (
          <li key={i} className="flex items-center gap-2 text-neutral-700">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-600" />
            {h}
          </li>
        ))}
      </ul>
    </section>
  );
};
