import Image from "next/image";
import Link from "next/link";

export function Header({
  siteName,
  logoUrl,
  ctaLabel,
  ctaUrl,
}: {
  siteName: string;
  logoUrl?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link className="flex items-center gap-3" href="/">
          {logoUrl ? (
            <span className="relative block h-8 w-28">
              <Image
                alt={siteName}
                className="object-contain object-left"
                fill
                priority
                src={logoUrl}
              />
            </span>
          ) : (
            <span className="text-lg font-semibold tracking-tight text-[#04543f]">
              {siteName}
            </span>
          )}
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-700 md:flex">
          <Link className="hover:text-[#04543f]" href="/solutions-overview">
            Solutions
          </Link>
          <Link className="hover:text-[#04543f]" href="/why-unit4">
            Why Unit4
          </Link>
          <Link className="hover:text-[#04543f]" href="/products/unit4-erp">
            Products
          </Link>
        </nav>
        {ctaUrl && ctaLabel ? (
          <a
            className="rounded-full bg-[#04543f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#033d30]"
            href={ctaUrl}
            rel="noopener noreferrer"
          >
            {ctaLabel}
          </a>
        ) : null}
      </div>
    </header>
  );
}
