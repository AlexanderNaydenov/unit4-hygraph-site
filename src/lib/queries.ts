import { DEFAULT_LOCALE } from "./hygraph";

export const LOCALE = [DEFAULT_LOCALE] as const;

/** Shared fragments for modular page sections (Landing + Product). */
export const SECTIONS_FRAGMENT = `
  sections {
    __typename
    ... on HeroBlock {
      id
      eyebrow
      headline
      subheadline
      backgroundImage { url width height }
      primaryCta { label url variant }
      secondaryCta { label url variant }
    }
    ... on RichTextBlock {
      id
      body { html raw }
    }
    ... on CallToActionBanner {
      id
      layout
      title
      bannerBody: body { html raw }
      image { url width height }
      cta { label url variant }
    }
    ... on CardGridBlock {
      id
      intro {
        eyebrow
        title
        subtitle
      }
      cards {
        id
        title
        excerpt
        href
        image { url width height }
      }
    }
    ... on FeatureGridBlock {
      id
      intro {
        eyebrow
        title
        subtitle
      }
      features {
        id
        title
        description { html }
        icon { url width height }
      }
    }
    ... on StatsBlock {
      id
      intro {
        eyebrow
        title
        subtitle
      }
      stats {
        id
        value
        label
      }
    }
    ... on LogoStripBlock {
      id
      title
      logos { url width height }
    }
    ... on QuoteBlock {
      id
      quote
      authorName
      authorTitle
      photo { url width height }
    }
    ... on MediaWithTextBlock {
      id
      mediaPosition
      title
      body { html }
      media { url width height }
      cta { label url variant }
    }
    ... on FaqBlock {
      id
      intro {
        eyebrow
        title
        subtitle
      }
      items {
        id
        question
        answer { html }
      }
    }
  }
`;

export const SITE_SETTINGS_QUERY = `
  query SiteSettings($locales: [Locale!]) {
    siteSettingsCollection(locales: $locales) {
      id
      siteName
      headerCtaLabel
      headerCtaUrl
      footerTagline
      logo { url width height }
    }
  }
`;

export const LANDING_BY_SLUG = `
  query LandingBySlug($slug: String!, $stage: Stage!, $locales: [Locale!]) {
    landingPages(where: { slug: $slug }, stage: $stage, locales: $locales) {
      id
      title
      slug
      seo {
        metaTitle
        metaDescription
        ogImage { url }
      }
      ${SECTIONS_FRAGMENT}
    }
  }
`;

export const PRODUCT_BY_SLUG = `
  query ProductBySlug($slug: String!, $stage: Stage!, $locales: [Locale!]) {
    products(where: { slug: $slug }, stage: $stage, locales: $locales) {
      id
      name
      slug
      summary
      seo {
        metaTitle
        metaDescription
        ogImage { url }
      }
      heroImage { url width height }
      ${SECTIONS_FRAGMENT}
    }
  }
`;

export const VALIDATE_DRAFT_SLUG = `
  query ValidateDraft($slug: String!, $stage: Stage!, $locales: [Locale!]) {
    landingPages(where: { slug: $slug }, stage: $stage, locales: $locales) {
      id
      slug
    }
    products(where: { slug: $slug }, stage: $stage, locales: $locales) {
      id
      slug
    }
  }
`;

export const variablesLocale = { locales: LOCALE };
