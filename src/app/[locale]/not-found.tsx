"use client";

import Link from "next/link";
import Image from "next/image";
import { agencyInfo } from "@/config";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Compass } from "lucide-react";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <main className="relative min-h-dvh bg-background">
      {/* Decor */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-amber-500/10 blur-2xl" />
      </div>

      <section className="container mx-auto flex min-h-dvh flex-col items-center justify-center px-4 py-16 text-center">
        {/* Logo */}
        <div className="mb-6 flex items-center justify-center">
          <div className="h-32 w-32 overflow-hidden rounded-2xl bg-muted/60 ring-1 ring-border">
            <Image src={agencyInfo.logo} alt={agencyInfo.name} width={56} height={56} className="h-full w-full object-cover" unoptimized priority />
          </div>
        </div>

        {/* Código */}
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="inline-flex h-2 w-2 rounded-full bg-amber-500" />
          {t("CodePill")}
        </p>

        {/* Título */}
        <h1 className="bg-gradient-to-b from-foreground py-2 to-foreground/60 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">{t("Title")}</h1>

        {/* Texto */}
        <p className="mt-3 max-w-xl text-balance text-sm text-muted-foreground sm:text-base">{t("Description")}</p>

        {/* Acciones */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild variant="secondary" className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              {t("Buttons.Home")}
            </Link>
          </Button>
          <Button asChild className="gap-2">
            <Link href="/activities">
              <Compass className="h-4 w-4" />
              {t("Buttons.Explore")}
            </Link>
          </Button>
          <Button asChild variant="ghost" className="gap-2">
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                history.back();
              }}
            >
              <ArrowLeft className="h-4 w-4" />
              {t("Buttons.Back")}
            </Link>
          </Button>
        </div>

        {/* Mini ayuda */}
        <p className="mt-6 text-xs text-muted-foreground">
          {t("HelpPrefix")}{" "}
          <a className="underline underline-offset-4" href={`mailto:${agencyInfo.contact.email}`}>
            {agencyInfo.contact.email}
          </a>
          .
        </p>
      </section>
    </main>
  );
}
