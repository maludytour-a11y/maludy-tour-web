import { Metadata } from "next";
import Script from "next/script";
import { db } from "@/lib/prisma";
import ActivitiesClient from "./ActivitiesClient";
import Footer from "@/components/Footer";
import { agencyInfo } from "@/config";
import { BadgeType } from "@/generated/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type DecimalLike = any;
const toNumber = (v: DecimalLike) => (v == null ? 0 : typeof v === "object" && "toNumber" in v ? v.toNumber() : Number(v));

function minPositive(...nums: number[]) {
  const pos = nums.filter((n) => typeof n === "number" && n > 0);
  return pos.length ? Math.min(...pos) : 0;
}

// ---------- SEO ----------
export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || agencyInfo.contact.web?.replace(/\/+$/, "") || "https://www.example.com";

  const title = `Actividades y excursiones | ${agencyInfo.name}`;
  const description = "Explora y reserva las mejores actividades, tours y excursiones en Punta Cana. Fechas, horarios, precios y valoraciones reales.";

  const ogImage = agencyInfo.logo; // ya es URL absoluta según tu config

  return {
    title,
    description,
    alternates: {
      canonical: "/activities",
    },
    openGraph: {
      type: "website",
      url: `${siteUrl}/activities`,
      siteName: agencyInfo.name,
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: "index,follow,max-image-preview:large",
    },
  };
}

export default async function ActivitiesPage() {
  const rows = await db.activitie.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      shortDescription: true,
      location: true,
      duration: true,
      rating: true,
      reviews: true,
      badge: true,
      images: { select: { url: true } },
      prices: {
        select: {
          seniorPrice: true,
          adultPrice: true,
          youthsPrice: true,
          childrenPrice: true,
          babiesPrice: true,
        },
      },
    },
  });

  const items = rows.map((a) => {
    const price = minPositive(
      toNumber(a.prices?.adultPrice),
      toNumber(a.prices?.youthsPrice),
      toNumber(a.prices?.childrenPrice),
      toNumber(a.prices?.seniorPrice)
      // bebés suelen ser 0; no los consideramos en "Desde"
    );

    return {
      id: a.id,
      title: a.title,
      location: a.location,
      duration: a.duration,
      rating: toNumber(a.rating) || 0,
      reviews: Number(a.reviews ?? 0),
      price,
      image: a.images?.[0]?.url || "/placeholder.png",
      badge: a.badge as BadgeType,
    };
  });

  // ---------- JSON-LD (ItemList) ----------
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || agencyInfo.contact.web?.replace(/\/+$/, "") || "https://www.example.com";

  // Limita a 10 para no saturar y evitar duplicación del home
  const itemList = items.slice(0, 10).map((a, idx) => {
    const url = `${siteUrl}/activities/${a.id}`;
    const el: Record<string, any> = {
      "@type": "ListItem",
      position: idx + 1,
      url,
      name: a.title,
      image: a.image?.startsWith("http") ? a.image : `${siteUrl}${a.image}`,
    };
    if (a.rating > 0) {
      el.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: a.rating,
        reviewCount: a.reviews,
      };
    }
    if (a.price && a.price > 0) {
      el.offers = {
        "@type": "Offer",
        price: a.price,
        priceCurrency: "USD",
        url,
        availability: "http://schema.org/InStock",
      };
    }
    return el;
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Listado de actividades de ${agencyInfo.name}`,
    itemListElement: itemList,
  };

  return (
    <>
      {/* JSON-LD estructurado para el listado */}
      <Script id="activities-itemlist-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ActivitiesClient initialItems={items} />
      <Footer />
    </>
  );
}
