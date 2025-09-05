// app/activities/[slug]/page.tsx
import { notFound } from "next/navigation";
import { db } from "@/app/libs/prisma";
import { Separator } from "@/components/ui/separator";

import { BookingForm, FeaturedReviews, SlugDetail, SlugGeneralInformation, SlugHeader, SlugWhatsIncluded, SlugWhatYouDo } from "./components";
import { SlugGallery } from "./components/SlugGallery";

// Helper: Prisma Decimal/string -> number
const toNumber = (v: any) => (v == null ? 0 : typeof v === "object" && "toNumber" in v ? v.toNumber() : Number(v));

export default async function ActivityDetailPage({ params }: { params: { slug: string } }) {
  const activity = await db.activitie.findUnique({
    where: { id: params.slug }, // o { slug: params.slug } si tu modelo usa slug
    select: {
      id: true,
      title: true,
      rating: true,
      reviews: true,
      images: { select: { url: true } },
      prices: { select: { adultPrice: true } },
      // agrega más campos si los necesitas
    },
  });

  if (!activity) {
    notFound();
  }

  const ratingNum = toNumber(activity.rating);
  const reviewsNum = Number(activity.reviews ?? 0);
  const imageUrls = activity.images;
  const priceNum = toNumber(activity.prices?.adultPrice);

  // Mock de contenido estático (ajusta cuando lo leas desde DB)
  const summary = "Disfruta de la belleza de la Isla Saona en una excursión desde Punta Cana, con almuerzo buffet y bar libre. Relájate en sus playas de arena blanca y nada en sus aguas cristalinas.";
  const highlights = ["Cancelación gratuita", "Reserva ahora y paga después", "Guía: Español / Inglés", "Comprobación de disponibilidad según horario"];
  const whatYouDo = ["Paseo en catamarán y lancha rápida hasta Isla Saona.", "Tiempo libre en playas de arena blanca y agua turquesa.", "Almuerzo tipo buffet con bar libre incluido.", "Parada en piscina natural para ver estrellas de mar."];
  const details = "Vive un día inolvidable en la Isla Saona, un paraíso caribeño con playas de arena blanca y cocoteros. Durante la excursión, disfrutarás de un paseo en catamarán y otro en lancha rápida, con tiempo para nadar y relajarte. Incluye almuerzo buffet, bebidas y guía profesional.";
  const includes = ["Transporte", "Almuerzo (buffet)", "Bebidas alcohólicas en el barco y en la isla", "Guía"];
  const notSuitable = ["Embarazadas", "Personas con problemas de espalda", "Personas con movilidad reducida"];

  return (
    <div className="container mx-auto px-4 py-6 lg:py-8">
      {/* título + meta */}
      <SlugHeader title={activity.title} rating={ratingNum} reviews={reviewsNum} />

      {/* layout principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COL IZQUIERDA (galería + info) */}
        <div className="lg:col-span-2">
          {/* Galería */}
          <SlugGallery images={imageUrls} title={activity.title} />

          {/* Resumen */}
          <p className="mt-4 text-neutral-700">{summary}</p>

          {/* Información general */}
          <SlugGeneralInformation highlights={highlights} />

          {/* Qué harás */}
          <SlugWhatYouDo whatYouDo={whatYouDo} />

          {/* En detalle */}
          <SlugDetail details={details} />

          {/* Qué incluye / No apto */}
          <SlugWhatsIncluded includes={includes} notSuitable={notSuitable} />

          <Separator className="my-6" />

          {/* reseñas destacadas - placeholder simple */}
          <FeaturedReviews />
        </div>

        {/* COL DERECHA (tarjeta reserva) */}
        <BookingForm id={activity.id} price={priceNum} />
      </div>
    </div>
  );
}
