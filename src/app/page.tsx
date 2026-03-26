import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { getLandingBySlug } from "@/lib/get-page-data";

/** Always render from Hygraph at request time (avoids stale 404s from builds without env). */
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLandingBySlug("home");
  if (!page?.seo) {
    return {};
  }
  return {
    description: page.seo.metaDescription ?? undefined,
    openGraph: {
      images: page.seo.ogImage?.url ? [page.seo.ogImage.url] : undefined,
      title: page.seo.metaTitle ?? undefined,
    },
    title: page.seo.metaTitle ?? page.title,
  };
}

export default async function HomePage() {
  const page = await getLandingBySlug("home");
  if (!page) {
    notFound();
  }

  return (
    <article>
      <h1
        className="sr-only"
        data-hygraph-entry-id={page.id}
        data-hygraph-field-api-id="title"
      >
        {page.title}
      </h1>
      <SectionRenderer
        entryId={page.id}
        sections={page.sections as Parameters<typeof SectionRenderer>[0]["sections"]}
      />
    </article>
  );
}
