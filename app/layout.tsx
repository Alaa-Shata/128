import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Manrope, IBM_Plex_Sans_Arabic } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ar",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://128cafe.example"),
  title: "128 Cafe & Bakery — Rule Number 1. Never Be Number 2.",
  description:
    "128 Cafe & Bakery in New Damietta. Specialty coffee, fresh bakery, all-day breakfast and desserts. Rule Number 1. Never Be Number 2.",
  keywords: [
    "128 Cafe",
    "One Two Eight",
    "New Damietta",
    "specialty coffee",
    "bakery",
    "breakfast",
  ],
  openGraph: {
    title: "128 Cafe & Bakery",
    description: "Rule Number 1. Never Be Number 2.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF7F2",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body
        className={`${display.variable} ${sans.variable} ${arabic.variable} bg-paper text-ink antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
