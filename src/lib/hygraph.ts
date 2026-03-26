import "server-only";

type HygraphResponse<T> = { data?: T; errors?: { message: string }[] };

const DEFAULT_LOCALE = "en";

export async function hygraphFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  options?: { draft: boolean },
): Promise<T> {
  const draft = options?.draft ?? false;
  const endpoint = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT;
  const previewToken = process.env.PREVIEW_TOKEN;
  const productionToken = process.env.PRODUCTION_TOKEN;

  if (!endpoint) {
    throw new Error("MISSING_HYGRAPH_CONFIG");
  }

  const token = draft ? previewToken : productionToken;
  if (!token) {
    throw new Error(
      draft ? "MISSING_HYGRAPH_CONFIG" : "MISSING_HYGRAPH_CONFIG",
    );
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "gcms-stage": draft ? "DRAFT" : "PUBLISHED",
    },
    body: JSON.stringify({ query, variables }),
    next: draft ? { revalidate: 0 } : { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Hygraph HTTP ${res.status}`);
  }

  const json = (await res.json()) as HygraphResponse<T>;
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }
  if (!json.data) {
    throw new Error("Hygraph returned no data");
  }
  return json.data;
}

export { DEFAULT_LOCALE };
