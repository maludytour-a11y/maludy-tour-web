import type { Metadata } from "next";
import { Montserrat, Ubuntu } from "next/font/google";
import "./globals.css";
import { ReduxProviders } from "../context/redux/providers";
import { agencyInfo } from "@/config";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${montserrat.variable} ${ubuntu.variable} antialiased`}>
        <ReduxProviders>{children}</ReduxProviders>
      </body>
    </html>
  );
}
