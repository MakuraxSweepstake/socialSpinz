import { pageSEO } from "@/serverApi/game";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";
import "./globals.css";
import ProviderWrapper from "./ProviderWrapper";
import { SeonProvider } from "./SeonProvider";
import TopLoader from "./TopLoader";

const metadata: Metadata = {
  title: "Social Spinz",
  description: "Sweepstake - Online Gaming Platform",
  icons: {
    icon: "/assets/images/logo.png",
  },
};

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const SITE_URL = process.env.NEXT_PUBLIC_FRONTEND_URL!;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const response = await pageSEO();
    const seoData = response;

    return {
      title: seoData?.data?.site_name || metadata.title,
      description: seoData?.data?.site_description || metadata.description,
      openGraph: {
        title: seoData?.data?.site_name || seoData?.data?.site_name || metadata.title,
        description: seoData?.data?.site_description || seoData?.data?.site_description || metadata.description,
        images: seoData?.data?.logo ? [seoData.logo] : ["/assets/images/logo.png"],
      },
      icons: seoData?.data?.favicon || metadata.icons,
    };
  } catch (error) {
    console.error("SEO metadata fetch failed:", error);
    return metadata;
  }
}
const inter = Inter({
  subsets: ['latin'],
  fallback: ['sans-serif'],
  weight: ['300', '400', '500', '700'],
  adjustFontFallback: false
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} scroll-smooth`} cz-shortcut-listen="true">
        {GTM_ID && (
          <GoogleAnalytics gaId={GTM_ID} />
        )}
        <SeonProvider>
          <ProviderWrapper>
            <React.Suspense fallback={<div />}>
              <TopLoader />

            </React.Suspense>
            {children}
          </ProviderWrapper>
        </SeonProvider>
      </body>
    </html>
  );
}
