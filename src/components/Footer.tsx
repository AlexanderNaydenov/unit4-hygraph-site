import Link from "next/link";

export function Footer({
  siteName,
  tagline,
}: {
  siteName: string;
  tagline?: string | null;
}) {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-14 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-lg font-semibold text-[#04543f]">{siteName}</p>
          {tagline ? (
            <p className="mt-2 max-w-md text-sm text-zinc-600">{tagline}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-zinc-600">
          <Link className="hover:text-[#04543f]" href="/">
            Home
          </Link>
          <Link className="hover:text-[#04543f]" href="/solutions-overview">
            Solutions overview
          </Link>
          <a
            className="hover:text-[#04543f]"
            href="https://www.unit4.com/privacy"
            rel="noopener noreferrer"
          >
            Privacy
          </a>
        </div>
      </div>
      <div className="border-t border-zinc-200/80 py-4 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} {siteName}. Demo site — not affiliated with Unit4.
      </div>
    </footer>
  );
}
