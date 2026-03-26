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
  } catch {
    if (draft) {
      try {
        return await hygraphFetch<R>(
          SITE_SETTINGS_QUERY,
          { locales: variablesLocale.locales },
          { draft: false },
        );
      } catch {
        return { siteSettingsCollection: [] };
      }
    }
    return { siteSettingsCollection: [] };
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
  const variables = (stage: "DRAFT" | "PUBLISHED") => ({
    slug,
    stage,
    locales: variablesLocale.locales,
  });

  try {
    const data = await hygraphFetch<R>(
      LANDING_BY_SLUG,
      variables(draft ? "DRAFT" : "PUBLISHED"),
      { draft },
    );
    return data.landingPages[0] ?? null;
  } catch (firstError) {
    // Draft preview uses PREVIEW_TOKEN. If it is missing, revoked, or wrong on the server,
    // every page 404s while cookies still enable draft mode. Fall back to published content.
    if (draft) {
      try {
        const data = await hygraphFetch<R>(
          LANDING_BY_SLUG,
          variables("PUBLISHED"),
          { draft: false },
        );
        return data.landingPages[0] ?? null;
      } catch {
        if (process.env.VERCEL === "1") {
          console.error("[getLandingBySlug] draft and published both failed", slug, firstError);
        }
        return null;
      }
    }
    if (process.env.VERCEL === "1") {
      console.error("[getLandingBySlug] failed", slug, firstError);
    }
    return null;
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
  const variables = (stage: "DRAFT" | "PUBLISHED") => ({
    slug,
    stage,
    locales: variablesLocale.locales,
  });

  try {
    const data = await hygraphFetch<R>(
      PRODUCT_BY_SLUG,
      variables(draft ? "DRAFT" : "PUBLISHED"),
      { draft },
    );
    return data.products[0] ?? null;
  } catch (firstError) {
    if (draft) {
      try {
        const data = await hygraphFetch<R>(
          PRODUCT_BY_SLUG,
          variables("PUBLISHED"),
          { draft: false },
        );
        return data.products[0] ?? null;
      } catch {
        if (process.env.VERCEL === "1") {
          console.error("[getProductBySlug] draft and published both failed", slug, firstError);
        }
        return null;
      }
    }
    if (process.env.VERCEL === "1") {
      console.error("[getProductBySlug] failed", slug, firstError);
    }
    return null;
  }
}
