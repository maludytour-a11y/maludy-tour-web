import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";

type Activity = {
  id: string;
  image: string;
  price: number;
  title: string;
  location: string;
  duration: string;
  rating: number;
  reviews: number;
  badge?: "NEW" | "POPULAR" | "SEASON";
};

const toNumber = (v: any) => (v == null ? 0 : typeof v === "object" && "toNumber" in v ? v.toNumber() : Number(v));

const minPositive = (...nums: number[]) => {
  const p = nums.filter((n) => Number.isFinite(n) && n > 0);
  return p.length ? Math.min(...p) : 0;
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const pageSize = Math.min(50, Math.max(1, Number(searchParams.get("pageSize") || 10)));
    const skip = (page - 1) * pageSize;

    // 🔎 Buscar SOLO por título (nombre)
    const where: Prisma.ActivitieWhereInput = q.length > 0 ? { title: { contains: q, mode: Prisma.QueryMode.insensitive } } : {};

    const total = await db.activitie.count({ where });

    const rows = await db.activitie.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: q ? { title: "asc" } : { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        rating: true,
        reviews: true,
        location: true,
        duration: true,
        images: { select: { url: true } },
        prices: {
          select: {
            seniorPrice: true,
            adultPrice: true,
            youthsPrice: true,
            childrenPrice: true,
          },
        },
      },
    });

    const data: Activity[] = rows.map((r) => {
      const image = r.images?.[0]?.url || "/logo-transparent.svg";
      const price = minPositive(toNumber(r.prices?.adultPrice), toNumber(r.prices?.seniorPrice), toNumber(r.prices?.youthsPrice), toNumber(r.prices?.childrenPrice));
      const rating = toNumber(r.rating) || 0;
      const reviews = toNumber(r.reviews) || 0;

      let badge: Activity["badge"] | undefined = undefined;
      if (reviews > 100 && rating >= 4.6) badge = "POPULAR";

      return {
        id: r.id,
        image,
        price,
        title: r.title,
        location: r.location,
        duration: r.duration,
        rating,
        reviews,
        badge,
      };
    });

    const pageCount = Math.max(1, Math.ceil(total / pageSize));
    const hasMore = page < pageCount;

    return NextResponse.json({ ok: true, data, page, pageSize, total, pageCount, hasMore }, { status: 200 });
  } catch (err) {
    console.error("GET /api/activities/search error:", err);
    return NextResponse.json({ ok: false, message: "Error interno." }, { status: 500 });
  }
}
