interface SlugWhatsIncludedProps {
  includes: string[];
  notSuitable: string[];
}

export const SlugWhatsIncluded = (props: SlugWhatsIncludedProps) => {
  return (
    <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Qué incluye</h3>
        <ul className="list-disc pl-5 text-neutral-700 space-y-1">
          {props.includes.map((inc, i) => (
            <li key={i}>{inc}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">No apto para</h3>
        <ul className="list-disc pl-5 text-neutral-700 space-y-1">
          {props.notSuitable.map((ns, i) => (
            <li key={i}>{ns}</li>
          ))}
        </ul>
      </div>
    </section>
  );
};
