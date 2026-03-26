"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const HygraphPreview = dynamic(
  () =>
    import("@hygraph/preview-sdk/react").then((mod) => ({
      default: mod.HygraphPreview,
    })),
  { ssr: false },
);

export function PreviewWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const endpoint = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT;
  const studioUrl = process.env.NEXT_PUBLIC_HYGRAPH_STUDIO_URL;

  if (!endpoint || !studioUrl) {
    return <>{children}</>;
  }

  return (
    <HygraphPreview
      debug={process.env.NODE_ENV === "development"}
      endpoint={endpoint}
      mode="auto"
      onSave={() => {
        router.refresh();
      }}
      overlay={{
        button: {
          backgroundColor: "#04543f",
          color: "#ffffff",
        },
        style: {
          borderColor: "#04543f",
          borderWidth: "2px",
        },
      }}
      studioUrl={studioUrl}
      sync={{ fieldFocus: true, fieldUpdate: false }}
    >
      {children}
    </HygraphPreview>
  );
}
