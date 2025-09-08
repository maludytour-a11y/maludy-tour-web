interface SlugDetailProps {
  details: string;
}

export const SlugDetail = (props: SlugDetailProps) => {
  return (
    <section className="mt-6">
      <h2 className="text-xl font-bold mb-2">En detalle</h2>
      <p className="text-neutral-700">{props.details}</p>
    </section>
  );
};
