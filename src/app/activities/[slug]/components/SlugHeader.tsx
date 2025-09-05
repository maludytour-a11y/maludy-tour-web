"use client";
import Rate from "@/components/ui/rate";
import { agencyInfo } from "@/config";

export function SlugHeader({ title, rating, reviews }: { title: string; rating: number | string; reviews: number | string }) {
  const ratingNum = Number(rating ?? 0);
  const reviewsNum = Number(reviews ?? 0);

  return (
    <header className="mb-6">
      <h1 className="text-2xl md:text-3xl font-extrabold leading-tight">{title}</h1>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-neutral-600">
        <span className="flex items-center gap-2">
          <Rate value={ratingNum} />
          <span className="text-neutral-500">
            {ratingNum.toFixed(1)} · {reviewsNum.toLocaleString()} reseñas
          </span>
        </span>
        <span>
          · Proveedor: <strong>{agencyInfo.name}</strong>
        </span>
      </div>
    </header>
  );
}
