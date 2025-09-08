"use client";

import Rate from "@/components/ui/rate";

export const FeaturedReviews = () => {
  return (
    <section className="mt-2">
      <h2 className="text-xl font-bold mb-3">Reseñas destacadas</h2>

      <div className="grid sm:grid-cols-2 gap-4">
        <article className="rounded-2xl border p-4 shadow-sm">
          <Rate value={5} />
          <p className="mt-2 text-neutral-700">¡Un viaje increíble! El trayecto hasta la isla es precioso y el equipo muy atento.</p>
          <p className="text-sm text-neutral-500 mt-2">Mellito · Mayo 2025</p>
        </article>

        <article className="rounded-2xl border p-4 shadow-sm">
          <Rate value={5} />
          <p className="mt-2 text-neutral-700">Excelente organización. La piscina natural fue lo mejor, volveríamos sin dudarlo.</p>
          <p className="text-sm text-neutral-500 mt-2">Danna · Abril 2025</p>
        </article>
      </div>
    </section>
  );
};
