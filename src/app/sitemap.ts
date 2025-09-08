// app/sitemap.ts
import type { MetadataRoute } from "next";
import { db } from "@/lib/prisma";
import { agencyInfo } from "@/config";

// Usa literal, no expresiones (evita errores en build de Next)
export const revalidate = 3600; // 1 hora

function getBaseUrl() {
  // 1) Siempre prioriza agencyInfo.contact.web
  let base = (agencyInfo.contact.web || "").trim();

  // Agrega protocolo si faltara (por seguridad)
  if (base && !/^https?:\/\//i.test(base)) {
    base = `https://${base}`;
  }

  // Elimina trailing slash
  base = base.replace(/\/$/, "");

  // 2) Fallbacks por si no hubiera nada en config (raro)
  if (!base) {
    const env = process.env.NEXT_PUBLIC_SITE_URL?.trim();
    if (env) return env.replace(/\/$/, "");
    return "http://localhost:3000";
  }

  return base;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getBaseUrl();
  const now = new Date();

  // Rutas estáticas
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${base}/activities`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/booking`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Rutas dinámicas (actividades)
  const activities = await db.activitie.findMany({
    select: { id: true, createdAt: true, updateAt: true },
    orderBy: { createdAt: "desc" },
  });

  const dynamicRoutes: MetadataRoute.Sitemap = activities.map((a) => ({
    url: `${base}/activities/${a.id}`,
    lastModified: a.updateAt ?? a.createdAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...dynamicRoutes];
}
