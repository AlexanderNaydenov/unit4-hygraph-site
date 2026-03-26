import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";

import { hygraphFetch } from "@/lib/hygraph";
import { VALIDATE_DRAFT_SLUG, variablesLocale } from "@/lib/queries";

type ValidateDraftQuery = {
  landingPages: { id: string; slug: string }[];
  products: { id: string; slug: string }[];
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug");
  const type = searchParams.get("type");

  if (secret !== process.env.HYGRAPH_PREVIEW_SECRET) {
    return new Response("Invalid token", { status: 401 });
  }
  if (!slug) {
    return new Response("Missing slug", { status: 400 });
  }

  const data = await hygraphFetch<ValidateDraftQuery>(
    VALIDATE_DRAFT_SLUG,
    {
      slug,
      stage: "DRAFT",
      locales: variablesLocale.locales,
    },
    { draft: true },
  );

  const landing = data.landingPages[0];
  const product = data.products[0];

  let redirectPath = "/";

  if (type === "product") {
    if (!product) {
      return new Response("Invalid product slug", { status: 401 });
    }
    redirectPath = `/products/${product.slug}`;
  } else if (landing) {
    redirectPath = landing.slug === "home" ? "/" : `/${landing.slug}`;
  } else if (product) {
    redirectPath = `/products/${product.slug}`;
  } else {
    return new Response("Invalid slug", { status: 401 });
  }

  (await draftMode()).enable();
  const cookieStore = await cookies();
  const bypass = cookieStore.get("__prerender_bypass");
  cookieStore.set({
    name: "__prerender_bypass",
    value: bypass?.value ?? "",
    httpOnly: true,
    path: "/",
    secure: true,
    sameSite: "none",
  });

  redirect(redirectPath);
}
