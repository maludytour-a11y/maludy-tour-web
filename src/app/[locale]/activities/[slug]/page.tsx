import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/prisma";
import { agencyInfo } from "@/config";
import { BookingForm, FeaturedReviews, PricesDTO, SlugDetail, SlugGeneralInformation, SlugHeader, SlugWhatsIncluded, SlugWhatYouDo } from "./components";
import { SlugGallery } from "./components/SlugGallery";
import { Separator } from "@/components/ui/separator";
import { getTranslations } from "next-intl/server";

// Opcional: ajusta si quieres caché por página
// export const revalidate = 3600;

// 👉 Tipar params como Promise y hacer await
export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: "ActivityDetailPage.Meta" });

  // Fallback si no viene (muy raro)
  if (!slug) {
    const title = t("FallbackTitle", { agencyName: agencyInfo.name });
    const description = t("FallbackDescription", { agencyName: agencyInfo.name });
    return {
      title,
      description,
      openGraph: {
        type: "website",
        title,
        description,
      },
    };
  }

  // Consulta mínima para SEO
  const activity = await db.activitie.findUnique({
    where: { id: slug }, // cambia a { slug } si usas un campo slug
    select: {
      title: true,
      shortDescription: true,
      images: { select: { url: true } },
      prices: { select: { adultPrice: true } },
    },
  });

  if (!activity) {
    const title = t("NotFoundTitle", { agencyName: agencyInfo.name });
    const description = t("NotFoundDescription");
    return {
      title,
      description,
      openGraph: {
        type: "website",
        title,
        description,
      },
    };
  }

  const ogImage = activity.images?.[0]?.url;

  return {
    title: `${activity.title} | ${agencyInfo.name}`,
    description: activity.shortDescription ?? undefined,
    openGraph: {
      type: "website",
      title: activity.title,
      description: activity.shortDescription ?? "",
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: activity.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: activity.title,
      description: activity.shortDescription ?? "",
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

// Helper: Prisma Decimal/string -> number
const toNumber = (v: any) => (v == null ? 0 : typeof v === "object" && "toNumber" in v ? v.toNumber() : Number(v));

export default async function ActivityDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: "ActivityDetailPage" });

  const activity = await db.activitie.findUnique({
    where: { id: slug }, // o { slug }
    select: {
      id: true,
      title: true,
      rating: true,
      reviews: true,
      schedules: true,
      shortDescription: true,
      descripcion: true,
      SlugWhatYouDo: true,
      includes: true,
      notSuitable: true,
      images: { select: { url: true } },
      prices: {
        select: {
          seniorAge: true,
          seniorPrice: true,
          adultAge: true,
          adultPrice: true,
          childrenAge: true,
          childrenPrice: true,
          youthsAge: true,
          youthsPrice: true,
          babiesAge: true,
          babiesPrice: true,
        },
      },
    },
  });

  if (!activity) {
    notFound();
  }

  const ratingNum = toNumber(activity!.rating);
  const reviewsNum = Number(activity!.reviews ?? 0);
  const imageUrls = activity!.images;

  const pricesPeople: PricesDTO = {
    seniorPrice: toNumber(activity!.prices?.seniorPrice),
    adultPrice: toNumber(activity!.prices?.adultPrice),
    youthsPrice: toNumber(activity!.prices?.youthsPrice),
    childrenPrice: toNumber(activity!.prices?.childrenPrice),
    babiesPrice: toNumber(activity!.prices?.babiesPrice),
    seniorAge: activity!.prices?.seniorAge ?? [],
    adultAge: activity!.prices?.adultAge ?? [],
    youthsAge: activity!.prices?.youthsAge ?? [],
    childrenAge: activity!.prices?.childrenAge ?? [],
    babiesAge: activity!.prices?.babiesAge ?? [],
  };

  // ✅ Textos destacados traducidos
  const highlights = [t("Highlights.FreeCancellation"), t("Highlights.BookNowPayLater"), t("Highlights.GuideLanguages")];

  return (
    <div className="container mx-auto px-4 py-6 lg:py-8">
      <SlugHeader title={activity!.title} rating={ratingNum} reviews={reviewsNum} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COL IZQ */}
        <div className="lg:col-span-2">
          <SlugGallery images={imageUrls} title={activity!.title} />

          <p className="mt-4 text-neutral-700 text-justify">{activity!.shortDescription}</p>

          <SlugGeneralInformation highlights={highlights} />

          <SlugWhatYouDo whatYouDo={activity!.SlugWhatYouDo} />

          <SlugDetail details={activity!.descripcion} />

          <SlugWhatsIncluded includes={activity!.includes} notSuitable={activity!.notSuitable} />

          <Separator className="my-6" />

          <FeaturedReviews />
        </div>

        {/* COL DER */}
        <BookingForm id={activity!.id} prices={pricesPeople} schedules={activity!.schedules || []} activityName={activity!.title} />
      </div>
    </div>
  );
}
