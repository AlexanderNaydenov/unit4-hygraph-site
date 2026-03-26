/** Safe metadataBase — invalid NEXT_PUBLIC_SITE_URL must not crash the app. */
export function getMetadataBase(): URL | undefined {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) {
    return undefined;
  }
  try {
    const withProtocol = raw.startsWith("http") ? raw : `https://${raw}`;
    return new URL(withProtocol);
  } catch {
    return undefined;
  }
}
