# Unit4-style Hygraph + Next.js site

Next.js App Router frontend that mirrors the Unit4 visual language (greens, typography, marketing layout) and pulls content from Hygraph. Includes **Live Preview** (draft mode + iframe cookies), **Preview SDK / click-to-edit** attributes, and separate **preview** vs **production** API tokens.

**Deployed (Vercel):** [https://unit4-hygraph-site.vercel.app](https://unit4-hygraph-site.vercel.app) — add Hygraph env vars in the Vercel project settings before content will load.

## Environment variables

Copy `env.example` to `.env.local` and fill in values from Hygraph **Project Settings → Access**.

| Variable | Purpose |
|----------|---------|
| `HYGRAPH_ENDPOINT` | **Same URL as below**, server-only. Read at runtime on Vercel so pages work even when `NEXT_PUBLIC_*` was not present during `next build` (avoids silent 404s). |
| `NEXT_PUBLIC_HYGRAPH_ENDPOINT` | Content API URL (CDN / high-performance endpoint recommended). Required for client-side preview (`PreviewWrapper`). |
| `NEXT_PUBLIC_HYGRAPH_STUDIO_URL` | Studio host, **no trailing slash** (required for click-to-edit). |
| `PREVIEW_TOKEN` | Permanent auth token whose **default stage is DRAFT** (preview + draft). |
| `PRODUCTION_TOKEN` | Permanent auth token whose **default stage is PUBLISHED** (production traffic). |
| `HYGRAPH_PREVIEW_SECRET` | Shared secret used only by `/api/draft` and the Hygraph preview URL template. |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL (e.g. `https://your-app.vercel.app`) for metadata. |

## Hygraph Studio: Live Preview

1. In **Schema**, open each model that should preview (**Landing page**, **Product**).
2. Open the **Sidebar** tab → add **Preview**.
3. **URL templates** (replace `YOUR_DOMAIN` and `YOUR_SECRET`):

**Landing page**

```text
https://YOUR_DOMAIN/api/draft?secret=YOUR_SECRET&slug={slug}
```

**Product** (use `type=product` so the draft route resolves the correct route and `/products/[slug]`)

```text
https://YOUR_DOMAIN/api/draft?secret=YOUR_SECRET&slug={slug}&type=product
```

Use the same `YOUR_SECRET` value as `HYGRAPH_PREVIEW_SECRET` in Vercel.

- Preview must use **DRAFT** stage — this app uses `PREVIEW_TOKEN` when `draftMode()` is enabled (after `/api/draft`).
- See [Live preview](https://hygraph.com/docs/developer-guides/schema/live-preview) and [Troubleshooting](https://hygraph.com/docs/developer-guides/schema/live-preview#troubleshooting) (iframe CSP, Vercel deployment protection).

## Click-to-edit

- [`@hygraph/preview-sdk`](https://github.com/hygraph/preview-sdk) wraps the app in `PreviewWrapper` (`src/components/PreviewWrapper.tsx`).
- Section blocks use `data-hygraph-entry-id` and `data-hygraph-field-api-id` (and component chains for nested blocks).
- Landing pages: `title` is tagged on the `[slug]` layout; home uses a screen-reader-only `title` for the same field.
- Products: `name` and `summary` are tagged on `src/app/products/[slug]/page.tsx`.

Docs: [Click to edit](https://hygraph.com/docs/developer-guides/schema/click-to-edit), [Next.js App Router](https://hygraph.com/docs/developer-guides/schema/click-to-edit-next-js).

## Vercel

- Disable **Deployment Protection** (or equivalent) for preview if the iframe is blocked (`X-Frame-Options`).
- Set all environment variables on the project for Production and Preview.

## Troubleshooting (404s after adding tokens)

1. Open **`/api/hygraph-health`** on your deployment. It reports whether the Content API URL and tokens are set and whether a `home` landing page resolves (no secrets exposed). If `draftMode` is `true` and content still fails, visit **`/api/disable-draft`** and reload — preview uses `PREVIEW_TOKEN`; a bad preview token used to make every page 404 while the draft cookie was set (this app now falls back to published content when draft fails).
2. Set **`HYGRAPH_ENDPOINT`** in Vercel (same value as `NEXT_PUBLIC_HYGRAPH_ENDPOINT`) and **redeploy**. Next.js bakes `NEXT_PUBLIC_*` in at build time; if the endpoint was missing then, server fetches see an empty URL until you add the server-only variable or rebuild with all public env vars set.
3. **Redeploy** after changing environment variables so the runtime picks them up.
4. GraphQL variables for `locales` must be declared as **`[Locale!]!`** (non-null list). This project uses that shape; older builds without it could not resolve content.
5. Use the **CDN / high-performance** Content API URL from Hygraph if that is what your token is scoped to (check token audience in Project Settings).
6. Ensure the **production** token’s default stage is **PUBLISHED** and it has **read** permission for `LandingPage`, `Product`, and `SiteSettings`.
7. Confirm the endpoint URL has no typos (e.g. must start with `https://`, not `ishttps://`).

## Local development

```bash
npm install
cp env.example .env.local
# edit .env.local
npm run dev
```

Draft preview locally: open  
`http://localhost:3000/api/draft?secret=YOUR_SECRET&slug=home`  
(or another slug, and `?type=product` for products).

## Routes

| Path | Source |
|------|--------|
| `/` | Landing page with `slug` = `home` |
| `/[slug]` | Other landing pages |
| `/products/[slug]` | Products |

## Disclaimer

This is a demo layout inspired by public Unit4 marketing patterns. It is not an official Unit4 product.
