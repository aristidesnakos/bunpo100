import { ReactNode } from "react";
import { Viewport } from "next";
import { getSEOTags } from "@/lib/seo";
import { AppProviders } from './providers';
import { CookieConsent } from "@/components/CookieConsent";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata = getSEOTags();

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          {children}
          <CookieConsent />
        </AppProviders>
      </body>
    </html>
  );
}
