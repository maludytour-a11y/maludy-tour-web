import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { Montserrat, Ubuntu } from "next/font/google";
import "../globals.css";
import { ReduxProviders } from "../../context/redux/providers";
import { agencyInfo } from "@/config";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});
const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: agencyInfo.metadata.home.title,
  description: agencyInfo.metadata.home.description,
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages(); // <-- viene de request.ts

  return (
    <html>
      <body lang={locale} className={`${montserrat.variable} ${ubuntu.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <ReduxProviders>{children}</ReduxProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
