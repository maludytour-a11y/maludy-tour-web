interface SlugGeneralInformationProps {
  highlights: string[];
}

export const SlugGeneralInformation = (props: SlugGeneralInformationProps) => {
  const { highlights } = props;
  return (
    <section className="mt-6">
      <h2 className="text-xl font-bold mb-3">Información general</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
