// src/i18n/request.ts
import "server-only";
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

const dictionaries = {
  en: () => import("../../messages/en.json"),
  es: () => import("../../messages/es.json"),
  // agrega tus locales aquí
} as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale; // ok si viene como Promise
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  const loader = dictionaries[locale as keyof typeof dictionaries];
  if (!loader) {
    // fallback opcional: usa defaultLocale si el locale no existe
    const fallback = dictionaries[routing.defaultLocale as keyof typeof dictionaries];
    const messages = (await fallback()).default;
    return { locale: routing.defaultLocale, messages };
  }

  const messages = (await loader()).default;
  return { locale, messages };
});
