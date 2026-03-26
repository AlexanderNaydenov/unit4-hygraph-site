import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { getProductBySlug } from "@/lib/get-page-data";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product?.seo) {
    return { title: product?.name };
  }
  return {
    description: product.seo.metaDescription ?? undefined,
    openGraph: {
      images: product.seo.ogImage?.url ? [product.seo.ogImage.url] : undefined,
    },
    title: product.seo.metaTitle ?? product.name,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  return (
    <article>
      <section className="border-b border-zinc-100 bg-gradient-to-b from-zinc-50 to-white px-6 py-14">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#04543f]">
              Product
            </p>
            <h1
              className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl"
              data-hygraph-entry-id={product.id}
              data-hygraph-field-api-id="name"
            >
              {product.name}
            </h1>
            {product.summary ? (
              <p
                className="mt-6 max-w-2xl text-lg text-zinc-600"
                data-hygraph-entry-id={product.id}
                data-hygraph-field-api-id="summary"
              >
                {product.summary}
              </p>
            ) : null}
          </div>
          {product.heroImage?.url ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5">
              <Image
                alt=""
                className="object-cover"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 40vw"
                src={product.heroImage.url}
              />
            </div>
          ) : null}
        </div>
      </section>
      <SectionRenderer
        entryId={product.id}
        sections={product.sections as Parameters<typeof SectionRenderer>[0]["sections"]}
      />
    </article>
  );
}
