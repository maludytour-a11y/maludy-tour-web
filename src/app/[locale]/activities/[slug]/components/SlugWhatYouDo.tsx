interface SlugWhatYouDoProps {
  whatYouDo: string[];
}
export const SlugWhatYouDo = (props: SlugWhatYouDoProps) => {
  return (
    <section className="mt-6">
      <h2 className="text-xl font-bold mb-2">Qué harás</h2>
      <ul className="list-disc pl-5 text-neutral-700 space-y-1">
        {props.whatYouDo.map((w, i) => (
          <li key={i}>{w}</li>
        ))}
      </ul>
    </section>
  );
};
