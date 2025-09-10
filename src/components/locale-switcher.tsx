"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";

// shadcn/ui
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

const LOCALES = [
  { code: "es", label: "ES", name: "Español", flag: "/flags/do.svg" },
  { code: "en", label: "EN", name: "English", flag: "/flags/us.svg" },
  // agrega más locales si los tienes, p. ej. { code: "fr", label: "FR", name: "Français", flag: "/flags/fr.svg" }
] as const;

export default function LocaleSwitcher({
  className,
  size = 18,
}: {
  className?: string;
  /** ancho en px para el svg de la banderita */
  size?: number;
}) {
  const locale = useLocale();
  const pathname = usePathname();

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Badge variant="secondary" className={`text-sm px-3 py-1 rounded-full cursor-pointer flex items-center gap-2 ${className ?? ""}`} aria-label="Cambiar idioma">
          <Image src={current.flag} alt={current.name} width={size} height={size} className="h-auto" />
          {current.label}
        </Badge>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>Idioma</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LOCALES.map((l) => {
          const isActive = l.code === locale;
          return (
            <DropdownMenuItem key={l.code} asChild disabled={isActive}>
              {/* Usamos tu helper <Link> para mantener la ruta actual y cambiar de locale */}
              <Link href={pathname} locale={l.code} className="flex items-center gap- cursor-pointer" aria-current={isActive ? "true" : "false"}>
                <Image src={l.flag} alt={l.name} width={size} height={size} className="h-auto" />
                <span className="flex-1">{l.name}</span>
                {isActive ? <span className="text-xs">✓</span> : null}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
