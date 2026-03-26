import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PreviewWrapper } from "@/components/PreviewWrapper";
import { getMetadataBase } from "@/lib/metadata-base";
import { getSiteSettings } from "@/lib/get-page-data";

import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Unit4 | Enterprise software for people-centric organizations",
    template: "%s | Unit4",
  },
  description:
    "Finance, HR, projects, and procurement on the AI-powered Unit4 Platform.",
  metadataBase: getMetadataBase(),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let siteName = "Unit4";
  let headerCtaLabel: string | null = null;
  let headerCtaUrl: string | null = null;
  let footerTagline: string | null = null;

  const { siteSettingsCollection } = await getSiteSettings();
  const s = siteSettingsCollection[0];
  if (s) {
    siteName = s.siteName;
    headerCtaLabel = s.headerCtaLabel;
    headerCtaUrl = s.headerCtaUrl;
    footerTagline = s.footerTagline;
  }

  return (
    <html className={`${jakarta.variable} h-full`} lang="en">
      <body className="flex min-h-full flex-col bg-white font-sans text-zinc-900 antialiased">
        <PreviewWrapper>
          <Header
            ctaLabel={headerCtaLabel}
            ctaUrl={headerCtaUrl}
            siteName={siteName}
          />
          <main className="flex-1">{children}</main>
          <Footer siteName={siteName} tagline={footerTagline} />
        </PreviewWrapper>
      </body>
    </html>
  );
}
