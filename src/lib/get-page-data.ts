import "server-only";

import { draftMode } from "next/headers";

import { hygraphFetch } from "./hygraph";
import {
  LANDING_BY_SLUG,
  PRODUCT_BY_SLUG,
  SITE_SETTINGS_QUERY,
  variablesLocale,
} from "./queries";

export async function getIsDraft() {
  return (await draftMode()).isEnabled;
}

export async function getSiteSettings() {
  const draft = await getIsDraft();
  type R = {
    siteSettingsCollection: {
      id: string;
      siteName: string;
      headerCtaLabel: string | null;
      headerCtaUrl: string | null;
      footerTagline: string | null;
      logo: { url: string } | null;
    }[];
  };
  try {
    return await hygraphFetch<R>(
      SITE_SETTINGS_QUERY,
      { locales: variablesLocale.locales },
      { draft },
    );
  } catch (e) {
    if (e instanceof Error && e.message === "MISSING_HYGRAPH_CONFIG") {
      return { siteSettingsCollection: [] };
    }
    throw e;
  }
}

export async function getLandingBySlug(slug: string) {
  const draft = await getIsDraft();
  type R = {
    landingPages: {
      id: string;
      title: string;
      slug: string;
      seo: {
        metaTitle: string | null;
        metaDescription: string | null;
        ogImage: { url: string } | null;
      } | null;
      sections: unknown;
    }[];
  };
  try {
    const data = await hygraphFetch<R>(
      LANDING_BY_SLUG,
      {
        slug,
        stage: draft ? "DRAFT" : "PUBLISHED",
        locales: variablesLocale.locales,
      },
      { draft },
    );
    return data.landingPages[0] ?? null;
  } catch (e) {
    if (e instanceof Error && e.message === "MISSING_HYGRAPH_CONFIG") {
      return null;
    }
    throw e;
  }
}

export async function getProductBySlug(slug: string) {
  const draft = await getIsDraft();
  type R = {
    products: {
      id: string;
      name: string;
      slug: string;
      summary: string | null;
      seo: {
        metaTitle: string | null;
        metaDescription: string | null;
        ogImage: { url: string } | null;
      } | null;
      heroImage: { url: string } | null;
      sections: unknown;
    }[];
  };
  try {
    const data = await hygraphFetch<R>(
      PRODUCT_BY_SLUG,
      {
        slug,
        stage: draft ? "DRAFT" : "PUBLISHED",
        locales: variablesLocale.locales,
      },
      { draft },
    );
    return data.products[0] ?? null;
  } catch (e) {
    if (e instanceof Error && e.message === "MISSING_HYGRAPH_CONFIG") {
      return null;
    }
    throw e;
  }
}
