"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Menu } from "lucide-react";
import { agencyInfo } from "@/config";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { waHref } from "@/utils/functions";
import LocaleSwitcher from "./locale-switcher";

/* ---------------- NAV ---------------- */

interface IMenuItem {
  key: number | string;
  name: string;
  link: string;
}

export const NavBar = () => {
  const t = useTranslations("NavBar");

  const menuItems: IMenuItem[] = [
    { key: 1, name: t("Activities"), link: "/activities" },
    { key: 2, name: t("About"), link: "/about" },
    { key: 3, name: t("YourReservation"), link: "/booking" },
  ];

  return (
    <nav className="w-full">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
        {/* logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo-transparent.svg" width={80} height={80} alt="Maludy Tour" className="rounded w-20 h-20" priority />
        </Link>

        {/* links desktop */}
        <ul className="hidden xl:flex items-center gap-8 text-[17px]">
          {menuItems.map((i) => (
            <li key={i.key} className="font-medium hover:text-amber-500 transition">
              <Link href={i.link}>{i.name}</Link>
            </li>
          ))}
        </ul>

        {/* acciones derechas (desktop) */}
        <div className="hidden xl:flex items-center gap-4">
          <LocaleSwitcher />

          <Button asChild variant="outline" className="rounded-full">
            <Link href={`https://wa.me/${agencyInfo.contact.phone}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <Image className="w-7 h-auto" src={"/whatsapp.svg"} alt={`${agencyInfo.name}-WhatsApp`} width={16} height={16} />
              WhatsApp
            </Link>
          </Button>
        </div>

        {/* menú móvil */}
        <div className="xl:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-md">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[320px] sm:w-[380px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Image src="/logo-transparent.svg" alt="Maludy Tour" width={36} height={36} className="rounded" />
                  {agencyInfo.name}
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-3">
                <nav className="grid gap-2">
                  {menuItems.map((i) => (
                    <SheetClose asChild key={i.key}>
                      <Link href={i.link} className="px-2 py-2 rounded-md hover:bg-muted transition text-base font-medium">
                        {i.name}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>

                <div className="pt-4">
                  <LocaleSwitcher />
                </div>
              </div>

              <SheetFooter className="mt-6">
                <SheetClose asChild>
                  <Button asChild className="w-full rounded-full">
                    <a href={waHref()} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                      <Image className="w-7 h-auto" src={"/whatsapp.svg"} alt={`${agencyInfo.name}-WhatsApp`} width={16} height={16} />
                      WhatsApp
                    </a>
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
