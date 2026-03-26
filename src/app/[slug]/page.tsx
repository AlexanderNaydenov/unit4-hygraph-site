import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { getLandingBySlug } from "@/lib/get-page-data";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getLandingBySlug(slug);
  if (!page?.seo) {
    return { title: page?.title };
  }
  return {
    description: page.seo.metaDescription ?? undefined,
    openGraph: {
      images: page.seo.ogImage?.url ? [page.seo.ogImage.url] : undefined,
    },
    title: page.seo.metaTitle ?? page.title,
  };
}

export default async function LandingPage({ params }: Props) {
  const { slug } = await params;
  if (slug === "home") {
    notFound();
  }

  const page = await getLandingBySlug(slug);
  if (!page) {
    notFound();
  }

  return (
    <article>
      <header className="border-b border-zinc-100 bg-white px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <h1
            className="text-4xl font-semibold tracking-tight text-zinc-900"
            data-hygraph-entry-id={page.id}
            data-hygraph-field-api-id="title"
          >
            {page.title}
          </h1>
        </div>
      </header>
      <SectionRenderer
        entryId={page.id}
        sections={page.sections as Parameters<typeof SectionRenderer>[0]["sections"]}
      />
    </article>
  );
}
