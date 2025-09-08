import type { MetadataRoute } from "next";
import { agencyInfo } from "@/config";

function getBaseUrl() {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (env) return env;
  return agencyInfo.contact.web.replace(/\/$/, "");
}

export default function robots(): MetadataRoute.Robots {
  const base = getBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          // APIs y rutas no indexables
          "/api/",
          // Flujo de checkout/success (evita thin/duplicado)
          "/checkout",
          "/success",
          // Cualquier zona interna de debug/admin si existiera
          "/_debug/",
          "/admin",
          "/studio",
          "/draft",
          "/private",
        ],
      },
    ],
    sitemap: [`${base}/sitemap.xml`],
    host: base,
  };
}
