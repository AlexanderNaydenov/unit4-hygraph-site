import { draftMode } from "next/headers";

import { hygraphFetch } from "@/lib/hygraph";
import { LANDING_BY_SLUG, variablesLocale } from "@/lib/queries";

/** Diagnostic: verifies env + Content API without exposing tokens. */
export const dynamic = "force-dynamic";

export async function GET() {
  const endpoint = !!(
    process.env.HYGRAPH_ENDPOINT?.trim() ||
    process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT?.trim()
  );
  const productionToken = !!process.env.PRODUCTION_TOKEN?.trim();
  const previewToken = !!process.env.PREVIEW_TOKEN?.trim();
  const draft = (await draftMode()).isEnabled;

  let landingHome: {
    ok: boolean;
    found?: boolean;
    error?: string;
  } = { ok: false };

  if (!endpoint || !productionToken) {
    landingHome = {
      ok: false,
      error: "missing_endpoint_or_production_token",
    };
  } else {
    try {
      const data = await hygraphFetch<{ landingPages: { id: string }[] }>(
        LANDING_BY_SLUG,
        {
          slug: "home",
          stage: "PUBLISHED",
          locales: variablesLocale.locales,
        },
        { draft: false },
      );
      landingHome = { ok: true, found: !!data.landingPages[0] };
    } catch (e) {
      landingHome = {
        ok: false,
        error: e instanceof Error ? e.message.slice(0, 300) : "unknown",
      };
    }
  }

  return Response.json({
    draftMode: draft,
    endpoint: endpoint ? "set" : "missing",
    landingHome,
    previewToken: previewToken ? "set" : "missing",
    productionToken: productionToken ? "set" : "missing",
  });
}
